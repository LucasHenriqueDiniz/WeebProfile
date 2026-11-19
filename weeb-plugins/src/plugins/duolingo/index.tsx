/**
 * Duolingo Plugin
 *
 * Plugin para exibir estatísticas do Duolingo
 *
 * WARNING: Uses unofficial API - may break if Duolingo changes their structure
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { DuolingoConfig, DuolingoData } from "./types"
import { RenderDuolingo } from "./components/RenderDuolingo"
import { fetchDuolingoData } from "./services/fetchData"

export const duolingoPlugin: Plugin<DuolingoConfig, PluginData & DuolingoData> = {
  name: "duolingo",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as DuolingoConfig,
  fetchData: async (config: DuolingoConfig, dev = false) => {
    return (await fetchDuolingoData(config, dev)) as PluginData & DuolingoData
  },
  render: (config: DuolingoConfig, data: PluginData & DuolingoData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderDuolingo config={config} data={data as DuolingoData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it. Until 11/2026
    // the streak counted 45px for it (5-7px cut) and total XP kept 52px with the title
    // hidden. Measured 18/11/2026, `section-heights.test.ts`.
    const title = (hidden: boolean): number => (hidden ? 0 : 40 + (size === "full" ? 12 : 10))

    let h = 0
    for (const s of config.sections) {
      if (s === "current_streak") {
        if (isTerminal) {
          h += 44
        } else {
          // hideTitle defaults to true for current_streak
          h += title(ne.current_streak_hide_title ?? true) + 112
        }
      } else if (s === "total_xp") {
        h += isTerminal ? 44 : title(ne.total_xp_hide_title ?? false) + 88
      } else if (s === "languages_learning") {
        const max = ne.languages_learning_max ?? 10
        const n = Math.min((data as DuolingoData).languages?.length ?? max, max)
        if (n === 0) continue
        // DefaultList: 50px rows, `gap-1`. Counted with 8px of padding that is not drawn and a
        // 45px title shown or hidden until 11/2026 (53px of blank space with it hidden).
        h += isTerminal ? 24 + n * 16 : title(ne.languages_learning_hide_title ?? false) + n * 50 + (n - 1) * 4
      }
    }
    return h
  },
}

export default duolingoPlugin
