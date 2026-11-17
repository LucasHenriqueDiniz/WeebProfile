import { describe, expect, it } from "vitest"
import { myAnimeListPlugin } from "./index"
import { getMockMyAnimeListData } from "./services/mock-data"
import type { FullAnimeFavorite, MyAnimeListConfig, MyAnimeListData } from "./types"

/**
 * The terminal favorites lists draw only the rows a favorite has, so their height has
 * to follow the data. These check that calculateHeight agrees with the renderer about
 * what is drawn; the pixel values themselves are measured in a browser
 * (`pnpm --filter @weeb/svg-generator audit:heights`).
 */

const mock = getMockMyAnimeListData()
const withPage = mock.favorites_full.anime.slice(0, 3)
const withoutPage: FullAnimeFavorite[] = withPage.map((x) => ({
  ...x,
  start_year: 2008,
  synopsis: null,
  score: null,
  popularity: null,
  episodes: null,
  status: null,
  rank: null,
  year: null,
  genres: [],
}))
const zeroed: FullAnimeFavorite[] = withoutPage.map((x) => ({
  ...x,
  synopsis: "",
  score: 0,
  popularity: 0,
  episodes: 0,
  status: "",
  rank: 0,
}))
const nothing: FullAnimeFavorite[] = withoutPage.map((x) => ({ ...x, start_year: null }))

function height(
  anime: FullAnimeFavorite[],
  options: { style?: "default" | "terminal"; size?: "half" | "full"; listStyle?: string } = {}
): number {
  const config = {
    enabled: true,
    sections: ["anime_favorites"],
    anime_favorites_max: 3,
    anime_favorites_list_style: options.listStyle,
    style: options.style ?? "terminal",
  } as unknown as MyAnimeListConfig
  const data = { ...mock, favorites_full: { ...mock.favorites_full, anime } } as MyAnimeListData
  return myAnimeListPlugin.calculateHeight!(config as never, data as never, options.size ?? "half")
}

describe("MyAnimeList favorites height follows what the list draws", () => {
  for (const listStyle of ["detailed", "minimal"]) {
    it(`terminal ${listStyle}: a favorite without its page is shorter than one with it`, () => {
      expect(height(withoutPage, { listStyle })).toBeLessThan(height(withPage, { listStyle }))
      expect(height(nothing, { listStyle })).toBeLessThan(height(withoutPage, { listStyle }))
    })

    it(`terminal ${listStyle}: a field at 0 takes no room, the same as an unknown one`, () => {
      expect(height(zeroed, { listStyle })).toBe(height(withoutPage, { listStyle }))
    })

    it(`default ${listStyle}: rows have a fixed height whatever the data`, () => {
      expect(height(nothing, { listStyle, style: "default" })).toBe(height(withPage, { listStyle, style: "default" }))
    })
  }

  it("terminal: a status alone draws a row only at full width", () => {
    const statusOnly = nothing.map((x) => ({ ...x, status: "Finished Airing" }))
    expect(height(statusOnly, { size: "half" })).toBe(height(nothing, { size: "half" }))
    expect(height(statusOnly, { size: "full" })).toBeGreaterThan(height(nothing, { size: "full" }))
  })

  it("terminal simple: the (type, year) line is counted only when it is drawn", () => {
    const noLine = nothing.map((x) => ({ ...x, type: "" }))
    expect(height(noLine, { listStyle: "simple" })).toBeLessThan(height(withoutPage, { listStyle: "simple" }))
  })
})
