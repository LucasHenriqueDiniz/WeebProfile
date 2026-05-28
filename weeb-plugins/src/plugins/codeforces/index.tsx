/**
 * Codeforces Plugin
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { CodeforcesConfig, CodeforcesData } from './types'
import { RenderCodeforces } from './components/RenderCodeforces'
import { fetchCodeforcesData } from './services/fetchData'

export const codeforcesPlugin: Plugin<CodeforcesConfig, PluginData & CodeforcesData> = {
  name: 'codeforces',
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as CodeforcesConfig,
  fetchData: async (config: CodeforcesConfig, dev = false) => {
    return await fetchCodeforcesData(config, dev) as PluginData & CodeforcesData
  },
  render: (config: CodeforcesConfig, data: PluginData & CodeforcesData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderCodeforces
        config={config}
        data={data as CodeforcesData}
        style={style}
        size={size}
      />
    )
  },
  calculateHeight: (config, data) => {
    const ne = config.nonEssential || {}
    let h = 0
    for (const s of config.sections) {
      if (s === 'rating_rank') h += 69
      else if (s === 'contests_participated') h += 73
      else if (s === 'problems_solved') h += 97
      else if (s === 'recent_submissions') {
        const max = ne.recent_submissions_max ?? 5
        const n = Math.min((data as CodeforcesData).recentSubmissions?.length ?? max, max)
        h += 33 + 12 + n * 50 + Math.max(0, n - 1) * 4
      }
    }
    return h
  },
}

export default codeforcesPlugin
































