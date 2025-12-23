/**
 * Codewars Plugin
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginData } from '../../types/index.js'
import type { CodewarsConfig, CodewarsData } from './types.js'
import { RenderCodewars } from './components/RenderCodewars.js'
import { fetchCodewarsData } from './services/fetchData.js'

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
}

export default codewarsPlugin








