import { jikanEdgeGet } from "./api-client"
import type { AnimeStatistics, MangaStatistics } from "../types"

export type EdgeFavorite = { mal_id: number; title?: string; name?: string; url?: string; type?: string; imageUrl?: string | null; images?: { jpg?: { small_image_url?: string; image_url?: string } } }
export type EdgeFavorites = { anime: EdgeFavorite[]; manga: EdgeFavorite[]; characters: EdgeFavorite[]; people: EdgeFavorite[] }
type EdgeEnvelope<T> = { data: T; meta: { stale?: boolean; refreshFailed?: boolean; pagination?: { page: number; limit: number; total: number; hasNextPage: boolean } } }
export type EdgeListItem = { malId: number; title: string; imageUrl: string | null; status: string | null; score: number | null; progress: number | null; total: number | null; updatedAt: string | null }

export interface MalProfileResponse {
  favorites: EdgeFavorites
  statistics: { anime: AnimeStatistics; manga: MangaStatistics }
}

function mapStatistics(value: Record<string, number | null | undefined>): AnimeStatistics & MangaStatistics {
  return {
    days_watched: value.daysWatched ?? null, days_read: value.daysRead ?? null, mean_score: value.meanScore ?? null,
    watching: value.watching ?? null, reading: value.reading ?? null, completed: value.completed ?? null, on_hold: value.onHold ?? null,
    dropped: value.dropped ?? null, plan_to_watch: value.planToWatch ?? null, plan_to_read: value.planToRead ?? null,
    total_entries: value.totalEntries ?? null, rewatched: value.rewatched ?? null, reread: value.reread ?? null,
    episodes_watched: value.episodesWatched ?? null, chapters_read: value.chaptersRead ?? null, volumes_read: value.volumesRead ?? null,
  }
}

export async function fetchFullProfile(username: string): Promise<MalProfileResponse> {
  const user = encodeURIComponent(username)
  const [favorites, statistics] = await Promise.all([
    jikanEdgeGet<EdgeEnvelope<EdgeFavorites>>(`/v1/users/${user}/favorites`),
    jikanEdgeGet<EdgeEnvelope<{ anime: Record<string, number | null>; manga: Record<string, number | null> }>>(`/v1/users/${user}/statistics`),
  ])
  if (favorites.meta.refreshFailed || statistics.meta.refreshFailed) throw new Error("Jikan Edge returned refreshFailed data")
  return { favorites: favorites.data, statistics: { anime: mapStatistics(statistics.data.anime), manga: mapStatistics(statistics.data.manga) } }
}

/** Reads a single, caller-selected page. The plugin never fans this out into catalog requests. */
export async function fetchMediaList(username: string, media: "anime" | "manga", page = 1, limit = 100): Promise<EdgeEnvelope<EdgeListItem[]>> {
  const safePage = Math.max(1, Math.floor(page))
  const safeLimit = Math.min(300, Math.max(1, Math.floor(limit)))
  return jikanEdgeGet<EdgeEnvelope<EdgeListItem[]>>(`/v1/users/${encodeURIComponent(username)}/${media}list?page=${safePage}&limit=${safeLimit}`)
}
