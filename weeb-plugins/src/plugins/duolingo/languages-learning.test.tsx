import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { getLanguageCode, hasFlag } from "../../utils/language-flags"
import type { DuolingoData } from "./types"

const plugin = () => PluginManager.getInstance().get("duolingo")!

// Course titles as the Duolingo API returned them on 18/11/2026 for `luis` (18 courses,
// some repeated with a different source language) and `Amayacrab`.
const LUIS_TITLES = [
  "French",
  "Japanese",
  "Spanish",
  "German",
  "Swedish",
  "Portuguese",
  "English",
  "English",
  "French",
  "English",
  "Italian",
  "Arabic",
  "Russian",
  "Korean",
  "Portuguese",
  "Greek",
  "Swahili",
  "Welsh",
]
const AMAYACRAB_TITLES = ["Japanese", "English", "French"]

// A regional-indicator pair is how a flag emoji is spelled; Windows has no glyph for it.
const FLAG_EMOJI = /[\u{1F1E6}-\u{1F1FF}]{2}/u

function render(titles: string[], style: "default" | "terminal") {
  const data: DuolingoData = {
    streak: 0,
    totalXP: 0,
    languages: titles.map((language, i) => ({ language, xp: 100 + i })),
  }
  const config = {
    enabled: true,
    sections: ["languages_learning"],
    style,
    size: "half",
    languages_learning_max: 20,
  } as never
  return renderToStaticMarkup(plugin().render(config, data as never))
}

/** Flags drawn as vector paths: <svg data-flag="XX">…<path… inside the markup. */
function drawnFlags(markup: string): string[] {
  return [...markup.matchAll(/<svg[^>]*data-flag="([^"]+)"[^>]*>(?:(?!<\/svg>).)*<(?:path|rect|circle|polygon)/g)].map(
    (m) => m[1]!
  )
}

describe("Duolingo languages learning flags", () => {
  for (const style of ["default", "terminal"] as const) {
    it(`draws one vector flag per language in the ${style} style, with no emoji`, () => {
      for (const titles of [LUIS_TITLES, AMAYACRAB_TITLES]) {
        const markup = render(titles, style)
        expect(markup).not.toMatch(FLAG_EMOJI)
        expect(drawnFlags(markup)).toEqual(titles.map(getLanguageCode))
      }
    })
  }

  it("has a drawable flag for every course title of the real accounts", () => {
    const missing = [...LUIS_TITLES, ...AMAYACRAB_TITLES].filter((title) => !hasFlag(getLanguageCode(title)))
    expect(missing).toEqual([])
  })
})

describe("getLanguageCode", () => {
  it("matches exact names and the longest known name inside a longer one", () => {
    expect(getLanguageCode("Japanese")).toBe("JP")
    expect(getLanguageCode("Brazilian Portuguese")).toBe("BR")
    expect(getLanguageCode("Scottish Gaelic")).toBe("GB-SCT")
    expect(getLanguageCode("Welsh")).toBe("GB-WLS")
  })

  it("does not match a name that only appears inside a known one", () => {
    // "latin american spanish" contains "latin", which used to give Latin the Mexican flag.
    expect(getLanguageCode("Latin")).toBe("LA")
    expect(hasFlag(getLanguageCode("Latin"))).toBe(false)
  })
})
