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
  calculateHeight: (config, data) => {
    const ne = config.nonEssential || {}
    const isTerminal = (config as { style?: string }).style === 'terminal'

    let h = 0
    for (const s of config.sections) {
      if (s === 'current_streak') {
        if (isTerminal) {
          h += 76
        } else {
          // hideTitle defaults to true for current_streak
          const hideTitle = ne.current_streak_hide_title ?? true
          h += hideTitle ? 112 : 157
        }
      } else if (s === 'total_xp') {
        h += isTerminal ? 76 : 140
      } else if (s === 'languages_learning') {
        const max = ne.languages_learning_max ?? 10
        const n = Math.min((data as DuolingoData).languages?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? 56 + n * 16 : 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 + 8
      }
    }
    return h
  },
}

export default duolingoPlugin
































