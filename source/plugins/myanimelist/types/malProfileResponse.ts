import { MalLastUpdatesResponse } from "./malLastUpdatesResponse"
import { MalFavoritesResponse } from "./malFavoritesResponse"
import { MalStatisticsResponse } from "./malStatisticsResponse"
import { MalImage } from "./malTypes"

export interface MalProfileResponse {
  data: {
    mal_id: number
    username: string
    url: string
    images: MalImage
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
  external:
    | {
        name: string | null
        url: string | null
      }[]
    | null
}
