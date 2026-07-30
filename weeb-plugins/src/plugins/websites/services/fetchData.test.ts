import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchWebsitesData } from "./fetchData"
import type { WebsitesConfig } from "../types"

vi.mock("./site-meta", () => ({
  fetchSiteMeta: vi.fn(),
}))
vi.mock("../../../utils/image-to-base64", () => ({
  urlToDataUriDirect: vi.fn(),
}))

import { fetchSiteMeta } from "./site-meta"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const emptyMeta = { finalUrl: "", title: null, description: null, imageUrl: null, iconUrl: null }

function config(items: unknown[], extra: Record<string, unknown> = {}): WebsitesConfig {
  return {
    enabled: true,
    sections: ["websites"],
    nonEssential: { websites_items: items as never, ...extra },
  } as unknown as WebsitesConfig
}

describe("fetchWebsitesData", () => {
  beforeEach(() => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({ ...emptyMeta })
    vi.mocked(urlToDataUriDirect).mockRejectedValue(new Error("no image"))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("returns mock data in dev and preview mode without touching the network", async () => {
    const dev = await fetchWebsitesData(config([]), true, false)
    const preview = await fetchWebsitesData(config([]), false, true)

    expect(dev.websites.length).toBeGreaterThan(0)
    expect(preview.websites.length).toBeGreaterThan(0)
    expect(fetchSiteMeta).not.toHaveBeenCalled()
  })

  it("returns nothing when no website is configured", async () => {
    expect((await fetchWebsitesData(config([]))).websites).toEqual([])
  })

  it("drops unsafe, malformed and duplicated URLs", async () => {
    const data = await fetchWebsitesData(
      config([
        { url: "https://example.com" },
        { url: "https://example.com/" }, // duplicate, differs only by trailing slash
        { url: "http://example.org" }, // not https
        { url: "https://192.168.0.1" }, // private
        { url: "not a url" },
        { url: "" },
        null,
      ])
    )

    expect(data.websites.map((w) => w.domain)).toEqual(["example.com"])
  })

  it("adds the https:// scheme when the user omits it", async () => {
    const data = await fetchWebsitesData(config([{ url: "example.com/portfolio" }]))
    expect(data.websites[0]?.url).toBe("https://example.com/portfolio")
  })

  it("caps the list at websites_max", async () => {
    const items = Array.from({ length: 8 }, (_, i) => ({ url: `https://site-${i}.dev` }))
    const data = await fetchWebsitesData(config(items, { websites_max: 3 }))
    expect(data.websites).toHaveLength(3)
  })

  it("prefers what the user typed over what the page advertises", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({
      ...emptyMeta,
      title: "Detected title",
      description: "Detected description",
    })

    const data = await fetchWebsitesData(
      config([{ url: "https://example.com", title: "My title", description: "My description" }])
    )

    expect(data.websites[0]).toMatchObject({ title: "My title", description: "My description" })
  })

  it("falls back to the domain when nothing provides a title", async () => {
    const data = await fetchWebsitesData(config([{ url: "https://www.example.com" }]))
    expect(data.websites[0]).toMatchObject({ domain: "example.com", title: "example.com" })
  })

  it("skips the page fetch when autofill is off", async () => {
    await fetchWebsitesData(config([{ url: "https://example.com" }], { websites_autofill: false }))
    expect(fetchSiteMeta).not.toHaveBeenCalled()
  })

  it("uses the manual image before the detected one", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({ ...emptyMeta, imageUrl: "https://example.com/og.png" })
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/png;base64,AAA",
      mime: "image/png",
      byteLength: 3,
    })

    await fetchWebsitesData(config([{ url: "https://example.com", image: "https://cdn.example.com/manual.png" }]))

    expect(vi.mocked(urlToDataUriDirect).mock.calls[0]?.[0]).toBe("https://cdn.example.com/manual.png")
  })

  it("walks the candidate chain when an image fails to embed", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({
      ...emptyMeta,
      imageUrl: "https://example.com/og.png",
      iconUrl: "https://example.com/touch.png",
    })
    vi.mocked(urlToDataUriDirect).mockImplementation(async (url: string) => {
      if (url !== "https://example.com/touch.png") throw new Error("unsupported")
      return { dataUri: "data:image/png;base64,ICON", mime: "image/png", byteLength: 4 }
    })

    const data = await fetchWebsitesData(config([{ url: "https://example.com" }]))
    expect(data.websites[0]?.thumbnail).toBe("data:image/png;base64,ICON")
  })

  it("degrades to a null thumbnail when every image fails", async () => {
    const data = await fetchWebsitesData(config([{ url: "https://example.com" }]))
    expect(data.websites[0]).toMatchObject({ thumbnail: null, favicon: null })
  })

  it("does not fetch thumbnails when they are turned off", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({ ...emptyMeta, imageUrl: "https://example.com/og.png" })
    await fetchWebsitesData(config([{ url: "https://example.com" }], { websites_show_thumbnail: false }))

    // Only the favicon lookup remains.
    const requested = vi.mocked(urlToDataUriDirect).mock.calls.map((call) => call[0])
    expect(requested.every((url) => url.includes("google.com/s2/favicons"))).toBe(true)
  })

  it("revalidates the URL an image request lands on after redirects", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({ ...emptyMeta, imageUrl: "https://example.com/og.png" })
    await fetchWebsitesData(config([{ url: "https://example.com" }]))

    const options = vi.mocked(urlToDataUriDirect).mock.calls[0]?.[1]
    expect(options?.validateFinalUrl).toBeTypeOf("function")
    expect(() => options!.validateFinalUrl!("https://169.254.169.254/x")).toThrow()
    expect(() => options!.validateFinalUrl!("https://cdn.example.com/x")).not.toThrow()
  })

  it("omits descriptions when they are turned off", async () => {
    vi.mocked(fetchSiteMeta).mockResolvedValue({ ...emptyMeta, description: "Detected" })
    const data = await fetchWebsitesData(
      config([{ url: "https://example.com", description: "Manual" }], { websites_show_description: false })
    )
    expect(data.websites[0]?.description).toBeNull()
  })
})
