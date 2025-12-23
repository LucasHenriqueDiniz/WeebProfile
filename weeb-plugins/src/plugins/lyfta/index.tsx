/**
 * Lyfta Plugin V2
 * 
 * Plugin para exibir estatísticas de treino do Lyfta
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginConfig, PluginData } from '../../types/index.js'
import type { EssentialPluginConfig } from '../shared/types/base.js'
import type { LyftaConfig, LyftaData } from './types.js'
import { RenderLyfta } from './components/RenderLyfta.js'
import { fetchLyftaData } from './services/fetchData.js'

export const lyftaPlugin: Plugin<PluginConfig & LyftaConfig, PluginData & LyftaData> = {
  name: 'lyfta',
  essentialConfigKeys: ['apiKey'],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & LyftaConfig,
  fetchData: async (config: PluginConfig & LyftaConfig, dev = false, essentialConfig?: EssentialPluginConfig) => {
    const apiKey = essentialConfig?.apiKey
    if (!dev && !apiKey) {
      throw new Error('Lyfta API Key is required. Please configure it in your profile settings.')
    }
    return await fetchLyftaData(config as LyftaConfig, dev, apiKey) as PluginData & LyftaData
  },
  render: (config: PluginConfig & LyftaConfig, data: PluginData & LyftaData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderLyfta
        config={config as LyftaConfig}
        data={data as LyftaData}
        style={style}
        size={size}
      />
    )
  },
}

export default lyftaPlugin

