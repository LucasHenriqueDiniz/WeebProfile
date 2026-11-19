/**
 * Lichess, from its public API (https://lichess.org/api, no token).
 *
 * Measured from a Worker on this account (`wrangler dev --remote`, colo POA, 19/11/2026):
 * `GET /api/user/{name}` answered 429 "Too many requests" 13 times of 13, with and without a
 * User-Agent, while the same URL answered 200 from a laptop. The other endpoints answered
 * 200 from the Worker (31 of 31), so the profile comes from `POST /api/users`, which returns
 * the same user object without the overall game count. The wins, draws and losses come from
 * each time control's `perf` page instead, which also has the highest rating.
 *
 * Lichess asks for one request at a time and a User-Agent naming the application
 * (fetchJson sends ours); the calls below are sequential.
 */

import type { ChessControl, ChessData, ChessGame, ChessRating, ChessRecord } from "../types"
import { ApiError } from "../../shared/utils/errors"
import { fetchJson, fetchWithRetry } from "../../shared/utils/api"
import { profileUrl } from "./identity"

export const LICHESS_API = "https://lichess.org/api"

/** Lichess' perf keys for our rows. Its correspondence is Chess.com's daily. */
const PERF_OF: Partial<Record<ChessControl, string>> = {
  bullet: "bullet",
  blitz: "blitz",
  rapid: "rapid",
  classical: "classical",
  daily: "correspondence",
}

export const LICHESS_CONTROLS: ChessControl[] = ["bullet", "blitz", "rapid", "classical", "daily"]

/** `max` of the games export: the section shows at most this many. */
export const RECENT_GAMES_LIMIT = 10

interface LichessPerf {
  games?: number
  rating?: number
  rd?: number
  prov?: boolean
}

/**
 * From this deviation Lichess shows the rating as a bare `?` (scalachess
 * `cluelessDeviation`): penguingim1's classical (rd 367, 6 games) and correspondence
 * (rd 271) on 19/11/2026, while the card printed 2578? and 1391?.
 */
export const CLUELESS_DEVIATION = 230

/** The rating as the profile page shows it: none for a control never played or still clueless. */
function shownRating(perf: LichessPerf | undefined): Pick<ChessRating, "rating" | "provisional"> {
  if (!perf?.games) return {}
  const clueless = (perf.rd ?? 0) >= CLUELESS_DEVIATION
  return {
    ...(clueless ? {} : { rating: perf.rating }),
    ...(perf.prov || clueless ? { provisional: true } : {}),
  }
}

interface LichessUser {
  id: string
  username: string
  title?: string
  disabled?: boolean
  createdAt?: number
  profile?: { flag?: string; country?: string; realName?: string }
  playTime?: { total?: number }
  perfs?: Record<string, LichessPerf>
}

interface LichessPerfStat {
  stat?: {
    highest?: { int?: number }
    count?: { win?: number; loss?: number; draw?: number }
  }
}

interface LichessGamePlayer {
  user?: { name?: string; title?: string; id?: string }
  aiLevel?: number
  rating?: number
}

interface LichessGame {
  id: string
  speed?: string
  perf?: string
  status?: string
  createdAt?: number
  lastMoveAt?: number
  winner?: "white" | "black"
  players: { white: LichessGamePlayer; black: LichessGamePlayer }
}

/** Games that never started are in the export too. */
const NOT_PLAYED = new Set(["created", "started", "aborted", "noStart", "unknownFinish"])

export class LichessUserNotFound extends Error {}

async function lichessUser(username: string): Promise<LichessUser> {
  const users = await fetchJson<LichessUser[]>(`${LICHESS_API}/users`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: username,
  })
  const user = users?.[0]
  // An unknown name answers 200 with an empty list; a closed account has `disabled`.
  if (!user || user.disabled) throw new LichessUserNotFound(username)
  return user
}

