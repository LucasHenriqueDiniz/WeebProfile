/**
 * Plugin to show LastFM music statistics using the official API
 * 
 * Essential configurations required:
 * - apiKey: LastFM API key (required)
 * - username: LastFM username (required, can be obtained via API or provided)
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginData } from '../../types/index'
import type { LastFmConfig, LastFmData } from './types'
import { RenderLastFm } from './components/RenderLastFm'
import { fetchLastFmData } from './services/fetchLastFm'

export const lastFmPlugin: Plugin<LastFmConfig, PluginData & LastFmData> = {
  name: 'lastfm',
  
  // Essential configuration keys that this plugin requires (required to fetch data)
  essentialConfigKeys: ['apiKey', 'username'],
  
  // Default plugin configuration (when the plugin is added for the first time)
  config: {
    enabled: false,
    sections: [],
    nonEssential: {
      recent_tracks_max: 5,
      top_artists_max: 5,
      top_albums_max: 5,
      top_tracks_max: 5,
    },
  } as LastFmConfig,
  
  /**
   * Fetches LastFM data
   */
  fetchData: async (config: LastFmConfig, dev = false, essentialConfig) => {
    return await fetchLastFmData(config, dev, essentialConfig) as PluginData & LastFmData
  },
  
  /**
   * Renders the plugin
   */
  render: (config: LastFmConfig, data: PluginData & LastFmData) => {
        // Extract style and size from config (comes from SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    
    return (
      <RenderLastFm
        config={config}
        data={data as LastFmData}
        style={style}
        size={size}
      />
    )
  },
}

export default lastFmPlugin

