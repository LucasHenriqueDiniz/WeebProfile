import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { ContributionWeek, GithubConfig, GithubData } from "../types"
import { GithubCalendar } from "./Calendar"

type Calendar = GithubData["calendar"]

/**
 * One year of weeks as GitHub returns them: oldest first, Sunday to Saturday, the first and
 * last weeks cut at the year's edges. GitHub returns the current year up to December 31.
 * Each day's count is `week * 7 + weekday`, so the markup tells which day landed where.
 */
function yearWeeks(year: number): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let day = new Date(`${year}-01-01T00:00:00Z`); day.getUTCFullYear() === year; ) {
    const weekday = day.getUTCDay()
    if (weeks.length === 0 || weekday === 0) weeks.push({ contributionDays: [] })
    weeks.at(-1)!.contributionDays.push({
      date: day.toISOString().slice(0, 10),
      weekday,
      contributionCount: (weeks.length - 1) * 7 + weekday,
      color: "#40c463",
    })
    day = new Date(day.getTime() + 86_400_000)
  }
  return weeks
}

function weekOf(weeks: ContributionWeek[], date: string): number {
  return weeks.findIndex((week) => week.contributionDays.some((day) => day.date === date))
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

function calendarOf(years: Array<{ year: number; weeks: ContributionWeek[] }>): Calendar {
  return {
    totalContributions: 0,
    // As fetchGithub builds it for the "full" year mode: the current year first.
    weeks: years.flatMap((y) => y.weeks),
    years: years.length > 1 ? years.map((y) => ({ ...y, totalContributions: 0 })) : undefined,
  }
}

function render(calendar: Calendar, size: "half" | "full", yearMode: GithubConfig["calendar_year_mode"]): string {
  return renderToStaticMarkup(
    <GithubCalendar
      data={calendar}
      config={{ calendar_year_mode: yearMode } as GithubConfig}
      style="terminal"
      size={size}
    />
  )
}

/**
 * The week columns left to right, each as its seven rows top to bottom (Sunday first): the
 * count of the day drawn there, or null for an empty row.
 */
function columns(html: string): Array<Array<number | null>> {
  return html
    .split('class="grid grid-rows-7 w-[0.60rem]">')
    .slice(1)
    .map((column) =>
      [...column.split("</div>")[0]!.matchAll(/<span(?: title="(\d+) contributions on [^"]*")?/g)].map((m) =>
        m[1] === undefined ? null : Number(m[1])
      )
    )
}

/** The week each column draws, left to right. */
function drawnWeeks(html: string): number[] {
  return columns(html).map((rows) => Math.floor(rows.find((count) => count !== null)! / 7))
}

/** Days drawn on a row other than their weekday's (Sunday on the top row). */
function daysOffTheirRow(html: string): number {
  return columns(html)
    .flatMap((rows) => rows.map((count, row) => ({ count, row })))
    .filter(({ count, row }) => count !== null && count % 7 !== row).length
}

/** The markup of each year block in a multi-year calendar, top first. */
function yearBlocks(html: string): string[] {
  return html.split('class="text-terminal-warning text-sm font-semibold">').slice(1)
}

describe("GithubCalendar terminal style", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function today(date: string) {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(`${date}T12:00:00Z`))
  }

  // 2025 starts on a Wednesday and ends on a Wednesday: 53 weeks, both edges cut.
  it("draws every week of a 53-week year in full, oldest on the left", () => {
    today("2026-11-17")
    const html = render(calendarOf([{ year: 2025, weeks: yearWeeks(2025) }]), "full", "last_year")
    expect(drawnWeeks(html)).toEqual(range(0, 52))
  })

  it("draws the last 26 weeks of a past year in half, oldest on the left", () => {
    today("2026-11-17")
    const html = render(calendarOf([{ year: 2025, weeks: yearWeeks(2025) }]), "half", "last_year")
    expect(drawnWeeks(html)).toEqual(range(27, 52))
  })

  // GitHub returns the current year up to December 31: the weeks after this one are empty.
  it("ends the half current year at this week", () => {
    today("2026-11-17")
    const weeks = yearWeeks(2026)
    const thisWeek = weekOf(weeks, "2026-11-17")
    const html = render(calendarOf([{ year: 2026, weeks }]), "half", "current_year")
    expect(drawnWeeks(html)).toEqual(range(thisWeek - 25, thisWeek))
  })

  it("draws the first 26 weeks of the half current year before it has 26 weeks", () => {
    today("2026-03-10")
    const html = render(calendarOf([{ year: 2026, weeks: yearWeeks(2026) }]), "half", "current_year")
    expect(drawnWeeks(html)).toEqual(range(0, 25))
  })

  it("keeps the half last 6 months within 26 weeks, ending at this week", () => {
    today("2026-11-17")
    const weeks = yearWeeks(2026)
    const thisWeek = weekOf(weeks, "2026-11-17")
    const html = render(calendarOf([{ year: 2026, weeks }]), "half", "last_6_months")
    expect(drawnWeeks(html)).toEqual(range(thisWeek - 25, thisWeek))
  })

  it.each(["half", "full"] as const)("draws each year of a multi-year calendar oldest on the left, %s", (size) => {
    today("2026-11-17")
    const years = [2026, 2025, 2024].map((year) => ({ year, weeks: yearWeeks(year) }))
    const blocks = yearBlocks(render(calendarOf(years), size, "full"))
    expect(blocks).toHaveLength(3)
    blocks.forEach((block, i) => {
      const { year, weeks } = years[i]!
      expect(block.startsWith(`${year} (`)).toBe(true)
      const last = year === 2026 ? weekOf(weeks, "2026-11-17") : weeks.length - 1
      expect(drawnWeeks(block)).toEqual(size === "full" ? range(0, weeks.length - 1) : range(last - 25, last))
    })
  })

  // 2026 starts on a Thursday, 2025 on a Wednesday, 2024 on a Monday.
  it.each(["half", "full"] as const)("puts every day on its weekday's row, %s", (size) => {
    today("2026-03-10")
    const years = [2026, 2025, 2024].map((year) => ({ year, weeks: yearWeeks(year) }))
    const html = render(calendarOf(years), size, "full")
    expect(columns(html).every((rows) => rows.length === 7)).toBe(true)
    expect(daysOffTheirRow(html)).toBe(0)
  })
})
