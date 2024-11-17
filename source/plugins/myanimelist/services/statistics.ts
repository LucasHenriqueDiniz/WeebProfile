import { MalStatistics } from "../types/malStatistics"
import { StatisticsResponse } from "../types/ProfileResponse"

export function transformStatistics(response: StatisticsResponse): MalStatistics {
  return {
    anime: {
      days_watched: response.anime.days_watched,
      mean_score: response.anime.mean_score,
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
      mean_score: response.manga.mean_score,
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
