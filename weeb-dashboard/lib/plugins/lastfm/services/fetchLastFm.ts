/**
 * Serviço de fetch de dados do LastFM
 * 
 * Usa a API oficial do LastFM (https://www.last.fm/api)
 */

import type { LastFmConfig, LastFmData } from '../types'
import type { EssentialPluginConfig } from '../../../weeb-plugins/plugins/shared/types/base'
import { getMockLastFmData } from './mock-data'
import { fetchLastFmDataFromApi } from './fetchLastFmApi'
import { requireApiKey } from '../../../weeb-plugins/plugins/shared/utils/api'
import { ConfigError } from '../../../weeb-plugins/plugins/shared/utils/errors'

/**
 * Busca dados do LastFM
 * 
 * @param config - Configuração do plugin (inclui enabled, sections, nonEssential)
 * @param dev - Modo desenvolvimento (usa dados mock)
 * @param essentialConfig - Configurações essenciais (API key, username) vindas do perfil
 */
export async function fetchLastFmData(
  config: LastFmConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<LastFmData> {
  // Combinar nonEssential com propriedades do nível raiz do config
  // Isso permite que configurações funcionem mesmo quando estão no nível raiz
  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('recent_tracks_') ||
        key.startsWith('top_artists_') ||
        key.startsWith('top_albums_') ||
        key.startsWith('top_tracks_') ||
        key.startsWith('statistics_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  // Modo desenvolvimento - retornar dados mock
  if (dev) {
    return getMockLastFmData({
      recent_tracks_max: sectionConfig.recent_tracks_max || 5,
      top_artists_max: sectionConfig.top_artists_max || 10,
      top_albums_max: sectionConfig.top_albums_max || 10,
      top_tracks_max: sectionConfig.top_tracks_max || 10,
    })
  }

  // Validar API key
  const apiKey = requireApiKey(essentialConfig?.apiKey, 'apiKey')

  // Obter username (deve estar em essentialConfig)
  if (!essentialConfig?.username) {
    throw new ConfigError(
      'LastFM username is required. Please provide it in essentialConfig.',
      ['username']
    )
  }
  const username = essentialConfig.username

  // Buscar dados via API
  return await fetchLastFmDataFromApi(apiKey, username, {
    recent_tracks_max: sectionConfig.recent_tracks_max || 50,
    top_artists_max: sectionConfig.top_artists_max || 50,
    top_albums_max: sectionConfig.top_albums_max || 50,
    top_tracks_max: sectionConfig.top_tracks_max || 50,
    top_artists_period: sectionConfig.top_artists_period || 'overall',
    top_albums_period: sectionConfig.top_albums_period || 'overall',
    top_tracks_period: sectionConfig.top_tracks_period || 'overall',
    sections: config.sections,
  })
}

