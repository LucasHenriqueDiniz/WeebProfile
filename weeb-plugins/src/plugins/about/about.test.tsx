import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { BADGE, badgeRows, badgeWidth, linksHeight, neofetchHeight } from "./layout"
import { MOCK_LINKS, MOCK_NEOFETCH } from "./services/mock-data"
import type { AboutData } from "./types"

const plugin = () => PluginManager.getInstance().get("about")!

const userLinks: AboutData["links"] = [
  { href: "https://lucashdo.com/", label: "lucashdo.com", icon: "website" },
  { href: "https://www.linkedin.com/in/someone/", label: "LinkedIn", icon: "linkedin" },
  { href: "mailto:someone@example.com", label: "Email", icon: "email" },
]
const data: AboutData = { neofetch: MOCK_NEOFETCH, links: userLinks }

describe("link badge widths", () => {
  // The hand-made README buttons were 153, 121 and 98px: 43px of icon and padding on
  // the left, 16 on the right and 7.8px per monospace character at 13px.
  it("sizes a terminal badge like the README buttons it replaces", () => {
    expect(["lucashdo.com", "LinkedIn", "Email"].map((label) => badgeWidth(label, "terminal"))).toEqual([153, 122, 98])
  })

  it("packs badges into rows the way flex-wrap does, with the gap between them", () => {
    expect(badgeRows([100, 100, 100], 316)).toBe(1) // 100 + 8 + 100 + 8 + 100 = 316
    expect(badgeRows([100, 100, 100], 315)).toBe(2)
    expect(badgeRows([400], 300)).toBe(1) // wider than the row: alone on it
    expect(badgeRows([], 300)).toBe(0)
  })
})

describe("About calculateHeight", () => {
  const config = (sections: string[], style: string, extra: Record<string, unknown> = {}) =>
    ({ enabled: true, sections, style, ...extra }) as never

  it("adds each enabled section, in either order", () => {
    const both = plugin().calculateHeight(config(["neofetch", "links"], "terminal"), data as never, "full")
    const reversed = plugin().calculateHeight(config(["links", "neofetch"], "terminal"), data as never, "full")
    const layout = { fields: 7, hasImage: true, showPalette: true, showCursor: true }
    const labels = userLinks.map((link) => link.label)
    expect(both).toBe(neofetchHeight("terminal", "full", layout) + linksHeight("terminal", "full", labels))
    expect(reversed).toBe(both)
  })

  it("drops the palette and the last prompt when they are off", () => {
    const on = plugin().calculateHeight(config(["neofetch"], "terminal"), data as never, "full")
    const off = plugin().calculateHeight(
      config(["neofetch"], "terminal", { neofetch_show_palette: false, neofetch_show_cursor: false }),
      data as never,
      "full"
    )
    // 7 lines of 20px are taller than the 174px picture, so the palette's 24px count.
    expect(on - off).toBe(10 + 14 + 8 + 24)
  })

  it("is the picture's height when the lines are shorter than it", () => {
    const short: AboutData = { neofetch: { ...MOCK_NEOFETCH, fields: MOCK_NEOFETCH.fields.slice(0, 2) }, links: [] }
    const height = plugin().calculateHeight(config(["neofetch"], "default"), short as never, "full")
    expect(height).toBe(8 + 168 + 8)
  })

  it("counts a second row of badges when they do not fit one", () => {
    const many: AboutData = {
      neofetch: MOCK_NEOFETCH,
      links: Array.from({ length: 8 }, (_, i) => ({
        href: `https://s${i}.example/`,
        label: `site-${i}.example`,
        icon: "website",
      })),
    }
    const half = plugin().calculateHeight(config(["links"], "default"), many as never, "half")
    expect(half).toBe(8 + 4 * BADGE.height + 3 * BADGE.gap + 8)
  })
})

describe("About tiles", () => {
  it("draws one inline badge per link, at its own width and 36px tall", () => {
    const tiles = plugin().tiles!({ enabled: true, sections: ["links"], style: "terminal" } as never, data as never)
    expect(tiles.map((tile) => [tile.href, tile.title, tile.width, tile.height, tile.layout])).toEqual([
      ["https://lucashdo.com/", "lucashdo.com", 153, 36, "inline"],
      ["https://www.linkedin.com/in/someone/", "LinkedIn", 122, 36, "inline"],
      ["mailto:someone@example.com", "Email", 98, 36, "inline"],
    ])
    const markup = renderToStaticMarkup(<>{tiles[2]!.element}</>)
    expect(markup).toContain('href="mailto:someone@example.com"')
    expect(markup).toContain('target="_top"')
    expect(markup).toContain("width:98px")
  })

  it("draws none for a card without the links section", () => {
    expect(plugin().tiles!({ enabled: true, sections: ["neofetch"] } as never, data as never)).toEqual([])
  })
})

describe("About render", () => {
  const render = (extra: Record<string, unknown>, d: AboutData = data) =>
    renderToStaticMarkup(
      <>
        {plugin().render(
          { enabled: true, sections: ["neofetch", "links"], size: "full", ...extra } as never,
          d as never
        )}
      </>
    )

  it("draws user@host with both halves in the accent color, and the lines in order", () => {
    const html = render({ style: "terminal" })
    expect(html).toContain("weeb<span")
    expect(html).toContain(">@</span>profile")
    expect(html.indexOf("Location:")).toBeLessThan(html.indexOf("Site:"))
    expect(html).toContain(">neofetch<") // the command line
    expect(html).toContain("about-cursor")
  })

  it("leaves the cursor out of the default style, which has no prompt", () => {
    expect(render({ style: "default" })).not.toContain("about-cursor")
  })

  it("leaves the picture out when there is none", () => {
    const html = render({ style: "default" }, { neofetch: { ...MOCK_NEOFETCH, image: null }, links: MOCK_LINKS })
    expect(html).not.toContain("<img")
  })
})
