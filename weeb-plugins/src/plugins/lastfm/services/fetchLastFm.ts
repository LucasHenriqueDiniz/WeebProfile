// https://www.last.fm/api

import type { LastFmConfig, LastFmData } from "../types"
import { getMockLastFmData } from "./mock-data"
import { urlToBase64 } from "../../../utils/image-to-base64"

/**
 * Converte URLs de imagens para base64 recursivamente
 * Necessário para que o Playwright possa carregar as imagens durante a medição de altura
 * Em modo preview, mantém URLs originais sem conversão
 */
async function convertImageUrlsToBase64(data: any, previewMode = false, context?: string): Promise<any> {
  if (Array.isArray(data)) {
    const results = await Promise.all(
      data.map((item, index) => {
        const itemContext = context ? `${context}[${index}]` : `item[${index}]`
        return convertImageUrlsToBase64(item, previewMode, itemContext)
      })
    )
    return results
  }

  if (data && typeof data === "object") {
    const result: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        key === "image" &&
        typeof value === "string" &&
        (value.startsWith("http://") || value.startsWith("https://"))
      ) {
        // Em modo preview, manter URLs originais
        if (previewMode) {
          result[key] = value
        } else {
          // Converter URL para base64 com log detalhado
          const itemName = data.artist || data.track || data.album || context || "unknown"
          try {
            console.log(`  [LastFM] Converting image for: ${itemName}`)
            result[key] = await urlToBase64(value)
            console.log(`  ✅ [LastFM] Image converted: ${itemName}`)
          } catch (error: any) {
            console.warn(`  ⚠️  [LastFM] Error converting image for ${itemName}:`, error.message)
            result[key] = value // Manter URL original em caso de erro
          }
        }
      } else {
        const nextContext = context ? `${context}.${key}` : key
        result[key] = await convertImageUrlsToBase64(value, previewMode, nextContext)
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
  essentialConfig?: any,
  previewMode = false
): Promise<LastFmData> {
  try {
    // Em modo dev ou preview, retornar dados mock
    if (dev || previewMode) {
      console.log(`[LastFM] Using mock data (dev mode or preview mode)`)

      const mockData = getMockLastFmData({
        recent_tracks_max: config.nonEssential?.recent_tracks_max || 10,
        top_artists_max: config.nonEssential?.top_artists_max || 10,
        top_albums_max: config.nonEssential?.top_albums_max || 10,
        top_tracks_max: config.nonEssential?.top_tracks_max || 10,
      })

      console.log(`[LastFM] Mock data generated:`, {
        recentTracks: Array.isArray(mockData.recentTracks) ? mockData.recentTracks.length : "NOT_ARRAY",
        topArtists: Array.isArray(mockData.topArtists) ? mockData.topArtists.length : "NOT_ARRAY",
        topAlbums: Array.isArray(mockData.topAlbums) ? mockData.topAlbums.length : "NOT_ARRAY",
        topTracks: Array.isArray(mockData.topTracks) ? mockData.topTracks.length : "NOT_ARRAY",
        statistics: typeof mockData.statistics,
      })

      // Em modo preview, manter URLs originais (não converter para base64)
      if (previewMode) {
        console.log(`[LastFM] Preview mode: keeping image URLs as-is (no base64 conversion)`)
        return mockData
      }

      // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
      console.log(`[LastFM] Converting image URLs to base64...`)
      const dataWithBase64Images = await convertImageUrlsToBase64(mockData, previewMode, "mockData")
      console.log(`[LastFM] Image conversion completed`)

      return dataWithBase64Images
    }

    // Validar configurações essenciais apenas quando não estiver em modo dev/preview
    if (!essentialConfig?.apiKey) {
      throw new Error("LastFM API key is required. Please add your LastFM API key to the configuration.")
    }

    if (!essentialConfig?.username) {
      throw new Error("LastFM username is required. Please add your LastFM username to the configuration.")
    }

    // Chamar API real do LastFM
    console.log(`[LastFM] Fetching real data from LastFM API for user: ${essentialConfig.username}`)
    const { fetchLastFmDataFromApi } = await import("./fetchLastFmApi.js")

    const apiData = await fetchLastFmDataFromApi(essentialConfig.apiKey, essentialConfig.username, {
      recent_tracks_max: config.nonEssential?.recent_tracks_max || 10,
      top_artists_max: config.nonEssential?.top_artists_max || 10,
      top_albums_max: config.nonEssential?.top_albums_max || 10,
      top_tracks_max: config.nonEssential?.top_tracks_max || 10,
      top_artists_period: config.nonEssential?.top_artists_period || "overall",
      top_albums_period: config.nonEssential?.top_albums_period || "overall",
      top_tracks_period: config.nonEssential?.top_tracks_period || "overall",
      sections: config.sections || [],
    })

    // Em modo preview, manter URLs originais (não converter para base64)
    if (previewMode) {
      console.log(`[LastFM] Preview mode: keeping image URLs as-is (no base64 conversion)`)
      return apiData
    }

    // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
    console.log(`[LastFM] Converting image URLs to base64...`)
    const dataWithBase64Images = await convertImageUrlsToBase64(apiData, previewMode, "apiData")
    console.log(`[LastFM] Image conversion completed`)

    return dataWithBase64Images
  } catch (error) {
    console.error(`[LastFM] Error fetching data:`, error)

    // Re-throw with more context
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error(`LastFM Configuration Error: ${error.message}`)
      }
      if (error.message.includes("username")) {
        throw new Error(`LastFM Configuration Error: ${error.message}`)
      }
      if (error.message.includes("rate limit")) {
        throw new Error(`LastFM API Rate Limit: ${error.message}`)
      }
      if (error.message.includes("network") || error.message.includes("fetch")) {
        throw new Error(`LastFM Network Error: ${error.message}`)
      }
    }

    throw error
  }
}
