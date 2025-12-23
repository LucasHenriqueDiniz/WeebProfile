/**
 * Spotify Plugin V2
 * 
 * Plugin to display Spotify data
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginData } from '../../types/index.js'
import type { SpotifyConfig, SpotifyData } from './types.js'
import { RenderSpotify } from './components/RenderSpotify.js'
import { fetchSpotifyData } from './services/fetchData.js'

/**
 * Spotify Plugin
 * 
 * ⚠️ DISABLED: This plugin is disabled due to Spotify's API restrictions.
 * See src/plugins/spotify/README.md for details.
 */
export const spotifyPlugin: Plugin<SpotifyConfig, PluginData & SpotifyData> = {
  name: 'spotify',
  
  // Essential configuration keys that this plugin requires
  // DISABLED: No essential configs - plugin not functional due to Spotify API restrictions
  essentialConfigKeys: [],
  
  // Default plugin configuration
  config: {
    enabled: false,
    sections: [],
    nonEssential: {
      recent_tracks_max: 10,
      top_artists_max: 10,
      top_tracks_max: 10,
      playlists_max: 10,
      top_artists_period: 'medium_term',
      top_tracks_period: 'medium_term',
    },
  } as SpotifyConfig,
  
  /**
   * Fetches plugin data
   */
  fetchData: async (config: SpotifyConfig, dev = false, essentialConfig) => {
    return await fetchSpotifyData(config, dev, essentialConfig) as PluginData & SpotifyData
  },
  
  /**
   * Renders the plugin
   */
  render: (config: SpotifyConfig, data: PluginData & SpotifyData) => {
    // Extract style and size from config (comes from SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    
    return (
      <RenderSpotify
        config={config}
        data={data as SpotifyData}
        style={style}
        size={size}
      />
    )
  },
}

export default spotifyPlugin
