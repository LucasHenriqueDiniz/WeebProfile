/**
 * Isometric contribution calendar: the window it draws, its statistics and its geometry.
 *
 * Ported from lowlighter/metrics, `source/plugins/isocalendar/index.mjs`:
 * Copyright (c) 2020-present lowlighter, MIT License. The cube paths (a top face 3.4 wide
 * and 2 tall, a column up to 6 tall, weeks stepping (1.7, 1) and days (-1.7, 1)) and the
 * streak, best day and average statistics come from there. metrics asked GitHub for the
 * window four weeks at a time (14 queries for a year); this asks once, or not at all when
 * the card's `calendar` section already fetched the days.
 */

import type { GithubConfig, GithubData } from "./types"

export type IsocalendarDuration = "half_year" | "full_year"

/**
 * Week columns drawn, the current week included: 26 for half a year, 53 for a year, as
 * GitHub's own calendar. Fixed, so the drawing's size does not depend on the weekday.
 */
export const ISOCALENDAR_COLUMNS: Record<IsocalendarDuration, number> = { half_year: 26, full_year: 53 }

/** Half the width of a cube's top face, and its height: one week or day step. */
const STEP_X = 1.7
/** Height of the tallest column, in the same units. */
export const COLUMN_HEIGHT = 6

export const duration = (cfg: Pick<GithubConfig, "isocalendar_duration">): IsocalendarDuration =>
  cfg.isocalendar_duration === "full_year" ? "full_year" : "half_year"

const DAY_MS = 24 * 60 * 60 * 1000

const isoDate = (ms: number): string => new Date(ms).toISOString().slice(0, 10)
const dayMs = (date: string): number => Date.parse(`${date}T00:00:00Z`)

export interface IsocalendarWindow {
  /** The Sunday the first column starts on. */
  start: string
  /** The first day asked for: `start`, or a year before `end` when that is later. */
  from: string
  /** The last day drawn (today in UTC). */
  end: string
}

/**
 * The days the calendar draws, ending on `today` ("YYYY-MM-DD"). GitHub's
 * `contributionsCollection` refuses a range over a year, and 53 columns are up to 371 days,
 * so a year's first column starts a year before today, like GitHub's own calendar.
 */
export function isocalendarWindow(d: IsocalendarDuration, today: string): IsocalendarWindow {
  const end = dayMs(today)
  const weekday = new Date(end).getUTCDay()
  const start = end - (weekday + 7 * (ISOCALENDAR_COLUMNS[d] - 1)) * DAY_MS
  const yearAgo = new Date(end)
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1)
  const from = Math.max(start, yearAgo.getTime() + DAY_MS)
  return { start: isoDate(start), from: isoDate(from), end: today }
}

/** Every day of a fetched calendar, by date: its single range and, in `full`, each year. */
function daysOf(calendar: GithubData["calendar"] | undefined): Map<string, number> {
  const days = new Map<string, number>()
  const weeks = [...(calendar?.weeks ?? []), ...(calendar?.years ?? []).flatMap((year) => year.weeks)]
  for (const week of weeks) for (const day of week.contributionDays) days.set(day.date, day.contributionCount)
  return days
}

/**
 * The window's days from an already fetched calendar, or `null` when it is missing any of
 * them. `last_6_months` covers half a year, `full` with two years or more covers both
 * durations, and `current_year` covers half a year once July is far enough along.
 */
export function isocalendarFromCalendar(
  calendar: GithubData["calendar"] | undefined,
  window: IsocalendarWindow
): NonNullable<GithubData["isocalendar"]>["days"] | null {
  const known = daysOf(calendar)
  const days: NonNullable<GithubData["isocalendar"]>["days"] = []
  for (let ms = dayMs(window.from); ms <= dayMs(window.end); ms += DAY_MS) {
    const date = isoDate(ms)
    const count = known.get(date)
    if (count === undefined) return null
    days.push({ date, count })
  }
  return days
}

export interface IsocalendarStats {
  /** Days in a row with a contribution, up to today, or up to yesterday while today has none. */
  currentStreak: number
  bestStreak: number
  /** Most contributions in one day. */
  bestDay: number
  /** Contributions per day over the window, as metrics wrote it: two decimals, trailing zeros off. */
  average: string
}

