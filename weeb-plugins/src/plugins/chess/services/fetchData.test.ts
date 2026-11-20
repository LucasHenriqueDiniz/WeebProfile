import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchChessData } from "./fetchData"
import { CHESSCOM_API } from "./chesscom"
import { LICHESS_API, RECENT_GAMES_LIMIT } from "./lichess"

/**
 * The answers below are trimmed copies of what lichess.org and api.chess.com returned on
 * 19/11/2026 (penguingim1, hikaru).
 */

const LICHESS_USERS = [
  {
    id: "penguingim1",
    username: "penguingim1",
    perfs: {
      bullet: { games: 47993, rating: 3159, rd: 55, prog: -15 },
      blitz: { games: 5251, rating: 2807, rd: 76, prog: 39 },
      rapid: { games: 237, rating: 2672, rd: 176, prog: -47, prov: true },
      classical: { games: 6, rating: 2578, rd: 367, prog: 0, prov: true },
      correspondence: { games: 0, rating: 1500, rd: 500, prog: 0, prov: true },
      puzzle: { games: 2963, rating: 2554, rd: 136, prog: 0, prov: true },
    },
    title: "GM",
    createdAt: 1429651207703,
    profile: { flag: "AQ", realName: "Andrew Tang" },
    playTime: { total: 8135485, tv: 2938142 },
  },
]

const perf = (highest: number, win: number, loss: number, draw: number) => ({
  user: { name: "penguingim1" },
  perf: { glicko: { rating: 2807.95, deviation: 76.04 }, nb: win + loss + draw },
  stat: { highest: { int: highest }, count: { all: win + loss + draw, win, loss, draw } },
})

const LICHESS_PERFS: Record<string, unknown> = {
  bullet: perf(3375, 38485, 8585, 1418),
  blitz: perf(2893, 3838, 1398, 302),
  rapid: perf(2734, 421, 160, 36),
  classical: perf(2550, 94, 21, 21),
}

const LICHESS_GAMES = [
  {
    id: "AFQEZyJN",
    speed: "bullet",
    status: "outoftime",
    lastMoveAt: 1794956808068,
    players: {
      white: { user: { name: "penguingim1", title: "GM", id: "penguingim1" }, rating: 3173 },
      black: { user: { name: "amazzzingbalalaika", id: "amazzzingbalalaika" }, rating: 2932 },
    },
    winner: "black",
  },
  {
    id: "rRWljygz",
    speed: "bullet",
    status: "resign",
    lastMoveAt: 1794956727889,
    players: {
      white: { user: { name: "Heisenberg01", title: "FM", id: "heisenberg01" }, rating: 2939 },
      black: { user: { name: "penguingim1", id: "penguingim1" }, rating: 3187 },
    },
    winner: "black",
  },
  {
    id: "abortedX",
    speed: "blitz",
    status: "aborted",
    lastMoveAt: 1794956000000,
    players: {
      white: { user: { name: "penguingim1", id: "penguingim1" } },
      black: { user: { name: "someone", id: "someone" } },
    },
  },
  {
    id: "drawnGme",
    speed: "blitz",
    status: "draw",
    lastMoveAt: 1794955000000,
    players: {
      white: { user: { name: "penguingim1", id: "penguingim1" }, rating: 2800 },
      black: { aiLevel: 8 },
    },
  },
]

const CHESSCOM_PROFILE = {
  avatar: "https://images.chesscomfiles.com/uploads/v1/user/15448422.88c010c1.200x200o.3c5619f5441e.png",
  player_id: 15448422,
  url: "https://www.chess.com/member/Hikaru",
  name: "Hikaru Nakamura",
  username: "hikaru",
  title: "GM",
  followers: 1435524,
  country: "https://api.chess.com/pub/country/US",
  joined: 1389043258,
  status: "premium",
}

const CHESSCOM_STATS = {
  chess_daily: { last: { rating: 2239 }, best: { rating: 2464 }, record: { win: 73, loss: 11, draw: 4 } },
  chess960_daily: { last: { rating: 1231 }, best: { rating: 1489 }, record: { win: 1, loss: 2, draw: 0 } },
  chess_rapid: { last: { rating: 2838 }, best: { rating: 2927 }, record: { win: 205, loss: 69, draw: 220 } },
  chess_bullet: { last: { rating: 3402 }, best: { rating: 3570 }, record: { win: 17334, loss: 2562, draw: 1197 } },
  chess_blitz: { last: { rating: 3465 }, best: { rating: 3503 }, record: { win: 36259, loss: 5573, draw: 4397 } },
  fide: 2814,
  tactics: { highest: { rating: 2730 }, lowest: { rating: 2730 } },
  puzzle_rush: { best: { total_attempts: 126, score: 123 } },
}

