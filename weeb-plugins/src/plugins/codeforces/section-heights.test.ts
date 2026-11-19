import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { CodeforcesData } from "./types"

/**
 * Height of every Codeforces section against what the browsers draw.
 *
 * Until 11/2026 the default style counted each title and its gap as 52px, shown or hidden:
 * 52px of blank space under a section with its title hidden, 2px in half, where the gap is
 * 10px. Recent submissions counted 8px of padding that is not drawn. Firefox drew the
 * terminal's TerminalLine 17px tall for Chrome's and WebKit's 16 (5px past the card with
 * five submissions) until the line got a fixed height.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header): each section alone and all
 * of them in one card, with every option that changes the height, and the mock changed as
 * `VARIANTS` says.
 */

const VARIANTS = {
  mock: (m: CodeforcesData): CodeforcesData => m,
  "12 submissions": (m: CodeforcesData): CodeforcesData => ({
    ...m,
    recentSubmissions: Array.from({ length: 12 }, (_, i) => ({
      ...m.recentSubmissions[i % m.recentSubmissions.length]!,
      id: 9000 + i,
    })),
  }),
  "no difficulties": (m: CodeforcesData): CodeforcesData => ({
    ...m,
    problemsSolved: { ...m.problemsSolved!, byDifficulty: {} },
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["rating_rank"], "default", "half", "mock", {}, [74, 74, 74]],
  [["rating_rank"], "terminal", "half", "mock", {}, [64, 64, 64]],
  [["rating_rank"], "default", "full", "mock", {}, [76, 76, 76]],
  [["rating_rank"], "terminal", "full", "mock", {}, [64, 64, 64]],
  [["rating_rank"], "default", "half", "mock", { rating_rank_hide_title: true }, [24, 24, 24]],
  [["rating_rank"], "terminal", "half", "mock", { rating_rank_hide_title: true }, [64, 64, 64]],
  [["rating_rank"], "default", "full", "mock", { rating_rank_hide_title: true }, [24, 24, 24]],
  [["rating_rank"], "terminal", "full", "mock", { rating_rank_hide_title: true }, [64, 64, 64]],
  [["rating_rank"], "default", "half", "12 submissions", {}, [74, 74, 74]],
  [["rating_rank"], "terminal", "half", "12 submissions", {}, [64, 64, 64]],
  [["rating_rank"], "default", "full", "12 submissions", {}, [76, 76, 76]],
  [["rating_rank"], "terminal", "full", "12 submissions", {}, [64, 64, 64]],
  [["rating_rank"], "default", "half", "no difficulties", {}, [74, 74, 74]],
  [["rating_rank"], "terminal", "half", "no difficulties", {}, [64, 64, 64]],
  [["rating_rank"], "default", "full", "no difficulties", {}, [76, 76, 76]],
  [["rating_rank"], "terminal", "full", "no difficulties", {}, [64, 64, 64]],
  [["contests_participated"], "default", "half", "mock", {}, [78, 78, 78]],
  [["contests_participated"], "terminal", "half", "mock", {}, [44, 44, 44]],
  [["contests_participated"], "default", "full", "mock", {}, [80, 80, 80]],
  [["contests_participated"], "terminal", "full", "mock", {}, [44, 44, 44]],
  [["contests_participated"], "default", "half", "mock", { contests_participated_hide_title: true }, [28, 28, 28]],
  [["contests_participated"], "terminal", "half", "mock", { contests_participated_hide_title: true }, [44, 44, 44]],
  [["contests_participated"], "default", "full", "mock", { contests_participated_hide_title: true }, [28, 28, 28]],
  [["contests_participated"], "terminal", "full", "mock", { contests_participated_hide_title: true }, [44, 44, 44]],
  [["contests_participated"], "default", "half", "12 submissions", {}, [78, 78, 78]],
  [["contests_participated"], "terminal", "half", "12 submissions", {}, [44, 44, 44]],
  [["contests_participated"], "default", "full", "12 submissions", {}, [80, 80, 80]],
  [["contests_participated"], "terminal", "full", "12 submissions", {}, [44, 44, 44]],
  [["contests_participated"], "default", "half", "no difficulties", {}, [78, 78, 78]],
  [["contests_participated"], "terminal", "half", "no difficulties", {}, [44, 44, 44]],
  [["contests_participated"], "default", "full", "no difficulties", {}, [80, 80, 80]],
  [["contests_participated"], "terminal", "full", "no difficulties", {}, [44, 44, 44]],
  [["problems_solved"], "default", "half", "mock", {}, [130, 130, 130]],
  [["problems_solved"], "terminal", "half", "mock", {}, [224, 224, 224]],
  [["problems_solved"], "default", "full", "mock", {}, [104, 104, 104]],
  [["problems_solved"], "terminal", "full", "mock", {}, [224, 224, 224]],
  [["problems_solved"], "default", "half", "mock", { problems_solved_hide_title: true }, [80, 80, 80]],
  [["problems_solved"], "terminal", "half", "mock", { problems_solved_hide_title: true }, [224, 224, 224]],
  [["problems_solved"], "default", "full", "mock", { problems_solved_hide_title: true }, [52, 52, 52]],
  [["problems_solved"], "terminal", "full", "mock", { problems_solved_hide_title: true }, [224, 224, 224]],
  [["problems_solved"], "default", "half", "12 submissions", {}, [130, 130, 130]],
  [["problems_solved"], "terminal", "half", "12 submissions", {}, [224, 224, 224]],
  [["problems_solved"], "default", "full", "12 submissions", {}, [104, 104, 104]],
  [["problems_solved"], "terminal", "full", "12 submissions", {}, [224, 224, 224]],
  [["problems_solved"], "default", "half", "no difficulties", {}, [74, 74, 74]],
  [["problems_solved"], "terminal", "half", "no difficulties", {}, [44, 44, 44]],
  [["problems_solved"], "default", "full", "no difficulties", {}, [76, 76, 76]],
  [["problems_solved"], "terminal", "full", "no difficulties", {}, [44, 44, 44]],
  [["recent_submissions"], "default", "half", "mock", {}, [208, 208, 208]],
  [["recent_submissions"], "terminal", "half", "mock", {}, [72, 72, 72]],
  [["recent_submissions"], "default", "full", "mock", {}, [210, 210, 210]],
  [["recent_submissions"], "terminal", "full", "mock", {}, [72, 72, 72]],
  [["recent_submissions"], "default", "half", "mock", { recent_submissions_hide_title: true }, [158, 158, 158]],
  [["recent_submissions"], "terminal", "half", "mock", { recent_submissions_hide_title: true }, [72, 72, 72]],
  [["recent_submissions"], "default", "full", "mock", { recent_submissions_hide_title: true }, [158, 158, 158]],
  [["recent_submissions"], "terminal", "full", "mock", { recent_submissions_hide_title: true }, [72, 72, 72]],
  [["recent_submissions"], "default", "half", "mock", { recent_submissions_max: 1 }, [100, 100, 100]],
  [["recent_submissions"], "terminal", "half", "mock", { recent_submissions_max: 1 }, [40, 40, 40]],
  [["recent_submissions"], "default", "full", "mock", { recent_submissions_max: 1 }, [102, 102, 102]],
  [["recent_submissions"], "terminal", "full", "mock", { recent_submissions_max: 1 }, [40, 40, 40]],
  [["recent_submissions"], "default", "half", "mock", { recent_submissions_max: 50 }, [208, 208, 208]],
  [["recent_submissions"], "terminal", "half", "mock", { recent_submissions_max: 50 }, [72, 72, 72]],
  [["recent_submissions"], "default", "full", "mock", { recent_submissions_max: 50 }, [210, 210, 210]],
  [["recent_submissions"], "terminal", "full", "mock", { recent_submissions_max: 50 }, [72, 72, 72]],
  [["recent_submissions"], "default", "half", "12 submissions", {}, [316, 316, 316]],
  [["recent_submissions"], "terminal", "half", "12 submissions", {}, [104, 104, 104]],
  [["recent_submissions"], "default", "full", "12 submissions", {}, [318, 318, 318]],
  [["recent_submissions"], "terminal", "full", "12 submissions", {}, [104, 104, 104]],
  [["recent_submissions"], "default", "half", "no difficulties", {}, [208, 208, 208]],
  [["recent_submissions"], "terminal", "half", "no difficulties", {}, [72, 72, 72]],
  [["recent_submissions"], "default", "full", "no difficulties", {}, [210, 210, 210]],
  [["recent_submissions"], "terminal", "full", "no difficulties", {}, [72, 72, 72]],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "half",
    "mock",
    {},
    [490, 489, 490],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "half",
    "mock",
    {},
    [404, 404, 404],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "full",
    "mock",
    {},
    [470, 469, 470],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "full",
    "mock",
    {},
    [404, 404, 404],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "half",
    "12 submissions",
    {},
    [598, 597, 598],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "half",
    "12 submissions",
    {},
    [436, 436, 436],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "full",
    "12 submissions",
    {},
    [578, 577, 578],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "full",
    "12 submissions",
    {},
    [436, 436, 436],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "half",
    "no difficulties",
    {},
    [434, 433, 434],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "half",
    "no difficulties",
    {},
    [224, 224, 224],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "default",
    "full",
    "no difficulties",
    {},
    [442, 441, 442],
  ],
  [
    ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
    "terminal",
    "full",
    "no difficulties",
    {},
    [224, 224, 224],
  ],
]

const plugin = PluginManager.getInstance().get("codeforces")!
let mock: CodeforcesData

beforeAll(async () => {
  const sections = ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("codeforces section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
