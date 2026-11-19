/**
 * Codeforces Plugin
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { CodeforcesConfig, CodeforcesData } from "./types"
import { RenderCodeforces } from "./components/RenderCodeforces"
import { DIFFICULTY_COLUMNS } from "./components/ProblemsSolved"
import { fetchCodeforcesData } from "./services/fetchData"

export const codeforcesPlugin: Plugin<CodeforcesConfig, PluginData & CodeforcesData> = {
  name: "codeforces",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as CodeforcesConfig,
  fetchData: async (config: CodeforcesConfig, dev = false) => {
    return (await fetchCodeforcesData(config, dev)) as PluginData & CodeforcesData
  },
  render: (config: CodeforcesConfig, data: PluginData & CodeforcesData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderCodeforces config={config} data={data as CodeforcesData} style={style} size={size} />
  },
  /**
   * Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
   * `section-heights.test.ts` pins it. Until then the default style counted the title and its
   * gap as 52px whether the title was shown or not (52px of blank space with it hidden, 2px
   * in half where the gap is 10px), and recent submissions 8px of padding that is not drawn.
   */
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const cfData = data as CodeforcesData
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40 + (size === "full" ? 12 : 10))

    let h = 0
    for (const s of config.sections) {
      if (s === "rating_rank") {
        // The rank and rating row: text-base lines beside icons.
        h += isTerminal ? 64 : title(ne.rating_rank_hide_title) + 24
      } else if (s === "contests_participated") {
        // A text-lg line.
        h += isTerminal ? 44 : title(ne.contests_participated_hide_title) + 28
      } else if (s === "problems_solved") {
        const byDifficulty = cfData.problemsSolved?.byDifficulty ?? {}
        const n = Object.values(byDifficulty).filter((count) => (count ?? 0) > 0).length
        // Terminal: the command and the total take 44px, and each difficulty is a 20px
        // line. Default: the total is a 24px line, and each grid row is a 20px line plus
        // an 8px gap; with no difficulty there is no grid.
        if (isTerminal) {
          h += 44 + n * 20
        } else {
          const rows = Math.ceil(n / DIFFICULTY_COLUMNS[size === "full" ? "full" : "half"])
          h += title(ne.problems_solved_hide_title) + 24 + rows * 28
        }
      } else if (s === "recent_submissions") {
        const max = ne.recent_submissions_max ?? 5
        const n = Math.min(cfData.recentSubmissions?.length ?? max, max)
        if (n === 0) continue
        // Default: 50px rows, `gap-1`.
        h += isTerminal ? 24 + n * 16 : title(ne.recent_submissions_hide_title) + n * 50 + (n - 1) * 4
      }
    }
    return h
  },
}

export default codeforcesPlugin
