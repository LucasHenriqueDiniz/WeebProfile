/**
 * Spotify plugin data fetch service
 * 
 * Fetches data from Spotify Web API using refresh token
 */

import type { SpotifyConfig, SpotifyData } from '../types'
import type { EssentialPluginConfig } from '../../shared/types/base'
import { getMockSpotifyData } from './mock-data'
import { requireToken } from '../../shared/utils/api'
import { ConfigError } from '../../shared/utils/errors'
import { urlToBase64 } from '../../../utils/image-to-base64'
import {
  getAccessTokenFromRefreshToken,
  fetchProfile,
  fetchRecentlyPlayed,
  fetchTopArtists,
  fetchTopTracks,
  fetchCurrentlyPlaying,
  fetchPlaylists,
  getPeriodLabel,
} from './spotifyApi'

/**
 * Fetches Spotify plugin data
 * 
 * @param config - Plugin configuration (includes enabled, sections, nonEssential)
 * @param dev - Development mode (uses mock data)
 * @param essentialConfig - Essential configurations (refresh token) from profile
 */
export async function fetchSpotifyData(
  config: SpotifyConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<SpotifyData> {
  // Development mode - return mock data
  if (dev) {
    const mockData = getMockSpotifyData()
    // Converter URLs de imagens para base64 para funcionar nos previews (Playwright bloqueia requisições externas)
    return await convertImageUrlsToBase64(mockData)
  }

  // Get refresh token from essential config
  const refreshToken = requireToken(essentialConfig?.refreshToken, 'refreshToken')

  // Get client credentials from environment variables (server-side only)
  // These should be set in the svg-generator service environment
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new ConfigError(
      'Spotify Client ID and Client Secret must be configured as environment variables (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)',
      ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET']
    )
  }

  // Get access token using refresh token
  const accessToken = await getAccessTokenFromRefreshToken(refreshToken, clientId, clientSecret)

  // Get non-essential config with defaults
  const nonEssential = config.nonEssential || {}
  const {
    recent_tracks_max = 20,
    top_artists_max = 20,
    top_tracks_max = 20,
    playlists_max = 20,
    top_artists_period = 'medium_term',
    top_tracks_period = 'medium_term',
  } = nonEssential

  const sections = config.sections || []

  // Determine which sections to fetch
  const hasRecentTracks = sections.includes('recent_tracks')
  const hasTopArtists = sections.includes('top_artists')
  const hasTopTracks = sections.includes('top_tracks')
  const hasCurrentlyPlaying = sections.includes('currently_playing')
  const hasPlaylists = sections.includes('playlists')
  const hasProfile = sections.includes('profile')

  // Fetch data in parallel for sections that are enabled
  const [
    recentTracks,
    topArtists,
    topTracks,
    currentlyPlaying,
    playlists,
    profile,
  ] = await Promise.all([
    hasRecentTracks
      ? fetchRecentlyPlayed(accessToken, recent_tracks_max)
      : Promise.resolve([]),
    hasTopArtists
      ? fetchTopArtists(accessToken, top_artists_period, top_artists_max)
      : Promise.resolve([]),
    hasTopTracks
      ? fetchTopTracks(accessToken, top_tracks_period, top_tracks_max)
      : Promise.resolve([]),
    hasCurrentlyPlaying
      ? fetchCurrentlyPlaying(accessToken).catch(() => null)
      : Promise.resolve(null),
    hasPlaylists
      ? fetchPlaylists(accessToken, playlists_max)
      : Promise.resolve([]),
    hasProfile
      ? fetchProfile(accessToken).catch(() => null)
      : Promise.resolve(null),
  ])

  return {
    recentTracks,
    topArtists,
    topTracks,
    currentlyPlaying,
    playlists,
    profile,
    topArtistsPeriod: getPeriodLabel(top_artists_period),
    topTracksPeriod: getPeriodLabel(top_tracks_period),
  }
}

/**
 * Converte URLs de imagens para base64 recursivamente
 */
async function convertImageUrlsToBase64(data: any): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => convertImageUrlsToBase64(item)))
  }

  if (data && typeof data === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        (key === 'image' || key === 'avatar' || key === 'avatarUrl') &&
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      ) {
        // Converter URL para base64
        result[key] = await urlToBase64(value)
      } else {
        result[key] = await convertImageUrlsToBase64(value)
      }
    }
    return result
  }

  return data
}
