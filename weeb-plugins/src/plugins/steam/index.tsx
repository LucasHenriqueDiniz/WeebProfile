/**
 * Steam Plugin V2
 * 
 * Plugin para exibir estatísticas de jogos do Steam
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginConfig, PluginData } from '../../types/index.js'
import type { EssentialPluginConfig } from '../shared/types/base.js'
import type { SteamConfig, SteamData } from './types.js'
import { RenderSteam } from './components/RenderSteam.js'
import { fetchSteamData } from './services/fetchData.js'

export const steamPlugin: Plugin<PluginConfig & SteamConfig, PluginData & SteamData> = {
  name: 'steam',
  essentialConfigKeys: ['apiKey', 'steamId'],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & SteamConfig,
  fetchData: async (config: PluginConfig & SteamConfig, dev = false, essentialConfig?: EssentialPluginConfig) => {
    const apiKey = essentialConfig?.apiKey
    const steamId = essentialConfig?.steamId
    if (!dev && (!apiKey || !steamId)) {
      throw new Error('Steam API Key and Steam ID are required. Please configure them in your profile settings.')
    }
    return await fetchSteamData(config as SteamConfig, dev, apiKey, steamId) as PluginData & SteamData
  },
  render: (config: PluginConfig & SteamConfig, data: PluginData & SteamData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderSteam
        config={config as SteamConfig}
        data={data as SteamData}
        style={style}
        size={size}
      />
    )
  },
}

export default steamPlugin

