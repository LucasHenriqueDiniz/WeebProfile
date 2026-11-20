/**
 * Chess.com, from its Published-Data API (https://www.chess.com/news/view/published-data-api,
 * no key).
 *
 * The API refreshes these endpoints at most every 12 to 24 hours, about as often as the
 * cron regenerates a card. It answers 403 to a request without a User-Agent (fetchJson
 * sends ours) and may answer 429 to parallel requests, so the calls below are
 * sequential. Measured from a Worker on this account on 19/11/2026: 12 of 12 calls with
 * the User-Agent answered 200 (profile, stats, archives, a month of games, the avatar).
 */

import type { ChessControl, ChessData, ChessGame, ChessRating, ChessRecord, ChessResult } from "../types"
import { ApiError } from "../../shared/utils/errors"
import { fetchJson } from "../../shared/utils/api"
import { embedImageOrNull } from "../../../utils/image-to-base64"
import { profileUrl } from "./identity"

export const CHESSCOM_API = "https://api.chess.com/pub/player"

/** Chess.com's stats keys for our rows. It has no classical: long games are rapid. */
const STATS_KEY: Partial<Record<ChessControl, string>> = {
  bullet: "chess_bullet",
  blitz: "chess_blitz",
  rapid: "chess_rapid",
  daily: "chess_daily",
}

export const CHESSCOM_CONTROLS: ChessControl[] = ["bullet", "blitz", "rapid", "daily"]

/** Avatars are 200x200 PNG or JPEG, 4-17 KB on the accounts measured. */
const AVATAR_MAX_BYTES = 200_000

/**
 * A month of games is one file, 1.5 MB for 18 days of Hikaru's. The current month
 * can be short or empty, so the one before is read too when needed, never more.
 */
const MAX_MONTHS = 2

interface ChessComProfile {
  username: string
  name?: string
  title?: string
  avatar?: string
  country?: string
  joined?: number
  followers?: number
  status?: string
  url?: string
}

interface ChessComStat {
  last?: { rating?: number }
  best?: { rating?: number }
  record?: { win?: number; loss?: number; draw?: number }
}

type ChessComStats = Partial<Record<string, ChessComStat>> & {
  tactics?: { highest?: { rating?: number } }
}

interface ChessComGameSide {
  username: string
  rating?: number
  result: string
}

interface ChessComGame {
  url: string
  end_time: number
  time_class?: string
  white: ChessComGameSide
  black: ChessComGameSide
}

/**
 * Result codes from the API documentation. The table does not say which side each code
 * is on; these are the draws by the rules of chess. Every other code than `win` is how
 * the game was lost (checkmated, resigned, timeout, abandoned...).
 */
const DRAWS = new Set(["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"])

export class ChessComUserNotFound extends Error {}

function resultOf(code: string): ChessResult {
  if (code === "win") return "win"
  return DRAWS.has(code) ? "draw" : "loss"
}

export function toChessComGame(game: ChessComGame, username: string): ChessGame {
  const color = game.white.username.toLowerCase() === username ? "white" : "black"
  const side = game[color]
  const opponent = game[color === "white" ? "black" : "white"]
  return {
    url: game.url,
    date: new Date(game.end_time * 1000).toISOString(),
    control: game.time_class ?? "",
    result: resultOf(side.result),
    color,
    opponent: { name: opponent.username, ...(opponent.rating ? { rating: opponent.rating } : {}) },
  }
}

/** A 404 here means "nothing to show", not "no such user": the profile was already read. */
async function orNullOn404<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null
    throw error
  }
}

async function recentGames(username: string, limit: number): Promise<ChessGame[]> {
  const archives = await orNullOn404(fetchJson<{ archives?: string[] }>(`${CHESSCOM_API}/${username}/games/archives`))
  const months = (archives?.archives ?? []).slice(-MAX_MONTHS).reverse()
  const games: ChessGame[] = []
  for (const month of months) {
    if (!month.startsWith(`${CHESSCOM_API}/`)) continue
    const answer = await fetchJson<{ games?: ChessComGame[] }>(month)
    // Each month is oldest first.
    const newest = (answer.games ?? []).slice(-(limit - games.length)).reverse()
    games.push(...newest.map((game) => toChessComGame(game, username)))
    if (games.length >= limit) break
  }
  return games
}

export async function fetchChessCom(
  username: string,
  sections: string[],
  options: { recentLimit: number; previewMode?: boolean }
): Promise<ChessData> {
  // The API answers 301 to a name with capitals.
  const name = username.toLowerCase()

  let profile: ChessComProfile
  try {
    profile = await fetchJson<ChessComProfile>(`${CHESSCOM_API}/${name}`)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) throw new ChessComUserNotFound(username)
    throw error
  }
  if (profile.status?.startsWith("closed")) throw new ChessComUserNotFound(username)

  // Some accounts answer the profile and 404 on the stats and games ("Data provider not
  // found", magnuscarlsen on 19/11/2026): the card then shows the profile alone.
  const wantsStats = sections.includes("ratings") || sections.includes("results")
  const stats = wantsStats ? await orNullOn404(fetchJson<ChessComStats>(`${CHESSCOM_API}/${name}/stats`)) : null

  const ratings: ChessRating[] = CHESSCOM_CONTROLS.map((control) => {
    const stat = stats?.[STATS_KEY[control]!]
    const record = stat?.record
    const games = (record?.win ?? 0) + (record?.draw ?? 0) + (record?.loss ?? 0)
    return {
      control,
      games,
      ...(stat?.last?.rating ? { rating: stat.last.rating } : {}),
      ...(stat?.best?.rating ? { best: stat.best.rating } : {}),
    }
  })
  const tactics = stats?.tactics?.highest?.rating
  ratings.push({ control: "puzzle", ...(tactics ? { best: tactics } : {}) })

  const results: ChessRecord = { win: 0, draw: 0, loss: 0 }
  for (const control of CHESSCOM_CONTROLS) {
    const record = stats?.[STATS_KEY[control]!]?.record
    results.win += record?.win ?? 0
    results.draw += record?.draw ?? 0
    results.loss += record?.loss ?? 0
  }

  const games = sections.includes("recent_games") ? await recentGames(name, options.recentLimit) : []

  // previewMode keeps the URL, as the other plugins do: the dashboard's preview loads it.
  const avatar = !sections.includes("profile")
    ? null
    : options.previewMode
      ? (profile.avatar ?? null)
      : await embedImageOrNull(profile.avatar, { maxBytes: AVATAR_MAX_BYTES, context: "chess/avatar" })

  const country = profile.country?.split("/").pop()

  return {
    platform: "chesscom",
    username: profile.username || name,
    profileUrl: profile.url ?? profileUrl({ platform: "chesscom", username: profile.username || name }),
    profile: {
      ...(profile.name ? { name: profile.name } : {}),
      ...(profile.title ? { title: profile.title } : {}),
      ...(avatar ? { avatar } : {}),
      ...(country ? { country } : {}),
      ...(profile.joined ? { joined: new Date(profile.joined * 1000).toISOString() } : {}),
      ...(typeof profile.followers === "number" ? { followers: profile.followers } : {}),
    },
    ratings,
    results,
    recentGames: games,
  }
}
