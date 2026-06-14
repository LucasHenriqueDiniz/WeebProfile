/**
 * Codewars Plugin
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { CodewarsConfig, CodewarsData } from './types'
import { RenderCodewars } from './components/RenderCodewars'
import { fetchCodewarsData } from './services/fetchData'

export const codewarsPlugin: Plugin<CodewarsConfig, PluginData & CodewarsData> = {
  name: 'codewars',
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as CodewarsConfig,
  fetchData: async (config: CodewarsConfig, dev = false) => {
    return await fetchCodewarsData(config, dev) as PluginData & CodewarsData
  },
  render: (config: CodewarsConfig, data: PluginData & CodewarsData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderCodewars
        config={config}
        data={data as CodewarsData}
        style={style}
        size={size}
      />
    )
  },
  calculateHeight: (config, data) => {
    const ne = config.nonEssential || {}
    const cwData = data as CodewarsData
    const isTerminal = (config as { style?: string }).style === 'terminal'

    let h = 0
    for (const s of config.sections) {
      if (s === 'rank_honor') {
        h += isTerminal ? 96 : 76
      } else if (s === 'completed_kata') {
        const max = ne.completed_kata_max ?? 5
        const n = Math.min(cwData.completedKata?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? 56 + n * 16 : 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 + 8
      } else if (s === 'languages_proficiency') {
        const max = ne.languages_proficiency_max ?? 5
        const n = Math.min(Object.keys(cwData.languages ?? {}).length, max)
        if (n === 0) continue
        h += isTerminal ? 56 + n * 16 : 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 + 8
      } else if (s === 'leaderboard_position') {
        const hasPosition = !!cwData.leaderboardPosition
        if (isTerminal) h += hasPosition ? 54 : 32
        else h += hasPosition ? 76 : 0
      }
    }
    return h
  },
}

export default codewarsPlugin
































