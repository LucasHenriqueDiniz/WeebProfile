import type { GithubRepoConfig, GithubRepoData, TrafficPath, TrafficReferrer } from "./types"

/**
 * What the traffic section draws and how tall it is, at content size md. The component and
 * `calculateHeight` both read `trafficParts`, so they cannot disagree on what is on the card.
 *
 * Every line has a fixed `line-height` and every row a fixed height, and nothing wraps (long
 * referrers and paths are cut with an ellipsis): the height depends only on which parts are
 * on and how many rows each list has. The rows are spaced with margins, not `gap`, which
 * WebKit does not zoom (see `gapAt` in section-heights.ts).
 */

/** Rows a list shows at most: GitHub answers the top 10. */
export const TRAFFIC_MAX_ITEMS = 10
const DEFAULT_MAX_ITEMS = 5

export interface TrafficList {
  id: "referrers" | "paths"
  title: string
  rows: Array<{ label: string; count: number; uniques: number }>
}

export interface TrafficParts {
  showClones: boolean
  lists: TrafficList[]
}

const referrerRows = (list: TrafficReferrer[]) => list.map((r) => ({ label: r.referrer, ...r }))
// GitHub's title is the path inside the repository ("/issues"), or "Overview" for its home.
const pathRows = (list: TrafficPath[]) => list.map((p) => ({ label: p.title || p.path, ...p }))

export function trafficParts(cfg: GithubRepoConfig, repo: GithubRepoData): TrafficParts | null {
  const traffic = repo.traffic
  if (!traffic) return null
  const max = Math.max(1, Math.min(TRAFFIC_MAX_ITEMS, Math.round(cfg.traffic_max_items ?? DEFAULT_MAX_ITEMS)))
  const lists: TrafficList[] = []
  if (cfg.traffic_show_referrers && traffic.referrers) {
    lists.push({ id: "referrers", title: "Top referrers", rows: referrerRows(traffic.referrers).slice(0, max) })
  }
  if (cfg.traffic_show_paths && traffic.paths) {
    lists.push({ id: "paths", title: "Top paths", rows: pathRows(traffic.paths).slice(0, max) })
  }
  return { showClones: Boolean(cfg.traffic_show_clones && traffic.clones), lists }
}

/** In full, two lists sit side by side; in half, one under the other. */
export const listsSideBySide = (size: "half" | "full", parts: TrafficParts) => size === "full" && parts.lists.length > 1

// Default style -------------------------------------------------------------------------

/** `pt-4`, the 14px eyebrow, `mt-2`, the totals (22px number, `mt-1`, 14px label). */
const DEFAULT_HEAD = 16 + 14 + 8 + 22 + 4 + 14
/** `mt-3`, the 84px chart, `mt-1.5`, the 14px axis row. */
const DEFAULT_CHART = 12 + 84 + 6 + 14
/** `mt-3`, the 14px eyebrow, `mt-1.5`, the 32px clones strip. */
const DEFAULT_CLONES = 12 + 14 + 6 + 32
/** `mt-3`, the 14px eyebrow, `mt-1.5`. */
const DEFAULT_LIST_HEAD = 12 + 14 + 6
/** A 20px row, `mt-1` above all but the first. */
const DEFAULT_ROW = 20
const DEFAULT_ROW_GAP = 4
/** `pb-4`. */
const DEFAULT_BOTTOM = 16

// Terminal ------------------------------------------------------------------------------

/** The command (24), the 20px totals line in `py-1`. */
const TERMINAL_HEAD = 24 + 8 + 20
/** The 60px chart and the 16px axis row. */
const TERMINAL_CHART = 60 + 16
/** `mt-1`, the 16px label and the 24px clones strip. */
const TERMINAL_CLONES = 4 + 16 + 24
/** `mt-1` and the 16px header line. */
const TERMINAL_LIST_HEAD = 4 + 16
/** A 16px line a row. */
const TERMINAL_ROW = 16
/** `pb-1`. */
const TERMINAL_BOTTOM = 4

/** A list's rows: an empty list still draws one "none" row. */
const rowCount = (list: TrafficList) => Math.max(1, list.rows.length)

function listsHeight(parts: TrafficParts, size: "half" | "full", isTerminal: boolean): number {
  const one = (list: TrafficList) => {
    const rows = rowCount(list)
    return isTerminal
      ? TERMINAL_LIST_HEAD + rows * TERMINAL_ROW
      : DEFAULT_LIST_HEAD + rows * DEFAULT_ROW + (rows - 1) * DEFAULT_ROW_GAP
  }
  const heights = parts.lists.map(one)
  if (heights.length === 0) return 0
  return listsSideBySide(size, parts) ? Math.max(...heights) : heights.reduce((sum, h) => sum + h, 0)
}

/** The traffic section's height, terminal command included; 0 without traffic data. */
export function trafficHeight(
  cfg: GithubRepoConfig,
  repo: GithubRepoData,
  isTerminal: boolean,
  size: "half" | "full"
): number {
  const parts = trafficParts(cfg, repo)
  if (!parts) return 0
  if (isTerminal) {
    return (
      TERMINAL_HEAD +
      TERMINAL_CHART +
      (parts.showClones ? TERMINAL_CLONES : 0) +
      listsHeight(parts, size, true) +
      TERMINAL_BOTTOM
    )
  }
  return (
    DEFAULT_HEAD +
    DEFAULT_CHART +
    (parts.showClones ? DEFAULT_CLONES : 0) +
    listsHeight(parts, size, false) +
    DEFAULT_BOTTOM
  )
}