export function isocalendarStats(days: Array<{ count: number }>): IsocalendarStats {
  let best = 0
  let run = 0
  let bestDay = 0
  let total = 0
  for (const { count } of days) {
    run = count > 0 ? run + 1 : 0
    best = Math.max(best, run)
    bestDay = Math.max(bestDay, count)
    total += count
  }
  // metrics reset the current streak on a day without contributions, today included, so
  // every card generated before the first commit of the day said 0.
  let current = 0
  const last = days.length - 1
  for (let i = days[last]?.count ? last : last - 1; i >= 0 && (days[i]?.count ?? 0) > 0; i--) current++
  const average = days.length ? (total / days.length).toFixed(2).replace(/\.?0+$/, "") : "0"
  return { currentStreak: current, bestStreak: best, bestDay, average }
}

/** Size of the drawing in cube units: x from the left of the last weekday of the first column. */
export function isocalendarViewBox(d: IsocalendarDuration): { width: number; height: number } {
  const columns = ISOCALENDAR_COLUMNS[d]
  // A column's left edge moves 1.7 per week and -1.7 per day; a cube is 3.4 wide. Its top is
  // at week + day, its bottom 8 lower (2 of top face, 6 of column).
  return { width: STEP_X * (columns - 1 + 6) + 2 * STEP_X, height: columns - 1 + 6 + 2 + COLUMN_HEIGHT }
}

/**
 * Height of the drawing in px, per card size. Half a year draws at 6px a unit in both;
 * a year fills a half card's 399px and draws at 4.5px a unit in a full one.
 */
export const ISOCALENDAR_DRAWING_HEIGHT: Record<"half" | "full", Record<IsocalendarDuration, number>> = {
  half: { half_year: 234, full_year: 257 },
  full: { half_year: 234, full_year: 297 },
}

/** The section's height: the default title (40px) when shown, then the drawing. */
export function isocalendarHeight(cfg: GithubConfig, gh: GithubData, size: "half" | "full", isTerminal: boolean) {
  if (!gh.isocalendar) return 0
  const drawing = ISOCALENDAR_DRAWING_HEIGHT[size][duration(cfg)]
  // Terminal: the 24px command, the drawing and the body's 8px bottom padding.
  if (isTerminal) return 24 + drawing + 8
  return (cfg.isocalendar_hide_title ? 0 : 40) + drawing
}

/** The cube of one day: its three faces as paths, top first. */
export function cubePaths(
  week: number,
  weekday: number,
  ratio: number
): { top: string; left?: string; right?: string } {
  const r = (n: number) => Math.round(n * 100) / 100
  const x = STEP_X * (week - weekday + 6)
  const y = week + weekday
  const top = y + (1 - ratio) * COLUMN_HEIGHT
  const paths: { top: string; left?: string; right?: string } = {
    top: `M${r(x + STEP_X)} ${r(top + 2)}l-1.7-1 1.7-1 1.7 1z`,
  }
  if (ratio > 0) {
    // The sides run from the top face down to the floor, 8 under the cube's origin.
    paths.left = `M${r(x)} ${r(top + 1)}l1.7 1V${r(y + 8)}l-1.7-1z`
    paths.right = `M${r(x + STEP_X)} ${r(top + 2)}l1.7-1V${r(y + 7)}l-1.7 1z`
  }
  return paths
}

/** Shade of a day: 0 without contributions, else 1 to 4 by its share of the best day. */
export const cubeLevel = (ratio: number): number => (ratio <= 0 ? 0 : Math.min(4, Math.ceil(ratio * 4)))

/**
 * Faces as classes, so 371 cubes do not each carry their colors. Theme colors, mixed with
 * the theme's background so the faces stay opaque (a cube in front hides the one behind);
 * the sides darker than the top, as metrics' brightness filters made them.
 */
export const ISOCALENDAR_CSS = [0, 1, 2, 3, 4]
  .map((level) => {
    const face =
      level === 0
        ? "color-mix(in srgb, var(--iso-empty) 28%, var(--iso-bg))"
        : `color-mix(in srgb, var(--iso-hl) ${[0, 40, 60, 80, 100][level]}%, var(--iso-bg))`
    return [
      `.gh-iso .t${level} { fill: ${face}; }`,
      `.gh-iso .l${level} { fill: color-mix(in srgb, ${face} 78%, #000); }`,
      `.gh-iso .r${level} { fill: color-mix(in srgb, ${face} 58%, #000); }`,
    ].join("\n")
  })
  .join("\n")
