import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { DuolingoData } from "./types"

/**
 * Height of every Duolingo section against what the browsers draw.
 *
 * Until 11/2026 the streak counted its title as 45px, 5 to 7px under the 50/52 it draws with
 * the gap after it, total XP kept 52px for a hidden title, and the languages list 53px (a
 * 45px title and 8px of padding that is not drawn).
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header).
 */

const VARIANTS = { mock: (m: DuolingoData): DuolingoData => m }

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["current_streak"], "default", "half", "mock", {}, [112, 112, 112]],
  [["current_streak"], "terminal", "half", "mock", {}, [44, 44, 44]],
  [["current_streak"], "default", "full", "mock", {}, [112, 112, 112]],
  [["current_streak"], "terminal", "full", "mock", {}, [44, 44, 44]],
  [["current_streak"], "default", "half", "mock", { current_streak_hide_title: false }, [162, 162, 162]],
  [["current_streak"], "terminal", "half", "mock", { current_streak_hide_title: false }, [44, 44, 44]],
  [["current_streak"], "default", "full", "mock", { current_streak_hide_title: false }, [164, 164, 164]],
  [["current_streak"], "terminal", "full", "mock", { current_streak_hide_title: false }, [44, 44, 44]],
  [["total_xp"], "default", "half", "mock", {}, [138, 138, 138]],
  [["total_xp"], "terminal", "half", "mock", {}, [44, 44, 44]],
  [["total_xp"], "default", "full", "mock", {}, [140, 140, 140]],
  [["total_xp"], "terminal", "full", "mock", {}, [44, 44, 44]],
  [["total_xp"], "default", "half", "mock", { total_xp_hide_title: true }, [88, 88, 88]],
  [["total_xp"], "terminal", "half", "mock", { total_xp_hide_title: true }, [44, 44, 44]],
  [["total_xp"], "default", "full", "mock", { total_xp_hide_title: true }, [88, 88, 88]],
  [["total_xp"], "terminal", "full", "mock", { total_xp_hide_title: true }, [44, 44, 44]],
  [["languages_learning"], "default", "half", "mock", {}, [208, 208, 208]],
  [["languages_learning"], "terminal", "half", "mock", {}, [72, 72, 72]],
  [["languages_learning"], "default", "full", "mock", {}, [210, 210, 210]],
  [["languages_learning"], "terminal", "full", "mock", {}, [72, 72, 72]],
  [["languages_learning"], "default", "half", "mock", { languages_learning_hide_title: true }, [158, 158, 158]],
  [["languages_learning"], "terminal", "half", "mock", { languages_learning_hide_title: true }, [72, 72, 72]],
  [["languages_learning"], "default", "full", "mock", { languages_learning_hide_title: true }, [158, 158, 158]],
  [["languages_learning"], "terminal", "full", "mock", { languages_learning_hide_title: true }, [72, 72, 72]],
  [["languages_learning"], "default", "half", "mock", { languages_learning_max: 1 }, [100, 100, 100]],
  [["languages_learning"], "terminal", "half", "mock", { languages_learning_max: 1 }, [40, 40, 40]],
  [["languages_learning"], "default", "full", "mock", { languages_learning_max: 1 }, [102, 102, 102]],
  [["languages_learning"], "terminal", "full", "mock", { languages_learning_max: 1 }, [40, 40, 40]],
  [["languages_learning"], "default", "half", "mock", { languages_learning_max: 20 }, [208, 208, 208]],
  [["languages_learning"], "terminal", "half", "mock", { languages_learning_max: 20 }, [72, 72, 72]],
  [["languages_learning"], "default", "full", "mock", { languages_learning_max: 20 }, [210, 210, 210]],
  [["languages_learning"], "terminal", "full", "mock", { languages_learning_max: 20 }, [72, 72, 72]],
  [["current_streak", "total_xp", "languages_learning"], "default", "half", "mock", {}, [458, 458, 458]],
  [["current_streak", "total_xp", "languages_learning"], "terminal", "half", "mock", {}, [160, 160, 160]],
  [["current_streak", "total_xp", "languages_learning"], "default", "full", "mock", {}, [462, 462, 462]],
  [["current_streak", "total_xp", "languages_learning"], "terminal", "full", "mock", {}, [160, 160, 160]],
]

const plugin = PluginManager.getInstance().get("duolingo")!
let mock: DuolingoData

beforeAll(async () => {
  const sections = ["current_streak", "total_xp", "languages_learning"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("duolingo section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
