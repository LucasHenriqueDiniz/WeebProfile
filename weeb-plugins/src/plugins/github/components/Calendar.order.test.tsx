import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import type { ContributionWeek, GithubConfig, GithubData } from "../types"
import { GithubCalendar } from "./Calendar"

type Calendar = GithubData["calendar"]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * One year of weeks as GitHub returns them: oldest first, Sunday to Saturday, the first and
 * last weeks cut at the year's edges. Each day counts its week's place in the year, so the
 * rendered tooltips give the order the weeks were drawn in.
 */
function yearWeeks(year: number, lastDay = `${year}-12-31`): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let day = new Date(`${year}-01-01T00:00:00Z`); day.toISOString().slice(0, 10) <= lastDay; ) {
    const weekday = day.getUTCDay()
    if (weeks.length === 0 || weekday === 0) weeks.push({ contributionDays: [] })
    weeks.at(-1)!.contributionDays.push({
      date: day.toISOString().slice(0, 10),
      weekday,
      contributionCount: weeks.length - 1,
      color: "#40c463",
    })
    day = new Date(day.getTime() + 86_400_000)
  }
  return weeks
}

function calendarOf(years: Array<{ year: number; weeks: ContributionWeek[] }>): Calendar {
  return {
    totalContributions: 0,
    // As fetchGithub builds it for the "full" year mode: the current year first.
    weeks: years.flatMap((y) => y.weeks),
    years: years.length > 1 ? years.map((y) => ({ ...y, totalContributions: 0 })) : undefined,
  }
}

function render(calendar: Calendar, size: "half" | "full"): string {
  return renderToStaticMarkup(
    <GithubCalendar
      data={calendar}
      config={{ calendar_year_mode: "full" } as GithubConfig}
      style="default"
      size={size}
    />
  )
}

/** The weeks in the order the markup draws them, by the count each day carries. */
function drawnWeeks(html: string): number[] {
  const weeks = [...html.matchAll(/title="(\d+) contributions on /g)].map((m) => Number(m[1]))
  return weeks.filter((week, i) => week !== weeks[i - 1])
}

function monthLabels(html: string): string[] {
  return [...html.matchAll(/grid-column:\d+ \/ span \d+[^"]*">(\w{3})</g)].map((m) => m[1]!)
}

/** The markup of each year block in a multi-year calendar, top first. */
function yearBlocks(html: string): string[] {
  return html.split('class="text-sm font-semibold text-default-text"').slice(1)
}

const sizes = ["half", "full"] as const

describe("GithubCalendar week order, default style", () => {
  it.each(sizes)("draws a single year from January to December, %s", (size) => {
    const weeks = yearWeeks(2025)
    const html = render(calendarOf([{ year: 2025, weeks }]), size)
    expect(drawnWeeks(html)).toEqual(weeks.map((_, i) => i))
    expect(monthLabels(html)[0]).toBe("Jan")
    expect(monthLabels(html).at(-1)).toBe("Dec")
  })

  // The current year, cut where GitHub has no more days, above two whole ones.
  it.each(sizes)("draws each year of a multi-year calendar from January to December, %s", (size) => {
    const years = [
      { year: 2026, weeks: yearWeeks(2026, "2026-05-20") },
      { year: 2025, weeks: yearWeeks(2025) },
      { year: 2024, weeks: yearWeeks(2024) },
    ]
    const blocks = yearBlocks(render(calendarOf(years), size))
    expect(blocks).toHaveLength(3)
    blocks.forEach((block, i) => {
      const { year, weeks } = years[i]!
      expect(block.startsWith(`>${year} (`)).toBe(true)
      expect(drawnWeeks(block)).toEqual(weeks.map((_, x) => x))
      const labels = monthLabels(block)
      expect(labels[0]).toBe("Jan")
      expect(labels.at(-1)).toBe(year === 2026 ? "May" : "Dec")
      // Left to right in each row, and the second row of the half size goes on from the first.
      const order = labels.map((label) => MONTHS.indexOf(label))
      expect(order).toEqual([...order].sort((a, b) => a - b))
    })
  })
})