const game = (n: number, white: string, black: string, whiteResult: string, blackResult: string) => ({
  url: `https://www.chess.com/game/live/${n}`,
  end_time: 1795000000 + n,
  time_class: "blitz",
  rules: "chess",
  white: { username: white, rating: 3000 + n, result: whiteResult },
  black: { username: black, rating: 3100 + n, result: blackResult },
})

const ARCHIVES = {
  archives: [`${CHESSCOM_API}/hikaru/games/2026/10`, `${CHESSCOM_API}/hikaru/games/2026/11`],
}
// Oldest first, as the API sends them. November has two games, so October is read too.
const NOVEMBER = {
  games: [
    game(10, "Hikaru", "Carnivoras", "win", "resigned"),
    game(11, "Carnivoras", "Hikaru", "repetition", "repetition"),
  ],
}
const OCTOBER = {
  games: [
    game(1, "a", "Hikaru", "win", "timeout"),
    game(2, "Hikaru", "b", "stalemate", "stalemate"),
    game(3, "c", "hikaru", "checkmated", "win"),
  ],
}

/** A 1x1 PNG, what the avatar URL answers with. */
const PNG = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="),
  (c) => c.charCodeAt(0)
)

type Sent = { url: string; method?: string; body?: string; headers: Record<string, string> }

function sites(routes: Record<string, () => Response>): Sent[] {
  const sent: Sent[] = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input)
    sent.push({
      url,
      method: init?.method,
      body: typeof init?.body === "string" ? init.body : undefined,
      headers: (init?.headers ?? {}) as Record<string, string>,
    })
    const route = routes[url]
    return route ? route() : new Response(JSON.stringify({ code: 0, message: "not found" }), { status: 404 })
  })
  return sent
}

const ndjson = (rows: unknown[]) =>
  new Response(rows.map((r) => JSON.stringify(r)).join("\n") + "\n", {
    headers: { "Content-Type": "application/x-ndjson" },
  })

const lichessRoutes = (): Record<string, () => Response> => ({
  [`${LICHESS_API}/users`]: () => Response.json(LICHESS_USERS),
  ...Object.fromEntries(
    Object.entries(LICHESS_PERFS).map(([key, body]) => [
      `${LICHESS_API}/user/penguingim1/perf/${key}`,
      () => Response.json(body),
    ])
  ),
  [`${LICHESS_API}/games/user/penguingim1?max=${RECENT_GAMES_LIMIT}&moves=false`]: () => ndjson(LICHESS_GAMES),
})

const chesscomRoutes = (): Record<string, () => Response> => ({
  [`${CHESSCOM_API}/hikaru`]: () => Response.json(CHESSCOM_PROFILE),
  [`${CHESSCOM_API}/hikaru/stats`]: () => Response.json(CHESSCOM_STATS),
  [`${CHESSCOM_API}/hikaru/games/archives`]: () => Response.json(ARCHIVES),
  [`${CHESSCOM_API}/hikaru/games/2026/11`]: () => Response.json(NOVEMBER),
  [`${CHESSCOM_API}/hikaru/games/2026/10`]: () => Response.json(OCTOBER),
  [CHESSCOM_PROFILE.avatar]: () => new Response(PNG, { headers: { "Content-Type": "image/png" } }),
})

