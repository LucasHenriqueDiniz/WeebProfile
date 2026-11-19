import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { CodewarsData } from "./types"

/**
 * Height of every Codewars section against what the browsers draw.
 *
 * Until 11/2026 the default style counted each title and its gap as 52px, shown or hidden:
 * 52px of blank space under a section with its title hidden, 2px in half, where the gap is
 * 10px. The lists counted 8px of padding that is not drawn, and the leaderboard 76px for
 * the 100 it draws (24px cut) and 54 in the terminal for 44.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header): each section alone and all
 * of them in one card, with every option that changes the height, and the mock changed as
 * `VARIANTS` says.
 */

const ARRAY = <T>(list: T[], n: number, rename: (item: T, i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => rename(list[i % list.length] as T, i))

const VARIANTS = {
  mock: (m: CodewarsData): CodewarsData => m,
  "12 kata": (m: CodewarsData): CodewarsData => ({
    ...m,
    completedKata: ARRAY(m.completedKata!, 12, (k, i) => ({ ...k, id: `k${i}` })),
  }),
  "no position": (m: CodewarsData): CodewarsData => ({ ...m, leaderboardPosition: undefined }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["rank_honor"], "default", "half", "mock", {}, [74, 74, 74]],
  [["rank_honor"], "terminal", "half", "mock", {}, [64, 64, 64]],
  [["rank_honor"], "default", "full", "mock", {}, [76, 76, 76]],
  [["rank_honor"], "terminal", "full", "mock", {}, [64, 64, 64]],
  [["rank_honor"], "default", "half", "mock", { rank_honor_hide_title: true }, [24, 24, 24]],
  [["rank_honor"], "terminal", "half", "mock", { rank_honor_hide_title: true }, [64, 64, 64]],
  [["rank_honor"], "default", "full", "mock", { rank_honor_hide_title: true }, [24, 24, 24]],
  [["rank_honor"], "terminal", "full", "mock", { rank_honor_hide_title: true }, [64, 64, 64]],
  [["rank_honor"], "default", "half", "12 kata", {}, [74, 74, 74]],
  [["rank_honor"], "terminal", "half", "12 kata", {}, [64, 64, 64]],
  [["rank_honor"], "default", "full", "12 kata", {}, [76, 76, 76]],
  [["rank_honor"], "terminal", "full", "12 kata", {}, [64, 64, 64]],
  [["rank_honor"], "default", "half", "no position", {}, [74, 74, 74]],
  [["rank_honor"], "terminal", "half", "no position", {}, [64, 64, 64]],
  [["rank_honor"], "default", "full", "no position", {}, [76, 76, 76]],
  [["rank_honor"], "terminal", "full", "no position", {}, [64, 64, 64]],
  [["completed_kata"], "default", "half", "mock", {}, [316, 316, 316]],
  [["completed_kata"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["completed_kata"], "default", "full", "mock", {}, [318, 318, 318]],
  [["completed_kata"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["completed_kata"], "default", "half", "mock", { completed_kata_hide_title: true }, [266, 266, 266]],
  [["completed_kata"], "terminal", "half", "mock", { completed_kata_hide_title: true }, [104, 104, 104]],
  [["completed_kata"], "default", "full", "mock", { completed_kata_hide_title: true }, [266, 266, 266]],
  [["completed_kata"], "terminal", "full", "mock", { completed_kata_hide_title: true }, [104, 104, 104]],
  [["completed_kata"], "default", "half", "mock", { completed_kata_max: 1 }, [100, 100, 100]],
  [["completed_kata"], "terminal", "half", "mock", { completed_kata_max: 1 }, [40, 40, 40]],
  [["completed_kata"], "default", "full", "mock", { completed_kata_max: 1 }, [102, 102, 102]],
  [["completed_kata"], "terminal", "full", "mock", { completed_kata_max: 1 }, [40, 40, 40]],
  [["completed_kata"], "default", "half", "mock", { completed_kata_max: 50 }, [316, 316, 316]],
  [["completed_kata"], "terminal", "half", "mock", { completed_kata_max: 50 }, [104, 104, 104]],
  [["completed_kata"], "default", "full", "mock", { completed_kata_max: 50 }, [318, 318, 318]],
  [["completed_kata"], "terminal", "full", "mock", { completed_kata_max: 50 }, [104, 104, 104]],
  [["completed_kata"], "default", "half", "12 kata", {}, [316, 316, 316]],
  [["completed_kata"], "terminal", "half", "12 kata", {}, [104, 104, 104]],
  [["completed_kata"], "default", "full", "12 kata", {}, [318, 318, 318]],
  [["completed_kata"], "terminal", "full", "12 kata", {}, [104, 104, 104]],
  [["completed_kata"], "default", "half", "no position", {}, [316, 316, 316]],
  [["completed_kata"], "terminal", "half", "no position", {}, [104, 104, 104]],
  [["completed_kata"], "default", "full", "no position", {}, [318, 318, 318]],
  [["completed_kata"], "terminal", "full", "no position", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "half", "mock", {}, [316, 316, 316]],
  [["languages_proficiency"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "full", "mock", {}, [318, 318, 318]],
  [["languages_proficiency"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "half", "mock", { languages_proficiency_hide_title: true }, [266, 266, 266]],
  [["languages_proficiency"], "terminal", "half", "mock", { languages_proficiency_hide_title: true }, [104, 104, 104]],
  [["languages_proficiency"], "default", "full", "mock", { languages_proficiency_hide_title: true }, [266, 266, 266]],
  [["languages_proficiency"], "terminal", "full", "mock", { languages_proficiency_hide_title: true }, [104, 104, 104]],
  [["languages_proficiency"], "default", "half", "mock", { languages_proficiency_max: 1 }, [100, 100, 100]],
  [["languages_proficiency"], "terminal", "half", "mock", { languages_proficiency_max: 1 }, [40, 40, 40]],
  [["languages_proficiency"], "default", "full", "mock", { languages_proficiency_max: 1 }, [102, 102, 102]],
  [["languages_proficiency"], "terminal", "full", "mock", { languages_proficiency_max: 1 }, [40, 40, 40]],
  [["languages_proficiency"], "default", "half", "mock", { languages_proficiency_max: 20 }, [316, 316, 316]],
  [["languages_proficiency"], "terminal", "half", "mock", { languages_proficiency_max: 20 }, [104, 104, 104]],
  [["languages_proficiency"], "default", "full", "mock", { languages_proficiency_max: 20 }, [318, 318, 318]],
  [["languages_proficiency"], "terminal", "full", "mock", { languages_proficiency_max: 20 }, [104, 104, 104]],
  [["languages_proficiency"], "default", "half", "12 kata", {}, [316, 316, 316]],
  [["languages_proficiency"], "terminal", "half", "12 kata", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "full", "12 kata", {}, [318, 318, 318]],
  [["languages_proficiency"], "terminal", "full", "12 kata", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "half", "no position", {}, [316, 316, 316]],
  [["languages_proficiency"], "terminal", "half", "no position", {}, [104, 104, 104]],
  [["languages_proficiency"], "default", "full", "no position", {}, [318, 318, 318]],
  [["languages_proficiency"], "terminal", "full", "no position", {}, [104, 104, 104]],
  [["leaderboard_position"], "default", "half", "mock", {}, [98, 98, 98]],
  [["leaderboard_position"], "terminal", "half", "mock", {}, [44, 44, 44]],
  [["leaderboard_position"], "default", "full", "mock", {}, [100, 100, 100]],
  [["leaderboard_position"], "terminal", "full", "mock", {}, [44, 44, 44]],
  [["leaderboard_position"], "default", "half", "mock", { leaderboard_position_hide_title: true }, [48, 48, 48]],
  [["leaderboard_position"], "terminal", "half", "mock", { leaderboard_position_hide_title: true }, [44, 44, 44]],
  [["leaderboard_position"], "default", "full", "mock", { leaderboard_position_hide_title: true }, [48, 48, 48]],
  [["leaderboard_position"], "terminal", "full", "mock", { leaderboard_position_hide_title: true }, [44, 44, 44]],
  [["leaderboard_position"], "default", "half", "12 kata", {}, [98, 98, 98]],
  [["leaderboard_position"], "terminal", "half", "12 kata", {}, [44, 44, 44]],
  [["leaderboard_position"], "default", "full", "12 kata", {}, [100, 100, 100]],
  [["leaderboard_position"], "terminal", "full", "12 kata", {}, [44, 44, 44]],
  [["leaderboard_position"], "default", "half", "no position", {}, [0, 0, 0]],
  [["leaderboard_position"], "terminal", "half", "no position", {}, [0, 0, 0]],
  [["leaderboard_position"], "default", "full", "no position", {}, [0, 0, 0]],
  [["leaderboard_position"], "terminal", "full", "no position", {}, [0, 0, 0]],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "half",
    "mock",
    {},
    [804, 803, 804],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "half",
    "mock",
    {},
    [316, 316, 316],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "full",
    "mock",
    {},
    [812, 811, 812],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "full",
    "mock",
    {},
    [316, 316, 316],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "half",
    "12 kata",
    {},
    [804, 803, 804],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "half",
    "12 kata",
    {},
    [316, 316, 316],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "full",
    "12 kata",
    {},
    [812, 811, 812],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "full",
    "12 kata",
    {},
    [316, 316, 316],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "half",
    "no position",
    {},
    [706, 705, 706],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "half",
    "no position",
    {},
    [272, 272, 272],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "default",
    "full",
    "no position",
    {},
    [712, 711, 712],
  ],
  [
    ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
    "terminal",
    "full",
    "no position",
    {},
    [272, 272, 272],
  ],
]

const plugin = PluginManager.getInstance().get("codewars")!
let mock: CodewarsData

beforeAll(async () => {
  const sections = ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("codewars section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
