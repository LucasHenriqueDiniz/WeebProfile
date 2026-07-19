/**
 * Tipos do Plugin MyAnimeList
 */

export interface AnimeStatistics {
  days_watched: number | null
  mean_score: number | null
  watching: number | null
  completed: number | null
  on_hold: number | null
  dropped: number | null
  plan_to_watch: number | null
  total_entries: number | null
  rewatched: number | null
  episodes_watched: number | null
}

export interface MangaStatistics {
  days_read: number | null
  mean_score: number | null
  reading: number | null
  completed: number | null
  on_hold: number | null
  dropped: number | null
  plan_to_read: number | null
  total_entries: number | null
  reread: number | null
  chapters_read: number | null
  volumes_read: number | null
}

export interface LastUpdatesAnime {
  title: string
  image: string | null
  score: number
  status: string
  episodes_seen: number | null
  episodes_total: number | null
  date: string
}

export interface LastUpdatesManga {
  title: string
  image: string | null
  score: number
  status: string
  chapters_read: number | null
  chapters_total: number | null
  date: string
}

export interface MalLastUpdates {
  anime: LastUpdatesAnime[]
  manga: LastUpdatesManga[]
}

export interface MyAnimeListData {
  favorites: {
    anime: BasicAnimeFavorite[]
    manga: BasicMangaFavorite[]
    characters: BasicCharacterFavorite[]
    people: BasicPeopleFavorite[]
  }
  favorites_full: {
    anime: FullAnimeFavorite[]
    manga: FullMangaFavorite[]
    characters: BasicCharacterFavorite[]
    people: BasicPeopleFavorite[]
  }
  last_updated: MalLastUpdates
  lastActivityStatus?: "complete" | "partial" | "empty" | "unavailable"
  statistics: {
    anime: AnimeStatistics
    manga: MangaStatistics
  }
}

// Favorites types
export interface BasicAnimeFavorite {
  mal_id: number
  title: string
  image: string | null
  start_year: number
  type: string
}

export interface FullAnimeFavorite extends BasicAnimeFavorite {
  synopsis: string
  score: number
  popularity: number
  episodes: number | null
  status: string
  rank: number
  year: number | null
  genres?: {
    name: string
  }[]
}

export interface BasicMangaFavorite {
  mal_id: number
  title: string
  image: string | null
  start_year: number
  type: string
}

export interface FullMangaFavorite extends BasicMangaFavorite {
  synopsis: string
  score: number
  popularity: number
  chapters: number | null
  rank: number
  volumes: number | null
  status: string
  year: number | null
  genres?: {
    name: string
  }[]
}

export interface BasicCharacterFavorite {
  mal_id: number
  name: string
  image: string | null
}

export interface BasicPeopleFavorite {
  mal_id: number
  name: string
  image: string | null
}

export type AnyMalFavorite =
  | BasicAnimeFavorite[]
  | BasicMangaFavorite[]
  | BasicCharacterFavorite[]
  | BasicPeopleFavorite[]

export type AnyMalFavoriteUnique =
  | BasicAnimeFavorite
  | BasicMangaFavorite
  | BasicCharacterFavorite
  | BasicPeopleFavorite

export interface MyAnimeListConfig {
  enabled: boolean
  sections: string[]
  username: string
  favorites_max?: number
  statistics_hide_title?: boolean
  statistics_media?: "anime" | "manga" | "both"
  statistics_anime_title?: string
  statistics_manga_title?: string
  last_activity_title?: string
  last_activity_max?: number
  last_activity_hide_anime?: boolean
  last_activity_hide_manga?: boolean
  statistics_simple_title?: string
  statistics_simple_hide_title?: boolean
  anime_bar_title?: string
  manga_bar_title?: string
  anime_bar_hide_title?: boolean
  manga_bar_hide_title?: boolean
  favorites_hide_overlay?: boolean
  anime_favorites_title?: string
  anime_favorites_hide_title?: boolean
  anime_favorites_list_style?: "simple" | "compact" | "detailed" | "minimal"
  anime_favorites_max?: number
  manga_favorites_title?: string
  manga_favorites_hide_title?: boolean
  manga_favorites_list_style?: "simple" | "compact" | "detailed" | "minimal"
  manga_favorites_max?: number
  people_favorites_title?: string
  people_favorites_hide_title?: boolean
  people_favorites_list_style?: "simple" | "compact"
  people_favorites_max?: number
  character_favorites_title?: string
  character_favorites_hide_title?: boolean
  character_favorites_list_style?: "simple" | "compact"
  character_favorites_max?: number
}
