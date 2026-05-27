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
    let h = 0
    for (const s of config.sections) {
      if (s === 'rank_honor') h += 69
      else if (s === 'completed_kata') {
        const max = ne.completed_kata_max ?? 5
        const n = Math.min((data as CodewarsData).completedKata?.length ?? max, max)
        h += 33 + 12 + n * 50 + Math.max(0, n - 1) * 4
      } else if (s === 'languages_proficiency') {
        const max = ne.languages_proficiency_max ?? 5
        const n = Math.min(Object.keys((data as CodewarsData).languages ?? {}).length, max)
        h += 33 + 12 + n * 50 + Math.max(0, n - 1) * 4
      } else if (s === 'leaderboard_position') {
        if ((data as CodewarsData).leaderboardPosition) h += 73
      }
    }
    return h
  },
}

export default codewarsPlugin
































