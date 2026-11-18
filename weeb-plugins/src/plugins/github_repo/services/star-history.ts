import type { StarHistoryPoint } from "../types"

/**
 * Star history from GitHub's `GET /repos/{owner}/{repo}/stargazers/history`.
 *
 * Since July 2026 the stargazers listing (`/stargazers`, and `stargazers` in GraphQL)
 * only answers a repository's admins and collaborators: anyone else gets a 404 from
 * REST and `totalCount: 0` from GraphQL. The card read `starred_at` from that listing,
 * so every repository the token's account did not own came out with no history.
 * The history endpoint answers any token, for any public repository: stars per day,
 * grouped in weeks, newest week first, 30 weeks a page, at most 100 pages.
 */

const STAR_HISTORY_TIMEOUT_MS = 10_000
const WEEKS_PER_PAGE = 30
// The endpoint answers 422 past page 100.
const MAX_PAGES = 100
const SAMPLE_POINTS = 10
const DAY_MS = 86_400_000
const WEEK_MS = 7 * DAY_MS

export interface StarHistoryWeek {
  /** Unix seconds of the week's first day (Sunday). */
  week: number
  total: number
  /** Stars per day, Sunday first. */
  days: number[]
}

/**
 * How many pages reach back to the repository's creation week. The creation week and
 * the current week are both partial, hence the two extra weeks.
 */
export function starHistoryPageCount(createdAt: string, now: number): number {
  const created = Date.parse(createdAt)
  if (Number.isNaN(created)) return 1
  const weeks = Math.floor(Math.max(0, now - created) / WEEK_MS) + 2
  return Math.min(MAX_PAGES, Math.max(1, Math.ceil(weeks / WEEKS_PER_PAGE)))
}

function sampleEvenly(points: StarHistoryPoint[], sampleCount: number): StarHistoryPoint[] {
  if (points.length <= sampleCount) return points
  const step = (points.length - 1) / (sampleCount - 1)
  return Array.from({ length: sampleCount }, (_, i) => points[Math.round(i * step)] as StarHistoryPoint)
}

/**
 * Cumulative star count per day, from the day of the first star to today, sampled at
 * evenly spaced days. The chart spaces points evenly, so even spacing in time draws
 * the real growth curve.
 */
export function buildStarHistory(weeks: StarHistoryWeek[], totalStars: number, now: number): StarHistoryPoint[] {
  const ordered = [...weeks].sort((a, b) => a.week - b.week)
  const daily: StarHistoryPoint[] = []
  let count = 0
  for (const { week, days } of ordered) {
    days.forEach((stars, i) => {
      const day = week * 1000 + i * DAY_MS
      if (day > now) return
      count += stars
      if (count > 0) daily.push({ date: new Date(day).toISOString(), count })
    })
  }
  if (daily.length === 0) return []

  const points = sampleEvenly(daily, SAMPLE_POINTS)
  // The headline number on the card is stargazerCount; end the curve on it even when
  // someone starred or unstarred between the two requests.
  const last = points[points.length - 1] as StarHistoryPoint
  points[points.length - 1] = { date: last.date, count: totalStars }
  return points
}

async function fetchStarHistoryPage(nameWithOwner: string, pat: string, page: number): Promise<StarHistoryWeek[]> {
  const [owner = "", repo = ""] = nameWithOwner.split("/")
  const url =
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
    `/stargazers/history?per_page=${WEEKS_PER_PAGE}&page=${page}`
  const res = await fetch(url, {
    signal: AbortSignal.timeout(STAR_HISTORY_TIMEOUT_MS),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${pat}`,
      "User-Agent": "WeebProfile",
    },
  })
  if (!res.ok) throw new Error(`star history page ${page}: HTTP ${res.status}`)
  const body: unknown = await res.json()
  if (!Array.isArray(body)) throw new Error(`star history page ${page}: not an array`)
  return body as StarHistoryWeek[]
}

/**
 * Fetches every page in parallel. A missing page would shift every count before it,
 * so any failed page rejects the whole history.
 *
 * @param nameWithOwner - canonical "owner/repo" from GraphQL, so a transferred
 *   repository needs no redirect
 */
export async function fetchStarHistory(
  nameWithOwner: string,
  createdAt: string,
  pat: string,
  totalStars: number,
  now = Date.now()
): Promise<StarHistoryPoint[]> {
  if (totalStars <= 0) return []
  const pageCount = starHistoryPageCount(createdAt, now)
  const pages = await Promise.all(
    Array.from({ length: pageCount }, (_, i) => fetchStarHistoryPage(nameWithOwner, pat, i + 1))
  )
  return buildStarHistory(pages.flat(), totalStars, now)
}
