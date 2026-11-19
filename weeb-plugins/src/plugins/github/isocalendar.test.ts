import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { textWidth } from "../../utils/text-lines"
import { PluginManager } from "../manager"
import { STAT_LINE, statLines } from "./components/Isocalendar"
import {
  ISOCALENDAR_DRAWING_HEIGHT,
  isocalendarFromCalendar,
  isocalendarStats,
  isocalendarViewBox,
  isocalendarWindow,
} from "./isocalendar"
import type { ContributionWeek, GithubData } from "./types"

const github = () => PluginManager.getInstance().get("github")!

const DAY_MS = 86_400_000
const daysBetween = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / DAY_MS + 1

/** A calendar as GitHub answers one range: weeks from Sunday, `count(date)` contributions a day. */
function calendarOf(from: string, to: string, count: (date: string) => number = () => 1): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let ms = Date.parse(from); ms <= Date.parse(to); ms += DAY_MS) {
    const day = new Date(ms)
    const date = day.toISOString().slice(0, 10)
    if (day.getUTCDay() === 0 || weeks.length === 0) weeks.push({ contributionDays: [] })
    weeks[weeks.length - 1]!.contributionDays.push({
      date,
      contributionCount: count(date),
      color: "#9be9a8",
      weekday: day.getUTCDay(),
    })
  }
  return weeks
}

describe("isocalendarWindow", () => {
  // Thursday
  const today = "2026-11-19"

  it("starts half a year on the Sunday 25 weeks before this week's", () => {
    const window = isocalendarWindow("half_year", today)
    expect(window).toEqual({ start: "2026-05-24", from: "2026-05-24", end: today })
    expect(new Date(window.start).getUTCDay()).toBe(0)
    expect(daysBetween(window.start, window.end)).toBe(25 * 7 + 5)
  })

  it("asks GitHub for a year at most: 53 columns, the first one cut to a year before today", () => {
    const window = isocalendarWindow("full_year", today)
    expect(window.start).toBe("2025-11-16")
    expect(window.from).toBe("2025-11-20")
    expect(daysBetween(window.from, window.end)).toBe(365)
    // On a Saturday the 53 columns are 371 days; GitHub refuses a range over a year.
    const saturday = isocalendarWindow("full_year", "2026-11-21")
    expect(daysBetween(saturday.start, saturday.end)).toBe(53 * 7)
    expect(daysBetween(saturday.from, saturday.end)).toBe(365)
  })
})

describe("isocalendarStats", () => {
  const days = (counts: number[]) => counts.map((count) => ({ count }))

  it("counts the current streak up to yesterday while today has no contribution yet", () => {
    // metrics said 0 here: every card generated before the first commit of the day.
    expect(isocalendarStats(days([1, 0, 3, 2, 5, 0])).currentStreak).toBe(3)
    expect(isocalendarStats(days([1, 0, 3, 2, 5, 4])).currentStreak).toBe(4)
    expect(isocalendarStats(days([1, 2, 0, 0])).currentStreak).toBe(0)
  })

  it("finds the best streak, the best day and the average as metrics wrote it", () => {
    expect(isocalendarStats(days([1, 2, 3, 0, 9, 1, 0]))).toEqual({
      currentStreak: 2,
      bestStreak: 3,
      bestDay: 9,
      average: "2.29",
    })
    expect(isocalendarStats(days([2, 4])).average).toBe("3")
    expect(isocalendarStats(days([1, 2])).average).toBe("1.5")
    expect(isocalendarStats([]).average).toBe("0")
  })
})

describe("isocalendarFromCalendar", () => {
  const window = isocalendarWindow("half_year", "2026-11-19")

  it("takes the days from a calendar that has all of them", () => {
    const calendar = { totalContributions: 0, weeks: calendarOf("2026-05-19", "2026-11-19") }
    const days = isocalendarFromCalendar(calendar, window)
    expect(days).toHaveLength(180)
    expect(days?.[0]).toEqual({ date: "2026-05-24", count: 1 })
    expect(days?.at(-1)).toEqual({ date: "2026-11-19", count: 1 })
  })

  it("takes them across the years of the `full` mode, newest year first as it fetches them", () => {
    const calendar = {
      totalContributions: 0,
      weeks: [],
      years: [
        { year: 2026, totalContributions: 0, weeks: calendarOf("2026-01-01", "2026-12-31") },
        { year: 2025, totalContributions: 0, weeks: calendarOf("2025-01-01", "2025-12-31") },
      ],
    }
    expect(isocalendarFromCalendar(calendar, isocalendarWindow("full_year", "2026-11-19"))).toHaveLength(365)
  })

  it("gives up when a day is missing: the current year before July, or no calendar", () => {
    const calendar = { totalContributions: 0, weeks: calendarOf("2026-01-01", "2026-12-31") }
    expect(isocalendarFromCalendar(calendar, isocalendarWindow("half_year", "2026-03-10"))).toBeNull()
    expect(isocalendarFromCalendar(undefined, window)).toBeNull()
  })
})

/**
 * The statistics sit over the drawing's empty top right corner. The tallest columns of the
 * first day of each week reach the line y = x / 1.7 - 7 (in cube units); each statistic,
 * right-aligned, must end above that line at its left edge, with the widest values.
 */
