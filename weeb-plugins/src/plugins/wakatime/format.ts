/**
 * Formatting shared by the WakaTime sections and their heights.
 */

import type { WakaTimeConfig, WakaTimeRange, WakaTimeUsage } from "./types"

const RANGE_LABELS: Record<WakaTimeRange, string> = {
  last_7_days: "last 7 days",
  last_30_days: "last 30 days",
  last_6_months: "last 6 months",
  last_year: "last year",
  all_time: "all time",
}

export function rangeLabel(range: WakaTimeRange): string {
  return RANGE_LABELS[range]
}

/** "38h 24m", "42m", "3,100h": hours and minutes, the minutes dropped past 100 hours. */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (hours >= 100) return `${hours.toLocaleString("en-US")}h`
  return `${hours}h ${minutes}m`
}

/** An option of the plugin, wherever it was stored (the manager copies the root to nonEssential). */
export function option<T>(config: WakaTimeConfig, key: string): T | undefined {
  const value = (config.nonEssential as Record<string, unknown> | undefined)?.[key] ?? config[key]
  return value === undefined || value === null || value === "" ? undefined : (value as T)
}

/** The items a usage section draws: the ignored ones out, most time first, at most `max`. */
export function shownUsage(
  items: WakaTimeUsage[] | undefined,
  ignore: string | undefined,
  max: number
): { items: WakaTimeUsage[]; total: number } {
  const ignored = (ignore ?? "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
  const kept = (items ?? []).filter((item) => !ignored.includes(item.name.toLowerCase()))
  // The percentages are over every kept item, not only the shown ones, as WakaTime's own.
  const total = kept.reduce((sum, item) => sum + item.seconds, 0)
  return { items: [...kept].sort((a, b) => b.seconds - a.seconds).slice(0, Math.max(0, max)), total }
}

/**
 * Every option key, spelled out: `validate-config-options` (CI) looks for each key literally in
 * the code, so a key built as `${section}_title` reads as an option nothing uses.
 */
export const OPTION_KEYS = {
  time: { title: "time_title", hideTitle: "time_hide_title", range: "time_range" },
  languages: {
    title: "languages_title",
    hideTitle: "languages_hide_title",
    range: "languages_range",
    max: "languages_max",
    ignore: "languages_ignore",
  },
  projects: {
    title: "projects_title",
    hideTitle: "projects_hide_title",
    range: "projects_range",
    max: "projects_max",
    ignore: "projects_ignore",
  },
  editors: { title: "editors_title", hideTitle: "editors_hide_title", range: "editors_range", max: "editors_max" },
  operating_systems: {
    title: "operating_systems_title",
    hideTitle: "operating_systems_hide_title",
    range: "operating_systems_range",
    max: "operating_systems_max",
  },
} as const

export type OptionKeys = { title: string; hideTitle: string; range: string; max?: string; ignore?: string }

/** The option keys of a section, or undefined for one this plugin does not have. */
export function keysOf(section: string): OptionKeys | undefined {
  return (OPTION_KEYS as Record<string, OptionKeys>)[section]
}
