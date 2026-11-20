/**
 * WakaTime data
 *
 * API: https://wakatime.com/developers (`GET /api/v1/users/current/stats/:range`, scope `read_stats`).
 *
 * Auth is the user's personal OAuth token (wakatime.com/oauth), sent as a Bearer token. The
 * secret API key no longer reads anything: WakaTime made API keys write-only, for the editor
 * plugins that send activity. The token goes in the header, never in the URL, so it cannot end
 * up in a logged URL.
 *
 * Without a token, `/users/:username/stats/:range` answers for public profiles, but only for the
 * range the user made public (400 "Time range not matching user's public stats range" for the
 * others: 13 of 15 requests to 5 leaderboard users on 18/11/2026) and never with projects (null
 * in all of them). A token is required.
 */

import { fetchJson } from "../../shared/utils/api"
import { ApiError, PluginError, upstreamFailure } from "../../shared/utils/errors"
import { keysOf } from "../format"
import type { WakaTimeData, WakaTimeRange, WakaTimeStats, WakaTimeUsage } from "../types"
import { WAKATIME_RANGES } from "../types"
import { getMockWakaTimeData } from "./mock-data"

const BASE_URL = "https://wakatime.com/api/v1"
const DEFAULT_RANGE: WakaTimeRange = "last_7_days"

/**
 * WakaTime answers 202 with `is_up_to_date: false` while it recomputes a range, with the last
 * numbers it had. Measured 18/11/2026 on a public `all_time`: 202, and 200 with fresh numbers
 * three seconds later. One retry after that wait; still stale, the card shows what came.
 */
export const STALE_RETRY_DELAY_MS = 3_000

/** The color catalogs are a nicety: short timeout, no retry, the card draws without them. */
const CATALOG_TIMEOUT_MS = 5_000

interface ApiUsage {
  name?: string
  total_seconds?: number
  color?: string | null
}

interface ApiStats {
  range?: string
  human_readable_range?: string
  is_up_to_date?: boolean
  total_seconds?: number
  total_seconds_including_other_language?: number
  daily_average?: number
  best_day?: { date?: string; total_seconds?: number } | null
  languages?: ApiUsage[] | null
  projects?: ApiUsage[] | null
  editors?: ApiUsage[] | null
  operating_systems?: ApiUsage[] | null
}

interface CatalogEntry {
  name?: string
  color?: string | null
}

interface WakaTimeConfigLike {
  sections?: string[]
  nonEssential?: unknown
  [key: string]: unknown
}

