/**
 * Codeforces Plugin
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginData } from '../../types/index.js'
import type { CodeforcesConfig, CodeforcesData } from './types.js'
import { RenderCodeforces } from './components/RenderCodeforces.js'
import { fetchCodeforcesData } from './services/fetchData.js'

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