describe("isocalendar statistics over the drawing", () => {
  const widest = statLines({ currentStreak: 365, bestStreak: 365, bestDay: 99_999, average: "999.99" })
  const contentWidth = { half: 399, full: 814 }

  it.each([
    ["half", "half_year"],
    ["half", "full_year"],
    ["full", "half_year"],
    ["full", "full_year"],
  ] as const)("stay above the columns in a %s card, %s", (size, duration) => {
    const scale = ISOCALENDAR_DRAWING_HEIGHT[size][duration] / isocalendarViewBox(duration).height
    const drawingWidth = isocalendarViewBox(duration).width * scale
    for (const style of ["default", "terminal"] as const) {
      widest.forEach(([value, label], i) => {
        const width =
          style === "terminal"
            ? textWidth(`${label} ${value}`, 12, "mono")
            : textWidth(value, 14, "poppins", 600) + 6 + textWidth(label, 12)
        const left = contentWidth[size] - width
        const bottom = (i + 1) * STAT_LINE
        if (left >= drawingWidth) return
        const columnTop = (left / scale / 1.7 - 7) * scale
        expect(bottom, `${style} "${label} ${value}"`).toBeLessThan(columnTop)
      })
    }
  })
})

describe("isocalendar section", () => {
  it("draws nothing and takes no height without data", () => {
    const config = { ...github().config, enabled: true, sections: ["isocalendar"], style: "default", size: "half" }
    const data = { warnings: [] } as unknown as GithubData
    expect(github().calculateHeight(config as never, data as never, "half")).toBe(0)
    expect(renderToStaticMarkup(github().render(config as never, data as never) as never)).not.toContain("weeb-iso")
  })

  it("draws a cube per day, the faces shaded by theme classes", async () => {
    const config = { ...github().config, enabled: true, sections: ["isocalendar"], style: "default", size: "half" }
    const data = await github().fetchData(config as never, true)
    const html = renderToStaticMarkup(github().render(config as never, data as never) as never)
    expect(html.match(/<title>/g)).toHaveLength((data as GithubData).isocalendar!.days.length)
    expect(html).toContain("--iso-hl:var(--default-color-highlight)")
    expect(html).not.toMatch(/#9be9a8|#40c463|#30a14e|#216e39/)
  })
})

/**
 * The isometric calendar asks GitHub once for its window, or not at all when the calendar
 * section already fetched those days. A fake GitHub answers each calendar query for the
 * range it asks, and records it.
 */
describe("fetchGithub isocalendar", () => {
  let asked: Array<{ from?: string; to?: string }>

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-11-19T15:00:00Z"))
    vi.spyOn(console, "warn").mockImplementation(() => {})
    asked = []
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const request = input instanceof Request ? input : new Request(String(input), init)
      if (request.url !== "https://api.github.com/graphql") throw new Error(`unexpected fetch: ${request.url}`)
      const { variables } = (await request.json()) as { variables: { from?: string; to?: string } }
      asked.push({ from: variables.from, to: variables.to })
      const from = (variables.from ?? "2025-11-19").slice(0, 10)
      const to = (variables.to ?? "2026-11-19").slice(0, 10)
      const weeks = calendarOf(from, to, (date) => (date.endsWith("5") ? 0 : Number(date.slice(8))))
      return Response.json({ data: { user: { contributionsCollection: { contributionCalendar: { weeks } } } } })
    })
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const card = (sections: string[], options: Record<string, unknown> = {}) =>
    ({ enabled: true, sections, username: "octocat", ...options }) as never

  it("asks for its window once, a year at most", async () => {
    const data = (await github().fetchData(card(["isocalendar"], { isocalendar_duration: "full_year" }), false, {
      pat: "ghp_test",
    })) as GithubData
    expect(asked).toEqual([{ from: "2025-11-20T00:00:00Z", to: "2026-11-19T23:59:59Z" }])
    expect(data.isocalendar?.start).toBe("2025-11-16")
    expect(data.isocalendar?.days).toHaveLength(365)
    expect(data.isocalendar?.days.at(-1)).toEqual({ date: "2026-11-19", count: 19 })
  })

  it.each([
    ["last_6_months", "half_year"],
    ["full", "full_year"],
  ])("asks nothing more when the calendar (%s) has the days of %s", async (mode, duration) => {
    const options = { calendar_year_mode: mode, calendar_full_max_years: 2, isocalendar_duration: duration }
    await github().fetchData(card(["calendar"], options), false, { pat: "ghp_test" })
    const calendarOnly = asked.length
    asked = []
    // The isometric calendar first: it waits for the calendar's days.
    const data = (await github().fetchData(card(["isocalendar", "calendar"], options), false, {
      pat: "ghp_test",
    })) as GithubData
    expect(asked).toHaveLength(calendarOnly)
    expect(data.isocalendar?.days.at(-1)).toEqual({ date: "2026-11-19", count: 19 })
  })

  it("asks once more when the calendar is the current year and the window starts before it", async () => {
    const options = { calendar_year_mode: "current_year", isocalendar_duration: "full_year" }
    await github().fetchData(card(["calendar"], options), false, { pat: "ghp_test" })
    const calendarOnly = asked.length
    asked = []
    await github().fetchData(card(["calendar", "isocalendar"], options), false, { pat: "ghp_test" })
    expect(asked).toHaveLength(calendarOnly + 1)
  })
})
