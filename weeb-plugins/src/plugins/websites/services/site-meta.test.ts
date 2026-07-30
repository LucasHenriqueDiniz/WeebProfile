import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchSiteMeta } from "./site-meta"

function headerGetter(map: Record<string, string>) {
  return { get: (key: string) => map[key.toLowerCase()] ?? null } as unknown as Headers
}

function htmlResponse(
  html: string,
  { url = "https://example.com/", status = 200, contentType = "text/html; charset=utf-8" } = {}
) {
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    body: null,
    headers: headerGetter({ "content-type": contentType }),
    text: async () => html,
  } as unknown as Response
}

describe("fetchSiteMeta", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn() as any
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it("reads Open Graph title, description and image", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(`
        <html><head>
          <meta property="og:title" content="My Portfolio" />
          <meta property="og:description" content="Personal site &amp; blog" />
          <meta property="og:image" content="https://example.com/preview.png" />
        </head></html>`)
    )

    const meta = await fetchSiteMeta("https://example.com")
    expect(meta.title).toBe("My Portfolio")
    expect(meta.description).toBe("Personal site & blog")
    expect(meta.imageUrl).toBe("https://example.com/preview.png")
  })

  it("falls back to <title> and name= meta tags", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(`<html><head>
        <title>  Fallback   Title </title>
        <meta name="description" content="From the description tag">
      </head></html>`)
    )

    const meta = await fetchSiteMeta("https://example.com")
    expect(meta.title).toBe("Fallback Title")
    expect(meta.description).toBe("From the description tag")
  })

  it("resolves relative image and icon paths against the final URL", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(
        `<html><head>
          <meta property="og:image" content="/static/card.png">
          <link rel="apple-touch-icon" href="icons/touch.png">
        </head></html>`,
        { url: "https://example.com/blog/" }
      )
    )

    const meta = await fetchSiteMeta("https://example.com/blog/")
    expect(meta.imageUrl).toBe("https://example.com/static/card.png")
    expect(meta.iconUrl).toBe("https://example.com/blog/icons/touch.png")
  })

  it("prefers og:image over twitter:image", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(`<html><head>
        <meta name="twitter:image" content="https://example.com/twitter.png">
        <meta property="og:image" content="https://example.com/og.png">
      </head></html>`)
    )

    expect((await fetchSiteMeta("https://example.com")).imageUrl).toBe("https://example.com/og.png")
  })

  it("drops image URLs that are not safe public https", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(`<html><head>
        <meta property="og:image" content="http://example.com/insecure.png">
        <link rel="apple-touch-icon" href="https://192.168.1.5/icon.png">
      </head></html>`)
    )

    const meta = await fetchSiteMeta("https://example.com")
    expect(meta.imageUrl).toBeNull()
    expect(meta.iconUrl).toBeNull()
  })

  it("never fetches an unsafe URL", async () => {
    const meta = await fetchSiteMeta("http://localhost:8080/admin")
    expect(global.fetch).not.toHaveBeenCalled()
    expect(meta.title).toBeNull()
  })

  it("returns empty metadata for non-HTML responses", async () => {
    ;(global.fetch as any).mockResolvedValue(htmlResponse("{}", { contentType: "application/json" }))
    expect((await fetchSiteMeta("https://example.com")).title).toBeNull()
  })

  it("returns empty metadata on HTTP errors and network failures", async () => {
    ;(global.fetch as any).mockResolvedValue(htmlResponse("<html></html>", { status: 503 }))
    expect((await fetchSiteMeta("https://example.com")).title).toBeNull()
    ;(global.fetch as any).mockRejectedValue(new Error("boom"))
    expect((await fetchSiteMeta("https://example.com")).title).toBeNull()
  })

  it("ignores a redirect that lands on a private address", async () => {
    ;(global.fetch as any).mockResolvedValue(
      htmlResponse(`<html><head><title>Internal</title></head></html>`, { url: "https://169.254.169.254/latest" })
    )
    expect((await fetchSiteMeta("https://example.com")).title).toBeNull()
  })
})
