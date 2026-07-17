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

export const steamPlugin: Plugin<PluginConfig & SteamConfig, PluginData & SteamData> = {
  name: "steam",
  essentialConfigKeys: ["apiKey", "steamId"],
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

    // TerminalGrid: TerminalCommand + grid header + n rows
    const terminalGridH = (n: number): number => (n > 0 ? 84 + n * 20 : 0)

    let h = 0
    for (const s of config.sections) {
      if (s === "statistics") {
        if (!steamData.statistics) continue
        if (isTerminal) {
          const hasProfile = !!steamData.playerSummary
          const hasFavorite = !!steamData.statistics.favoriteGame
          const nLines = (hasProfile ? 1 : 0) + 3 + (hasFavorite ? 1 : 0)
          h += 24 + nLines * 28
        } else {
          const showFeatured = ne.statistics_show_featured !== false
          const hasProfile = !!steamData.playerSummary
          const avatarH = size === "half" ? 40 : 48
          const cardsH = 102
          const featuredH =
            showFeatured && steamData.games?.some((g) => (g.playtime_2weeks || 0) > 0)
              ? size === "half"
                ? 100
                : 120
              : 0
          const hideTitle = ne.statistics_hide_title || false
          const titleH = hideTitle ? 0 : 40
          const contentH = (hasProfile ? avatarH + gapH : 0) + cardsH + (featuredH > 0 ? gapH + featuredH : 0)
          h += titleH + gapH + contentH
        }
      } else if (s === "recent_games") {
        const max = ne.recent_games_max ?? 5
        const recentGames = steamData.games?.filter((g) => (g.playtime_2weeks || 0) > 0).slice(0, max) ?? []
        const n = recentGames.length
        if (n === 0) continue
        if (isTerminal) {
          h += terminalGridH(n)
        } else {
          const hideTitle = ne.recent_games_hide_title || false
          const titleH = hideTitle ? 0 : 40
          h += titleH + gapH + n * itemH + Math.max(0, n - 1) * gapH
        }
      } else if (s === "top_games") {
        const max = ne.top_games_max ?? 5
        const n = Math.min(steamData.games?.length ?? max, max)
        if (n === 0) continue
        if (isTerminal) {
          h += terminalGridH(n)
        } else {
          const hideTitle = ne.top_games_hide_title || false
          const titleH = hideTitle ? 0 : 40
          h += titleH + gapH + n * itemH + Math.max(0, n - 1) * gapH
        }
      }
    }
    return h
  },
}

export default steamPlugin
