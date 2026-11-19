/**
 * Stack Overflow Plugin
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { StackOverflowConfig, StackOverflowData } from "./types"
import { RenderStackOverflow } from "./components/RenderStackOverflow"
import { fetchStackOverflowData } from "./services/fetchData"

export const stackoverflowPlugin: Plugin<StackOverflowConfig, PluginData & StackOverflowData> = {
  name: "stackoverflow",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    userId: "",
  } as StackOverflowConfig,
  fetchData: async (config: StackOverflowConfig, dev = false) => {
    return (await fetchStackOverflowData(config, dev)) as PluginData & StackOverflowData
  },
  render: (config: StackOverflowConfig, data: PluginData & StackOverflowData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderStackOverflow config={config} data={data as StackOverflowData} style={style} size={size} />
  },
  /**
   * Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
   * `section-heights.test.ts` pins it. Until then the default style counted the title and its
   * gap as 52px whether the title was shown or not (up to 53px of blank space with it hidden,
   * 2px in half where the gap is 10px), the tags list 8px of padding that is not drawn, and the
   * terminal answers a questions line that hide_questions takes away (20px).
   */
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40 + (size === "full" ? 12 : 10))

    let h = 0
    for (const s of config.sections) {
      if (s === "reputation") {
        h += isTerminal ? 44 : title(ne.reputation_hide_title) + 28
      } else if (s === "badges") {
        h += isTerminal ? 104 : title(ne.badges_hide_title) + 56
      } else if (s === "answers_questions") {
        h += isTerminal
          ? 24 + (ne.answers_questions_hide_questions ? 1 : 2) * 20
          : title(ne.answers_questions_hide_title) + 28
      } else if (s === "tags_expertise") {
        const max = ne.tags_expertise_max ?? 5
        const n = Math.min((data as StackOverflowData).topTags?.length ?? max, max)
        if (n === 0) continue
        // DefaultList: 50px rows, `gap-1`.
        h += isTerminal ? 24 + n * 16 : title(ne.tags_expertise_hide_title) + n * 50 + (n - 1) * 4
      }
    }
    return h
  },
}

export default stackoverflowPlugin
