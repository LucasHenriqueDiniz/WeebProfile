import { JikanEdgeError, jikanEdgeGet } from "./api-client"

/**
 * The fields of `/v1/anime/:id` and `/v1/manga/:id` (jikan-edge) that a favorite
 * draws. Anything else in the payload is ignored.
 */
export interface EdgeMediaDetail {
  malId?: number
  synopsis?: string | null
  score?: number | null
  popularity?: number | null
  rank?: number | null
  status?: string | null
  genres?: { name?: string | null }[] | null
  /** anime */
  episodes?: number | null
  /** anime: the year of its season. Manga pages have no such field. */
  year?: number | null
  /** manga */
  chapters?: number | null
  /** manga */
  volumes?: number | null
}

export type DetailRequest = { media: "anime" | "manga"; malId: number }

/**
 * Time the whole detail step may take, 429 retries included. The profile's list of
 * favorites carries only id, title, cover, type and start year; the rest comes from one
 * request per title shown. Past this, the titles still waiting are drawn from the
 * profile alone: a slow page costs its own details, never the card.
 */
export const DETAILS_DEADLINE_MS = 8_000

/**
 * Requests in flight at once. jikan-edge allows 30 requests per 10 s per client IP, and
 * the generator's requests over the service binding may all count as one client. Firing
 * a 20 + 20 card at once would go over by itself; a small pool lets the first 429 stop
 * the rest before they are sent.
 */
export const DETAILS_CONCURRENCY = 5

export function detailKey(media: "anime" | "manga", malId: number): string {
  return `${media}:${malId}`
}

function withDeadline<T>(work: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms)
  })
  return Promise.race([work, deadline]).finally(() => clearTimeout(timer))
}

/**
 * The page of each favorite shown. A title whose page fails, times out or was never
 * asked for (deadline passed, or the API rate-limited an earlier one) has no entry,
 * and the caller draws it from the profile alone.
 */
export async function fetchFavoriteDetails(requests: DetailRequest[]): Promise<Map<string, EdgeMediaDetail>> {
  const queue = requests.filter(({ malId }) => Number.isInteger(malId) && malId > 0)
  const details = new Map<string, EdgeMediaDetail>()
  const deadline = Date.now() + DETAILS_DEADLINE_MS
  let rateLimited = false

  async function worker(): Promise<void> {
    while (queue.length > 0 && !rateLimited) {
      const remaining = deadline - Date.now()
      const item = queue.shift()
      if (!item || remaining <= 0) {
        if (item) queue.unshift(item)
        return
      }
      const { media, malId } = item
      try {
        const response = await withDeadline(
          jikanEdgeGet<{ data?: EdgeMediaDetail | null }>(`/v1/${media}/${malId}`, { timeoutMs: remaining }),
          remaining
        )
        if (response?.data) details.set(detailKey(media, malId), response.data)
        else if (response === null) console.warn(`[MyAnimeList] favorite details timed out: ${media} ${malId}`)
      } catch (error) {
        if (error instanceof JikanEdgeError && error.status === 429) rateLimited = true
        console.warn(
          `[MyAnimeList] favorite details unavailable: ${media} ${malId}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(DETAILS_CONCURRENCY, queue.length) }, () => worker()))
  if (queue.length > 0)
    console.warn(
      `[MyAnimeList] favorite details skipped for ${queue.length} titles (${rateLimited ? "rate limited" : "deadline"})`
    )
  return details
}
