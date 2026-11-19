import type { RepoTraffic, TrafficDay, TrafficPath, TrafficReferrer, TrafficSeries } from "../types"

/**
 * Repository traffic from GitHub's REST traffic endpoints: views and clones per day, the top
 * referrers and the top paths, over GitHub's 14-day window.
 *
 * GitHub shows a repository's traffic only to accounts that can push to it. A token that
 * can read the repository but not push answers 403 "Must have push access to repository"
 * (measured 19/11/2026 on facebook/react with a classic `repo` token). A fine-grained token
 * needs the "Administration" repository permission (read), per GitHub's
 * "Permissions required for fine-grained personal access tokens".
 *
 * Idea from the `traffic` plugin of lowlighter/metrics (MIT), which sums the views of every
 * repository; this is a separate implementation for one repository.
 */

const TRAFFIC_TIMEOUT_MS = 10_000
/** GitHub's window: today's partial day plus the 13 before, or the 14 before today. */
export const TRAFFIC_DAYS = 14
const DAY_MS = 86_400_000

export interface TrafficOptions {
  clones: boolean
  referrers: boolean
  paths: boolean
}

interface SeriesResponse {
  count?: number
  uniques?: number
  views?: Array<{ timestamp: string; count: number; uniques: number }>
  clones?: Array<{ timestamp: string; count: number; uniques: number }>
}

export class TrafficPermissionError extends Error {}

/** The message a card shows when the token cannot read the traffic: what to change, where. */
export function trafficPermissionMessage(nameWithOwner: string): string {
  // The error box shows about 90 characters in half: what is missing goes first.
  return (
    `Traffic needs push access to ${nameWithOwner}: a 'repo' token, ` +
    "or fine-grained with Administration (read). GitHub shows traffic only to accounts that can push."
  )
}

async function getJson(nameWithOwner: string, path: string, pat: string): Promise<unknown> {
  const [owner = "", repo = ""] = nameWithOwner.split("/")
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/traffic/${path}`
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TRAFFIC_TIMEOUT_MS),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${pat}`,
      "User-Agent": "WeebProfile",
    },
  })
  if (res.ok) return res.json()

  const body = (await res.json().catch(() => null)) as { message?: string } | null
  const message = body?.message ?? ""
  // A classic token without push access: "Must have push access to repository". A
  // fine-grained token without the Administration permission: "Resource not accessible
  // by personal access token".
  if (res.status === 403 && /push access|not accessible/i.test(message)) {
    throw new TrafficPermissionError(trafficPermissionMessage(nameWithOwner))
  }
  throw new Error(`GitHub traffic (${path}): HTTP ${res.status}${message ? ` ${message}` : ""}`)
}

/** Midnight UTC of the day `time` falls in. */
const utcDay = (time: number) => Math.floor(time / DAY_MS) * DAY_MS

/**
 * The 14 days of the window, oldest first, with 0 for a day GitHub left out. The window ends
 * on the last day GitHub answered, or yesterday when that is later: GitHub's own answer ends
 * on yesterday (14 entries on 19/11/2026, 05/11 to 18/11) and may skip days without traffic.
 */
export function buildTrafficSeries(body: SeriesResponse, key: "views" | "clones", now: number): TrafficSeries {
  const entries = body[key] ?? []
  const byDay = new Map<number, { count: number; uniques: number }>()
  for (const entry of entries) {
    const time = Date.parse(entry.timestamp)
    if (Number.isNaN(time)) continue
    byDay.set(utcDay(time), { count: entry.count ?? 0, uniques: entry.uniques ?? 0 })
  }
  const last = Math.max(utcDay(now) - DAY_MS, ...byDay.keys())
  const days: TrafficDay[] = Array.from({ length: TRAFFIC_DAYS }, (_, i) => {
    const day = last - (TRAFFIC_DAYS - 1 - i) * DAY_MS
    const found = byDay.get(day)
    return { date: new Date(day).toISOString(), count: found?.count ?? 0, uniques: found?.uniques ?? 0 }
  })
  // The totals are GitHub's: unique visitors over 14 days are not the sum of each day's.
  return { count: body.count ?? 0, uniques: body.uniques ?? 0, days }
}

/**
 * Fetches the views, and the clones, referrers and paths the section shows, in parallel.
 * Any failure rejects: a card with half its traffic would show wrong totals.
 *
 * @param nameWithOwner - canonical "owner/repo" from GraphQL
 */
export async function fetchTraffic(
  nameWithOwner: string,
  pat: string,
  options: TrafficOptions,
  now = Date.now()
): Promise<RepoTraffic> {
  const [views, clones, referrers, paths] = await Promise.all([
    getJson(nameWithOwner, "views", pat),
    options.clones ? getJson(nameWithOwner, "clones", pat) : null,
    options.referrers ? getJson(nameWithOwner, "popular/referrers", pat) : null,
    options.paths ? getJson(nameWithOwner, "popular/paths", pat) : null,
  ])
  return {
    views: buildTrafficSeries(views as SeriesResponse, "views", now),
    clones: clones ? buildTrafficSeries(clones as SeriesResponse, "clones", now) : null,
    referrers: Array.isArray(referrers)
      ? (referrers as TrafficReferrer[]).map(({ referrer, count, uniques }) => ({ referrer, count, uniques }))
      : null,
    paths: Array.isArray(paths)
      ? (paths as TrafficPath[]).map(({ path, title, count, uniques }) => ({ path, title, count, uniques }))
      : null,
  }
}
