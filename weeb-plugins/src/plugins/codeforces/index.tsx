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
}

export default codeforcesPlugin








