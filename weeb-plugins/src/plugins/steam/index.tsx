/**
 * Steam Plugin V2
 *
 * Plugin para exibir estatísticas de jogos do Steam
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import type { SteamConfig, SteamData } from "./types"
import { RenderSteam } from "./components/RenderSteam"
import { fetchSteamData } from "./services/fetchData"

/** The card minus the section's 8px side padding. */
const CONTENT_WIDTH = { half: 415 - 16, full: 830 - 16 }

export const steamPlugin: Plugin<PluginConfig & SteamConfig, PluginData & SteamData> = {
  name: "steam",
  // apiKey is deliberately absent: the Steam Web API key identifies the caller,
  // not the account being read, so any valid key can fetch any public profile.
  // Asking each user for theirs requested a credential that was both stronger
  // than needed -- it can administer that account's game server tokens -- and
  // not needed per-user. The generator supplies its own via app-credentials.ts.
  essentialConfigKeys: ["steamId"],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & SteamConfig,
  fetchData: async (
    config: PluginConfig & SteamConfig,
    dev = false,
    essentialConfig?: EssentialPluginConfig,
    previewMode = false
  ) => {
    const apiKey = essentialConfig?.apiKey
    const steamId = essentialConfig?.steamId
    return (await fetchSteamData(config as SteamConfig, dev, apiKey, steamId, previewMode)) as PluginData & SteamData
  },
  render: (config: PluginConfig & SteamConfig, data: PluginData & SteamData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderSteam config={config as SteamConfig} data={data as SteamData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => {
    const ne = (config as SteamConfig).nonEssential || {}
    const steamData = data as SteamData
    const isTerminal = (config as { style?: string }).style === "terminal"
    const itemH = size === "half" ? 70 : 80
    const gapH = size === "half" ? 10 : 12

    // TerminalGrid: TerminalCommand + grid header + n rows. The `.terminal-body` around the
    // sections adds its 8px `padding-bottom` once, below (it was counted once per section
    // until 11/2026: 16px of blank space under a terminal card with all three).
    const terminalGridH = (n: number): number => (n > 0 ? 44 + n * 20 : 0)

    // A games section in the default style: the title and the games, `gapH` apart, in a
    // list of cards or a grid of covers (`compact`). Until 11/2026 the grid was counted
    // as the list (up to 202px of blank space), and a hidden title kept its gap (10/12px).
    const gamesH = (games: Array<{ header_image?: string }>, hideTitle?: boolean, display?: string): number => {
      const titleH = hideTitle ? 0 : 40 + gapH
      if (display !== "compact") return titleH + games.length * itemH + (games.length - 1) * gapH
      // Grid of 3 (half) or 4 columns; each cell a 16:9 cover, `gap-1.5`/`gap-2`, then the
      // name (11/12px leading-tight, mb-1) and the playtime (10/11px at the 1.6 line-height).
      const columns = size === "half" ? 3 : 4
      const cellW = (CONTENT_WIDTH[size] - (columns - 1) * gapH) / columns
      const coverH = (cellW * 9) / 16 + (size === "half" ? 6 : 8)
      const textH = size === "half" ? 13.75 + 4 + 16 : 15 + 4 + 17.6
      let gridH = 0
      for (let row = 0; row * columns < games.length; row++) {
        const cells = games.slice(row * columns, (row + 1) * columns)
        gridH += (row > 0 ? gapH : 0) + textH + (cells.some((g) => g.header_image) ? coverH : 0)
      }
      return Math.ceil(titleH + gridH)
    }

    let h = 0
    for (const s of config.sections) {
      if (s === "statistics") {
        if (!steamData.statistics) continue
        if (isTerminal) {
          const hasProfile = !!steamData.playerSummary
          const hasFavorite = !!steamData.statistics.favoriteGame
          const nLines = (hasProfile ? 1 : 0) + 3 + (hasFavorite ? 1 : 0)
          h += nLines * 28 - 16
        } else {
          const showFeatured = ne.statistics_show_featured !== false
          const hasProfile = !!steamData.playerSummary
          // The profile row is as tall as its name and status (text-base/text-lg plus a
          // text-xs line), taller than the 40/48px avatar; the two stat cards are 96/100px.
          // Counted as the avatar and 102px until 11/2026, with the featured game making up
          // the difference: hiding it left 4px of blank space in half, and a hidden title
          // kept its gap (10/12px).
          const profileH = size === "half" ? 42 : 50
          const cardsH = size === "half" ? 96 : 100
          // The featured game: the most played of the last two weeks, over its cover (102/120px)
          // or, without one, beside its icon (106/120px).
          const featured = [...(steamData.games ?? [])]
            .filter((g) => (g.playtime_2weeks || 0) > 0)
            .sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))[0]
          const featuredH = showFeatured && featured ? (size === "full" ? 120 : featured.header_image ? 102 : 106) : 0
          const blocks = [...(hasProfile ? [profileH] : []), cardsH, ...(featuredH > 0 ? [featuredH] : [])]
          const titleH = ne.statistics_hide_title ? 0 : 40 + gapH
          h += titleH + blocks.reduce((sum, b) => sum + b, 0) + (blocks.length - 1) * gapH
        }
      } else if (s === "recent_games") {
        const max = ne.recent_games_max ?? 5
        const recentGames = steamData.games?.filter((g) => (g.playtime_2weeks || 0) > 0).slice(0, max) ?? []
        const n = recentGames.length
        if (n === 0) continue
        if (isTerminal) {
          h += terminalGridH(n)
        } else {
          h += gamesH(recentGames, ne.recent_games_hide_title, ne.recent_games_style)
        }
      } else if (s === "top_games") {
        const max = ne.top_games_max ?? 5
        const topGames = steamData.games?.slice(0, max) ?? []
        const n = topGames.length
        if (n === 0) continue
        if (isTerminal) {
          h += terminalGridH(n)
        } else {
          h += gamesH(topGames, ne.top_games_hide_title, ne.top_games_style)
        }
      }
    }
    // The terminal body is drawn, with its padding, even when every section is empty.
    return isTerminal ? h + 8 : h
  },
}

export default steamPlugin
