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
    const cfData = data as CodeforcesData
    const isTerminal = (config as { style?: string }).style === 'terminal'

    let h = 0
    for (const s of config.sections) {
      if (s === 'rating_rank') {
        h += isTerminal ? 96 : 76
      } else if (s === 'contests_participated') {
        h += isTerminal ? 76 : 80
      } else if (s === 'problems_solved') {
        if (isTerminal) {
          const byDifficulty = cfData.problemsSolved?.byDifficulty ?? {}
          const n = Object.values(byDifficulty).filter((count) => (count ?? 0) > 0).length
          h += 24 + (1 + n) * 25
        } else {
          h += 104
        }
      } else if (s === 'recent_submissions') {
        const max = ne.recent_submissions_max ?? 5
        const n = Math.min(cfData.recentSubmissions?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? 56 + n * 16 : 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 + 8
      }
    }
    return h
  },
}

export default codeforcesPlugin
































