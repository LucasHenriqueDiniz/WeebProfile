/**
 * What the Code Habits variants read from the counts: the layout to draw, the busiest hour
 * and weekday, the part of the day with the most commits, and how dark a cell is.
 * The card and its height (`codeHabitsHeight`) both go through `codeHabitsVariant`, so a
 * punch card without its weekday × hour counts falls back to the bars on both sides.
 */

import type { GithubConfig, GithubData } from "../types"

export type CodeHabitsVariant = "bars" | "punchcard" | "summary"

export const CODE_HABITS_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

type Habits = GithubData["codeHabits"]

const total = (values: number[]): number => values.reduce((sum, v) => sum + v, 0)

/** The weekday × hour counts, when the data has them and they hold at least one commit. */
export function dayHourMatrix(habits: Habits): number[][] | undefined {
  const byDayHour = habits.commitsByDayHour
  if (!byDayHour) return undefined
  const rows = CODE_HABITS_DAYS.map((day) =>
    Array.from({ length: 24 }, (_, hour) => Number(byDayHour[day]?.[hour] ?? 0) || 0)
  )
  return total(rows.flat()) > 0 ? rows : undefined
}

export function codeHabitsVariant(cfg: GithubConfig, habits: Habits): CodeHabitsVariant {
  const asked = cfg.code_habits_variant
  if (asked === "summary") return "summary"
  // Data from before the weekday × hour counts (or a fetch that read no commit) has no punch card.
  if (asked === "punchcard") return dayHourMatrix(habits) ? "punchcard" : "bars"
  return "bars"
}

export function hourCounts(habits: Habits): number[] {
  return Array.from({ length: 24 }, (_, hour) => Number(habits.commitsByHour?.[hour] ?? 0) || 0)
}

export function dayCounts(habits: Habits): number[] {
  return CODE_HABITS_DAYS.map((day) => Number(habits.commitsByDay?.[day] ?? 0) || 0)
}

/** Index of the largest count; the earliest one wins a tie. Undefined when all are zero. */
function peak(values: number[]): number | undefined {
  let best: number | undefined
  values.forEach((v, i) => {
    if (v > 0 && (best === undefined || v > (values[best] ?? 0))) best = i
  })
  return best
}

export interface CodeHabitsHighlights {
  peakHour?: { hour: number; commits: number }
  busiestDay?: { day: string; commits: number }
  /** The quarter of the day with the most commits and its share of them, in %. */
  rhythm?: { label: string; share: number }
}

const PERIODS = [
  { label: "Night owl", from: 0, to: 6 },
  { label: "Morning", from: 6, to: 12 },
  { label: "Afternoon", from: 12, to: 18 },
  { label: "Evening", from: 18, to: 24 },
]

export function codeHabitsHighlights(habits: Habits): CodeHabitsHighlights {
  const hours = hourCounts(habits)
  const days = dayCounts(habits)
  const hour = peak(hours)
  const day = peak(days)
  const sum = total(hours)
  const periods = PERIODS.map((p) => total(hours.slice(p.from, p.to)))
  const period = peak(periods)
  return {
    peakHour: hour === undefined ? undefined : { hour, commits: hours[hour] ?? 0 },
    busiestDay: day === undefined ? undefined : { day: CODE_HABITS_DAYS[day] ?? "", commits: days[day] ?? 0 },
    rhythm:
      period === undefined || sum === 0
        ? undefined
        : { label: PERIODS[period]?.label ?? "", share: Math.round(((periods[period] ?? 0) / sum) * 100) },
  }
}

/** 0 for no commits, then 1–4 by the share of the largest count (quartiles). */
export function level(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || max <= 0) return 0
  const ratio = value / max
  if (ratio > 0.75) return 4
  if (ratio > 0.5) return 3
  if (ratio > 0.25) return 2
  return 1
}
