import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import type { GithubData } from "./types"

/**
 * Height of the calendar section when it draws one block per year (`calendar_year_mode:
 * "full"` with more than one year). The old formula, `33 + years * 150 + 28`, ignored the
 * size and the hide options: a 3-year half card got 511px for 940px of content, cutting
 * the second year in the middle and hiding the third; full cut the "Total" line; terminal
 * reserved 89px of blank space for 3 years.
 *
 * `MEASURED` is the height the section occupies in Chromium, measured 17/11/2026 the way
 * `pnpm --filter @weeb/svg-generator audit:heights` measures it (renderPlugins, theme CSS,
 * no terminal header), with the input built here: the mock's 53-week calendar once per
 * year. Real calendars from the GitHub API (2017–2026) measured the same in all 384
 * variants. `calendar_hide_weeks` and `calendar_hide_legends` do not change the height, and
 * the terminal style has no title or month labels to hide.
 *
 * Tolerance is the audit's: never shorter than the content, at most 20px taller. The
 * terminal gets at most 1px: its height is the same in every engine, so room there is blank.
 *
 * The terminal rows measured the same in Chrome 158, Firefox 150 and WebKit 26.4 (Playwright
 * 1.60, same method). The grid's symbols fall back to another font, and while its 7 rows were
 * sized by their content Firefox and WebKit drew each 1px taller: 145 and 144px per year
 * against Chrome's 138, so the formula carried 7px of blank per year in Chrome. The rows are
 * now a fixed 14px track, 138px per year in all three, and the "Total" line a fixed 19px
 * (WebKit drew it 18).
 */

type Style = "default" | "terminal"
type Size = "half" | "full"
type Hide = "title" | "months" | "weeks" | "legends"

// [style, size, years ("short": 3 years, the first with 20 weeks), hidden, measured px]
const MEASURED: Array<[Style, Size, number | "short", Hide[], number]> = [
  ["default", "half", 2, [], 646],
  ["default", "half", 2, ["title"], 606],
  ["default", "half", 2, ["months"], 562],
  ["default", "half", 2, ["title", "months"], 522],
  ["default", "half", 3, [], 940],
  ["default", "half", 3, ["title"], 900],
  ["default", "half", 3, ["months"], 814],
  ["default", "half", 3, ["title", "months"], 774],
  ["default", "half", 3, ["weeks", "legends"], 940],
  ["default", "half", 4, [], 1235],
  ["default", "half", 4, ["title", "months"], 1027],
  ["default", "half", 5, [], 1530],
  ["default", "half", 5, ["title"], 1490],
  ["default", "half", 5, ["months"], 1320],
  ["default", "half", 5, ["title", "months"], 1280],
  ["default", "half", 10, [], 3003],
  ["default", "half", 10, ["title", "months"], 2543],
  ["default", "half", "short", [], 807],
  ["default", "half", "short", ["title", "months"], 662],
  ["default", "full", 2, [], 379],
  ["default", "full", 2, ["title"], 339],
  ["default", "full", 2, ["months"], 337],
  ["default", "full", 2, ["title", "months"], 297],
  ["default", "full", 3, [], 540],
  ["default", "full", 3, ["title"], 500],
  ["default", "full", 3, ["months"], 477],
  ["default", "full", 3, ["title", "months"], 437],
  ["default", "full", 3, ["weeks", "legends"], 540],
  ["default", "full", 4, [], 702],
  ["default", "full", 4, ["title", "months"], 578],
  ["default", "full", 5, [], 863],
  ["default", "full", 5, ["title"], 823],
  ["default", "full", 5, ["months"], 758],
  ["default", "full", 5, ["title", "months"], 718],
  ["default", "full", 10, [], 1670],
  ["default", "full", 10, ["title", "months"], 1420],
  ["default", "full", "short", [], 540],
  ["default", "full", "short", ["title", "months"], 437],
  ["terminal", "half", 2, [], 327],
  ["terminal", "half", 3, [], 465],
  ["terminal", "half", 3, ["title", "months", "weeks", "legends"], 465],
  ["terminal", "half", 4, [], 603],
  ["terminal", "half", 5, [], 741],
  ["terminal", "half", 10, [], 1431],
  ["terminal", "half", "short", [], 465],
  ["terminal", "full", 2, [], 327],
  ["terminal", "full", 3, [], 465],
  ["terminal", "full", 3, ["title", "months", "weeks", "legends"], 465],
  ["terminal", "full", 4, [], 603],
  ["terminal", "full", 5, [], 741],
  ["terminal", "full", 10, [], 1431],
  ["terminal", "full", "short", [], 465],
]

const plugin = PluginManager.getInstance().get("github")!
let mock: GithubData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["calendar"] }, true, undefined, true)) as never
})

function withYears(years: number | "short"): GithubData {
  const count = years === "short" ? 3 : years
  const calendarYears = Array.from({ length: count }, (_, i) => ({
    year: 2026 - i,
    totalContributions: mock.calendar.totalContributions,
    weeks: years === "short" && i === 0 ? mock.calendar.weeks.slice(0, 20) : mock.calendar.weeks,
  }))
  return {
    ...mock,
    calendar: {
      totalContributions: mock.calendar.totalContributions * count,
      weeks: calendarYears.flatMap((year) => year.weeks),
      years: calendarYears,
    },
  }
}

describe("github calendar height, one block per year", () => {
  it("uses the mock's 53-week calendar the heights were measured with", () => {
    expect(mock.calendar.weeks).toHaveLength(53)
  })

  it("covers the rendered height of every measured variant, at most 20px over (terminal: 1px)", () => {
    const wrong: string[] = []
    for (const [style, size, years, hidden, measured] of MEASURED) {
      const config = {
        ...plugin.config,
        enabled: true,
        sections: ["calendar"],
        calendar_year_mode: "full",
        style,
        size,
        ...Object.fromEntries(hidden.map((key) => [`calendar_hide_${key}`, true])),
      }
      const height = plugin.calculateHeight(config as never, withYears(years) as never, size)
      if (height < measured || height - measured > (style === "terminal" ? 1 : 20)) {
        wrong.push(`${style}/${size} years=${years} hide=[${hidden}]: calc=${height} rendered=${measured}`)
      }
    }
    expect(wrong).toEqual([])
  })
})
