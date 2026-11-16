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
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const cfData = data as CodeforcesData
    const isTerminal = (config as { style?: string }).style === "terminal"

    let h = 0
    for (const s of config.sections) {
      if (s === "rating_rank") {
        h += isTerminal ? 64 : 76
      } else if (s === "contests_participated") {
        h += isTerminal ? 44 : 80
      } else if (s === "problems_solved") {
        const byDifficulty = cfData.problemsSolved?.byDifficulty ?? {}
        const n = Object.values(byDifficulty).filter((count) => (count ?? 0) > 0).length
        // Measured in Chromium. Terminal: the command and the total take 44px, and each
        // difficulty is a 20px line. Default: the title and the total take 76px, and each
        // grid row is a 20px line plus an 8px gap; with no difficulty there is no grid.
        if (isTerminal) {
          h += 44 + n * 20
        } else {
          const rows = Math.ceil(n / DIFFICULTY_COLUMNS[size === "full" ? "full" : "half"])
          h += 76 + rows * 28
        }
      } else if (s === "recent_submissions") {
        const max = ne.recent_submissions_max ?? 5
        const n = Math.min(cfData.recentSubmissions?.length ?? max, max)
        if (n === 0) continue
        h += isTerminal ? 24 + n * 16 : 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 + 8
      }
    }
    return h
  },
}

export default codeforcesPlugin
