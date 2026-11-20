/**
 * Chess plugin types (Lichess and Chess.com)
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

export type ChessPlatform = "lichess" | "chesscom"

/**
 * The rows of the ratings section. `daily` is Chess.com's daily chess and Lichess'
 * correspondence; `classical` exists only on Lichess.
 */
export type ChessControl = "bullet" | "blitz" | "rapid" | "classical" | "daily" | "puzzle"

export type ChessResult = "win" | "draw" | "loss"

export interface ChessRecord {
  win: number
  draw: number
  loss: number
}

export interface ChessRating {
  control: ChessControl
  /** Current rating. Chess.com has none for puzzles, only the highest. */
  rating?: number
  /** Highest rating ever. Lichess has none for puzzles. */
  best?: number
  /** Games (puzzles: puzzles solved on Lichess, unknown on Chess.com). */
  games?: number
  /** Lichess marks a rating with few games as provisional (shown with a `?`). */
  provisional?: boolean
}

export interface ChessGame {
  url: string
  /** ISO 8601, when the game ended. */
  date: string
  /** bullet, blitz, rapid, classical, daily, correspondence, ultraBullet... as the site names it. */
  control: string
  result: ChessResult
  color: "white" | "black"
  opponent: {
    name: string
    title?: string
    rating?: number
  }
}

export interface ChessProfile {
  /** Real name, when the player shows one. */
  name?: string
  /** GM, IM, FM, CM, NM, WGM... and Lichess' BOT / LM. */
  title?: string
  /** Data URI (Chess.com only: Lichess has no avatars). */
  avatar?: string
  /** ISO 3166 alpha-2 as the site gives it, or a site code (Lichess `_earth`, Chess.com `XX`). */
  country?: string
  /** ISO 8601. */
  joined?: string
  /** Chess.com only: Lichess stopped exposing follower counts. */
  followers?: number
  /** Lichess only: seconds spent playing. */
  playTimeSeconds?: number
}

export interface ChessNonEssentialConfig extends NonEssentialPluginConfig {
  profile_title?: string
  profile_hide_title?: boolean
  ratings_title?: string
  ratings_hide_title?: boolean
  ratings_show_best?: boolean
  ratings_show_puzzles?: boolean
  ratings_show_unplayed?: boolean
  results_title?: string
  results_hide_title?: boolean
  recent_games_title?: string
  recent_games_hide_title?: boolean
  recent_games_max?: number
}

export interface ChessConfig extends BasePluginConfig {
  /** A profile link, `lichess:<name>` or `chess.com:<name>` (services/identity.ts). */
  username?: string
  nonEssential?: ChessNonEssentialConfig
  [key: string]: unknown
}

export interface ChessData {
  platform: ChessPlatform
  /** As the site spells it. */
  username: string
  profileUrl: string
  profile: ChessProfile
  /** In ChessControl order, only the controls the site has. */
  ratings: ChessRating[]
  /** Summed over the standard time controls (bullet, blitz, rapid, classical, daily). */
  results: ChessRecord
  /** Newest first. */
  recentGames: ChessGame[]
}
