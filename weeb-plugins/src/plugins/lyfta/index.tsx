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
        const n = Math.min(ld.exercises?.length ?? max, max)
        // Calibrated: 279px for 5 items → 33 + n×46 + (n-1)×4
        h += n > 0 ? 33 + n * 46 + Math.max(0, n - 1) * 4 : 0
      } else if (s === 'recent_workouts') {
        const max = ne.workouts_max ?? 3
        const n = Math.min(ld.workoutSummaries?.length ?? max, max)
        // Calibrated: 273px for 3 items → 33 + n×80
        h += n > 0 ? 33 + n * 80 : 0
      }
    }
    return h
  },
}

export default lyftaPlugin

