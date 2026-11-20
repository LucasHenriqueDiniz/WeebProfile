/**
 * Chess data from Lichess or Chess.com, whichever the username field names.
 *
 * lowlighter/metrics' community/chess plugin (MIT, Copyright (c) 2020-present lowlighter)
 * animated the last Lichess game; this card shows the player's stats instead, from both
 * sites. Subrequests per card: Lichess at most 7 (user, a perf page per played time
 * control, the games export), Chess.com at most 6 (profile, stats, avatar, archives, two
 * months of games).
 */

import type { ChessConfig, ChessData } from "../types"
import { upstreamFailure } from "../../shared/utils/errors"
import { parseChessIdentity } from "./identity"
import { ChessComUserNotFound, fetchChessCom } from "./chesscom"
import { fetchLichess, LichessUserNotFound, RECENT_GAMES_LIMIT } from "./lichess"
import { getMockChessData } from "./mock-data"

export async function fetchChessData(config: ChessConfig, dev = false, previewMode = false): Promise<ChessData> {
  if (dev) {
    return getMockChessData()
  }

  const identity = parseChessIdentity(config.username)
  if (!identity) {
    throw new Error(
      "Chess username is required: your profile link (lichess.org/@/name or chess.com/member/name), or lichess:name / chess.com:name."
    )
  }

  const sections = config.sections ?? []
  const ne = config.nonEssential ?? {}
  const site = identity.platform === "lichess" ? "Lichess" : "Chess.com"

  try {
    return identity.platform === "lichess"
      ? await fetchLichess(identity.username, sections, ne.ratings_show_best !== false)
      : await fetchChessCom(identity.username, sections, { recentLimit: RECENT_GAMES_LIMIT, previewMode })
  } catch (error) {
    if (error instanceof LichessUserNotFound || error instanceof ChessComUserNotFound) {
      throw new Error(`${site} user "${identity.username}" not found`)
    }
    console.error(`[Chess] Error fetching ${site} data:`, error)
    throw upstreamFailure(site, error)
  }
}