const ALL = ["profile", "ratings", "results", "recent_games"]
const config = (username: string, sections = ALL, nonEssential = {}) =>
  ({ enabled: true, sections, username, nonEssential }) as never

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe("fetchChessData on Lichess", () => {
  it("reads the user with POST /api/users, a perf page per played control and the games export", async () => {
    const sent = sites(lichessRoutes())

    const data = await fetchChessData(config("https://lichess.org/@/penguingim1"))

    // GET /api/user/{name} answers 429 to Workers; the plain-text POST is what works.
    expect(sent[0]).toMatchObject({ url: `${LICHESS_API}/users`, method: "POST", body: "penguingim1" })
    expect(sent.some((s) => s.url === `${LICHESS_API}/user/penguingim1`)).toBe(false)
    // Correspondence was never played: no perf page for it.
    expect(sent.map((s) => s.url.split("/").pop())).toEqual([
      "users",
      "bullet",
      "blitz",
      "rapid",
      "classical",
      `penguingim1?max=${RECENT_GAMES_LIMIT}&moves=false`,
    ])
    expect(sent.every((s) => /^WeebProfile\//.test(s.headers["User-Agent"] ?? ""))).toBe(true)
    expect(sent.at(-1)!.headers.Accept).toBe("application/x-ndjson")

    expect(data.platform).toBe("lichess")
    expect(data.profileUrl).toBe("https://lichess.org/@/penguingim1")
    expect(data.profile).toEqual({
      name: "Andrew Tang",
      title: "GM",
      country: "AQ",
      joined: new Date(1429651207703).toISOString(),
      playTimeSeconds: 8135485,
    })
    expect(data.ratings).toEqual([
      { control: "bullet", games: 47993, rating: 3159, best: 3375 },
      { control: "blitz", games: 5251, rating: 2807, best: 2893 },
      { control: "rapid", games: 237, rating: 2672, best: 2734, provisional: true },
      // rd 367: Lichess' profile shows a bare "?" for it, so no rating either.
      { control: "classical", games: 6, best: 2550, provisional: true },
      // Lichess' default 1500 for a control never played is not a rating.
      { control: "daily", games: 0 },
      { control: "puzzle", games: 2963, rating: 2554, provisional: true },
    ])
    expect(data.results).toEqual({
      win: 38485 + 3838 + 421 + 94,
      draw: 1418 + 302 + 36 + 21,
      loss: 8585 + 1398 + 160 + 21,
    })
    // The aborted game is left out; a game without a winner is a draw; Stockfish has a name.
    expect(data.recentGames).toEqual([
      {
        url: "https://lichess.org/AFQEZyJN",
        date: new Date(1794956808068).toISOString(),
        control: "bullet",
        result: "loss",
        color: "white",
        opponent: { name: "amazzzingbalalaika", rating: 2932 },
      },
      {
        url: "https://lichess.org/rRWljygz/black",
        date: new Date(1794956727889).toISOString(),
        control: "bullet",
        result: "win",
        color: "black",
        opponent: { name: "Heisenberg01", title: "FM", rating: 2939 },
      },
      {
        url: "https://lichess.org/drawnGme",
        date: new Date(1794955000000).toISOString(),
        control: "blitz",
        result: "draw",
        color: "white",
        opponent: { name: "Stockfish level 8" },
      },
    ])
  })

  it("makes one call when the card shows only the profile", async () => {
    const sent = sites(lichessRoutes())

    await fetchChessData(config("lichess:penguingim1", ["profile"]))

    expect(sent.map((s) => s.url)).toEqual([`${LICHESS_API}/users`])
  })

  it("skips the perf pages for ratings without the best column", async () => {
    const sent = sites(lichessRoutes())

    const data = await fetchChessData(config("lichess:penguingim1", ["ratings"], { ratings_show_best: false }))

    expect(sent).toHaveLength(1)
    expect(data.ratings[0]).toEqual({ control: "bullet", games: 47993, rating: 3159 })
  })

  it("reports a name Lichess does not know as not found, though it answers 200 with []", async () => {
    sites({ [`${LICHESS_API}/users`]: () => Response.json([]) })

    await expect(fetchChessData(config("lichess:nobody-zz9q"))).rejects.toThrow('Lichess user "nobody-zz9q" not found')
  })

  it("reports a closed account as not found", async () => {
    sites({ [`${LICHESS_API}/users`]: () => Response.json([{ id: "gone", username: "gone", disabled: true }]) })

    await expect(fetchChessData(config("lichess:gone"))).rejects.toThrow('Lichess user "gone" not found')
  })

  it("reports a 429 from Lichess as an upstream failure with the status", async () => {
    sites({
      [`${LICHESS_API}/users`]: () => new Response("<title>Too many requests</title>", { status: 429 }),
    })

    await expect(fetchChessData(config("lichess:penguingim1"))).rejects.toThrow("Lichess API request failed: HTTP 429")
  })
})

describe("fetchChessData on Chess.com", () => {
  it("reads the profile, stats, avatar and the newest games across two months", async () => {
    const sent = sites(chesscomRoutes())

    // The link keeps the capital; the API answers 301 to it, so the name is lowercased.
    const data = await fetchChessData(config("https://www.chess.com/member/Hikaru"))

    expect(sent.map((s) => s.url)).toEqual([
      `${CHESSCOM_API}/hikaru`,
      `${CHESSCOM_API}/hikaru/stats`,
      `${CHESSCOM_API}/hikaru/games/archives`,
      `${CHESSCOM_API}/hikaru/games/2026/11`,
      `${CHESSCOM_API}/hikaru/games/2026/10`,
      CHESSCOM_PROFILE.avatar,
    ])
    // Chess.com answers 403 without one.
    expect(sent.every((s) => /^WeebProfile\//.test(s.headers["User-Agent"] ?? ""))).toBe(true)

    expect(data.platform).toBe("chesscom")
    expect(data.profileUrl).toBe("https://www.chess.com/member/Hikaru")
    expect(data.profile).toMatchObject({
      name: "Hikaru Nakamura",
      title: "GM",
      country: "US",
      joined: new Date(1389043258 * 1000).toISOString(),
      followers: 1435524,
    })
    expect(data.profile.avatar).toMatch(/^data:image\/png;base64,/)
    expect(data.ratings).toEqual([
      { control: "bullet", games: 17334 + 2562 + 1197, rating: 3402, best: 3570 },
      { control: "blitz", games: 36259 + 5573 + 4397, rating: 3465, best: 3503 },
      { control: "rapid", games: 205 + 69 + 220, rating: 2838, best: 2927 },
      { control: "daily", games: 73 + 11 + 4, rating: 2239, best: 2464 },
      { control: "puzzle", best: 2730 },
    ])
    // Chess960 is not in the totals.
    expect(data.results).toEqual({
      win: 17334 + 36259 + 205 + 73,
      draw: 1197 + 4397 + 220 + 4,
      loss: 2562 + 5573 + 69 + 11,
    })
    expect(data.recentGames.map((g) => [g.url.split("/").pop(), g.color, g.result, g.opponent.name])).toEqual([
      ["11", "black", "draw", "Carnivoras"],
      ["10", "white", "win", "Carnivoras"],
      ["3", "black", "win", "c"],
      ["2", "white", "draw", "b"],
      ["1", "black", "loss", "a"],
    ])
  })

  it("reads no games archive and no stats when the card shows only the profile", async () => {
    const sent = sites(chesscomRoutes())

    await fetchChessData(config("chess.com:hikaru", ["profile"]))

    expect(sent.map((s) => s.url)).toEqual([`${CHESSCOM_API}/hikaru`, CHESSCOM_PROFILE.avatar])
  })

  it("shows the profile alone when the stats and games answer 404 (magnuscarlsen, 19/11/2026)", async () => {
    sites({ [`${CHESSCOM_API}/hikaru`]: () => Response.json(CHESSCOM_PROFILE) })

    const data = await fetchChessData(config("chess.com:hikaru"))

    expect(data.username).toBe("hikaru")
    expect(data.results).toEqual({ win: 0, draw: 0, loss: 0 })
    expect(data.ratings.every((r) => r.rating === undefined)).toBe(true)
    expect(data.recentGames).toEqual([])
    // The avatar failed too (404): no image rather than a broken one.
    expect(data.profile.avatar).toBeUndefined()
  })

  it("reports a name Chess.com does not know as not found", async () => {
    sites({})

    await expect(fetchChessData(config("chess.com:nobody-zz9q"))).rejects.toThrow(
      'Chess.com user "nobody-zz9q" not found'
    )
  })

  it("reports a 403 from Chess.com as an upstream failure with the status", async () => {
    sites({ [`${CHESSCOM_API}/hikaru`]: () => new Response("<html>blocked</html>", { status: 403 }) })

    await expect(fetchChessData(config("chess.com:hikaru"))).rejects.toThrow("Chess.com API request failed: HTTP 403")
  })
})

describe("fetchChessData input", () => {
  it.each(["thibault", "", "  ", "https://example.com/@/thibault", "lichess:a b"])(
    "asks for the site before calling anything: %j",
    async (username) => {
      const sent = sites({})

      await expect(fetchChessData(config(username))).rejects.toThrow("Chess username is required")
      expect(sent).toEqual([])
    }
  )

  it("returns the mock without calling anything in dev", async () => {
    const sent = sites({})

    const data = await fetchChessData(config("lichess:penguingim1"), true)

    expect(sent).toEqual([])
    expect(data.ratings.length).toBeGreaterThan(0)
  })
})