async function perfStat(username: string, perf: string): Promise<LichessPerfStat | null> {
  try {
    return await fetchJson<LichessPerfStat>(`${LICHESS_API}/user/${encodeURIComponent(username)}/perf/${perf}`)
  } catch (error) {
    // A perf the account never played answers 200 with no stat; 404 only for unknown users.
    if (error instanceof ApiError && error.statusCode === 404) return null
    throw error
  }
}

export function toLichessGame(game: LichessGame, userId: string): ChessGame | null {
  if (NOT_PLAYED.has(game.status ?? "")) return null
  const color = game.players.white.user?.id === userId ? "white" : "black"
  const opponent = game.players[color === "white" ? "black" : "white"]
  const result = game.winner ? (game.winner === color ? "win" : "loss") : "draw"
  return {
    url: `https://lichess.org/${game.id}${color === "black" ? "/black" : ""}`,
    date: new Date(game.lastMoveAt ?? game.createdAt ?? 0).toISOString(),
    control: game.speed ?? game.perf ?? "",
    result,
    color,
    opponent: {
      name: opponent.user?.name ?? (opponent.aiLevel ? `Stockfish level ${opponent.aiLevel}` : "Anonymous"),
      ...(opponent.user?.title ? { title: opponent.user.title } : {}),
      ...(opponent.rating ? { rating: opponent.rating } : {}),
    },
  }
}

async function recentGames(username: string, userId: string): Promise<ChessGame[]> {
  const response = await fetchWithRetry(
    `${LICHESS_API}/games/user/${encodeURIComponent(username)}?max=${RECENT_GAMES_LIMIT}&moves=false`,
    // Without this Accept the export is PGN.
    { headers: { Accept: "application/x-ndjson" } }
  )
  const text = await response.text()
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => toLichessGame(JSON.parse(line) as LichessGame, userId))
    .filter((game): game is ChessGame => game !== null)
}

export async function fetchLichess(username: string, sections: string[], showBest: boolean): Promise<ChessData> {
  const user = await lichessUser(username)
  const perfs = user.perfs ?? {}

  // A perf page per time control the account has played, only when the card shows
  // what is on it: the results, or the best ratings. At most five calls.
  const wantsPerfStats = sections.includes("results") || (sections.includes("ratings") && showBest)
  const stats: Partial<Record<ChessControl, LichessPerfStat | null>> = {}
  if (wantsPerfStats) {
    for (const control of LICHESS_CONTROLS) {
      const key = PERF_OF[control]!
      if ((perfs[key]?.games ?? 0) > 0) stats[control] = await perfStat(user.username, key)
    }
  }

  const ratings: ChessRating[] = LICHESS_CONTROLS.map((control) => {
    const perf = perfs[PERF_OF[control]!] ?? {}
    const best = stats[control]?.stat?.highest?.int
    return {
      control,
      games: perf.games ?? 0,
      ...shownRating(perf),
      ...(best ? { best } : {}),
    }
  })
  const puzzle = perfs.puzzle
  ratings.push({
    control: "puzzle",
    games: puzzle?.games ?? 0,
    ...shownRating(puzzle),
  })

  const results: ChessRecord = { win: 0, draw: 0, loss: 0 }
  for (const control of LICHESS_CONTROLS) {
    const count = stats[control]?.stat?.count
    results.win += count?.win ?? 0
    results.draw += count?.draw ?? 0
    results.loss += count?.loss ?? 0
  }

  const games = sections.includes("recent_games") ? await recentGames(user.username, user.id) : []

  return {
    platform: "lichess",
    username: user.username,
    profileUrl: profileUrl({ platform: "lichess", username: user.username }),
    profile: {
      ...(user.profile?.realName ? { name: user.profile.realName } : {}),
      ...(user.title ? { title: user.title } : {}),
      ...((user.profile?.flag ?? user.profile?.country)
        ? { country: user.profile?.flag ?? user.profile?.country }
        : {}),
      ...(user.createdAt ? { joined: new Date(user.createdAt).toISOString() } : {}),
      ...(user.playTime?.total ? { playTimeSeconds: user.playTime.total } : {}),
    },
    ratings,
    results,
    recentGames: games,
  }
}
