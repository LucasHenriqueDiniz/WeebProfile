import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { HERO_CARD_LIST, HERO_FRAME_HEIGHT, heroCardUrl, nextHeroIndex } from "./hero-rotation"

const publicFile = (url: string) => readFileSync(join(__dirname, "..", "..", "public", url), "utf8")

describe("hero cards", () => {
  // The manifest and the files are written together by generate-hero-cards; a card
  // edited by hand, or a file left behind, shows up here.
  it.each(HERO_CARD_LIST.map((card) => [card.slug, card] as const))(
    "%s: the file is there, at the declared size, with animations on",
    (_slug, card) => {
      const svg = publicFile(heroCardUrl(card))
      const root = /<svg[^>]*>/.exec(svg)![0]

      expect(root).toContain(`width="${card.width}"`)
      expect(root).toContain(`height="${card.height}"`)
      expect(svg).toContain("weeb-anim")
      for (const plugin of card.plugins) expect(PLUGINS_METADATA).toHaveProperty(plugin)
    }
  )

  // The frame reserves the tallest card; a much shorter one would sit in an empty box.
  it("keeps every card within 10% of the frame's height", () => {
    for (const card of HERO_CARD_LIST) expect(card.height).toBeGreaterThanOrEqual(HERO_FRAME_HEIGHT * 0.9)
  })

  it("rotates through every card and back to the first", () => {
    const seen = [0]
    for (let i = 1; i <= HERO_CARD_LIST.length; i++) seen.push(nextHeroIndex(seen.at(-1)!))
    expect(seen).toEqual([...HERO_CARD_LIST.map((_, index) => index), 0])
  })
})
