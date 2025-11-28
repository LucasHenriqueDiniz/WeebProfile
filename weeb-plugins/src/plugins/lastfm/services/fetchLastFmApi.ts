/**
 * Serviço de fetch de dados do LastFM via API oficial
 * 
 * Documentação: https://www.last.fm/api
 */

import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack } from '../types'
import type { EssentialPluginConfig } from '../../shared/types/base'
import { fetchJson, requireApiKey, buildQueryString } from '../../shared/utils/api'
import { ApiError, ConfigError } from '../../shared/utils/errors'
import { urlToBase64 } from '../../../utils/image-to-base64'

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/'

/**
 * Converte período da API para label legível
 */
function getPeriodLabel(period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'): string {
  const labels: Record<string, string> = {
    overall: 'All time',
    '7day': 'Last 7 days',
    '1month': 'Last month',
    '3month': 'Last 3 months',
    '6month': 'Last 6 months',
    '12month': 'Last year',
  }
  return labels[period] || 'All time'
}

/**
 * Tipos de resposta da API do LastFM
 */
interface LastFmApiResponse<T> {
  recenttracks?: {
    track?: Array<{
      name: string
      artist: { '#text': string }
      date?: { uts: string; '#text': string }
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  topartists?: {
    artist?: Array<{
      name: string
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  topalbums?: {
    album?: Array<{
      name: string
      artist: { name: string }
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  toptracks?: {
    track?: Array<{
      name: string
      artist: { name: string }
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  user?: {
    name: string
    playcount: string
    artist_count: string
    lovedtracks: string
  }
  error?: number
  message?: string
}


/**
 * Busca recent tracks do LastFM
 */
async function fetchRecentTracks(
  apiKey: string,
  username: string,
  limit = 50
): Promise<LastFmTrack[]> {
  const params = buildQueryString({
    method: 'user.getrecenttracks',
    user: username,
    api_key: apiKey,
    format: 'json',
    limit: Math.min(limit, 50), // Limite máximo para exibição: 50
  })

  const response = await fetchJson<LastFmApiResponse<LastFmTrack[]>>(
    `${LASTFM_API_BASE}${params}`
  )

  if (response.error) {
    throw new ApiError(
      response.message || 'Failed to fetch recent tracks',
      response.error,
      'LastFM'
    )
  }

  const tracks = response.recenttracks?.track || []
  
  return tracks.map((track) => {
    const image = track.image?.find(img => img.size === 'large')?.['#text'] ||
                  track.image?.find(img => img.size === 'medium')?.['#text'] ||
                  track.image?.[0]?.['#text']
    
    return {
      track: track.name,
      artist: track.artist['#text'],
      date: track.date?.['#text'] || 'now',
      image,
    }
  })
}

/**
 * Busca top artists do LastFM
 */
async function fetchTopArtists(
  apiKey: string,
  username: string,
  period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall',
  limit = 50
): Promise<LastFmArtist[]> {
  const params = buildQueryString({
    method: 'user.gettopartists',
    user: username,
    api_key: apiKey,
    format: 'json',
    period,
    limit: Math.min(limit, 50), // Limite máximo para exibição: 50
  })

  const response = await fetchJson<LastFmApiResponse<LastFmArtist[]>>(
    `${LASTFM_API_BASE}${params}`
  )

  if (response.error) {
    throw new ApiError(
      response.message || 'Failed to fetch top artists',
      response.error,
      'LastFM'
    )
  }

  const artists = response.topartists?.artist || []
  
  return artists.map((artist) => {
    const image = artist.image?.find(img => img.size === 'large')?.['#text'] ||
                  artist.image?.find(img => img.size === 'medium')?.['#text'] ||
                  artist.image?.[0]?.['#text']
    
    return {
      artist: artist.name,
      totalPlays: artist.playcount,
      image,
    }
  })
}

/**
 * Busca top albums do LastFM
 */
async function fetchTopAlbums(
  apiKey: string,
  username: string,
  period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall',
  limit = 50
): Promise<LastFmAlbum[]> {
  const params = buildQueryString({
    method: 'user.gettopalbums',
    user: username,
    api_key: apiKey,
    format: 'json',
    period,
    limit: Math.min(limit, 50), // Limite máximo para exibição: 50
  })

  const response = await fetchJson<LastFmApiResponse<LastFmAlbum[]>>(
    `${LASTFM_API_BASE}${params}`
  )

  if (response.error) {
    throw new ApiError(
      response.message || 'Failed to fetch top albums',
      response.error,
      'LastFM'
    )
  }

  const albums = response.topalbums?.album || []
  
  return albums.map((album) => {
    const image = album.image?.find(img => img.size === 'large')?.['#text'] ||
                  album.image?.find(img => img.size === 'medium')?.['#text'] ||
                  album.image?.[0]?.['#text']
    
    return {
      album: album.name,
      artist: album.artist.name,
      plays: album.playcount,
      image,
    }
  })
}

/**
 * Busca top tracks do LastFM
 */
async function fetchTopTracks(
  apiKey: string,
  username: string,
  period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall',
  limit = 50
): Promise<TopTrack[]> {
  const params = buildQueryString({
    method: 'user.gettoptracks',
    user: username,
    api_key: apiKey,
    format: 'json',
    period,
    limit: Math.min(limit, 50), // Limite máximo para exibição: 50
  })

  const response = await fetchJson<LastFmApiResponse<TopTrack[]>>(
    `${LASTFM_API_BASE}${params}`
  )

  if (response.error) {
    throw new ApiError(
      response.message || 'Failed to fetch top tracks',
      response.error,
      'LastFM'
    )
  }

  const tracks = response.toptracks?.track || []
  
  return tracks.map((track) => {
    const image = track.image?.find(img => img.size === 'large')?.['#text'] ||
                  track.image?.find(img => img.size === 'medium')?.['#text'] ||
                  track.image?.[0]?.['#text']
    
    return {
      track: track.name,
      artist: track.artist.name,
      plays: track.playcount,
      image,
    }
  })
}

/**
 * Busca informações do usuário (statistics)
 */
async function fetchUserInfo(
  apiKey: string,
  username: string
): Promise<{ totalScrobbles: string; totalArtists: string; lovedTracks: string }> {
  const params = buildQueryString({
    method: 'user.getinfo',
    user: username,
    api_key: apiKey,
    format: 'json',
  })

  const response = await fetchJson<LastFmApiResponse<never>>(
    `${LASTFM_API_BASE}${params}`
  )

  if (response.error) {
    throw new ApiError(
      response.message || 'Failed to fetch user info',
      response.error,
      'LastFM'
    )
  }

  const user = response.user
  if (!user) {
    throw new ApiError('User not found', 404, 'LastFM')
  }

  return {
    totalScrobbles: user.playcount || '0',
    totalArtists: user.artist_count || '0',
    lovedTracks: user.lovedtracks || '0',
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
        key === 'image' &&
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

/**
 * Busca todos os dados do LastFM via API
 */
export async function fetchLastFmDataFromApi(
  apiKey: string,
  username: string,
  config: {
    recent_tracks_max?: number
    top_artists_max?: number
    top_albums_max?: number
    top_tracks_max?: number
    top_artists_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'
    top_albums_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'
    top_tracks_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'
    sections: string[]
  }
): Promise<LastFmData> {
  const hasRecentTracks = config.sections.includes('recent_tracks')
  const hasTopArtists = config.sections.some(s => s.includes('top_artists'))
  const hasTopAlbums = config.sections.some(s => s.includes('top_albums'))
  const hasTopTracks = config.sections.some(s => s.includes('top_tracks'))
  const hasStatistics = config.sections.includes('statistics')

  // Buscar dados em paralelo
  const [recentTracks, topArtists, topAlbums, topTracks, statistics] = await Promise.all([
    hasRecentTracks
      ? fetchRecentTracks(apiKey, username, config.recent_tracks_max || 50)
      : Promise.resolve([]),
    hasTopArtists
      ? fetchTopArtists(apiKey, username, config.top_artists_period || 'overall', config.top_artists_max || 50)
      : Promise.resolve([]),
    hasTopAlbums
      ? fetchTopAlbums(apiKey, username, config.top_albums_period || 'overall', config.top_albums_max || 50)
      : Promise.resolve([]),
    hasTopTracks
      ? fetchTopTracks(apiKey, username, config.top_tracks_period || 'overall', config.top_tracks_max || 50)
      : Promise.resolve([]),
    hasStatistics
      ? fetchUserInfo(apiKey, username)
      : Promise.resolve({ totalScrobbles: '0', totalArtists: '0', lovedTracks: '0' }),
  ])

  const rawData: LastFmData = {
    recentTracks,
    topArtists,
    topAlbums,
    topTracks,
    statistics,
    featuredTrack: recentTracks.length > 0 && recentTracks[0]
      ? {
          track: recentTracks[0].track || '',
          artist: recentTracks[0].artist || '',
          image: recentTracks[0].image,
        }
      : null,
    topArtistsInterval: getPeriodLabel(config.top_artists_period || 'overall'),
    topAlbumsInterval: getPeriodLabel(config.top_albums_period || 'overall'),
    topTracksInterval: getPeriodLabel(config.top_tracks_period || 'overall'),
  }

  // Converter todas as URLs de imagens para base64
  return await convertImageUrlsToBase64(rawData) as LastFmData
}

