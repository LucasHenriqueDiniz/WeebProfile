/**
 * Heights of the WakaTime sections, in px, as the browsers lay them out. `section-heights.test.ts`
 * pins them against `audit:heights` (Chrome, Firefox and WebKit).
 *
 * The sections stack with no gap and draw no padding of their own (the GitHub plugin's terminal
 * sections carry the 8px `padding-bottom` of a `.terminal-body`; these do not).
 */

import { codingTimeStats } from "./components/CodingTime"
import { statsFor, usageFor } from "./components/RenderWakaTime"
import { keysOf, option } from "./format"
import type { WakaTimeConfig, WakaTimeData, WakaTimeUsageSection } from "./types"

/** DefaultTitle: 28px row plus `my-1.5`. */
const DEFAULT_TITLE = 40
/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND = 24
/** One terminal line (`line-height: 1.25rem`). */
const LINE = 20
/** The terminal bar's wrapper: 20px, fixed (the bar alone drew 19px in Chrome and Firefox, 18 in WebKit). */
const TERMINAL_BAR = 20
/** A default usage line: `text-base`, 24px. */
const DEFAULT_USAGE_LINE = 24
/** HorizontalMultipleItemsBar, `h-2.5`. */
const DEFAULT_BAR = 10
/** CodingTime's value (28px) and label (20px) lines. */
const DEFAULT_TIME_STAT = 28 + 20

const USAGE_SECTIONS = new Set<string>(["languages", "projects", "editors", "operating_systems"])

export function wakatimeHeight(config: WakaTimeConfig, data: WakaTimeData, _size: "half" | "full"): number {
  const isTerminal = (config as { style?: string }).style === "terminal"
  let h = 0

  for (const section of config.sections ?? []) {
    const stats = statsFor(config, data, section)
    if (!stats) continue
    const keys = keysOf(section)
    if (!keys) continue
    const title = option<boolean>(config, keys.hideTitle) ? 0 : DEFAULT_TITLE

    if (section === "time") {
      const rows = codingTimeStats(stats).length
      h += isTerminal ? TERMINAL_COMMAND + rows * LINE : title + DEFAULT_TIME_STAT
    } else if (USAGE_SECTIONS.has(section)) {
      const { items: shown, total } = usageFor(config, stats, section as WakaTimeUsageSection)
      const n = shown.length
      if (n === 0 || total <= 0) continue
      // The bar, then one line per item, `gap-1` apart.
      h += isTerminal
        ? TERMINAL_COMMAND + TERMINAL_BAR + n * (4 + LINE)
        : title + DEFAULT_BAR + n * (4 + DEFAULT_USAGE_LINE)
    }
  }
  return h
}
