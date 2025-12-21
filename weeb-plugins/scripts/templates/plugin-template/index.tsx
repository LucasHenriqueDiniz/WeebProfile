/**
 * PLUGIN_NAME Plugin V2
 * 
 * Plugin to display PLUGIN_NAME data
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { PLUGIN_NAMEConfig, PLUGIN_NAMEData } from './types'
import { RenderPLUGIN_NAME } from './components/RenderPLUGIN_NAME'
import { fetchPLUGIN_NAMEData } from './services/fetchData'

/**
 * PLUGIN_NAME Plugin
 * 
 * Required essential configurations: ['apiKey'] (or ['token'], etc)
 * Adjust essentialConfigKeys as needed
 */
export const PLUGIN_NAMEPlugin: Plugin<PLUGIN_NAMEConfig, PluginData & PLUGIN_NAMEData> = {
  name: 'PLUGIN_NAME',
  
  // List of essential configuration keys that this plugin requires
  // Example: ['apiKey'] for LastFM, ['token'] for GitHub, etc
  essentialConfigKeys: ['apiKey'], // Adjust as needed
  
  // Default plugin configuration
  config: {
    enabled: false,
    sections: [],
    // Add default values for nonEssential here if needed
    // nonEssential: {
    //   max_items: 10,
    //   show_title: true,
    // },
  } as PLUGIN_NAMEConfig,
  
  /**
   * Fetches plugin data
   */
  fetchData: async (config: PLUGIN_NAMEConfig, dev = false, essentialConfig) => {
    return await fetchPLUGIN_NAMEData(config, dev, essentialConfig) as PluginData & PLUGIN_NAMEData
  },
  
  /**
   * Renders the plugin
   */
  render: (config: PLUGIN_NAMEConfig, data: PluginData & PLUGIN_NAMEData) => {
    // Extract style and size from config (comes from SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    
    return (
      <RenderPLUGIN_NAME
        config={config}
        data={data as PLUGIN_NAMEData}
        style={style}
        size={size}
      />
    )
  },
}

export default PLUGIN_NAMEPlugin
