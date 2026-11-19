/**
 * Which site and which account the card is for, from the one `username` field.
 *
 * The same name can belong to two different people on Lichess and Chess.com, so the
 * site is never guessed: the field takes the profile link (what the visitor copies from
 * the address bar) or the name with the site in front, `lichess:name` / `chess.com:name`.
 */

import type { ChessPlatform } from "../types"

export interface ChessIdentity {
  platform: ChessPlatform
  username: string
}

/** Both sites: letters, digits, `_` and `-`, 2 to 30 characters (Lichess allows 2-30, Chess.com 3-25). */
const NAME = /^[A-Za-z0-9][A-Za-z0-9_-]{1,29}$/

const PREFIXES: Array<[RegExp, ChessPlatform]> = [
  [/^lichess(?:\.org)?:/i, "lichess"],
  [/^chess(?:\.com|com)?:/i, "chesscom"],
]

function fromUrl(input: string): ChessIdentity | null {
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`)
  } catch {
    return null
  }
  const host = url.hostname.toLowerCase().replace(/^(www|[a-z]{2})\./, "")
  const parts = url.pathname.split("/").filter(Boolean)
  // A localized page: chess.com/pt-BR/member/name.
  if (parts.length > 1 && /^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(parts[0]!) && parts[1] !== "@") parts.shift()
  if (host === "lichess.org") {
    // lichess.org/@/name, also /@/name/perf/blitz and the bare lichess.org/name.
    const name = parts[0] === "@" ? parts[1] : parts.length === 1 ? parts[0] : undefined
    return name ? { platform: "lichess", username: name } : null
  }
  if (host === "chess.com") {
    // chess.com/member/name, chess.com/stats/live/blitz/name, chess.com/name.
    const name =
      parts[0] === "member"
        ? parts[1]
        : parts[0] === "stats"
          ? parts[parts.length - 1]
          : parts.length === 1
            ? parts[0]
            : undefined
    return name ? { platform: "chesscom", username: name } : null
  }
  return null
}

/** Null when the input names no site or is not a valid name. */
export function parseChessIdentity(input: unknown): ChessIdentity | null {
  if (typeof input !== "string") return null
  const value = input.trim()
  if (!value) return null

  let identity: ChessIdentity | null = null
  for (const [prefix, site] of PREFIXES) {
    if (prefix.test(value)) {
      identity = { platform: site, username: value.replace(prefix, "").trim() }
      break
    }
  }
  if (!identity && /[./]/.test(value)) identity = fromUrl(value)

  return identity && NAME.test(identity.username) ? identity : null
}

export function profileUrl({ platform, username }: ChessIdentity): string {
  return platform === "lichess"
    ? `https://lichess.org/@/${encodeURIComponent(username)}`
    : `https://www.chess.com/member/${encodeURIComponent(username)}`
}
