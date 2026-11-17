import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { PluginManager } from "../../manager"
import { getMockGithubData } from "../services/mock-data"
import type { ContributionWeek, GithubConfig, GithubData } from "../types"
import { GithubCalendar } from "./Calendar"

const DAY = 86_400_000

/** The days GitHub returns from `from` to `to` (both "YYYY-MM-DD"), in weeks from Sunday. */
function weeksBetween(from: string, to: string): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let day = Date.parse(from); day <= Date.parse(to); day += DAY) {
    const weekday = new Date(day).getUTCDay()
    if (weeks.length === 0 || weekday === 0) weeks.push({ contributionDays: [] })
    weeks.at(-1)!.contributionDays.push({
      date: new Date(day).toISOString().slice(0, 10),
      weekday,
      contributionCount: 1,
      color: "#40c463",
    })
  }
  return weeks
}

function daysDrawn(calendar: GithubData["calendar"], style: "default" | "terminal"): number {
  const html = renderToStaticMarkup(
    <GithubCalendar
      data={calendar}
      config={{ calendar_year_mode: "last_6_months" } as GithubConfig}
      style={style}
      size="full"
    />
  )
  return html.split(" contributions on ").length - 1
}

/**
 * The fetch asks GitHub for the six months before today's UTC date, so the calendar holds
 * exactly those days. The Worker renders in UTC; the dashboard preview renders in the
 * visitor's time zone, and so does a local run.
 */
describe("GithubCalendar last 6 months in any time zone", () => {
  const realTz = process.env.TZ

  afterEach(() => {
    process.env.TZ = realTz
    vi.useRealTimers()
  })

  it.each([
    // Midday UTC: a time zone behind UTC put its midnight after the first day.
    ["2026-11-17T12:00:00Z", "2026-05-17", "2026-11-17"],
    // Late in the UTC day, Tokyo is already on the next day and six months back from it.
    ["2026-11-17T16:00:00Z", "2026-05-17", "2026-11-17"],
  ])("draws every day GitHub returned, now %s", (now, from, to) => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(now))
    const weeks = weeksBetween(from, to)
    const calendar = { totalContributions: 0, weeks }
    const days = weeks.reduce((sum, week) => sum + week.contributionDays.length, 0)

    for (const tz of ["UTC", "America/Sao_Paulo", "Asia/Tokyo"]) {
      process.env.TZ = tz
      expect({ tz, default: daysDrawn(calendar, "default"), terminal: daysDrawn(calendar, "terminal") }).toEqual({
        tz,
        default: days,
        terminal: days,
      })
    }
  })
})

// GitHub returns the current year up to December 31, with the days after today empty.
describe("GithubCalendar last 6 months over a calendar that runs past today", () => {
  afterEach(() => vi.useRealTimers())

  it.each(["default", "terminal"] as const)("keeps the days from six months before today, %s", (style) => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-11-17T12:00:00Z"))
    const calendar = { totalContributions: 0, weeks: weeksBetween("2026-01-01", "2026-12-31") }
    // 2026-05-17 to 2026-12-31: the full size draws the empty weeks after today too
    expect(daysDrawn(calendar, style)).toBe(229)
  })
})

/**
 * The dashboard's wizard preview renders the mock through the plugin, as useMockPluginData and
 * PreviewRenderer do. The mock is all of 2025: measured from today, its last six months were
 * empty and the preview drew no days.
 */
describe("GithubCalendar last 6 months in the dashboard preview", () => {
  afterEach(() => vi.useRealTimers())

  it.each(["default", "terminal"] as const)("draws the mock's last six months, %s", async (style) => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-11-17T12:00:00Z"))
    const plugin = PluginManager.getInstance().get("github")!
    const config = {
      ...plugin.config,
      enabled: true,
      sections: ["calendar"],
      style,
      size: "full",
      calendar_year_mode: "last_6_months",
    }
    const data = await plugin.fetchData(config as never, true, undefined, true)
    const html = renderToStaticMarkup(
      plugin.render({ ...config, previewMode: true } as never, data) as React.ReactElement
    )
    // 2025-07-01 to 2025-12-31
    expect(html.split(" contributions on ").length - 1).toBe(184)

    // The total is those days', not the mock's total for the year (992)
    const mock = await getMockGithubData()
    const total = mock.calendar.weeks
      .flatMap((week) => week.contributionDays)
      .filter((day) => day.date >= "2025-07-01")
      .reduce((sum, day) => sum + day.contributionCount, 0)
    expect(total).toBe(743)
    expect(html.replace(/<!-- -->/g, "")).toContain(`${total} contributions in the last 6 months`)
  })
})
