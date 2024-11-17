//OBS : The profile response have more data than what we need, these types using only the data we need, if you need more data, you can add it here.

interface baseStatisticsResponse {
  mean_score: number
  completed: number
  on_hold: number
  dropped: number
  total_entries: number
}

export interface StatisticsResponse {
  anime: baseStatisticsResponse & {
    days_watched: number
    watching: number
    rewatched: number
    episodes_watched: number
    plan_to_watch: number
  }
  manga: baseStatisticsResponse & {
    days_read: number
    reading: number
    reread: number
    chapters_read: number
    volumes_read: number
    plan_to_read: number
  }
}

interface ImagesResponse {
  jpg: {
    image_url: string
    small_image_url?: string
    large_image_url?: string
  }
  webp?: {
    image_url?: string
    small_image_url?: string
    large_image_url?: string
  }
}

export interface BasicMediaFavoriteResponse {
  mal_id: number
  url: string
  title: string
  type: string
  start_year: number
  images: ImagesResponse
}

export interface BasicPersonFavoriteResponse {
  mal_id: number
  url: string
  name: string
  images: ImagesResponse
}

export interface BasicFavoritesResponse {
  anime: BasicMediaFavoriteResponse[]
  manga: BasicMediaFavoriteResponse[]
  characters: BasicPersonFavoriteResponse[]
  people: BasicPersonFavoriteResponse[]
}

interface UpdatesResponse {
  anime: Array<{
    entry: {
      mal_id: number
      images: ImagesResponse
      title: string
    }
    score: number
    status: string
    episodes_seen: number | null
    episodes_total: number | null
    date: string
  }>
  manga: Array<{
    entry: {
      mal_id: number
      images: ImagesResponse
      title: string
    }
    score: number
    status: string
    chapters_read: number | null
    chapters_total: number | null
    date: string
  }>
}

interface MalProfileResponse {
  mal_id: number
  username: string
  url: string
  images: ImagesResponse
  last_online: string
  gender: string
  birthday: string
  location: string
  joined: string
  statistics: StatisticsResponse
  favorites: BasicFavoritesResponse
  updates: UpdatesResponse
}

export type { MalProfileResponse }
