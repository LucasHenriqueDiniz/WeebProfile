/**
 * Plugin to show LastFM music statistics using the official API
 *
 * Essential configurations required:
 * - apiKey: LastFM API key (required)
 * - username: LastFM username (required, can be obtained via API or provided)
 */

import React from "react"
import { DEFAULT_GRID_HEIGHT } from "../../templates/Default/DefaultGrid"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { LastFmConfig, LastFmData } from "./types"
import { RenderLastFm } from "./components/RenderLastFm"
import { fetchLastFmData } from "./services/fetchLastFm"

/**
 * DefaultGrid, the `default` style of the top sections, without its title: two 100px rows and
 * their 4px gap (the first item spans both), and the 8px under it. Fixed whatever the items
 * and their images. Until 11/2026 the image of the first item sized the grid, and this was
 * the mock's: 35px of blank space under a square artist photo, a portrait one cut the card.
 */
const DEFAULT_GRID_SECTION_HEIGHT = DEFAULT_GRID_HEIGHT + 8

export const lastFmPlugin: Plugin<LastFmConfig, PluginData & LastFmData> = {
  name: "lastfm",

  // Essential configuration keys that this plugin requires (required to fetch data)
  essentialConfigKeys: ["apiKey", "username"],

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
    return (await fetchLastFmData(config, dev, essentialConfig, previewMode)) as PluginData & LastFmData
  },

  /**
   * Renders the plugin
   */
  render: (config: LastFmConfig, data: PluginData & LastFmData) => {
    // Extract style and size from config (comes from SvgConfig)
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"

    return <RenderLastFm config={config} data={data as LastFmData} style={style} size={size} />
  },

  /**
   * Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
   * `section-heights.test.ts` pins it. Until then a hidden title still counted 40px (and the
   * statistics' gap after it), the terminal counted its body's 8px padding once per section
   * (32px of blank space under a terminal card with all five) and 17px a TerminalList line
   * for 16, the terminal statistics 52px without the featured track for 72 (20px cut), and
   * the `default` grid a fixed height whatever the number of items.
   */
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const lfmData = data as LastFmData
    const isTerminal = (config as { style?: string }).style === "terminal"
    const gapH = size === "half" ? 10 : 12
    // DefaultTitle, with the interval as its subtitle: 40px, no gap of its own after it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40)

    // Terminal heights leave out the `.terminal-body` padding, added once at the end.
    // TerminalGrid: TerminalCommand + grid header + n rows
    const terminalGridH = (n: number): number => (n > 0 ? 44 + n * 20 : 0)
    // TerminalCommand + n TerminalLine rows (`sm-text`, 16px)
    const terminalListH = (n: number): number => (n > 0 ? 24 + n * 16 : 0)
    // TerminalTree: header + n items (title + value, plus subtitle row if present)
    const terminalTreeH = (n: number, hasSubtitle: boolean): number => (n > 0 ? 43 + n * (hasSubtitle ? 60 : 40) : 0)
    // DefaultList: n rows (50px, gap-1) + pb-2
    const defaultListH = (n: number): number => (n > 0 ? n * 50 + Math.max(0, n - 1) * 4 + 8 : 0)
    // DefaultImageGrid: rows of 100px (limited to multiples of 4) + pb-2
    const defaultImageGridH = (n: number): number => {
      const cols = size === "half" ? 4 : 8
      const limited = Math.floor(n / 4) * 4
      const rows = limited > 0 ? Math.ceil(limited / cols) : 0
      return rows * 100 + Math.max(0, rows - 1) * 4 + 8
    }

    const topItemHeight = (
      n: number,
      displayStyle: string,
      hasSubtitle: boolean,
      hideTitle: boolean | undefined
    ): number => {
      if (n === 0) return 0
      if (isTerminal) {
        if (displayStyle === "list") return terminalListH(n)
        if (displayStyle === "grid") return terminalGridH(n)
        return terminalTreeH(n, hasSubtitle)
      }
      if (displayStyle === "list") return title(hideTitle) + defaultListH(n)
      if (displayStyle === "grid") return title(hideTitle) + defaultImageGridH(n)
      return title(hideTitle) + DEFAULT_GRID_SECTION_HEIGHT
    }

    let h = 0
    for (const s of config.sections) {
      if (s === "statistics") {
        const hasFeatured = !ne.statistics_hide_featured_track && !!lfmData.featuredTrack
        if (isTerminal) {
          // TerminalCommand, two TerminalLineWithDots and the featured track.
          h += 64 + (hasFeatured ? 38 : 0)
        } else {
          const titleH = ne.statistics_hide_title ? 0 : 40 + gapH
          const cardsRowH = size === "half" ? 72 : 74
          const featuredH = hasFeatured ? (size === "half" ? 92 : 98) : 0
          h += titleH + cardsRowH + (hasFeatured ? gapH + featuredH : 0)
        }
      } else if (s === "recent_tracks") {
        const max = ne.recent_tracks_max ?? 5
        const n = Math.min(lfmData.recentTracks?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? terminalListH(n) : title(ne.recent_tracks_hide_title) + defaultListH(n)
      } else if (s === "top_artists") {
        const max = ne.top_artists_max ?? 5
        const n = Math.min(lfmData.topArtists?.length ?? max, max)
        h += topItemHeight(n, ne.top_artists_style ?? "default", false, ne.top_artists_hide_title)
      } else if (s === "top_albums") {
        const max = ne.top_albums_max ?? 5
        const n = Math.min(lfmData.topAlbums?.length ?? max, max)
        h += topItemHeight(n, ne.top_albums_style ?? "default", false, ne.top_albums_hide_title)
      } else if (s === "top_tracks") {
        const max = ne.top_tracks_max ?? 5
        const n = Math.min(lfmData.topTracks?.length ?? max, max)
        h += topItemHeight(n, ne.top_tracks_style ?? "default", true, ne.top_tracks_hide_title)
      }
    }
    // The terminal body and its padding are drawn once around all the sections.
    return isTerminal && config.sections.length > 0 ? h + 8 : h
  },
}

export default lastFmPlugin
