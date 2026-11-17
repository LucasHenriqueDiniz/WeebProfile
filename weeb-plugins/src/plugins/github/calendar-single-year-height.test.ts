import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import type { GithubData } from "./types"

/**
 * Height of the calendar section when it draws a single year (`calendar_year_mode`
 * `current_year`, `last_year`, `last_6_months`, or `full` with one year). The old formula,
 * `33 + rows * 135 + 28` with two rows in half, ignored `calendar_hide_title` (40px) and
 * `calendar_hide_months` (21px per row), so a half card with both hidden reserved 90px of
 * blank space. It also counted two rows in half for a year of up to 26 weeks, which the
 * calendar draws in one (a current year before July: 141px over).
 *
 * `MEASURED` is the height the section occupies in Chrome 158, measured 17/11/2026 the way
 * `pnpm --filter @weeb/svg-generator audit:heights` measures it (renderPlugins, theme CSS,
 * no terminal header), with the mock's 53-week calendar cut to the given number of weeks.
 * `last_6_months` was measured with weeks dated up to today, since the calendar drops the
 * older ones. Real calendars from the GitHub API measured the same. `calendar_hide_weeks`
 * and `calendar_hide_legends` do not change the height, except that with no weeks at all
 * the weekday labels are the only thing left in the grid. The terminal style has no title
 * or month labels to hide.
 *
 * Tolerance is the audit's: never shorter than the content, at most 20px taller.
 *
 * The terminal grid's symbols fall back to another font, and Firefox 150 and WebKit 26.4
 * (Playwright 1.60, same method) draw it taller than Chrome: 164 and 163px for Chrome's 157.
 * The default style measured the same or 1px shorter there. `OTHER_ENGINES` keeps the
 * terminal from being sized to Chrome alone.
 */

type Style = "default" | "terminal"
type Size = "half" | "full"
type Mode = "current_year" | "last_year" | "last_6_months" | "full"
type Hide = "title" | "months" | "weeks" | "legends"

// [style, size, year mode, weeks, hidden, measured px]
const MEASURED: Array<[Style, Size, Mode, number, Hide[], number]> = [
  ["default", "half", "current_year", 53, [], 323],
  ["default", "half", "current_year", 53, ["title"], 283],
  ["default", "half", "current_year", 53, ["months"], 281],
  ["default", "half", "current_year", 53, ["title", "months"], 241],
  ["default", "half", "current_year", 53, ["weeks", "legends"], 323],
  ["default", "half", "last_year", 53, [], 323],
  ["default", "half", "last_year", 53, ["title", "months"], 241],
  ["default", "half", "full", 53, [], 323],
  ["default", "half", "full", 53, ["title", "months"], 241],
  ["default", "half", "current_year", 27, [], 323],
  ["default", "half", "current_year", 26, [], 190],
  ["default", "half", "current_year", 26, ["title", "months"], 129],
  ["default", "half", "current_year", 20, [], 190],
  ["default", "half", "last_6_months", 27, [], 190],
  ["default", "half", "last_6_months", 27, ["title"], 150],
  ["default", "half", "last_6_months", 27, ["months"], 169],
  ["default", "half", "last_6_months", 27, ["title", "months"], 129],
  ["default", "half", "current_year", 0, [], 169],
  ["default", "half", "current_year", 0, ["months"], 169],
  ["default", "half", "current_year", 0, ["weeks"], 72],
  ["default", "half", "current_year", 0, ["title", "weeks"], 32],
  ["default", "full", "current_year", 53, [], 190],
  ["default", "full", "current_year", 53, ["title"], 150],
  ["default", "full", "current_year", 53, ["months"], 169],
  ["default", "full", "current_year", 53, ["title", "months"], 129],
  ["default", "full", "current_year", 53, ["weeks", "legends"], 190],
  ["default", "full", "last_year", 53, ["title", "months"], 129],
  ["default", "full", "full", 53, [], 190],
  ["default", "full", "last_6_months", 27, [], 190],
  ["default", "full", "last_6_months", 27, ["title", "months"], 129],
  ["default", "full", "current_year", 0, [], 169],
  ["default", "full", "current_year", 0, ["title", "weeks"], 32],
  ["terminal", "half", "current_year", 53, [], 157],
  ["terminal", "half", "current_year", 53, ["title", "months", "weeks", "legends"], 157],
  ["terminal", "half", "last_year", 53, [], 157],
  ["terminal", "half", "full", 53, [], 157],
  ["terminal", "half", "last_6_months", 27, [], 157],
  ["terminal", "half", "current_year", 0, [], 59],
  ["terminal", "full", "current_year", 53, [], 157],
  ["terminal", "full", "current_year", 53, ["title", "months", "weeks", "legends"], 157],
  ["terminal", "full", "last_year", 53, [], 157],
  ["terminal", "full", "full", 53, [], 157],
  ["terminal", "full", "last_6_months", 27, [], 157],
  ["terminal", "full", "current_year", 0, [], 59],
]