export interface FetchWakaTimeOptions {
  /** Wait before retrying a stale (202) answer. */
  staleRetryDelayMs?: number
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isRange(value: unknown): value is WakaTimeRange {
  return typeof value === "string" && (WAKATIME_RANGES as readonly string[]).includes(value)
}

/** The ranges the enabled sections ask for, each once. */
export function rangesFor(config: WakaTimeConfigLike): WakaTimeRange[] {
  const ranges = new Set<WakaTimeRange>()
  for (const section of config.sections ?? []) {
    const keys = keysOf(section)
    if (!keys) continue
    const range = config[keys.range] ?? (config.nonEssential as Record<string, unknown> | undefined)?.[keys.range]
    ranges.add(isRange(range) ? range : DEFAULT_RANGE)
  }
  return [...ranges]
}

function usage(items: ApiUsage[] | null | undefined, colors: Map<string, string>): WakaTimeUsage[] {
  return (items ?? [])
    .filter((item) => item.name && (item.total_seconds ?? 0) > 0)
    .map((item) => {
      const color = item.color || colors.get(item.name!.toLowerCase())
      return { name: item.name!, seconds: item.total_seconds!, ...(color ? { color } : {}) }
    })
    .sort((a, b) => b.seconds - a.seconds)
}

function toStats(range: WakaTimeRange, api: ApiStats, colors: Colors): WakaTimeStats {
  return {
    range,
    humanReadableRange: api.human_readable_range ?? range.replace(/_/g, " "),
    isUpToDate: api.is_up_to_date !== false,
    totalSeconds: api.total_seconds ?? 0,
    dailyAverageSeconds: api.daily_average ?? 0,
    bestDay:
      api.best_day?.date && (api.best_day.total_seconds ?? 0) > 0
        ? { date: api.best_day.date, seconds: api.best_day.total_seconds! }
        : null,
    languages: usage(api.languages, colors.languages),
    projects: usage(api.projects, new Map()),
    editors: usage(api.editors, colors.editors),
    operatingSystems: usage(api.operating_systems, new Map()),
  }
}

function hasActivity(api: ApiStats): boolean {
  return (api.total_seconds_including_other_language ?? api.total_seconds ?? 0) > 0 || (api.languages?.length ?? 0) > 0
}

async function requestStats(range: WakaTimeRange, token: string): Promise<ApiStats> {
  const body = await fetchJson<{ data?: ApiStats }>(`${BASE_URL}/users/current/stats/${range}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  })
  return body.data ?? {}
}

async function fetchRange(range: WakaTimeRange, token: string, retryDelayMs: number): Promise<ApiStats> {
  const first = await requestStats(range, token)
  if (first.is_up_to_date !== false) return first

  await sleep(retryDelayMs)
  const second = await requestStats(range, token)
  if (second.is_up_to_date !== false || hasActivity(second)) return second
  // Nothing computed yet: failing keeps the user's previous card, and the next run asks again.
  throw new PluginError(
    `WakaTime API request failed: HTTP 202, the ${range.replace(/_/g, " ")} stats are still being computed`,
    "wakatime"
  )
}

interface Colors {
  languages: Map<string, string>
  editors: Map<string, string>
}

async function fetchCatalog(path: string): Promise<Map<string, string>> {
  try {
    const body = await fetchJson<{ data?: CatalogEntry[] }>(`${BASE_URL}${path}`, {
      timeout: CATALOG_TIMEOUT_MS,
      retries: 0,
    })
    const colors = new Map<string, string>()
    for (const entry of body.data ?? []) {
      if (entry.name && entry.color) colors.set(entry.name.toLowerCase(), entry.color)
    }
    return colors
  } catch {
    return new Map()
  }
}

function describeFailure(error: unknown): Error {
  if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
    return new PluginError(
      `WakaTime API request failed: HTTP ${error.statusCode}, the token was refused. Use the personal token from wakatime.com/oauth: the secret API key can no longer read stats`,
      "wakatime"
    )
  }
  if (error instanceof ApiError && error.statusCode === 404) {
    return new PluginError("WakaTime API request failed: HTTP 404, no WakaTime account for this token", "wakatime")
  }
  if (error instanceof PluginError && error.pluginName === "wakatime") return error
  return upstreamFailure("WakaTime", error)
}

export async function fetchWakaTimeData(
  config: WakaTimeConfigLike,
  dev = false,
  token?: string,
  previewMode = false,
  { staleRetryDelayMs = STALE_RETRY_DELAY_MS }: FetchWakaTimeOptions = {}
): Promise<WakaTimeData> {
  if (dev || previewMode) return getMockWakaTimeData()

  const secret = token?.trim()
  if (!secret) {
    throw new PluginError("WakaTime personal token is required. Copy it from wakatime.com/oauth.", "wakatime")
  }

  const sections = config.sections ?? []
  const ranges = rangesFor(config)
  if (ranges.length === 0) return { stats: {} }

  const [colors, ...results] = await Promise.all([
    Promise.all([
      sections.includes("languages") ? fetchCatalog("/program_languages") : Promise.resolve(new Map<string, string>()),
      sections.includes("editors") ? fetchCatalog("/editors") : Promise.resolve(new Map<string, string>()),
    ]).then(([languages, editors]) => ({ languages, editors })),
    ...ranges.map((range) =>
      fetchRange(range, secret, staleRetryDelayMs).then(
        (api) => ({ range, api }),
        (error: unknown) => ({ range, error })
      )
    ),
  ])

  const stats: WakaTimeData["stats"] = {}
  for (const result of results) {
    if ("error" in result) throw describeFailure(result.error)
    stats[result.range] = toStats(result.range, result.api, colors)
  }
  return { stats }
}
