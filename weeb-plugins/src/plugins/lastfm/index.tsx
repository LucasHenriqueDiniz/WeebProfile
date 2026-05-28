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
  fetchData: async (config: LastFmConfig, dev = false, essentialConfig?, previewMode = false) => {
    return await fetchLastFmData(config, dev, essentialConfig, previewMode) as PluginData & LastFmData
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

  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const lfmData = data as LastFmData

    const topItemHeight = (n: number, displayStyle: string, isArtist: boolean): number => {
      if (displayStyle === 'list') {
        return n > 0 ? 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 : 0
      }
      if (displayStyle === 'grid') {
        // DefaultImageGrid: items rounded to nearest multiple of cols
        const cols = size === 'half' ? 4 : 8
        const limited = Math.floor(n / 4) * 4  // always rounds to multiple of 4
        const rows = limited > 0 ? Math.ceil(limited / cols) : 0
        const gridH = rows > 0 ? rows * 100 + (rows - 1) * 4 : 0
        return gridH > 0 ? 33 + 12 + gridH + 8 : 0  // +8 for pb-2
      }
      // 'default': uses DefaultGrid (always 2 rows = 204px)
      // top_artists has interval subtitle which makes it slightly taller
      return isArtist ? 281 : 247
    }

    let h = 0
    for (const s of config.sections) {
      if (s === 'statistics') {
        h += 209
      } else if (s === 'recent_tracks') {
        const max = ne.recent_tracks_max ?? 5
        const n = Math.min(lfmData.recentTracks?.length ?? max, max)
        h += n > 0 ? 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 : 0
      } else if (s === 'top_artists') {
        const max = ne.top_artists_max ?? 5
        const n = Math.min(lfmData.topArtists?.length ?? max, max)
        h += topItemHeight(n, ne.top_artists_style ?? 'default', true)
      } else if (s === 'top_albums') {
        const max = ne.top_albums_max ?? 5
        const n = Math.min(lfmData.topAlbums?.length ?? max, max)
        h += topItemHeight(n, ne.top_albums_style ?? 'default', false)
      } else if (s === 'top_tracks') {
        const max = ne.top_tracks_max ?? 5
        const n = Math.min(lfmData.topTracks?.length ?? max, max)
        h += topItemHeight(n, ne.top_tracks_style ?? 'default', false)
      }
    }
    return h
  },
}

export default lastFmPlugin

