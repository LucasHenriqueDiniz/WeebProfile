import {
  AnimeStatistics,
  MalStatisticsResponse,
  MangaStatistics,
} from "plugins/myanimelist/types/malStatisticsResponse"

async function filterStatisticsGist(data: MalStatisticsResponse) {
  const animeData = data.anime as AnimeStatistics
  const mangaData = data.manga as MangaStatistics

  return {
    anime: {
      days_watched: animeData.days_watched,
      mean_score: animeData.mean_score,
      watching: animeData.watching,
      completed: animeData.completed,
      on_hold: animeData.on_hold,
      dropped: animeData.dropped,
      plan_to_watch: animeData.plan_to_watch,
      total_entries: animeData.total_entries,
      rewatched: animeData.rewatched,
      episodes_watched: animeData.episodes_watched,
    },
    manga: {
      days_read: mangaData.days_read,
      mean_score: mangaData.mean_score,
      reading: mangaData.reading,
      completed: mangaData.completed,
      on_hold: mangaData.on_hold,
      dropped: mangaData.dropped,
      plan_to_read: mangaData.plan_to_read,
      total_entries: mangaData.total_entries,
      reread: mangaData.reread,
      chapters_read: mangaData.chapters_read,
      volumes_read: mangaData.volumes_read,
    },
  }
}

export default filterStatisticsGist
