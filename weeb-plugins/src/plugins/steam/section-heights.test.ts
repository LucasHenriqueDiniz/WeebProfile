import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { SteamData } from "./types"

/**
 * Height of every Steam section against what the browsers draw.
 *
 * Until 11/2026 the compact grid of covers was counted as the list of cards (up to 202px of
 * blank space), a hidden title kept its 10/12px gap, the statistics counted the 40/48px
 * avatar beside a 42/50px name block and 102px stat cards that draw 96/100, and the terminal
 * counted its body's 8px padding once per section (16px of blank space with all three).
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header): each section alone and all
 * of them in one card, with every option that changes the height, and the mock changed as
 * `VARIANTS` says.
 */

const many = (m: SteamData, n: number): SteamData => ({
  ...m,
  games: Array.from({ length: n }, (_, i) => ({
    ...m.games[i % m.games.length]!,
    appid: 1000 + i,
    name: `Game ${i}`,
    playtime_2weeks: 10 + i,
    playtime_forever: 1000 - i,
  })),
})

const VARIANTS = {
  mock: (m: SteamData): SteamData => m,
  "12 games": (m: SteamData): SteamData => many(m, 12),
  // Three rows of a half grid, the last with one cover
  "7 games": (m: SteamData): SteamData => many(m, 7),
  "no covers": (m: SteamData): SteamData => ({ ...m, games: m.games.map((g) => ({ ...g, header_image: undefined })) }),
  // No game played in the last two weeks: no featured game, no recent games
  "no featured": (m: SteamData): SteamData => ({ ...m, games: m.games.map((g) => ({ ...g, playtime_2weeks: 0 })) }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["statistics"], "default", "half", "mock", {}, [310, 310, 310]],
  [["statistics"], "terminal", "half", "mock", {}, [132, 132, 132]],
  [["statistics"], "default", "full", "mock", {}, [346, 346, 346]],
  [["statistics"], "terminal", "full", "mock", {}, [132, 132, 132]],
  [["statistics"], "default", "half", "mock", { statistics_hide_title: true }, [260, 260, 260]],
  [["statistics"], "terminal", "half", "mock", { statistics_hide_title: true }, [132, 132, 132]],
  [["statistics"], "default", "full", "mock", { statistics_hide_title: true }, [294, 294, 294]],
  [["statistics"], "terminal", "full", "mock", { statistics_hide_title: true }, [132, 132, 132]],
  [["statistics"], "default", "half", "mock", { statistics_show_featured: false }, [198, 198, 198]],
  [["statistics"], "terminal", "half", "mock", { statistics_show_featured: false }, [132, 132, 132]],
  [["statistics"], "default", "full", "mock", { statistics_show_featured: false }, [214, 214, 214]],
  [["statistics"], "terminal", "full", "mock", { statistics_show_featured: false }, [132, 132, 132]],
  [["statistics"], "default", "half", "12 games", {}, [310, 310, 310]],
  [["statistics"], "terminal", "half", "12 games", {}, [132, 132, 132]],
  [["statistics"], "default", "full", "12 games", {}, [346, 346, 346]],
  [["statistics"], "terminal", "full", "12 games", {}, [132, 132, 132]],
  [["statistics"], "default", "half", "7 games", {}, [310, 310, 310]],
  [["statistics"], "terminal", "half", "7 games", {}, [132, 132, 132]],
  [["statistics"], "default", "full", "7 games", {}, [346, 346, 346]],
  [["statistics"], "terminal", "full", "7 games", {}, [132, 132, 132]],
  [["statistics"], "default", "half", "no covers", {}, [314, 314, 314]],
  [["statistics"], "terminal", "half", "no covers", {}, [132, 132, 132]],
  [["statistics"], "default", "full", "no covers", {}, [346, 346, 346]],
  [["statistics"], "terminal", "full", "no covers", {}, [132, 132, 132]],
  [["statistics"], "default", "half", "no featured", {}, [198, 198, 198]],
  [["statistics"], "terminal", "half", "no featured", {}, [132, 132, 132]],
  [["statistics"], "default", "full", "no featured", {}, [214, 214, 214]],
  [["statistics"], "terminal", "full", "no featured", {}, [132, 132, 132]],
  [["recent_games"], "default", "half", "mock", {}, [360, 360, 360]],
  [["recent_games"], "terminal", "half", "mock", {}, [132, 132, 132]],
  [["recent_games"], "default", "full", "mock", {}, [408, 408, 408]],
  [["recent_games"], "terminal", "full", "mock", {}, [132, 132, 132]],
  [["recent_games"], "default", "half", "mock", { recent_games_hide_title: true }, [310, 310, 310]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_hide_title: true }, [132, 132, 132]],
  [["recent_games"], "default", "full", "mock", { recent_games_hide_title: true }, [356, 356, 356]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_hide_title: true }, [132, 132, 132]],
  [["recent_games"], "default", "half", "mock", { recent_games_max: 1 }, [120, 120, 120]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_max: 1 }, [72, 72, 72]],
  [["recent_games"], "default", "full", "mock", { recent_games_max: 1 }, [132, 132, 132]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_max: 1 }, [72, 72, 72]],
  [["recent_games"], "default", "half", "mock", { recent_games_max: 20 }, [360, 360, 360]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_max: 20 }, [132, 132, 132]],
  [["recent_games"], "default", "full", "mock", { recent_games_max: 20 }, [408, 408, 408]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_max: 20 }, [132, 132, 132]],
  [["recent_games"], "default", "half", "mock", { recent_games_style: "compact" }, [282, 282, 282]],
  [["recent_games"], "terminal", "half", "mock", { recent_games_style: "compact" }, [132, 132, 132]],
  [["recent_games"], "default", "full", "mock", { recent_games_style: "compact" }, [206, 206, 206]],
  [["recent_games"], "terminal", "full", "mock", { recent_games_style: "compact" }, [132, 132, 132]],
  [["recent_games"], "default", "half", "12 games", {}, [440, 440, 440]],
  [["recent_games"], "terminal", "half", "12 games", {}, [152, 152, 152]],
  [["recent_games"], "default", "full", "12 games", {}, [500, 500, 500]],
  [["recent_games"], "terminal", "full", "12 games", {}, [152, 152, 152]],
  [["recent_games"], "default", "half", "7 games", {}, [440, 440, 440]],
  [["recent_games"], "terminal", "half", "7 games", {}, [152, 152, 152]],
  [["recent_games"], "default", "full", "7 games", {}, [500, 500, 500]],
  [["recent_games"], "terminal", "full", "7 games", {}, [152, 152, 152]],
  [["recent_games"], "default", "half", "no covers", {}, [360, 360, 360]],
  [["recent_games"], "terminal", "half", "no covers", {}, [132, 132, 132]],
  [["recent_games"], "default", "full", "no covers", {}, [408, 408, 408]],
  [["recent_games"], "terminal", "full", "no covers", {}, [132, 132, 132]],
  [["recent_games"], "default", "half", "no featured", {}, [0, 0, 0]],
  [["recent_games"], "terminal", "half", "no featured", {}, [8, 8, 8]],
  [["recent_games"], "default", "full", "no featured", {}, [0, 0, 0]],
  [["recent_games"], "terminal", "full", "no featured", {}, [8, 8, 8]],
  [["top_games"], "default", "half", "mock", {}, [440, 440, 440]],
  [["top_games"], "terminal", "half", "mock", {}, [152, 152, 152]],
  [["top_games"], "default", "full", "mock", {}, [500, 500, 500]],
  [["top_games"], "terminal", "full", "mock", {}, [152, 152, 152]],
  [["top_games"], "default", "half", "mock", { top_games_hide_title: true }, [390, 390, 390]],
  [["top_games"], "terminal", "half", "mock", { top_games_hide_title: true }, [152, 152, 152]],
  [["top_games"], "default", "full", "mock", { top_games_hide_title: true }, [448, 448, 448]],
  [["top_games"], "terminal", "full", "mock", { top_games_hide_title: true }, [152, 152, 152]],
  [["top_games"], "default", "half", "mock", { top_games_max: 1 }, [120, 120, 120]],
  [["top_games"], "terminal", "half", "mock", { top_games_max: 1 }, [72, 72, 72]],
  [["top_games"], "default", "full", "mock", { top_games_max: 1 }, [132, 132, 132]],
  [["top_games"], "terminal", "full", "mock", { top_games_max: 1 }, [72, 72, 72]],
  [["top_games"], "default", "half", "mock", { top_games_max: 20 }, [440, 440, 440]],
  [["top_games"], "terminal", "half", "mock", { top_games_max: 20 }, [152, 152, 152]],
  [["top_games"], "default", "full", "mock", { top_games_max: 20 }, [500, 500, 500]],
  [["top_games"], "terminal", "full", "mock", { top_games_max: 20 }, [152, 152, 152]],
  [["top_games"], "default", "half", "mock", { top_games_style: "compact" }, [282, 282, 282]],
  [["top_games"], "terminal", "half", "mock", { top_games_style: "compact" }, [152, 152, 152]],
  [["top_games"], "default", "full", "mock", { top_games_style: "compact" }, [371, 371, 371]],
  [["top_games"], "terminal", "full", "mock", { top_games_style: "compact" }, [152, 152, 152]],
  [["top_games"], "default", "half", "12 games", {}, [440, 440, 440]],
  [["top_games"], "terminal", "half", "12 games", {}, [152, 152, 152]],
  [["top_games"], "default", "full", "12 games", {}, [500, 500, 500]],
  [["top_games"], "terminal", "full", "12 games", {}, [152, 152, 152]],
  [["top_games"], "default", "half", "7 games", {}, [440, 440, 440]],
  [["top_games"], "terminal", "half", "7 games", {}, [152, 152, 152]],
  [["top_games"], "default", "full", "7 games", {}, [500, 500, 500]],
  [["top_games"], "terminal", "full", "7 games", {}, [152, 152, 152]],
  [["top_games"], "default", "half", "no covers", {}, [440, 440, 440]],
  [["top_games"], "terminal", "half", "no covers", {}, [152, 152, 152]],
  [["top_games"], "default", "full", "no covers", {}, [500, 500, 500]],
  [["top_games"], "terminal", "full", "no covers", {}, [152, 152, 152]],
  [["top_games"], "default", "half", "no featured", {}, [440, 440, 440]],
  [["top_games"], "terminal", "half", "no featured", {}, [152, 152, 152]],
  [["top_games"], "default", "full", "no featured", {}, [500, 500, 500]],
  [["top_games"], "terminal", "full", "no featured", {}, [152, 152, 152]],
  [["statistics", "recent_games", "top_games"], "default", "half", "mock", {}, [1110, 1109, 1110]],
  [["statistics", "recent_games", "top_games"], "terminal", "half", "mock", {}, [400, 400, 400]],
  [["statistics", "recent_games", "top_games"], "default", "full", "mock", {}, [1254, 1253, 1254]],
  [["statistics", "recent_games", "top_games"], "terminal", "full", "mock", {}, [400, 400, 400]],
  [["statistics", "recent_games", "top_games"], "default", "half", "12 games", {}, [1190, 1189, 1190]],
  [["statistics", "recent_games", "top_games"], "terminal", "half", "12 games", {}, [420, 420, 420]],
  [["statistics", "recent_games", "top_games"], "default", "full", "12 games", {}, [1346, 1345, 1346]],
  [["statistics", "recent_games", "top_games"], "terminal", "full", "12 games", {}, [420, 420, 420]],
  [["statistics", "recent_games", "top_games"], "default", "half", "7 games", {}, [1190, 1189, 1190]],
  [["statistics", "recent_games", "top_games"], "terminal", "half", "7 games", {}, [420, 420, 420]],
  [["statistics", "recent_games", "top_games"], "default", "full", "7 games", {}, [1346, 1345, 1346]],
  [["statistics", "recent_games", "top_games"], "terminal", "full", "7 games", {}, [420, 420, 420]],
  [["statistics", "recent_games", "top_games"], "default", "half", "no covers", {}, [1114, 1113, 1114]],
  [["statistics", "recent_games", "top_games"], "terminal", "half", "no covers", {}, [400, 400, 400]],
  [["statistics", "recent_games", "top_games"], "default", "full", "no covers", {}, [1254, 1253, 1254]],
  [["statistics", "recent_games", "top_games"], "terminal", "full", "no covers", {}, [400, 400, 400]],
  [["statistics", "recent_games", "top_games"], "default", "half", "no featured", {}, [638, 638, 638]],
  [["statistics", "recent_games", "top_games"], "terminal", "half", "no featured", {}, [276, 276, 276]],
  [["statistics", "recent_games", "top_games"], "default", "full", "no featured", {}, [714, 714, 714]],
  [["statistics", "recent_games", "top_games"], "terminal", "full", "no featured", {}, [276, 276, 276]],
]

const plugin = PluginManager.getInstance().get("steam")!
let mock: SteamData

beforeAll(async () => {
  const sections = ["statistics", "recent_games", "top_games"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("steam section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
