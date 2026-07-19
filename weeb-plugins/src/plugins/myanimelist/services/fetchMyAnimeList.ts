/**
 * Serviço principal para buscar dados do MyAnimeList
 */

import type { MalLastUpdates, MyAnimeListConfig, MyAnimeListData } from "../types"
import { getMockMyAnimeListData } from "./mock-data"
import { fetchFullProfile } from "./profile"
import { fetchFavorites } from "./favorites"
import { jikanEdgeGet, JikanEdgeError } from "./api-client"
import { transformLastUpdates } from "./last-updates"
import { transformStatistics } from "./statistics"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const MAL_MOCK_IMAGE_MAX_BYTES = 100_000

/**
 * Converte URLs de imagens para base64 recursivamente (para dados mock)
 */
async function convertImageUrlsToBase64(data: any, previewMode = false): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => convertImageUrlsToBase64(item, previewMode)))
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
          // Converter URL para base64
          try {
            result[key] = (await urlToDataUriDirect(value, { maxBytes: MAL_MOCK_IMAGE_MAX_BYTES })).dataUri
          } catch {
            result[key] = null
          }
        }
      } else {
        result[key] = await convertImageUrlsToBase64(value, previewMode)
      }
    }
    return result
  }

  return data
}

/**
 * Busca dados do MyAnimeList
 *
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock)
 */
export async function fetchMyAnimeListData(
  config: MyAnimeListConfig,
  dev = false,
  essentialConfig?: any,
  previewMode = false
): Promise<MyAnimeListData> {
  console.debug(`[MyAnimeList] Fetching data for user: ${config.username || "mock"}`)

  try {
    // Em modo dev ou preview, retornar dados mock sem validar username
    if (dev || previewMode) {
      console.debug(`[MyAnimeList] Using mock data (${dev ? "dev" : "preview"} mode)`)
      const mockData = getMockMyAnimeListData()

      // Em modo preview, manter URLs originais (não converter para base64)
      if (previewMode) {
        return mockData
      }

      // Converter URLs de imagens para base64 apenas quando não estiver em modo preview
      return await convertImageUrlsToBase64(mockData, previewMode)
    }

    // Validar que tem username configurado apenas quando não estiver em modo dev/preview
    if (!config.username || typeof config.username !== "string" || config.username.trim() === "") {
      throw new Error("MyAnimeList username is required. Please configure your username in the plugin settings.")
    }

    // Buscar dados reais da API
    // Buscar perfil completo
    const profile = await fetchFullProfile(config.username)

    // Buscar favoritos (básicos e completos)
    const favorites = await fetchFavorites(profile, config)

    // Transformar últimas atualizações
    let lastUpdates: MalLastUpdates = { anime: [], manga: [] }
    let lastActivityStatus: MyAnimeListData["lastActivityStatus"] = "complete"
    if ((config.sections || []).includes("last_activity")) {
      try {
        const updates = await jikanEdgeGet<{ data: unknown }>(`/v1/users/${encodeURIComponent(config.username)}/userupdates`)
        lastUpdates = await transformLastUpdates(updates as never, config)
      } catch (error) {
        lastActivityStatus = "unavailable"
        if (!(error instanceof JikanEdgeError && error.status === 501 && error.code === "USER_UPDATES_UNSUPPORTED")) console.warn("[MyAnimeList] Recent updates unavailable", error)
      }
    }

    // Transformar estatísticas
    const statistics = transformStatistics(profile.statistics)

    const data: MyAnimeListData = {
      favorites: favorites.basic,
      favorites_full: favorites.full,
      last_updated: lastUpdates,
      lastActivityStatus,
      statistics,
    }

    console.log(`[MyAnimeList] Successfully fetched data for ${config.username}`)
    return data
  } catch (error) {
    console.error(`[MyAnimeList] Error fetching data:`, error)
    // Em caso de erro, relançar para que seja tratado pelo componente de erro
    throw error
  }
}
