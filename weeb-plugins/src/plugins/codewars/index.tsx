/**
 * Codewars Plugin
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { CodewarsConfig, CodewarsData } from "./types"
import { RenderCodewars } from "./components/RenderCodewars"
import { fetchCodewarsData } from "./services/fetchData"

export const codewarsPlugin: Plugin<CodewarsConfig, PluginData & CodewarsData> = {
  name: "codewars",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as CodewarsConfig,
  fetchData: async (config: CodewarsConfig, dev = false) => {
    return (await fetchCodewarsData(config, dev)) as PluginData & CodewarsData
  },
  render: (config: CodewarsConfig, data: PluginData & CodewarsData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderCodewars config={config} data={data as CodewarsData} style={style} size={size} />
  },
  /**
   * Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
   * `section-heights.test.ts` pins it. Until then the default style counted the title and its
   * gap as 52px whether the title was shown or not (up to 53px of blank space with it hidden,
   * 2px in half where the gap is 10px), the lists 8px of padding that is not drawn, and the
   * leaderboard 76px for the 100px it draws (24px cut) and 54px in the terminal for 44.
   */
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const cwData = data as CodewarsData
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40 + (size === "full" ? 12 : 10))
    // DefaultList: 50px rows, `gap-1`.
    const list = (n: number): number => n * 50 + (n - 1) * 4

    let h = 0
    for (const s of config.sections) {
      if (s === "rank_honor") {
        h += isTerminal ? 64 : title(ne.rank_honor_hide_title) + 24
      } else if (s === "completed_kata") {
        const max = ne.completed_kata_max ?? 5
        const n = Math.min(cwData.completedKata?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? 24 + n * 16 : title(ne.completed_kata_hide_title) + list(n)
      } else if (s === "languages_proficiency") {
        const max = ne.languages_proficiency_max ?? 5
        const n = Math.min(Object.keys(cwData.languages ?? {}).length, max)
        if (n === 0) continue
        h += isTerminal ? 24 + n * 16 : title(ne.languages_proficiency_hide_title) + list(n)
      } else if (s === "leaderboard_position") {
        // LeaderboardPosition returns <></> when there is no position, and that
        // early return sits above the style branch -- so neither style renders
        // anything. The terminal case used to reserve 32px anyway, which is dead
        // space on every card whose Codewars profile has no ranking.
        const hasPosition = !!cwData.leaderboardPosition
        if (!hasPosition) continue
        // The position (text-2xl) over its label.
        h += isTerminal ? 44 : title(ne.leaderboard_position_hide_title) + 48
      }
    }
    return h
  },
}

export default codewarsPlugin
