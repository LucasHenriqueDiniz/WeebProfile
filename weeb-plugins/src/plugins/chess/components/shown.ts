/**
 * What each chess section shows, shared by the components and calculateHeight so the
 * height counts the same rows the section draws.
 */

import type { ChessConfig, ChessControl, ChessData, ChessGame, ChessPlatform, ChessRating, ChessResult } from "../types"

export const DEFAULT_RECENT_GAMES_MAX = 5
export const MAX_RECENT_GAMES = 10

/** Win, draw and loss, on the bars and badges only: text stays in the theme. */
export const RESULT_COLOR: Record<ChessResult, string> = {
  win: "#3fb950",
  draw: "#8b949e",
  loss: "#f85149",
}

export const RESULT_LETTER: Record<ChessResult, string> = { win: "W", draw: "D", loss: "L" }

function options(config: ChessConfig) {
  return config.nonEssential ?? {}
}

/** Options can arrive as strings from older saved configs. */
function on(value: unknown): boolean {
  return value === true || value === "true"
}

export function hiddenTitle(value: unknown): boolean {
  return on(value)
}

function off(value: unknown): boolean {
  return value === false || value === "false"
}

export function controlLabel(control: ChessControl, platform: ChessPlatform): string {
  if (control === "daily") return platform === "lichess" ? "Correspondence" : "Daily"
  if (control === "puzzle") return "Puzzles"
  return control.charAt(0).toUpperCase() + control.slice(1)
}

export function showsBest(config: ChessConfig): boolean {
  return !off(options(config).ratings_show_best)
}

/**
 * A row needs a number to show: the current rating, the best when that column is on, or
 * games played (Lichess hides the rating of a control with few games: shown as `?`).
 * `ratings_show_unplayed` keeps the time controls never played, with dashes.
 */
export function shownRatings(data: Pick<ChessData, "ratings"> | undefined, config: ChessConfig): ChessRating[] {
  const ne = options(config)
  const best = showsBest(config)
  const unplayed = on(ne.ratings_show_unplayed)
  return (data?.ratings ?? []).filter((r) => {
    if (r.control === "puzzle" && off(ne.ratings_show_puzzles)) return false
    return unplayed || r.rating !== undefined || (best && r.best !== undefined) || (r.games ?? 0) > 0
  })
}

export function resultsTotal(data: Pick<ChessData, "results"> | undefined): number {
  const r = data?.results
  return r ? r.win + r.draw + r.loss : 0
}

export function shownRecentGames(data: Pick<ChessData, "recentGames"> | undefined, config: ChessConfig): ChessGame[] {
  const n = Number(options(config).recent_games_max)
  const max = Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), MAX_RECENT_GAMES) : DEFAULT_RECENT_GAMES_MAX
  return (data?.recentGames ?? []).slice(0, max)
}

/** A fixed format: the card is rendered on a server whose locale is not the reader's. */
export function formatDate(iso: string | undefined, withDay = true): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", {
    month: "short",
    ...(withDay ? { day: "numeric" } : {}),
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatPlayTime(seconds: number): string {
  // Down, as Lichess' "94 days, 3 hours" does.
  const hours = Math.floor(seconds / 3600)
  return `${hours.toLocaleString("en-US")} h`
}

export function siteName(platform: ChessPlatform): string {
  return platform === "lichess" ? "Lichess" : "Chess.com"
}

/** The terminal profile's lines: only the ones the account has. */
export function profileLines(data: ChessData): Array<[string, string]> {
  const p = data.profile
  const lines: Array<[string, string]> = [["Player", p.title ? `${p.title} ${data.username}` : data.username]]
  if (p.name) lines.push(["Name", p.name])
  lines.push(["Site", siteName(data.platform)])
  if (p.country) lines.push(["Country", p.country])
  if (p.joined) lines.push(["Joined", formatDate(p.joined, false)])
  if (p.followers !== undefined) lines.push(["Followers", p.followers.toLocaleString("en-US")])
  if (p.playTimeSeconds) lines.push(["Play time", formatPlayTime(p.playTimeSeconds)])
  return lines
}

/** Lichess prints a provisional rating with `?`, and a clueless one as `?` alone. */
export function currentRating(r: ChessRating): string {
  if (r.rating === undefined) return r.provisional ? "?" : "—"
  return `${r.rating}${r.provisional ? "?" : ""}`
}
