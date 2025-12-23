/**
 * Spotify API service
 * 
 * Handles authentication and API calls to Spotify Web API
 */

import { fetchJson } from '../../shared/utils/api.js'
import { ApiError } from '../../shared/utils/errors.js'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

/**
 * Get access token from refresh token
 * 
 * @param refreshToken - Refresh token from essentialConfig
 * @param clientId - Spotify Client ID (from env or config)
 * @param clientSecret - Spotify Client Secret (from env or config)
 * @returns Access token
 */
export async function getAccessTokenFromRefreshToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      error.error_description || error.error || 'Failed to refresh access token',
      response.status,
      'Spotify'
    )
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Convert period label to readable format
 */
function getPeriodLabel(period: 'short_term' | 'medium_term' | 'long_term'): string {
  const labels: Record<string, string> = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'All time',
  }
  return labels[period] || 'All time'
}

/**
 * Fetch user profile
 */
export async function fetchProfile(accessToken: string): Promise<{
  id: string
  displayName: string
  image?: string
  followers?: number
  externalUrl?: string
}> {
  const response = await fetchJson<{
    id: string
    display_name: string
    images?: Array<{ url: string }>
    followers?: { total: number }
    external_urls?: { spotify: string }
  }>(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  return {
    id: response.id,
    displayName: response.display_name || 'Unknown',
    image: response.images?.[0]?.url,
    followers: response.followers?.total,
    externalUrl: response.external_urls?.spotify,
  }
}

/**
 * Fetch recently played tracks
 */
export async function fetchRecentlyPlayed(
  accessToken: string,
  limit = 50
): Promise<Array<{
  id: string
  name: string
  artist: string
  album?: string
  image?: string
  duration?: number
  externalUrl?: string
}>> {
  const response = await fetchJson<{
    items: Array<{
      track: {
        id: string
        name: string
        artists: Array<{ name: string }>
        album?: {
          name: string
          images?: Array<{ url: string }>
        }
        duration_ms?: number
        external_urls?: { spotify: string }
      }
      played_at: string
    }>
  }>(`${SPOTIFY_API_BASE}/me/player/recently-played?limit=${Math.min(limit, 50)}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  return response.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists[0]?.name || 'Unknown',
    album: item.track.album?.name,
    image: item.track.album?.images?.[0]?.url,
    duration: item.track.duration_ms ? Math.floor(item.track.duration_ms / 1000) : undefined,
    externalUrl: item.track.external_urls?.spotify,
  }))
}

/**
 * Fetch top artists
 */
export async function fetchTopArtists(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 50
): Promise<Array<{
  id: string
  name: string
  image?: string
  externalUrl?: string
}>> {
  const response = await fetchJson<{
    items: Array<{
      id: string
      name: string
      images?: Array<{ url: string }>
      external_urls?: { spotify: string }
    }>
  }>(`${SPOTIFY_API_BASE}/me/top/artists?time_range=${timeRange}&limit=${Math.min(limit, 50)}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  return response.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url,
    externalUrl: artist.external_urls?.spotify,
  }))
}

/**
 * Fetch top tracks
 */
export async function fetchTopTracks(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 50
): Promise<Array<{
  id: string
  name: string
  artist: string
  album?: string
  image?: string
  duration?: number
  externalUrl?: string
}>> {
  const response = await fetchJson<{
    items: Array<{
      id: string
      name: string
      artists: Array<{ name: string }>
      album?: {
        name: string
        images?: Array<{ url: string }>
      }
      duration_ms?: number
      external_urls?: { spotify: string }
    }>
  }>(`${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=${Math.min(limit, 50)}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  return response.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name || 'Unknown',
    album: track.album?.name,
    image: track.album?.images?.[0]?.url,
    duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : undefined,
    externalUrl: track.external_urls?.spotify,
  }))
}

/**
 * Fetch currently playing track
 */
export async function fetchCurrentlyPlaying(accessToken: string): Promise<{
  track: string
  artist: string
  album?: string
  image?: string
  isPlaying: boolean
} | null> {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  // 204 means no content (not playing)
  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    throw new ApiError('Failed to fetch currently playing', response.status, 'Spotify')
  }

  const data = await response.json()

  if (!data.item) {
    return null
  }

  return {
    track: data.item.name || 'Unknown',
    artist: data.item.artists?.[0]?.name || 'Unknown',
    album: data.item.album?.name,
    image: data.item.album?.images?.[0]?.url,
    isPlaying: data.is_playing || false,
  }
}

/**
 * Fetch user playlists
 */
export async function fetchPlaylists(
  accessToken: string,
  limit = 50
): Promise<Array<{
  id: string
  name: string
  description?: string
  image?: string
  tracksCount: number
  externalUrl?: string
}>> {
  const response = await fetchJson<{
    items: Array<{
      id: string
      name: string
      description?: string
      images?: Array<{ url: string }>
      tracks: { total: number }
      external_urls?: { spotify: string }
    }>
  }>(`${SPOTIFY_API_BASE}/me/playlists?limit=${Math.min(limit, 50)}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  return response.items.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description || undefined,
    image: playlist.images?.[0]?.url,
    tracksCount: playlist.tracks.total,
    externalUrl: playlist.external_urls?.spotify,
  }))
}

/**
 * Helper to get period label
 */
export { getPeriodLabel }

