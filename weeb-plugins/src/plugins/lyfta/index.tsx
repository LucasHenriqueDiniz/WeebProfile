/**
 * Lyfta Plugin V2
 * 
 * Plugin para exibir estatísticas de treino do Lyfta
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginConfig, PluginData } from '../../types/index'
import type { EssentialPluginConfig } from '../shared/types/base'
import type { LyftaConfig, LyftaData } from './types'
import { RenderLyfta } from './components/RenderLyfta'
import { fetchLyftaData } from './services/fetchData'

export const lyftaPlugin: Plugin<PluginConfig & LyftaConfig, PluginData & LyftaData> = {
  name: 'lyfta',
  essentialConfigKeys: ['apiKey'],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & LyftaConfig,
  fetchData: async (config: PluginConfig & LyftaConfig, dev = false, essentialConfig?: EssentialPluginConfig, previewMode = false) => {
    const apiKey = essentialConfig?.apiKey
    return await fetchLyftaData(config as LyftaConfig, dev, apiKey, previewMode) as PluginData & LyftaData
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
  calculateHeight: (config, data) => {
    const ne = (config as LyftaConfig).nonEssential || {}
    const ld = data as LyftaData

    let h = 0
    for (const s of config.sections) {
      if (s === 'statistics') h += 123
      else if (s === 'overview') h += 203
      else if (s === 'last_workout') {
        // Fixed upper bound from preview; last workout has a fixed number of visible exercises
        h += 295
      } else if (s === 'exercises') {
        const max = ne.exercises_max ?? 5
        // Use max as upper bound (exercises computed from workout history, not data.exercises)
        const n = max
        // p-4 container (32px fixed overhead) + space-y-2 (8px gap) + ~37px per item
        // Formula: 65 + n*37 + (n-1)*8; checks: n=5→282≈279, n=1→102
        h += n > 0 ? 65 + n * 37 + Math.max(0, n - 1) * 8 : 0
      } else if (s === 'recent_workouts') {
        // Component default is 4 items (workouts_max || 4)
        const max = ne.workouts_max ?? 4
        const n = Math.min(ld.workoutSummaries?.length ?? max, max)
        // p-4+mb-3 container (44px) + space-y-3 (12px gap) + ~40px per item
        // Formula: 77 + n*40 + (n-1)*12; checks: n=4→273✓, n=3→221, n=1→117
        h += n > 0 ? 77 + n * 40 + Math.max(0, n - 1) * 12 : 0
      }
    }
    return h
  },
}

export default lyftaPlugin

