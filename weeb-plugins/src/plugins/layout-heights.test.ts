import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { DefaultGrid } from "../templates/Default/DefaultGrid"
import { TerminalLine } from "../templates/Terminal/TerminalLine"
import { PluginManager } from "./manager"

/**
 * Layout fixes behind the section heights, which the formulas alone do not show: each of
 * these drew a section taller than `calculateHeight` counts, in some engine or for some data,
 * while the formula stayed the same (audit:heights, Chrome 158, Firefox 150 and WebKit 26.4,
 * 18/11/2026).
 */

async function render(name: string, sections: string[], options: Record<string, unknown>): Promise<string> {
  const plugin = PluginManager.getInstance().get(name)!
  const config = { ...plugin.config, enabled: true, sections, ...options }
  const data = await plugin.fetchData(config as never, true, undefined, true)
  return renderToStaticMarkup(plugin.render(config as never, data) as React.ReactElement)
}

describe("layout behind the section heights", () => {
  it("draws a TerminalLine 16px tall: Firefox drew 17 from the inherited line-height", () => {
    const html = renderToStaticMarkup(React.createElement(TerminalLine, { right: "a", left: "b" }))
    expect(html).toContain("line-height:16px")
  })

  it("sizes the Last.fm grid cells whatever the first image's shape: a portrait one grew the grid", () => {
    const svg = (w: number, h: number) =>
      `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"/>`).toString("base64")}`
    const cells = (image: string | null) => {
      const data = [image, ...Array(4).fill(svg(300, 300))].map((img, i) => ({
        image: img,
        title: `t${i}`,
        value: "1",
      }))
      const html = renderToStaticMarkup(React.createElement(DefaultGrid, { data, size: "half" }))
      return [...html.matchAll(/style="height:(\d+)px"/g)].map((m) => Number(m[1]))
    }
    const square = cells(svg(300, 300))
    expect(square).toEqual([204, 100, 100, 100, 100])
    for (const [w, h] of [
      [300, 200],
      [200, 300],
      [530, 640],
    ])
      expect(cells(svg(w!, h!)), `${w}x${h}`).toEqual(square)
    expect(cells(null), "no image").toEqual(square)
  })

  it("fits five AniList favorites in a half row: a 1/5 width plus the gaps wrapped at four", async () => {
    const html = await render("anilist", ["favorites_anime"], { style: "default", size: "half" })
    expect(html).toContain("width:calc((100% - 32px) / 5)")
  })

  it("keeps the MyAnimeList terminal progress on one line: '?%' broke after the '?'", async () => {
    const html = await render("myanimelist", ["last_activity"], { style: "terminal", size: "half" })
    expect(html).toContain("text-terminal-muted font-bold whitespace-nowrap flex-shrink-0")
  })

  it("draws the MyAnimeList terminal emoji lines 20px tall: Chrome drew 26, Firefox and WebKit less", async () => {
    const lines = (html: string) => html.split("height:20px;line-height:20px").length - 1
    const updates = await render("myanimelist", ["last_activity"], { style: "terminal", size: "half" })
    // Three lines an entry: title, progress bar, status.
    expect(lines(updates)).toBeGreaterThanOrEqual(3)
    expect(lines(updates) % 3).toBe(0)
    const favorites = await render("myanimelist", ["anime_favorites"], {
      style: "terminal",
      size: "half",
      anime_favorites_list_style: "detailed",
    })
    // Title, numbers, genres and synopsis of each favorite.
    expect(lines(favorites)).toBeGreaterThanOrEqual(4)
  })

  it("draws the MyAnimeList terminal favorites in 16px lines: Firefox and WebKit drew 17", async () => {
    for (const listStyle of ["compact", "simple"]) {
      const html = await render("myanimelist", ["anime_favorites"], {
        style: "terminal",
        size: "half",
        anime_favorites_list_style: listStyle,
      })
      expect(html, listStyle).toContain("line-height:16px")
    }
  })

  it("keeps the repository banner's stars and forks on one line: zoomed in half they wrapped", async () => {
    const html = await render("github_repo", ["banner"], { style: "default", size: "half", content_size: "xl" })
    expect(html).toContain("flex items-center gap-3.5 text-xs text-default-muted whitespace-nowrap overflow-hidden")
  })

  it("hides each MyAnimeList bar's title by its own option, as calculateHeight reads it", async () => {
    const html = await render("myanimelist", ["anime_bar"], {
      style: "default",
      size: "half",
      anime_bar_hide_title: true,
      manga_bar_hide_title: false,
    })
    expect(html).not.toContain("Anime Statistics")
  })
})
