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
  calculateHeight: (config, data, size = 'half') => {
    const ne = (config as LyftaConfig).nonEssential || {}
    const ld = data as LyftaData
    const isTerminal = (config as { style?: string }).style === 'terminal'

    // TerminalGrid: TerminalCommand + grid header + n rows
    const terminalGridH = (n: number): number => (n > 0 ? 84 + n * 20 : 0)

    let h = 0
    for (const s of config.sections) {
      if (s === 'statistics') {
        h += isTerminal ? 123 : 132
      } else if (s === 'overview') {
        h += isTerminal ? 144 : 221
      } else if (s === 'last_workout') {
        if (!ld.workouts || ld.workouts.length === 0) continue
        const maxExercises = ne.last_workout_max_exercises ?? 5
        const lastWorkout = [...ld.workouts].sort(
          (a, b) => new Date(b.workout_perform_date).getTime() - new Date(a.workout_perform_date).getTime()
        )[0]!
        const n = Math.min(maxExercises, lastWorkout.exercises?.length ?? maxExercises)
        if (isTerminal) {
          const showBodyWeight = ne.last_workout_show_body_weight !== false
          const hasBodyWeight = showBodyWeight && (lastWorkout.body_weight ?? 0) > 0
          h += 24 + (2 + (hasBodyWeight ? 1 : 0) + n) * 28
        } else {
          const base = size === 'half' ? 315 : 334
          const itemH = size === 'half' ? 37 : 40
          h += base + Math.max(0, n - 5) * itemH
        }
      } else if (s === 'exercises') {
        const max = ne.exercises_max ?? 5
        // Use max as upper bound (exercises computed from workout history, not data.exercises)
        const n = max
        if (n === 0) continue
        if (isTerminal) {
          h += terminalGridH(n)
        } else {
          const itemH = size === 'half' ? 44 : 48
          h += 70 + n * itemH
        }
      } else if (s === 'recent_workouts') {
        const max = ne.workouts_max ?? 4
        const n = Math.min(ld.workoutSummaries?.length ?? max, max)
        if (n === 0) continue
        if (isTerminal) {
          h += 70 + n * 20
        } else {
          const base = size === 'half' ? 52 : 54
          const itemH = size === 'half' ? 70 : 73
          h += base + n * itemH
        }
      }
    }
    return h
  },
}

export default lyftaPlugin

