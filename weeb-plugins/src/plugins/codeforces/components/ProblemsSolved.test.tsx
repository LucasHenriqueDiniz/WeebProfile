import React from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { codeforcesPlugin } from "../index"
import type { CodeforcesConfig, CodeforcesData } from "../types"
import { DIFFICULTY_COLUMNS, ProblemsSolved } from "./ProblemsSolved"

const config = (style: "default" | "terminal") =>
  ({ enabled: true, sections: ["problems_solved"], username: "tourist", style }) as unknown as CodeforcesConfig

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I+", "Other"]

/** A breakdown with `groups` difficulties of 1,234 problems each. */
function byDifficulty(groups: number): Record<string, number> {
  return Object.fromEntries(GROUPS.slice(0, groups).map((group) => [group, 1234]))
}

function data(groups: number): CodeforcesData {
  const breakdown = byDifficulty(groups)
  return {
    rating: 3408,
    rank: "legendary grandmaster",
    contestsCount: 0,
    problemsSolved: { total: Object.values(breakdown).reduce((a, b) => a + b, 0), byDifficulty: breakdown },
    recentSubmissions: [],
  }
}

const textOf = (element: React.ReactElement) =>
  renderToString(element)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")

describe("Codeforces problems_solved height", () => {
  // Each value is where the section ends in Chromium, rendered by generateSvg from
  // a fake Codeforces API with that many difficulties (2026-11-16). The terminal
  // formula used to add 25px per difficulty against 20px rendered: 42px of empty
  // terminal under tourist's nine, and 3px cut off a card with none.
  it.each([
    ["default", "half", 0, 76],
    ["default", "half", 5, 104],
    ["default", "half", 9, 132],
    ["default", "half", 10, 132],
    ["default", "full", 0, 76],
    ["default", "full", 9, 104],
    ["default", "full", 10, 104],
    ["terminal", "half", 0, 76],
    ["terminal", "half", 5, 176],
    ["terminal", "half", 9, 256],
    ["terminal", "full", 10, 276],
  ] as const)("%s %s with %i difficulties is %ipx", (style, size, groups, height) => {
    expect(codeforcesPlugin.calculateHeight(config(style), data(groups) as never, size)).toBe(height)
  })

  // calculateHeight counts rows from DIFFICULTY_COLUMNS; the browser lays them out from
  // the class names. Changing one side alone pads or cuts the card by 28px a row.
  it("draws the grid with the columns calculateHeight counts", () => {
    const html = renderToString(
      <ProblemsSolved total={1234} byDifficulty={byDifficulty(10)} config={config("default")} size="half" />
    )

    expect(html).toContain(`grid-cols-${DIFFICULTY_COLUMNS.full}`)
    expect(html).toContain(`half:grid-cols-${DIFFICULTY_COLUMNS.half}`)
  })
})

describe("Codeforces problems_solved numbers", () => {
  it.each(["default", "terminal"] as const)(
    "%s: exact total and difficulties, so the difficulties add up to the total",
    (style) => {
      const text = textOf(
        <ProblemsSolved total={3060} byDifficulty={{ A: 1234, B: 1826 }} config={config(style)} style={style} />
      )

      expect(text).toContain("3,060")
      expect(text).toContain("1,234")
      expect(text).toContain("1,826")
      expect(text).not.toMatch(/\d\.\dK/)
      expect(text).not.toContain("3,060+")
    }
  )

  it.each(["default", "terminal"] as const)("%s: a capped history reads as a lower bound", (style) => {
    const text = textOf(
      <ProblemsSolved total={20000} byDifficulty={{ A: 20000 }} capped config={config(style)} style={style} />
    )

    expect(text).toContain("20,000+")
  })
})
