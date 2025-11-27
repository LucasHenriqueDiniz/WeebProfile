/**
 * Tipos do Plugin LastFM
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../../weeb-plugins/plugins/shared/types/base'

export interface LastFmTrack {
  track: string
  artist: string
  date: string
  image?: string
}

export interface LastFmArtist {
  artist: string
  image?: string
  totalPlays: string
}

export interface LastFmAlbum {
  album: string
  artist: string
  plays: string
  image?: string
}

export interface TopTrack {
  track: string
  artist: string
  plays: string
  image?: string
}

export interface LastFmFeaturedTrack {
  track: string
  artist: string
  image?: string
}

/**
 * Configurações não-essenciais do LastFM (preferências do usuário)
 * Essas configs são armazenadas em pluginsConfig no banco
 */
export interface LastFmNonEssentialConfig extends NonEssentialPluginConfig {
  recent_tracks_max?: number
  top_artists_max?: number
  top_albums_max?: number
  top_tracks_max?: number
  recent_tracks_title?: string
  recent_tracks_hide_title?: boolean
  top_artists_title?: string
  top_artists_hide_title?: boolean
  top_artists_style?: 'grid' | 'list' | 'default' // Estilo de exibição: grid, lista ou default (grid)
  top_artists_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' // Período de tempo
  top_albums_title?: string
  top_albums_hide_title?: boolean
  top_albums_style?: 'grid' | 'list' | 'default' // Estilo de exibição: grid, lista ou default (grid)
  top_albums_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' // Período de tempo
  top_tracks_title?: string
  top_tracks_hide_title?: boolean
  top_tracks_style?: 'grid' | 'list' | 'default' // Estilo de exibição: grid, lista ou default (grid)
  top_tracks_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' // Período de tempo
  statistics_title?: string
  statistics_hide_title?: boolean
  hide_intervals?: boolean
}

/**
 * Configuração completa do plugin LastFM
 * 
 * NOTA: username foi removido - agora é obtido via API usando a API key
 * A API key fica em EssentialPluginConfig (não aqui)
 */
export interface LastFmConfig extends BasePluginConfig {
  nonEssential?: LastFmNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface LastFmData {
  recentTracks: LastFmTrack[]
  topArtists: LastFmArtist[]
  topAlbums: LastFmAlbum[]
  topTracks: TopTrack[]
  statistics: {
    totalScrobbles: string
    totalArtists: string
    lovedTracks: string
  }
  featuredTrack?: LastFmFeaturedTrack | null
  topArtistsInterval?: string
  topAlbumsInterval?: string
  topTracksInterval?: string
}

