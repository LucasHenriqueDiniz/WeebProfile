// https://www.last.fm/api

import type { LastFmConfig, LastFmData } from "../types"
import { getMockLastFmData } from "./mock-data"
import { urlToBase64 } from "../../../utils/image-to-base64"

/**
 * Converte URLs de imagens para base64 recursivamente
 * Necessário para que o Playwright possa carregar as imagens durante a medição de altura
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
 * Busca dados do LastFM
 */
export async function fetchLastFmData(
  config: LastFmConfig,
  dev = false,
  essentialConfig?: any
): Promise<LastFmData> {

  try {
    // Em modo dev ou preview, retornar dados mock
    if (dev || !essentialConfig?.apiKey || !essentialConfig?.username) {
      console.log(`[LastFM] Using mock data (dev mode or missing config)`)

      const mockData = getMockLastFmData({
        recent_tracks_max: config.nonEssential?.recent_tracks_max || 10,
        top_artists_max: config.nonEssential?.top_artists_max || 10,
        top_albums_max: config.nonEssential?.top_albums_max || 10,
        top_tracks_max: config.nonEssential?.top_tracks_max || 10,
      })

      console.log(`[LastFM] Mock data generated:`, {
        recentTracks: Array.isArray(mockData.recentTracks) ? mockData.recentTracks.length : 'NOT_ARRAY',
        topArtists: Array.isArray(mockData.topArtists) ? mockData.topArtists.length : 'NOT_ARRAY',
        topAlbums: Array.isArray(mockData.topAlbums) ? mockData.topAlbums.length : 'NOT_ARRAY',
        topTracks: Array.isArray(mockData.topTracks) ? mockData.topTracks.length : 'NOT_ARRAY',
        statistics: typeof mockData.statistics
      })

      // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
      console.log(`[LastFM] Converting image URLs to base64...`)
      const dataWithBase64Images = await convertImageUrlsToBase64(mockData)
      console.log(`[LastFM] Image conversion completed`)

      return dataWithBase64Images
    }

    // Validar configurações essenciais apenas quando não estiver em modo dev
    if (!essentialConfig?.apiKey) {
      throw new Error('LastFM API key is required. Please add your LastFM API key to the configuration.')
    }

    if (!essentialConfig?.username) {
      throw new Error('LastFM username is required. Please add your LastFM username to the configuration.')
    }

    // TODO: Implementar chamada real da API LastFM
    // Por enquanto, retornar dados mock até a API estar implementada
    console.log(`[LastFM] API integration not yet implemented, using mock data`)

    const mockData = getMockLastFmData({
      recent_tracks_max: config.nonEssential?.recent_tracks_max || 10,
      top_artists_max: config.nonEssential?.top_artists_max || 10,
      top_albums_max: config.nonEssential?.top_albums_max || 10,
      top_tracks_max: config.nonEssential?.top_tracks_max || 10,
    })

    // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
    console.log(`[LastFM] Converting image URLs to base64...`)
    const dataWithBase64Images = await convertImageUrlsToBase64(mockData)
    console.log(`[LastFM] Image conversion completed`)

    return dataWithBase64Images

  } catch (error) {
    console.error(`[LastFM] Error fetching data:`, error)

    // Re-throw with more context
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error(`LastFM Configuration Error: ${error.message}`)
      }
      if (error.message.includes('username')) {
        throw new Error(`LastFM Configuration Error: ${error.message}`)
      }
      if (error.message.includes('rate limit')) {
        throw new Error(`LastFM API Rate Limit: ${error.message}`)
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error(`LastFM Network Error: ${error.message}`)
      }
    }

    throw error
  }
}