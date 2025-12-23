/**
 * Serviço principal para buscar dados do MyAnimeList
 */

import type { MyAnimeListConfig, MyAnimeListData } from '../types'
import { getMockMyAnimeListData } from './mock-data'
import { fetchFullProfile } from './profile'
import { fetchFavorites } from './favorites'
import { transformLastUpdates } from './last-updates'
import { transformStatistics } from './statistics'
import { urlToBase64 } from '../../../utils/image-to-base64'

/**
 * Converte URLs de imagens para base64 recursivamente (para dados mock)
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
 * Busca dados do MyAnimeList
 *
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock)
 */
export async function fetchMyAnimeListData(
  config: MyAnimeListConfig,
  dev = false
): Promise<MyAnimeListData> {
  // Modo desenvolvimento - retornar dados mock
  if (dev) {
    const mockData = getMockMyAnimeListData()
    // Retornar dados mock com URLs diretas (não converter para base64)
    return mockData
  }

  // Modo produção - buscar dados reais da API
  if (!config.username) {
    throw new Error('No username provided for MyAnimeList plugin')
  }

  console.log(`[MyAnimeList] Fetching data for user: ${config.username}`)

  try {
    // Buscar perfil completo
    const profile = await fetchFullProfile(config.username)

    // Buscar favoritos (básicos e completos)
    const favorites = await fetchFavorites(profile, config)

    // Transformar últimas atualizações
    const lastUpdates = await transformLastUpdates(profile, config)

    // Transformar estatísticas
    const statistics = transformStatistics(profile.statistics)

    const data: MyAnimeListData = {
      favorites: favorites.basic,
      favorites_full: favorites.full,
      last_updated: lastUpdates,
      statistics,
    }

    console.log(`[MyAnimeList] Successfully fetched data for ${config.username}`)
    return data
  } catch (error) {
    console.error(`[MyAnimeList] Error fetching data:`, error)
    // Em caso de erro, retornar dados mock como fallback
    const mockData = getMockMyAnimeListData()
    return (await convertImageUrlsToBase64(mockData)) as MyAnimeListData
  }
}

