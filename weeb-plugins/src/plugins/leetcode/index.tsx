/**
 * LeetCode Plugin
 *
 * Ported from the leetcode plugin of lowlighter/metrics (MIT, Copyright (c) 2020-present
 * lowlighter): the same sections and options, reimplemented on our templates.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginData } from "../../types/index"
import type { LeetCodeConfig, LeetCodeData } from "./types"
import { RenderLeetCode } from "./components/RenderLeetCode"
import { BAR_ROW_HEIGHT, DEFAULT_BAR_ROW_GAP } from "./components/CountBars"
import { RECENT_ROW_GAP, RECENT_ROW_HEIGHT, RECENT_TERMINAL_LINE_HEIGHT } from "./components/Recent"
import { SOLVED_ROW_GAP, SOLVED_ROW_HEIGHT, SOLVED_TOTAL_HEIGHT } from "./components/Solved"
import { hiddenTitle, shownLanguages, shownRecent, shownSkills } from "./components/shown"
import { fetchLeetCodeData } from "./services/fetchData"

/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND_HEIGHT = 24
/** TerminalLineWithDots. */
const TERMINAL_LINE_HEIGHT = 20

export const leetcodePlugin: Plugin<LeetCodeConfig, PluginData & LeetCodeData> = {
  name: "leetcode",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as LeetCodeConfig,
  fetchData: async (config: LeetCodeConfig, dev = false) => {
    return (await fetchLeetCodeData(config, dev)) as PluginData & LeetCodeData
  },
  render: (config: LeetCodeConfig, data: PluginData & LeetCodeData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderLeetCode config={config} data={data as LeetCodeData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => {
    const ne = config.nonEssential || {}
    const lcData = data as LeetCodeData
    const isTerminal = (config as { style?: string }).style === "terminal"
    // DefaultTitle (28px plus `my-1.5`) and the `gap-2.5`/`gap-3` after it.
    const title = (hidden: unknown): number => (hiddenTitle(hidden) ? 0 : 40 + (size === "full" ? 12 : 10))
    const bars = (n: number): number => n * BAR_ROW_HEIGHT + (n - 1) * DEFAULT_BAR_ROW_GAP

    let h = 0
    for (const s of config.sections) {
      if (s === "solved") {
        const rows = lcData?.solved?.byDifficulty?.length ?? 3
        h += isTerminal
          ? TERMINAL_COMMAND_HEIGHT + (rows + 1) * TERMINAL_LINE_HEIGHT
          : title(ne.solved_hide_title) + SOLVED_TOTAL_HEIGHT + rows * (SOLVED_ROW_HEIGHT + SOLVED_ROW_GAP)
      } else if (s === "skills") {
        const n = shownSkills(lcData, config).length
        if (n === 0) continue
        h += isTerminal ? TERMINAL_COMMAND_HEIGHT + n * BAR_ROW_HEIGHT : title(ne.skills_hide_title) + bars(n)
      } else if (s === "languages") {
        const n = shownLanguages(lcData, config).length
        if (n === 0) continue
        h += isTerminal ? TERMINAL_COMMAND_HEIGHT + n * BAR_ROW_HEIGHT : title(ne.languages_hide_title) + bars(n)
      } else if (s === "recent") {
        const n = shownRecent(lcData, config).length
        if (n === 0) continue
        h += isTerminal
          ? TERMINAL_COMMAND_HEIGHT + n * RECENT_TERMINAL_LINE_HEIGHT
          : title(ne.recent_hide_title) + n * RECENT_ROW_HEIGHT + (n - 1) * RECENT_ROW_GAP
      }
    }
    return h
  },
}

export default leetcodePlugin
