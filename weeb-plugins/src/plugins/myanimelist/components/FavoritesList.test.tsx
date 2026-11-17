import React from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import type { FullAnimeFavorite, FullMangaFavorite, MyAnimeListConfig } from "../types"
import { FavoritesList } from "./FavoritesList"

// What the plugin built for every real favorite until 11/2026: the profile's id, title
// and cover, and 0 in every field that should have come from the title's page. The
// default card drew "00" under each title (score 0, popularity 0).
const zeroed: FullAnimeFavorite = {
  mal_id: 4224,
  title: "Toradora!",
  image: null,
  start_year: 0,
  type: "TV",
  synopsis: "",
  score: 0,
  popularity: 0,
  episodes: null,
  status: "",
  rank: 0,
  year: null,
  genres: [],
}

// A page that could not be fetched: the profile still knows the start year.
const withoutPage: FullAnimeFavorite = {
  ...zeroed,
  start_year: 2008,
  synopsis: null,
  score: null,
  popularity: null,
  status: null,
  rank: null,
}

const mangaZeroed: FullMangaFavorite = { ...zeroed, mal_id: 7149, chapters: 0, volumes: 0, type: "Light Novel" }

function text(
  style: "default" | "terminal",
  listStyle: "detailed" | "minimal" | "simple" | "compact",
  data: FullAnimeFavorite[] | FullMangaFavorite[],
  type: "anime" | "manga" = "anime",
  size: "half" | "full" = "full"
): string {
  const html = renderToString(
    <FavoritesList
      data={data}
      type={type}
      config={{ anime_favorites_max: 5, manga_favorites_max: 5 } as MyAnimeListConfig}
      style={style}
      size={size}
      listStyle={listStyle}
    />
  )
  return html
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Every token made only of zeros: "0", "00", or a 0 glued to a label ("⭐0", "(TV, 0)"). */
function zeros(rendered: string): string[] {
  return rendered.match(/(^|[\s⭐#(,])0+(?=[\s)]|$)/g) ?? []
}

describe("MyAnimeList favorites never print a missing field as 0", () => {
  for (const style of ["default", "terminal"] as const) {
    for (const listStyle of ["detailed", "minimal", "simple", "compact"] as const) {
      it(`${style}/${listStyle}: a favorite with score, popularity and years at 0`, () => {
        const anime = text(style, listStyle, [zeroed])
        const manga = text(style, listStyle, [mangaZeroed], "manga")
        expect(zeros(anime)).toEqual([])
        expect(zeros(manga)).toEqual([])
        // The title is still there: hiding the zeros must not hide the favorite.
        if (style === "terminal" || listStyle !== "simple") {
          expect(anime).toContain("Toradora!")
          expect(manga).toContain("Toradora!")
        }
      })
    }
  }

  it("terminal simple: the type stays when the year is unknown, the line goes when both are", () => {
    expect(text("terminal", "simple", [zeroed])).toContain("(TV)")
    expect(text("terminal", "simple", [{ ...zeroed, type: "" }])).not.toContain("(")
  })
})

describe("MyAnimeList favorites without their page", () => {
  for (const style of ["default", "terminal"] as const) {
    for (const listStyle of ["detailed", "minimal"] as const) {
      it(`${style}/${listStyle}: shows the start year from the profile`, () => {
        expect(text(style, listStyle, [withoutPage])).toContain("2008")
        expect(text(style, listStyle, [{ ...withoutPage, mal_id: 7149 }], "manga")).toContain("2008")
      })
    }
  }

  it("terminal simple: prints type and start year", () => {
    expect(text("terminal", "simple", [withoutPage])).toContain("(TV, 2008)")
  })

  it("prefers the year of the title's page over the profile's start year", () => {
    expect(text("default", "detailed", [{ ...withoutPage, year: 2009 }])).toContain("2009")
    expect(text("default", "detailed", [{ ...withoutPage, year: 2009 }])).not.toContain("2008")
  })
})
