/**
 * WakaTime plugin types
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

/** The `:range` values of `GET /api/v1/users/current/stats/:range`. */
export const WAKATIME_RANGES = ["last_7_days", "last_30_days", "last_6_months", "last_year", "all_time"] as const
export type WakaTimeRange = (typeof WAKATIME_RANGES)[number]

export const WAKATIME_SECTIONS = ["time", "languages", "projects", "editors", "operating_systems"] as const
export type WakaTimeSection = (typeof WAKATIME_SECTIONS)[number]

/** The sections drawn as a bar and one line per item. */
export type WakaTimeUsageSection = Exclude<WakaTimeSection, "time">

/** One language, project, editor or operating system, with the time spent in it. */
export interface WakaTimeUsage {
  name: string
  seconds: number
  /** From WakaTime's own catalog when it has one for the name. */
  color?: string
}

/** The stats of one range. */
export interface WakaTimeStats {
  range: WakaTimeRange
  /** WakaTime's own wording of the range ("last 7 days", "since Aug 4 2025"). */
  humanReadableRange: string
  /**
   * False when WakaTime still answered 202 after the retry: the numbers are the last ones it
   * computed for this range, and are refreshed in the background.
   */
  isUpToDate: boolean
  /** Coding time without the "Other" language, as WakaTime's dashboard shows it. */
  totalSeconds: number
  dailyAverageSeconds: number
  bestDay: { date: string; seconds: number } | null
  languages: WakaTimeUsage[]
  projects: WakaTimeUsage[]
  editors: WakaTimeUsage[]
  operatingSystems: WakaTimeUsage[]
}

export interface WakaTimeData {
  /** One entry per range the enabled sections ask for. */
  stats: Partial<Record<WakaTimeRange, WakaTimeStats>>
}

export interface WakaTimeNonEssentialConfig extends NonEssentialPluginConfig {
  time_title?: string
  time_hide_title?: boolean
  time_range?: WakaTimeRange
  languages_title?: string
  languages_hide_title?: boolean
  languages_range?: WakaTimeRange
  languages_max?: number
  languages_ignore?: string
  projects_title?: string
  projects_hide_title?: boolean
  projects_range?: WakaTimeRange
  projects_max?: number
  projects_ignore?: string
  editors_title?: string
  editors_hide_title?: boolean
  editors_range?: WakaTimeRange
  editors_max?: number
  operating_systems_title?: string
  operating_systems_hide_title?: boolean
  operating_systems_range?: WakaTimeRange
  operating_systems_max?: number
}

export interface WakaTimeConfig extends BasePluginConfig {
  nonEssential?: WakaTimeNonEssentialConfig
  [key: string]: unknown
}
