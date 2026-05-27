/**
 * Stack Overflow Plugin
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { StackOverflowConfig, StackOverflowData } from './types'
import { RenderStackOverflow } from './components/RenderStackOverflow'
import { fetchStackOverflowData } from './services/fetchData'

export const stackoverflowPlugin: Plugin<StackOverflowConfig, PluginData & StackOverflowData> = {
  name: 'stackoverflow',
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    userId: '',
  } as StackOverflowConfig,
  fetchData: async (config: StackOverflowConfig, dev = false) => {
    return await fetchStackOverflowData(config, dev) as PluginData & StackOverflowData
  },
  render: (config: StackOverflowConfig, data: PluginData & StackOverflowData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderStackOverflow
        config={config}
        data={data as StackOverflowData}
        style={style}
        size={size}
      />
    )
  },
  calculateHeight: (config, data) => {
    const ne = config.nonEssential || {}
    let h = 0
    for (const s of config.sections) {
      if (s === 'reputation') h += 73
      else if (s === 'badges') h += 101
      else if (s === 'answers_questions') h += 73
      else if (s === 'tags_expertise') {
        const max = ne.tags_expertise_max ?? 5
        const n = Math.min((data as StackOverflowData).topTags?.length ?? max, max)
        h += 33 + 12 + n * 50 + Math.max(0, n - 1) * 4
      }
    }
    return h
  },
}

export default stackoverflowPlugin
































