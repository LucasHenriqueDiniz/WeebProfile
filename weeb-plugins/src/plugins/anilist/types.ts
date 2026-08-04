/**
 * Tipos do plugin AniList
 *
 * A API é GraphQL pública (https://graphql.anilist.co) e não exige autenticação
 * para dados de perfis públicos — só o username. Por isso o plugin não tem
 * essentialConfigKeys.
 */

export interface AniListConfig {
  enabled: boolean
  sections: string[]
  username: string
  style?: "default" | "terminal"
  size?: "half" | "full"
  nonEssential?: Record<string, unknown>

  statistics_title?: string
  statistics_hide_title?: string | boolean
  statistics_media?: "both" | "anime" | "manga"

  favorites_anime_title?: string
  favorites_anime_hide_title?: string | boolean
  favorites_anime_max?: number

  currently_watching_title?: string
  currently_watching_hide_title?: string | boolean
  currently_watching_max?: number
}

export interface AniListStatistics {
  animeCount: number
  episodesWatched: number
  minutesWatched: number
  animeMeanScore: number
  mangaCount: number
  chaptersRead: number
  volumesRead: number
  mangaMeanScore: number
}

export interface AniListMedia {
  id: number
  title: string
  /** Data URI já embutido, ou null quando a conversão falha. Nunca a URL original. */
  cover: string | null
}

export interface AniListWatchingEntry extends AniListMedia {
  progress: number
  /** null para séries em exibição, cujo total ainda não é conhecido. */
  totalEpisodes: number | null
}

export interface AniListData {
  username: string
  statistics: AniListStatistics
  favoritesAnime: AniListMedia[]
  currentlyWatching: AniListWatchingEntry[]
  /** Preenchido quando a busca falha; RenderAniList troca o card por PluginError. */
  _error?: string
}
