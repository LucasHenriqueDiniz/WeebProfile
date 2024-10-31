import { MalStatisticsResponse } from "source/plugins/myanimelist/types/malStatisticsResponse"

const exampleStatisticsResponse: MalStatisticsResponse = {
  anime: {
    days_watched: 259.6,
    mean_score: 2.44,
    watching: 28,
    completed: 254,
    on_hold: 28,
    dropped: 24,
    plan_to_watch: 26,
    total_entries: 260,
    rewatched: 26,
    episodes_watched: 2725,
  },
  manga: {
    days_read: 24.4,
    mean_score: 2.65,
    reading: 24,
    completed: 21,
    on_hold: 27,
    dropped: 28,
    plan_to_read: 21,
    total_entries: 241,
    reread: 2,
    chapters_read: 2477,
    volumes_read: 219,
  },
}

export default exampleStatisticsResponse
