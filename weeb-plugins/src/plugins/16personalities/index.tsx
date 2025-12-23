/**
 * 16personalities Plugin V2
 * 
 * Plugin to display 16personalities data
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginData } from '../../types/index.js'
import type { Personality16Config, Personality16Data } from './types.js'
import { RenderPersonality16 } from './components/Render16personalities.js'
import { fetchPersonality16Data } from './services/fetchData.js'

  /**
   * 16personalities Plugin
   * 
   * No essential configuration keys needed
   */
export const personality16Plugin: Plugin<Personality16Config, PluginData & Personality16Data> = {
  name: '16personalities',
  
  // No API key needed - only type configuration
  essentialConfigKeys: [],
  
  // Default plugin configuration
  config: {
    enabled: false,
    sections: ['personality'],
    personality_type: 'ENFJ',
  } as Personality16Config,
  
  /**
   * Fetches plugin data
   */
  fetchData: async (config: Personality16Config, dev = false) => {
    return await fetchPersonality16Data(config, dev) as PluginData & Personality16Data
  },
  
  /**
   * Renders the plugin
   */
  render: (config: Personality16Config, data: PluginData & Personality16Data) => {
    // Extract style and size from config (comes from SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    
    return (
      <RenderPersonality16
        config={config}
        data={data as Personality16Data}
        style={style}
        size={size}
      />
    )
  },
}

export default personality16Plugin

