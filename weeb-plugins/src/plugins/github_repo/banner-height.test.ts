import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import type { GithubRepoData } from "./types"

/**
 * Height of the banner section. `MEASURED` is what each variant occupies in Chrome 158,
 * measured 17/11/2026 the way `pnpm --filter @weeb/svg-generator audit:heights` measures it
 * (renderPlugins, theme CSS, no terminal header), on the mock repository.
 *
 * Until 11/2026 the formula added 24px to every default variant, on top of the 24px the
 * PluginManager adds to every card, and counted 2 description lines whatever the text. A
 * hero banner with a one-line description reserved 160px for 117 drawn, and the README
 * banner of this repository (centered_dark) had 44px of blank under it.
 *
 * Each row holds 18 heights: description none, 1 line, 2 lines; within each, avatar on and
 * off; within each, owner on, owner off, owner off with a custom label.
 */

type Variant = "hero" | "minimal" | "split" | "display" | "centered" | "centered_dark" | "centered_gradient" | "dark"
type Size = "half" | "full"

const MEASURED: Array<[Variant, Size, number[]]> = [
  ["hero", "half", [91, 91, 91, 91, 91, 91, 117, 117, 117, 117, 117, 117, 137, 137, 137, 137, 137, 137]],
  ["hero", "full", [91, 91, 91, 91, 91, 91, 117, 117, 117, 117, 117, 117, 137, 137, 137, 137, 137, 137]],
  ["minimal", "half", [68, 68, 68, 47, 47, 47, 68, 68, 68, 63, 63, 63, 68, 68, 68, 63, 63, 63]],
  ["minimal", "full", [68, 68, 68, 47, 47, 47, 68, 68, 68, 63, 63, 63, 68, 68, 68, 63, 63, 63]],
  ["split", "half", [82, 82, 82, 82, 82, 82, 106, 106, 106, 106, 106, 106, 124, 124, 124, 124, 124, 124]],
  ["split", "full", [82, 82, 82, 82, 82, 82, 106, 106, 106, 106, 106, 106, 124, 124, 124, 124, 124, 124]],
  ["display", "half", [112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112]],
  ["display", "full", [112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112]],
  ["centered", "half", [177, 151, 177, 119, 101, 119, 203, 177, 203, 145, 127, 145, 223, 197, 223, 165, 147, 165]],
  ["centered", "full", [177, 151, 177, 119, 101, 119, 203, 177, 203, 145, 127, 145, 223, 197, 223, 165, 147, 165]],
  ["centered_dark", "half", [101, 76, 101, 101, 76, 101, 129, 104, 129, 129, 104, 129, 148, 123, 148, 148, 123, 148]],
  ["centered_dark", "full", [101, 76, 101, 101, 76, 101, 129, 104, 129, 129, 104, 129, 148, 123, 148, 148, 123, 148]],
  [
    "centered_gradient",
    "half",
    [113, 113, 113, 113, 113, 113, 140, 140, 140, 140, 140, 140, 159, 159, 159, 159, 159, 159],
  ],
  [
    "centered_gradient",
    "full",
    [113, 113, 113, 113, 113, 113, 140, 140, 140, 140, 140, 140, 159, 159, 159, 159, 159, 159],
  ],
  ["dark", "half", [60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]],
  ["dark", "full", [60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]],
]

const DESCRIPTIONS: Array<Record<string, unknown>> = [
  { banner_show_description: false },
  { banner_description: "Stats cards." },
  {
    banner_description:
      "Code, anime, music and gaming stats for your GitHub profile README, refreshed every day, with themes, a terminal style and fifteen plugins to choose from, in two sizes.",
  },
]
const AVATARS: Array<Record<string, unknown>> = [{}, { banner_show_avatar: false }]
const LABELS: Array<Record<string, unknown>> = [
  {},
  { banner_show_owner: false },
  { banner_show_owner: false, banner_eyebrow: "Custom label" },
]

const plugin = PluginManager.getInstance().get("github_repo")!
let mock: GithubRepoData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["banner"] }, true, undefined, true)) as never
})

function height(size: Size, options: Record<string, unknown>, style: "default" | "terminal" = "default"): number {
  const config = { ...plugin.config, enabled: true, sections: ["banner"], style, size, ...options }
  return plugin.calculateHeight(config as never, mock as never, size)
}

describe("github_repo banner height", () => {
  it("is the rendered height of every variant and option set, to the px", () => {
    const wrong: string[] = []
    for (const [variant, size, heights] of MEASURED) {
      let i = 0
      for (const description of DESCRIPTIONS)
        for (const avatar of AVATARS)
          for (const label of LABELS) {
            const options = { banner_variant: variant, ...description, ...avatar, ...label }
            const calc = height(size, options)
            const measured = heights[i++]!
            if (calc !== measured)
              wrong.push(`${variant}/${size} ${JSON.stringify(options)}: calc=${calc} rendered=${measured}`)
          }
    }
    expect(wrong).toEqual([])
  })

  // The mock's description is one line in full and two in half, where the avatar leaves 305px.
  it("follows the description onto a second line in the narrower card", () => {
    expect(mock.description).toBeTruthy()
    expect(height("full", { banner_variant: "hero" })).toBe(117)
    expect(height("half", { banner_variant: "hero" })).toBe(137)
    expect(height("full", { banner_variant: "split" })).toBe(106)
    expect(height("half", { banner_variant: "split" })).toBe(124)
  })

  // The terminal section measured 50px, plus 24 for a line of description and 44 for two.
  // calculateHeight hands it in 24px short: the PluginManager adds those 24 back to the card.
  it("draws the terminal description in as many lines as it takes", () => {
    for (const size of ["half", "full"] as const) {
      expect(DESCRIPTIONS.map((description) => height(size, description, "terminal"))).toEqual([
        50 - 24,
        74 - 24,
        94 - 24,
      ])
    }
  })

  // content_size zooms the section (sm 0.85, lg 1.25, xl 1.5) and the text wraps in the
  // width divided by the zoom. Measured in full, same method; within 3px of the formula,
  // which scales the md height and rounds up. Not covered: half at lg and xl, where the
  // meta row (language, stars, forks, license) runs out of width and wraps, 20 to 26px the
  // formula does not count (hero, display, centered; centered_gradient's chips at xl).
  it("scales with content_size in full", () => {
    const SCALED: Array<[Variant, number[]]> = [
      ["hero", [96, 178, 219]],
      ["minimal", [56, 89, 109]],
      ["split", [87, 161, 198]],
      ["display", [92, 145, 178]],
      ["centered", [183, 290, 357]],
      ["centered_dark", [121, 191, 236]],
      ["centered_gradient", [130, 205, 251]],
      ["dark", [66, 104, 128]],
    ]
    const wrong: string[] = []
    for (const [variant, measured] of SCALED)
      ["sm", "lg", "xl"].forEach((contentSize, i) => {
        const calc = height("full", { banner_variant: variant, content_size: contentSize })
        if (calc < measured[i]! || calc - measured[i]! > 3)
          wrong.push(`${variant} ${contentSize}: calc=${calc} rendered=${measured[i]}`)
      })
    expect(wrong).toEqual([])
  })
})
