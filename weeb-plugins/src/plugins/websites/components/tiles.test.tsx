import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "../../manager"
import type { WebsiteEntry } from "../types"

function site(url: string, domain: string, description: string | null = null): WebsiteEntry {
  return { url, domain, title: domain, description, thumbnail: null, favicon: null }
}

const websites = [
  site("https://example.com/", "example.com", "A site with a description long enough to need truncating"),
  site("https://example.org/", "example.org"),
  site("javascript:alert(document.domain)", "evil.test"),
]

// Through the manager, as the generator calls it: the options arrive at the root of the
// config, the way the dashboard stores them, and the manager copies them to nonEssential.
const tiles = (options: Record<string, unknown> = {}, style = "default") =>
  PluginManager.getInstance().get("websites")!.tiles!(
    { enabled: true, sections: ["websites"], style, ...options } as never,
    { websites } as never
  )

describe("websites tiles", () => {
  it("draws one tile per linkable site, linking it with target _top", () => {
    const drawn = tiles()

    expect(drawn.map((tile) => tile.href)).toEqual(["https://example.com/", "https://example.org/"])
    expect(drawn.map((tile) => tile.title)).toEqual(["example.com", "example.org"])
    for (const tile of drawn) {
      const html = renderToStaticMarkup(tile.element)
      expect(html).toContain(`<a href="${tile.href}" target="_top" rel="noopener noreferrer"`)
      expect(html).not.toMatch(/javascript:/i)
    }
  })

  // The README lays them side by side at a percentage width: a taller one makes the row ragged.
  it("gives every tile the same size, with or without a description", () => {
    const sizes = tiles().map(({ width, height }) => `${width}x${height}`)
    expect(new Set(sizes).size).toBe(1)
  })

  it.each(["default", "terminal"])("reserves the description line when a %s site has none", (style) => {
    const [withDescription, without] = tiles({}, style).map((tile) => renderToStaticMarkup(tile.element))
    const lines = (html: string) => html.match(/<p /g)?.length
    expect(lines(without!)).toBe(lines(withDescription!))
  })

  it("follows the card's options, read from the root of the config", () => {
    const full = tiles()[0]!.height
    const noThumbnail = tiles({ websites_show_thumbnail: false })[0]!.height
    const noDescription = tiles({ websites_show_description: false })[0]!.height

    expect(noThumbnail).toBeLessThan(full)
    expect(noDescription).toBeLessThan(full)
  })

  it("draws nothing when the websites section is off", () => {
    const plugin = PluginManager.getInstance().get("websites")!
    expect(plugin.tiles!({ enabled: true, sections: [] } as never, { websites } as never)).toEqual([])
  })
})
