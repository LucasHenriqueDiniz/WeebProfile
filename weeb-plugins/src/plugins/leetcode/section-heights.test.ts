import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { LeetCodeData } from "./types"

/**
 * Height of every LeetCode section against what the browsers draw.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --plugin=leetcode
 * --variants --engine=all --data-variants=<VARIANTS as a module>` (renderPlugins, theme CSS, no
 * terminal header): each section alone and all of them in one card, with every option that
 * changes the height, and the mock changed as `VARIANTS` says. 100 cases, all exact in the
 * three engines.
 */

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

const VARIANTS = {
  mock: (m: LeetCodeData): LeetCodeData => m,
  // Every list at the API's or the option's maximum, with names too long for their column.
  many: (m: LeetCodeData): LeetCodeData => ({
    ...m,
    skills: range(30).map((i) => ({
      name: `Very Long Topic Tag Name Number ${i}`,
      category: "advanced" as const,
      solved: 1000 - i,
    })),
    languages: range(20).map((i) => ({ name: `Language${i}`, solved: 2000 - i })),
    recent: range(20).map((i) => ({
      title: `Minimum Number of Operations to Make Array Elements Equal ${i}`,
      slug: `p-${i}`,
      date: "2026-11-17T21:14:00Z",
    })),
  }),
  // A new account: nothing solved yet, so only the solved section draws.
  empty: (m: LeetCodeData): LeetCodeData => ({ ...m, skills: [], languages: [], recent: [] }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["solved"], "default", "half", "mock", {}, [158, 158, 158]],
  [["solved"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["solved"], "default", "full", "mock", {}, [160, 160, 160]],
  [["solved"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["solved"], "default", "half", "mock", { solved_hide_title: true }, [108, 108, 108]],
  [["solved"], "terminal", "half", "mock", { solved_hide_title: true }, [104, 104, 104]],
  [["solved"], "default", "full", "mock", { solved_hide_title: true }, [108, 108, 108]],
  [["solved"], "terminal", "full", "mock", { solved_hide_title: true }, [104, 104, 104]],
  [["solved"], "default", "half", "many", {}, [158, 158, 158]],
  [["solved"], "terminal", "half", "many", {}, [104, 104, 104]],
  [["solved"], "default", "full", "many", {}, [160, 160, 160]],
  [["solved"], "terminal", "full", "many", {}, [104, 104, 104]],
  [["solved"], "default", "half", "empty", {}, [158, 158, 158]],
  [["solved"], "terminal", "half", "empty", {}, [104, 104, 104]],
  [["solved"], "default", "full", "empty", {}, [160, 160, 160]],
  [["solved"], "terminal", "full", "empty", {}, [104, 104, 104]],
  [["skills"], "default", "half", "mock", {}, [304, 304, 304]],
  [["skills"], "terminal", "half", "mock", {}, [224, 224, 224]],
  [["skills"], "default", "full", "mock", {}, [306, 306, 306]],
  [["skills"], "terminal", "full", "mock", {}, [224, 224, 224]],
  [["skills"], "default", "half", "mock", { skills_hide_title: true }, [254, 254, 254]],
  [["skills"], "terminal", "half", "mock", { skills_hide_title: true }, [224, 224, 224]],
  [["skills"], "default", "full", "mock", { skills_hide_title: true }, [254, 254, 254]],
  [["skills"], "terminal", "full", "mock", { skills_hide_title: true }, [224, 224, 224]],
  [["skills"], "default", "half", "mock", { skills_max: 1 }, [70, 70, 70]],
  [["skills"], "terminal", "half", "mock", { skills_max: 1 }, [44, 44, 44]],
  [["skills"], "default", "full", "mock", { skills_max: 1 }, [72, 72, 72]],
  [["skills"], "terminal", "full", "mock", { skills_max: 1 }, [44, 44, 44]],
  [["skills"], "default", "half", "mock", { skills_max: 30 }, [356, 356, 356]],
  [["skills"], "terminal", "half", "mock", { skills_max: 30 }, [264, 264, 264]],
  [["skills"], "default", "full", "mock", { skills_max: 30 }, [358, 358, 358]],
  [["skills"], "terminal", "full", "mock", { skills_max: 30 }, [264, 264, 264]],
  [["skills"], "default", "half", "many", {}, [304, 304, 304]],
  [["skills"], "terminal", "half", "many", {}, [224, 224, 224]],
  [["skills"], "default", "full", "many", {}, [306, 306, 306]],
  [["skills"], "terminal", "full", "many", {}, [224, 224, 224]],
  [["skills"], "default", "half", "empty", {}, [0, 0, 0]],
  [["skills"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["skills"], "default", "full", "empty", {}, [0, 0, 0]],
  [["skills"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["languages"], "default", "half", "mock", {}, [174, 174, 174]],
  [["languages"], "terminal", "half", "mock", {}, [124, 124, 124]],
  [["languages"], "default", "full", "mock", {}, [176, 176, 176]],
  [["languages"], "terminal", "full", "mock", {}, [124, 124, 124]],
  [["languages"], "default", "half", "mock", { languages_hide_title: true }, [124, 124, 124]],
  [["languages"], "terminal", "half", "mock", { languages_hide_title: true }, [124, 124, 124]],
  [["languages"], "default", "full", "mock", { languages_hide_title: true }, [124, 124, 124]],
  [["languages"], "terminal", "full", "mock", { languages_hide_title: true }, [124, 124, 124]],
  [["languages"], "default", "half", "mock", { languages_max: 1 }, [70, 70, 70]],
  [["languages"], "terminal", "half", "mock", { languages_max: 1 }, [44, 44, 44]],
  [["languages"], "default", "full", "mock", { languages_max: 1 }, [72, 72, 72]],
  [["languages"], "terminal", "full", "mock", { languages_max: 1 }, [44, 44, 44]],
  [["languages"], "default", "half", "mock", { languages_max: 20 }, [174, 174, 174]],
  [["languages"], "terminal", "half", "mock", { languages_max: 20 }, [124, 124, 124]],
  [["languages"], "default", "full", "mock", { languages_max: 20 }, [176, 176, 176]],
  [["languages"], "terminal", "full", "mock", { languages_max: 20 }, [124, 124, 124]],
  [["languages"], "default", "half", "many", {}, [174, 174, 174]],
  [["languages"], "terminal", "half", "many", {}, [124, 124, 124]],
  [["languages"], "default", "full", "many", {}, [176, 176, 176]],
  [["languages"], "terminal", "full", "many", {}, [124, 124, 124]],
  [["languages"], "default", "half", "empty", {}, [0, 0, 0]],
  [["languages"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["languages"], "default", "full", "empty", {}, [0, 0, 0]],
  [["languages"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["recent"], "default", "half", "mock", {}, [186, 186, 186]],
  [["recent"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["recent"], "default", "full", "mock", {}, [188, 188, 188]],
  [["recent"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["recent"], "default", "half", "mock", { recent_hide_title: true }, [136, 136, 136]],
  [["recent"], "terminal", "half", "mock", { recent_hide_title: true }, [104, 104, 104]],
  [["recent"], "default", "full", "mock", { recent_hide_title: true }, [136, 136, 136]],
  [["recent"], "terminal", "full", "mock", { recent_hide_title: true }, [104, 104, 104]],
  [["recent"], "default", "half", "mock", { recent_max: 1 }, [74, 74, 74]],
  [["recent"], "terminal", "half", "mock", { recent_max: 1 }, [40, 40, 40]],
  [["recent"], "default", "full", "mock", { recent_max: 1 }, [76, 76, 76]],
  [["recent"], "terminal", "full", "mock", { recent_max: 1 }, [40, 40, 40]],
  [["recent"], "default", "half", "mock", { recent_max: 20 }, [186, 186, 186]],
  [["recent"], "terminal", "half", "mock", { recent_max: 20 }, [104, 104, 104]],
  [["recent"], "default", "full", "mock", { recent_max: 20 }, [188, 188, 188]],
  [["recent"], "terminal", "full", "mock", { recent_max: 20 }, [104, 104, 104]],
  [["recent"], "default", "half", "many", {}, [186, 186, 186]],
  [["recent"], "terminal", "half", "many", {}, [104, 104, 104]],
  [["recent"], "default", "full", "many", {}, [188, 188, 188]],
  [["recent"], "terminal", "full", "many", {}, [104, 104, 104]],
  [["recent"], "default", "half", "empty", {}, [0, 0, 0]],
  [["recent"], "terminal", "half", "empty", {}, [0, 0, 0]],
  [["recent"], "default", "full", "empty", {}, [0, 0, 0]],
  [["recent"], "terminal", "full", "empty", {}, [0, 0, 0]],
  [["solved", "skills", "languages", "recent"], "default", "half", "mock", {}, [822, 821, 822]],
  [["solved", "skills", "languages", "recent"], "terminal", "half", "mock", {}, [556, 556, 556]],
  [["solved", "skills", "languages", "recent"], "default", "full", "mock", {}, [830, 829, 830]],
  [["solved", "skills", "languages", "recent"], "terminal", "full", "mock", {}, [556, 556, 556]],
  [["solved", "skills", "languages", "recent"], "default", "half", "many", {}, [822, 821, 822]],
  [["solved", "skills", "languages", "recent"], "terminal", "half", "many", {}, [556, 556, 556]],
  [["solved", "skills", "languages", "recent"], "default", "full", "many", {}, [830, 829, 830]],
  [["solved", "skills", "languages", "recent"], "terminal", "full", "many", {}, [556, 556, 556]],
  [["solved", "skills", "languages", "recent"], "default", "half", "empty", {}, [158, 158, 158]],
  [["solved", "skills", "languages", "recent"], "terminal", "half", "empty", {}, [104, 104, 104]],
  [["solved", "skills", "languages", "recent"], "default", "full", "empty", {}, [160, 160, 160]],
  [["solved", "skills", "languages", "recent"], "terminal", "full", "empty", {}, [104, 104, 104]],
]

const plugin = PluginManager.getInstance().get("leetcode")!
let mock: LeetCodeData

beforeAll(async () => {
  const sections = ["solved", "skills", "languages", "recent"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("leetcode section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
