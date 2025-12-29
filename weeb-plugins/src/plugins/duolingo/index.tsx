/**
 * Duolingo Plugin
 * 
 * Plugin para exibir estatísticas do Duolingo
 * 
 * WARNING: Uses unofficial API - may break if Duolingo changes their structure
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { DuolingoConfig, DuolingoData } from './types'
import { RenderDuolingo } from './components/RenderDuolingo'
import { fetchDuolingoData } from './services/fetchData'

export const duolingoPlugin: Plugin<DuolingoConfig, PluginData & DuolingoData> = {
  name: 'duolingo',
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as DuolingoConfig,
  fetchData: async (config: DuolingoConfig, dev = false) => {
    return await fetchDuolingoData(config, dev) as PluginData & DuolingoData
  },
  render: (config: DuolingoConfig, data: PluginData & DuolingoData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderDuolingo
        config={config}
        data={data as DuolingoData}
        style={style}
        size={size}
      />
    )
  },
}

export default duolingoPlugin