// [engine, size, year mode, weeks, measured px], terminal style, no hide options
const OTHER_ENGINES: Array<["firefox" | "webkit", Size, Mode, number, number]> = [
  ["firefox", "half", "current_year", 53, 164],
  ["firefox", "full", "current_year", 53, 164],
  ["firefox", "half", "last_6_months", 27, 164],
  ["firefox", "half", "current_year", 0, 59],
  ["webkit", "half", "current_year", 53, 163],
  ["webkit", "full", "current_year", 53, 163],
  ["webkit", "half", "last_6_months", 27, 163],
  ["webkit", "half", "current_year", 0, 58],
]

const plugin = PluginManager.getInstance().get("github")!
let mock: GithubData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["calendar"] }, true, undefined, true)) as never
})

function withWeeks(mode: Mode, count: number): GithubData {
  const weeks = mock.calendar.weeks.slice(0, count)
  const totalContributions = mock.calendar.totalContributions
  return {
    ...mock,
    calendar: {
      totalContributions,
      weeks,
      // "full" that found a single year keeps it in `years`, and still draws one calendar.
      years: mode === "full" ? [{ year: 2025, totalContributions, weeks }] : undefined,
    },
  }
}

describe("github calendar height, single year", () => {
  it("uses the mock's 53-week calendar the heights were measured with", () => {
    expect(mock.calendar.weeks).toHaveLength(53)
  })

  it("covers the rendered height of every measured variant, at most 20px over", () => {
    const wrong: string[] = []
    for (const [style, size, mode, weeks, hidden, measured] of MEASURED) {
      const config = {
        ...plugin.config,
        enabled: true,
        sections: ["calendar"],
        calendar_year_mode: mode,
        style,
        size,
        ...Object.fromEntries(hidden.map((key) => [`calendar_hide_${key}`, true])),
      }
      const height = plugin.calculateHeight(config as never, withWeeks(mode, weeks) as never, size)
      if (height < measured || height - measured > 20) {
        wrong.push(`${style}/${size} ${mode} weeks=${weeks} hide=[${hidden}]: calc=${height} rendered=${measured}`)
      }
    }
    expect(wrong).toEqual([])
  })

  it("does not cut the terminal grid in Firefox or WebKit", () => {
    const cut: string[] = []
    for (const [engine, size, mode, weeks, measured] of OTHER_ENGINES) {
      const config = {
        ...plugin.config,
        enabled: true,
        sections: ["calendar"],
        calendar_year_mode: mode,
        style: "terminal",
        size,
      }
      const height = plugin.calculateHeight(config as never, withWeeks(mode, weeks) as never, size)
      if (height < measured) cut.push(`${engine} ${size} ${mode} weeks=${weeks}: calc=${height} rendered=${measured}`)
    }
    expect(cut).toEqual([])
  })
})
