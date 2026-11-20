import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { ChessData, ChessResult } from "./types"

/**
 * Height of every chess section against what the browsers draw.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 19/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --plugin=chess
 * --variants --engine=all --data-variants=<VARIANTS as a module>` (renderPlugins, theme CSS, no
 * terminal header): each section alone and all of them in one card, with every option that
 * changes the height, and the mock changed as `VARIANTS` says. 116 cases, all exact in the
 * three engines (Firefox draws the default card's bar 1px shorter, inside the 2px slack).
 */

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)
const AVATAR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
const RESULTS: ChessResult[] = ["win", "draw", "loss"]

const VARIANTS = {
  mock: (m: ChessData): ChessData => m,
  // A Chess.com account: avatar, followers, no classical, puzzles with only the best.
  chesscom: (m: ChessData): ChessData => ({
    ...m,
    platform: "chesscom",
    profileUrl: "https://www.chess.com/member/example",
    profile: {
      name: "Example Player",
      title: "IM",
      avatar: AVATAR,
      country: "US",
      joined: "2014-01-06T21:20:58.000Z",
      followers: 1435556,
    },
    ratings: [
      { control: "bullet", rating: 3402, best: 3570, games: 21093 },
      { control: "blitz", rating: 3465, best: 3503, games: 46229 },
      { control: "rapid", rating: 2838, best: 2927, games: 494 },
      { control: "daily", rating: 2239, best: 2464, games: 88 },
      { control: "puzzle", best: 2730 },
    ],
  }),
  // Every list at its maximum, names too long for their column.
  many: (m: ChessData): ChessData => ({
    ...m,
    profile: { ...m.profile, name: "A Very Long Real Name That Does Not Fit In Half Width At All" },
    ratings: m.ratings.map((r) => ({ ...r, rating: 2999, best: 3001, games: 123456 })),
    results: { win: 1234567, draw: 123456, loss: 987654 },
    recentGames: range(10).map((i) => ({
      url: `https://lichess.org/game${i}`,
      date: "2026-11-17T21:14:00.000Z",
      control: i % 2 ? "ultraBullet" : "correspondence",
      result: RESULTS[i % 3]!,
      color: "white" as const,
      opponent: { name: `AnOpponentWithAVeryLongUsername${i}`, title: "GM", rating: 2900 },
    })),
  }),
  // A new account: nothing played, no profile details.
  empty: (m: ChessData): ChessData => ({
    ...m,
    profile: {},
    ratings: m.ratings.map((r) => ({ control: r.control, games: 0 })),
    results: { win: 0, draw: 0, loss: 0 },
    recentGames: [],
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["profile"], "default", "half", "mock", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "mock", {}, [144, 144, 144]],
  [["profile"], "default", "full", "mock", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "mock", {}, [144, 144, 144]],
  [["profile"], "default", "half", "mock", { profile_hide_title: true }, [56, 56, 56]],
  [["profile"], "terminal", "half", "mock", { profile_hide_title: true }, [144, 144, 144]],
  [["profile"], "default", "full", "mock", { profile_hide_title: true }, [56, 56, 56]],
  [["profile"], "terminal", "full", "mock", { profile_hide_title: true }, [144, 144, 144]],
  [["profile"], "default", "half", "chesscom", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "chesscom", {}, [144, 144, 144]],
  [["profile"], "default", "full", "chesscom", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "chesscom", {}, [144, 144, 144]],
  [["profile"], "default", "half", "many", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "many", {}, [144, 144, 144]],
  [["profile"], "default", "full", "many", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "many", {}, [144, 144, 144]],
  [["profile"], "default", "half", "empty", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "empty", {}, [64, 64, 64]],
  [["profile"], "default", "full", "empty", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "empty", {}, [64, 64, 64]],
  [["ratings"], "default", "half", "mock", {}, [186, 186, 186]],
  [["ratings"], "terminal", "half", "mock", {}, [124, 124, 124]],
  [["ratings"], "default", "full", "mock", {}, [188, 188, 188]],
  [["ratings"], "terminal", "full", "mock", {}, [124, 124, 124]],
  [["ratings"], "default", "half", "mock", { ratings_hide_title: true }, [136, 136, 136]],
  [["ratings"], "terminal", "half", "mock", { ratings_hide_title: true }, [124, 124, 124]],
  [["ratings"], "default", "full", "mock", { ratings_hide_title: true }, [136, 136, 136]],
  [["ratings"], "terminal", "full", "mock", { ratings_hide_title: true }, [124, 124, 124]],
  [["ratings"], "default", "half", "mock", { ratings_show_best: false }, [186, 186, 186]],
  [["ratings"], "terminal", "half", "mock", { ratings_show_best: false }, [124, 124, 124]],
  [["ratings"], "default", "full", "mock", { ratings_show_best: false }, [188, 188, 188]],
  [["ratings"], "terminal", "full", "mock", { ratings_show_best: false }, [124, 124, 124]],
  [["ratings"], "default", "half", "mock", { ratings_show_puzzles: false }, [158, 158, 158]],
  [["ratings"], "terminal", "half", "mock", { ratings_show_puzzles: false }, [104, 104, 104]],
  [["ratings"], "default", "full", "mock", { ratings_show_puzzles: false }, [160, 160, 160]],
  [["ratings"], "terminal", "full", "mock", { ratings_show_puzzles: false }, [104, 104, 104]],
  [["ratings"], "default", "half", "mock", { ratings_show_unplayed: true }, [214, 214, 214]],
  [["ratings"], "terminal", "half", "mock", { ratings_show_unplayed: true }, [144, 144, 144]],
  [["ratings"], "default", "full", "mock", { ratings_show_unplayed: true }, [216, 216, 216]],
  [["ratings"], "terminal", "full", "mock", { ratings_show_unplayed: true }, [144, 144, 144]],
  [["ratings"], "default", "half", "chesscom", {}, [186, 186, 186]],
  [["ratings"], "terminal", "half", "chesscom", {}, [124, 124, 124]],
  [["ratings"], "default", "full", "chesscom", {}, [188, 188, 188]],
  [["ratings"], "terminal", "full", "chesscom", {}, [124, 124, 124]],
  [["ratings"], "default", "half", "many", {}, [214, 214, 214]],
  [["ratings"], "terminal", "half", "many", {}, [144, 144, 144]],
  [["ratings"], "default", "full", "many", {}, [216, 216, 216]],
  [["ratings"], "terminal", "full", "many", {}, [144, 144, 144]],
  [["ratings"], "default", "half", "empty", {}, [0, 0, 0]],
  [["ratings"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["ratings"], "default", "full", "empty", {}, [0, 0, 0]],
  [["ratings"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["results"], "default", "half", "mock", {}, [120, 120, 120]],
  [["results"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["results"], "default", "full", "mock", {}, [122, 122, 122]],
  [["results"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["results"], "default", "half", "mock", { results_hide_title: true }, [70, 70, 70]],
  [["results"], "terminal", "half", "mock", { results_hide_title: true }, [104, 104, 104]],
  [["results"], "default", "full", "mock", { results_hide_title: true }, [70, 70, 70]],
  [["results"], "terminal", "full", "mock", { results_hide_title: true }, [104, 104, 104]],
  [["results"], "default", "half", "chesscom", {}, [120, 120, 120]],
  [["results"], "terminal", "half", "chesscom", {}, [104, 104, 104]],
  [["results"], "default", "full", "chesscom", {}, [122, 122, 122]],
  [["results"], "terminal", "full", "chesscom", {}, [104, 104, 104]],
  [["results"], "default", "half", "many", {}, [120, 120, 120]],
  [["results"], "terminal", "half", "many", {}, [104, 104, 104]],
  [["results"], "default", "full", "many", {}, [122, 122, 122]],
  [["results"], "terminal", "full", "many", {}, [104, 104, 104]],
  [["results"], "default", "half", "empty", {}, [0, 0, 0]],
  [["results"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["results"], "default", "full", "empty", {}, [0, 0, 0]],
  [["results"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["recent_games"], "default", "half", "mock", {}, [186, 186, 186]],
  [["recent_games"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["recent_games"], "default", "full", "mock", {}, [188, 188, 188]],
  [["recent_games"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["recent_games"], "default", "half", "mock", { recent_games_hide_title: true }, [136, 136, 136]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_hide_title: true }, [104, 104, 104]],
  [["recent_games"], "default", "full", "mock", { recent_games_hide_title: true }, [136, 136, 136]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_hide_title: true }, [104, 104, 104]],
  [["recent_games"], "default", "half", "mock", { recent_games_max: 1 }, [74, 74, 74]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_max: 1 }, [40, 40, 40]],
  [["recent_games"], "default", "full", "mock", { recent_games_max: 1 }, [76, 76, 76]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_max: 1 }, [40, 40, 40]],
  [["recent_games"], "default", "half", "mock", { recent_games_max: 10 }, [186, 186, 186]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_max: 10 }, [104, 104, 104]],
  [["recent_games"], "default", "full", "mock", { recent_games_max: 10 }, [188, 188, 188]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_max: 10 }, [104, 104, 104]],
  [["recent_games"], "default", "half", "chesscom", {}, [186, 186, 186]],
  [["recent_games"], "terminal", "half", "chesscom", {}, [104, 104, 104]],
  [["recent_games"], "default", "full", "chesscom", {}, [188, 188, 188]],
  [["recent_games"], "terminal", "full", "chesscom", {}, [104, 104, 104]],
  [["recent_games"], "default", "half", "many", {}, [186, 186, 186]],
  [["recent_games"], "terminal", "half", "many", {}, [104, 104, 104]],
  [["recent_games"], "default", "full", "many", {}, [188, 188, 188]],
  [["recent_games"], "terminal", "full", "many", {}, [104, 104, 104]],
  [["recent_games"], "default", "half", "empty", {}, [0, 0, 0]],
  [["recent_games"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["recent_games"], "default", "full", "empty", {}, [0, 0, 0]],
  [["recent_games"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["profile", "ratings", "results", "recent_games"], "default", "half", "mock", {}, [598, 597, 598]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "half", "mock", {}, [476, 476, 476]],
  [["profile", "ratings", "results", "recent_games"], "default", "full", "mock", {}, [606, 605, 606]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "full", "mock", {}, [476, 476, 476]],
  [["profile", "ratings", "results", "recent_games"], "default", "half", "chesscom", {}, [598, 597, 598]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "half", "chesscom", {}, [476, 476, 476]],
  [["profile", "ratings", "results", "recent_games"], "default", "full", "chesscom", {}, [606, 605, 606]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "full", "chesscom", {}, [476, 476, 476]],
  [["profile", "ratings", "results", "recent_games"], "default", "half", "many", {}, [626, 625, 626]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "half", "many", {}, [496, 496, 496]],
  [["profile", "ratings", "results", "recent_games"], "default", "full", "many", {}, [634, 633, 634]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "full", "many", {}, [496, 496, 496]],
  [["profile", "ratings", "results", "recent_games"], "default", "half", "empty", {}, [106, 106, 106]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "half", "empty", {}, [64, 64, 64]],
  [["profile", "ratings", "results", "recent_games"], "default", "full", "empty", {}, [108, 108, 108]],
  [["profile", "ratings", "results", "recent_games"], "terminal", "full", "empty", {}, [64, 64, 64]],
]

const plugin = PluginManager.getInstance().get("chess")!
let mock: ChessData

beforeAll(async () => {
  const sections = ["profile", "ratings", "results", "recent_games"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("chess section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
