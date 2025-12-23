/**
 * Tipos do Plugin Spotify
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base.js'

export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album?: string
  image?: string
  duration?: number
  externalUrl?: string
}

export interface SpotifyArtist {
  id: string
  name: string
  image?: string
  externalUrl?: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description?: string
  image?: string
  tracksCount: number
  externalUrl?: string
}

export interface SpotifyProfile {
  id: string
  displayName: string
  image?: string
  followers?: number
  externalUrl?: string
}

export interface CurrentlyPlaying {
  track: string
  artist: string
  album?: string
  image?: string
  isPlaying: boolean
}

/**
 * Configurações não-essenciais do Spotify (preferências do usuário)
 * Essas configs são armazenadas em pluginsConfig no banco
 */
export interface SpotifyNonEssentialConfig extends NonEssentialPluginConfig {
  recent_tracks_max?: number
  top_artists_max?: number
  top_tracks_max?: number
  playlists_max?: number
  recent_tracks_title?: string
  recent_tracks_hide_title?: boolean
  top_artists_title?: string
  top_artists_hide_title?: boolean
  top_artists_style?: 'grid' | 'list' | 'default'
  top_artists_period?: 'short_term' | 'medium_term' | 'long_term'
  top_tracks_title?: string
  top_tracks_hide_title?: boolean
  top_tracks_style?: 'grid' | 'list' | 'default'
  top_tracks_period?: 'short_term' | 'medium_term' | 'long_term'
  currently_playing_title?: string
  currently_playing_hide_title?: boolean
  playlists_title?: string
  playlists_hide_title?: boolean
  profile_title?: string
  profile_hide_title?: boolean
}

/**
 * Configuração completa do plugin Spotify
 */
export interface SpotifyConfig extends BasePluginConfig {
  nonEssential?: SpotifyNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface SpotifyData {
  recentTracks: SpotifyTrack[]
  topArtists: SpotifyArtist[]
  topTracks: SpotifyTrack[]
  currentlyPlaying?: CurrentlyPlaying | null
  playlists: SpotifyPlaylist[]
  profile?: SpotifyProfile | null
  topArtistsPeriod?: string
  topTracksPeriod?: string
}
