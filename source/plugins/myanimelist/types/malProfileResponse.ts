import { MalLastUpdatesResponse } from "./malLastUpdatesResponse"
import { MalFavoritesResponse } from "./malFavoritesResponse"
import { MalStatisticsResponse } from "./malStatisticsResponse"

interface MalProfileResponse {
  data: {
    mal_id: number
    username: string
    url: string
    image: string
    last_online: string
    gender: string
    birthday: string
    location: string
    joined: string
    statistics: MalStatisticsResponse
    favorites: MalFavoritesResponse
    updates: MalLastUpdatesResponse
  }
  about: string
  external: Array<{
    name: string | null
    url: string | null
  }> | null
}

export type { MalProfileResponse }
