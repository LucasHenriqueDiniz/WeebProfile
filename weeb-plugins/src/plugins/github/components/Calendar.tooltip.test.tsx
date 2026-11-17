import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"
import type { ContributionWeek, GithubConfig } from "../types"
import { GithubCalendar } from "./Calendar"

const DAY = 86_400_000
const SUNDAY = Date.UTC(2026, 4, 17)

/** One week, Sunday 2026-05-17 to Saturday 2026-05-23, each day counting its weekday. */
function oneWeek(withWeekday: boolean): ContributionWeek[] {
  return [
    {
      contributionDays: Array.from({ length: 7 }, (_, weekday) => ({
        date: new Date(SUNDAY + weekday * DAY).toISOString().slice(0, 10),
        ...(withWeekday ? { weekday } : {}),
        contributionCount: weekday,
        color: "#40c463",
      })),
    },
  ]
}

function render(weeks: ContributionWeek[], style: "default" | "terminal"): string {
  return renderToStaticMarkup(
    <GithubCalendar
      data={{ totalContributions: 0, weeks }}
      config={{ calendar_year_mode: "last_year" } as GithubConfig}
      style={style}
      size="full"
    />
  )
}

/** Each tooltip's count and date, in the order the markup draws them. */
function tooltips(html: string): Array<[number, string]> {
  return [...html.matchAll(/title="(\d+) contributions on ([^"]+)"/g)].map((m) => [Number(m[1]), m[2]!])
}

/**
 * GitHub's days are plain dates ("2026-05-17"), which `new Date` reads as UTC midnight. The
 * Worker renders in UTC; the dashboard preview and local runs render in the machine's zone,
 * where a zone behind UTC put every tooltip on the day before and moved month labels.
 */
describe("GithubCalendar in any time zone", () => {
  const realTz = process.env.TZ
  afterEach(() => {
    process.env.TZ = realTz
  })

  it.each(["default", "terminal"] as const)("names each day's own date, %s", (style) => {
    process.env.TZ = "America/Sao_Paulo"
    const expected = Array.from({ length: 7 }, (_, weekday): [number, string] => [
      weekday,
      new Date(SUNDAY + weekday * DAY).toLocaleDateString(undefined, { timeZone: "UTC" }),
    ])
    expect(tooltips(render(oneWeek(true), style))).toEqual(expected)
  })

  // A year's worth of week columns, month labels and tooltips, the way the Worker draws it in UTC.
  it.each(["default", "terminal"] as const)("draws the same calendar in any time zone, %s", (style) => {
    const year: ContributionWeek[] = []
    for (let day = Date.UTC(2025, 0, 1); day < Date.UTC(2026, 0, 1); day += DAY) {
      const weekday = new Date(day).getUTCDay()
      if (year.length === 0 || weekday === 0) year.push({ contributionDays: [] })
      year.at(-1)!.contributionDays.push({
        date: new Date(day).toISOString().slice(0, 10),
        weekday,
        contributionCount: 1,
        color: "#40c463",
      })
    }
    process.env.TZ = "UTC"
    const utc = render(year, style)
    for (const tz of ["America/Sao_Paulo", "Asia/Tokyo"]) {
      process.env.TZ = tz
      expect({ tz, same: render(year, style) === utc }).toEqual({ tz, same: true })
    }
  })

  // Without `weekday` the default style places a day by its date: Sunday on the top row.
  it("puts a day without its weekday on its own row, default", () => {
    process.env.TZ = "America/Sao_Paulo"
    expect(tooltips(render(oneWeek(false), "default")).map(([count]) => count)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})
