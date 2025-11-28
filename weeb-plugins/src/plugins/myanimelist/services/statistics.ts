/**
 * Serviço para transformar estatísticas do MyAnimeList
 */

import type { AnimeStatistics, MangaStatistics } from '../types'

export interface JikanStatisticsResponse {
  anime: {
    days_watched: number
    mean_score: number | null
    watching: number
    completed: number
    on_hold: number
    dropped: number
    plan_to_watch: number
    total_entries: number
    rewatched: number
    episodes_watched: number
  }
  manga: {
    days_read: number
    mean_score: number | null
    reading: number
    completed: number
    on_hold: number
    dropped: number
    plan_to_read: number
    total_entries: number
    reread: number
    chapters_read: number
    volumes_read: number
  }
}

/**
 * Transforma a resposta da API em formato interno
 */
export function transformStatistics(response: JikanStatisticsResponse): {
  anime: AnimeStatistics
  manga: MangaStatistics
} {
  return {
    anime: {
      days_watched: response.anime.days_watched,
      mean_score: response.anime.mean_score ?? 0,
      watching: response.anime.watching,
      completed: response.anime.completed,
      on_hold: response.anime.on_hold,
      dropped: response.anime.dropped,
      plan_to_watch: response.anime.plan_to_watch,
      total_entries: response.anime.total_entries,
      rewatched: response.anime.rewatched,
      episodes_watched: response.anime.episodes_watched,
    },
    manga: {
      days_read: response.manga.days_read,
      mean_score: response.manga.mean_score ?? 0,
      reading: response.manga.reading,
      completed: response.manga.completed,
      on_hold: response.manga.on_hold,
      dropped: response.manga.dropped,
      plan_to_read: response.manga.plan_to_read,
      total_entries: response.manga.total_entries,
      reread: response.manga.reread,
      chapters_read: response.manga.chapters_read,
      volumes_read: response.manga.volumes_read,
    },
  }
}



