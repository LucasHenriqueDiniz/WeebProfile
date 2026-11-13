import { describe, it, expect, vi, afterEach } from "vitest"
import { urlToDataUriDirect, ImageTooLargeError } from "./image-to-base64"
import { fetchSiteMeta } from "../plugins/websites/services/site-meta"
import { fetchJson } from "../plugins/shared/utils/api"

/**
 * Upstreams that answer the headers and then stall. Each fake behaves like fetch: the
 * body is a stream that keeps trickling, and aborting the request's signal errors it.
 */

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function trickle(signal: AbortSignal | undefined, contentType: string, first: Uint8Array) {
  let timer: ReturnType<typeof setInterval> | undefined
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(first)
      timer = setInterval(() => controller.enqueue(new Uint8Array([0x20])), 50)
      signal?.addEventListener("abort", () => {
        clearInterval(timer)
        controller.error(new DOMException("The operation was aborted", "AbortError"))
      })
    },
    cancel() {
      clearInterval(timer)
    },
  })
  return new Response(body, { headers: { "content-type": contentType } })
}

const serve = (respond: (init?: RequestInit) => Response) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => respond(init))

afterEach(() => vi.restoreAllMocks())

const elapsed = async (run: () => Promise<unknown>) => {
  const start = Date.now()
  const outcome = await run().then(
    (value) => ({ value }),
    (error) => ({ error })
  )
  return { ms: Date.now() - start, ...outcome }
}

describe("a server that sends the headers and then trickles the body", () => {
  it("is cut at the image timeout", async () => {
    serve((init) => trickle(init?.signal ?? undefined, "image/png", new Uint8Array(PNG_MAGIC)))

    const r = await elapsed(() => urlToDataUriDirect("https://img.test/a.png", { timeout: 300 }))

    expect(r.ms).toBeLessThan(1500)
    expect(String((r as { error?: Error }).error)).toMatch(/timed out/)
  }, 5000)

  it("is cut at the site-meta timeout, which then answers with empty meta", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    serve((init) =>
      trickle(init?.signal ?? undefined, "text/html", new TextEncoder().encode("<html><head><title>Slow</title>"))
    )

    const r = await elapsed(() => fetchSiteMeta("https://example.com/", 300))

    expect(r.ms).toBeLessThan(1500)
    expect((r as { value?: { title: string | null } }).value?.title ?? null).toBeNull()
  }, 5000)

  it("is cut at the API timeout instead of waiting out the body", async () => {
    serve((init) => trickle(init?.signal ?? undefined, "application/json", new TextEncoder().encode('{"a":')))

    const r = await elapsed(() => fetchJson("https://api.test/x", { timeout: 300, retries: 0 }))

    expect(r.ms).toBeLessThan(1500)
    expect((r as { error?: Error }).error).toBeDefined()
  }, 5000)
})

describe("an image with no content-length", () => {
  // Without the header the size check ran after arrayBuffer() had read it all.
  it("stops reading once it passes maxBytes", async () => {
    let served = 0
    serve(() => {
      const chunk = new Uint8Array(64 * 1024)
      chunk.set(PNG_MAGIC)
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (served >= 8 * 1024 * 1024) return controller.close()
          served += chunk.byteLength
          controller.enqueue(chunk)
        },
      })
      return new Response(body, { headers: { "content-type": "image/png" } })
    })

    await expect(urlToDataUriDirect("https://img.test/big.png", { maxBytes: 250_000 })).rejects.toBeInstanceOf(
      ImageTooLargeError
    )
    expect(served).toBeLessThan(1024 * 1024)
  })
})

describe("fetchJson defaults", () => {
  it("tries a failing upstream twice, not four times", async () => {
    const fetchSpy = serve(() => new Response("down", { status: 503, statusText: "Service Unavailable" }))

    await expect(fetchJson("https://api.test/x", { retryDelay: 1 })).rejects.toThrow(/503/)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
