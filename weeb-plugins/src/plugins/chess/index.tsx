/**
 * Chess Plugin (Lichess and Chess.com)
 *
 * Inspired by the community/chess plugin of lowlighter/metrics (MIT, Copyright (c)
 * 2020-present lowlighter), which animated the last Lichess game. This one is a stats
 * card for either site: profile, ratings, results and recent games.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { ChessConfig, ChessData } from "./types"
import { RenderChess } from "./components/RenderChess"
import { PROFILE_HEADER_HEIGHT } from "./components/Profile"
import { RATING_ROW_GAP, RATING_ROW_HEIGHT } from "./components/Ratings"
import { RECENT_ROW_GAP, RECENT_ROW_HEIGHT, RECENT_TERMINAL_LINE_HEIGHT } from "./components/RecentGames"
import { RESULTS_HEIGHT, RESULTS_TERMINAL_LINES } from "./components/Results"
import { hiddenTitle, profileLines, resultsTotal, shownRatings, shownRecentGames } from "./components/shown"
import { fetchChessData } from "./services/fetchData"

/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND_HEIGHT = 24
/** TerminalLineWithDots. */
const TERMINAL_LINE_HEIGHT = 20

export const chessPlugin: Plugin<ChessConfig, PluginData & ChessData> = {
  name: "chess",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as ChessConfig,
  fetchData: async (config: ChessConfig, dev = false, _essentialConfig, previewMode = false) => {
    return (await fetchChessData(config, dev, previewMode)) as PluginData & ChessData
  },
  render: (config: ChessConfig, data: PluginData & ChessData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderChess config={config} data={data as ChessData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const chess = data as ChessData
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it.
    const title = (hidden: unknown): number => (hiddenTitle(hidden) ? 0 : 40 + (size === "full" ? 12 : 10))
    const terminal = (lines: number, lineHeight = TERMINAL_LINE_HEIGHT): number =>
      TERMINAL_COMMAND_HEIGHT + lines * lineHeight

    let h = 0
    for (const s of config.sections) {
      if (s === "profile") {
        if (!chess?.profile) continue
        h += isTerminal ? terminal(profileLines(chess).length) : title(ne.profile_hide_title) + PROFILE_HEADER_HEIGHT
      } else if (s === "ratings") {
        const n = shownRatings(chess, config).length
        if (n === 0) continue
        h += isTerminal ? terminal(n) : title(ne.ratings_hide_title) + n * RATING_ROW_HEIGHT + (n - 1) * RATING_ROW_GAP
      } else if (s === "results") {
        if (resultsTotal(chess) === 0) continue
        h += isTerminal ? terminal(RESULTS_TERMINAL_LINES) : title(ne.results_hide_title) + RESULTS_HEIGHT
      } else if (s === "recent_games") {
        const n = shownRecentGames(chess, config).length
        if (n === 0) continue
        h += isTerminal
          ? terminal(n, RECENT_TERMINAL_LINE_HEIGHT)
          : title(ne.recent_games_hide_title) + n * RECENT_ROW_HEIGHT + (n - 1) * RECENT_ROW_GAP
      }
    }
    return h
  },
}

export default chessPlugin
