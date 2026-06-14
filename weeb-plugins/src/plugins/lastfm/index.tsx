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
    const isTerminal = (config as { style?: string }).style === 'terminal'
    const gapH = size === 'half' ? 10 : 12

    // TerminalGrid: TerminalCommand + grid header + n rows
    const terminalGridH = (n: number): number => (n > 0 ? 84 + n * 20 : 0)
    // TerminalCommand + n TerminalLine rows
    const terminalListH = (n: number): number => (n > 0 ? 64 + n * 17 : 0)
    // TerminalTree: header + n items (title + value, plus subtitle row if present)
    const terminalTreeH = (n: number, hasSubtitle: boolean): number =>
      n > 0 ? 83 + n * (hasSubtitle ? 60 : 40) : 0
    // DefaultList: title (with interval subtitle) + n rows (50px, gap-1) + pb-2
    const defaultListH = (n: number): number => (n > 0 ? 40 + n * 50 + Math.max(0, n - 1) * 4 + 8 : 0)
    // DefaultImageGrid: title + rows of 100px (limited to multiples of 4) + pb-2
    const defaultImageGridH = (n: number): number => {
      const cols = size === 'half' ? 4 : 8
      const limited = Math.floor(n / 4) * 4
      const rows = limited > 0 ? Math.ceil(limited / cols) : 0
      return 40 + rows * 100 + Math.max(0, rows - 1) * 4 + 8
    }

    const topItemHeight = (n: number, displayStyle: string, isArtist: boolean, hasSubtitle: boolean): number => {
      if (n === 0) return 0
      if (isTerminal) {
        if (displayStyle === 'list') return terminalListH(n)
        if (displayStyle === 'grid') return terminalGridH(n)
        return terminalTreeH(n, hasSubtitle)
      }
      if (displayStyle === 'list') return defaultListH(n)
      if (displayStyle === 'grid') return defaultImageGridH(n)
      // 'default': uses DefaultGrid (fixed 2-row layout)
      // top_artists renders slightly taller than albums/tracks
      return isArtist ? 291 : 252
    }

    let h = 0
    for (const s of config.sections) {
      if (s === 'statistics') {
        const hasFeatured = !ne.statistics_hide_featured_track && !!lfmData.featuredTrack
        if (isTerminal) {
          h += 24 + 2 * 30 + (hasFeatured ? 58 : 0)
        } else {
          const hideTitle = ne.statistics_hide_title || false
          const titleH = hideTitle ? 0 : 40
          const cardsRowH = size === 'half' ? 72 : 80
          const featuredH = hasFeatured ? (size === 'half' ? 92 : 96) : 0
          h += titleH + gapH + cardsRowH + (hasFeatured ? gapH + featuredH : 0)
        }
      } else if (s === 'recent_tracks') {
        const max = ne.recent_tracks_max ?? 5
        const n = Math.min(lfmData.recentTracks?.length ?? max, max)
        h += isTerminal ? terminalListH(n) : defaultListH(n)
      } else if (s === 'top_artists') {
        const max = ne.top_artists_max ?? 5
        const n = Math.min(lfmData.topArtists?.length ?? max, max)
        h += topItemHeight(n, ne.top_artists_style ?? 'default', true, false)
      } else if (s === 'top_albums') {
        const max = ne.top_albums_max ?? 5
        const n = Math.min(lfmData.topAlbums?.length ?? max, max)
        h += topItemHeight(n, ne.top_albums_style ?? 'default', false, false)
      } else if (s === 'top_tracks') {
        const max = ne.top_tracks_max ?? 5
        const n = Math.min(lfmData.topTracks?.length ?? max, max)
        h += topItemHeight(n, ne.top_tracks_style ?? 'default', false, true)
      }
    }
    return h
  },
}

export default lastFmPlugin

