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
}

export default stackoverflowPlugin








