import { describe, expect, it, vi } from "vitest"
import { SCREENSHOT_FRESH_MS, SCREENSHOT_MAX_BYTES, makeSiteScreenshot } from "./site-screenshot.js"

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3])
const OLD_JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 9, 9, 9])
const dataUri = (bytes: Uint8Array) => `data:image/jpeg;base64,${btoa(String.fromCharCode(...bytes))}`

function browser(answer: () => Response | Promise<Response>) {
  return { quickAction: vi.fn(async (_action: string, _options: unknown) => answer()) }
}
const shot = (bytes: Uint8Array = JPEG, type = "image/jpeg") =>
  new Response(bytes as BodyInit, { status: 200, headers: { "Content-Type": type, "X-Browser-Ms-Used": "4200.5" } })

/** An R2 bucket in memory, keeping what put() was given. */
function bucket(seed?: { bytes: Uint8Array; takenAt: number }) {
  const store = new Map<string, { bytes: Uint8Array; customMetadata: Record<string, string> }>()
  const r2 = {
    store,
    get: vi.fn(async (key: string) => {
      const entry =
        store.get(key) ?? (seed ? { bytes: seed.bytes, customMetadata: { takenAt: String(seed.takenAt) } } : null)
      return entry ? { arrayBuffer: async () => entry.bytes.buffer, customMetadata: entry.customMetadata } : null
    }),
    put: vi.fn(async (key: string, bytes: Uint8Array, options: { customMetadata: Record<string, string> }) => {
      store.set(key, { bytes, customMetadata: options.customMetadata })
    }),
  }
  return r2
}

const NOW = 1_800_000_000_000
const url = "https://heartopia.guide/"

describe("makeSiteScreenshot", () => {
  it("takes the page at 1200x630 as JPEG, keeps it in R2 and returns it", async () => {
    const BROWSER = browser(() => shot())
    const SCREENSHOTS = bucket()
    const take = makeSiteScreenshot({ BROWSER, SCREENSHOTS } as never, () => NOW)

    expect(await take(url)).toBe(dataUri(JPEG))
    const options = BROWSER.quickAction.mock.calls[0]![1] as Record<string, any>
    expect(options).toMatchObject({ url, viewport: { width: 1200, height: 630 }, screenshotOptions: { type: "jpeg" } })
    expect(options.addStyleTag[0].content).toContain('[aria-label*="cookie" i]')
    expect(options.rejectRequestPattern).toContain("googlesyndication\\.com")

    const [[key, , putOptions]] = SCREENSHOTS.put.mock.calls as any
    expect(key).toMatch(/^screenshots\/[0-9a-f]{64}\.jpg$/)
    expect(putOptions.customMetadata).toEqual({ takenAt: String(NOW), url })
  })

  // The cron regenerates every card daily: one screenshot a day per site would add up.
  it("uses a copy younger than a week without opening a browser", async () => {
    const BROWSER = browser(() => shot())
    const take = makeSiteScreenshot(
      { BROWSER, SCREENSHOTS: bucket({ bytes: OLD_JPEG, takenAt: NOW - SCREENSHOT_FRESH_MS + 60_000 }) } as never,
      () => NOW
    )

    expect(await take(url)).toBe(dataUri(OLD_JPEG))
    expect(BROWSER.quickAction).not.toHaveBeenCalled()
  })

  it("retakes a copy older than a week, and keeps the old one if that fails", async () => {
    const stale = { bytes: OLD_JPEG, takenAt: NOW - SCREENSHOT_FRESH_MS - 1 }

    const retaken = makeSiteScreenshot(
      { BROWSER: browser(() => shot()), SCREENSHOTS: bucket(stale) } as never,
      () => NOW
    )
    expect(await retaken(url)).toBe(dataUri(JPEG))

    const failing = browser(() => new Response('{"success":false}', { status: 422 }))
    const kept = makeSiteScreenshot({ BROWSER: failing, SCREENSHOTS: bucket(stale) } as never, () => NOW)
    expect(await kept(url)).toBe(dataUri(OLD_JPEG))
    expect(failing.quickAction).toHaveBeenCalledTimes(1)
  })

  it("returns null, without throwing, when there is nothing to show", async () => {
    const cases = [
      browser(() => new Response('{"success":false}', { status: 422 })),
      browser(() => shot(JPEG, "text/plain")),
      browser(() => shot(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))), // a PNG labelled as JPEG
      browser(() => shot(new Uint8Array(SCREENSHOT_MAX_BYTES + 1).fill(0xff))),
      browser(() => {
        throw new Error("browser down")
      }),
    ]
    for (const BROWSER of cases) {
      const SCREENSHOTS = bucket()
      expect(await makeSiteScreenshot({ BROWSER, SCREENSHOTS } as never)(url)).toBeNull()
      expect(SCREENSHOTS.put).not.toHaveBeenCalled()
    }
  })

  it("does nothing without its bindings", async () => {
    expect(await makeSiteScreenshot({})(url)).toBeNull()
    expect(await makeSiteScreenshot({ BROWSER: browser(() => shot()) } as never)(url)).toBeNull()
  })

  it("still returns the screenshot when R2 cannot keep it", async () => {
    const SCREENSHOTS = bucket()
    SCREENSHOTS.put.mockRejectedValue(new Error("put: We encountered an internal error. (10001)"))
    const take = makeSiteScreenshot({ BROWSER: browser(() => shot()), SCREENSHOTS } as never)
    expect(await take(url)).toBe(dataUri(JPEG))
  })
})
