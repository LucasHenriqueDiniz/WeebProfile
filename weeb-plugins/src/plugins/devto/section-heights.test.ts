import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { DevToData } from "./types"

/**
 * Height of the Dev.to profile and recent articles against what the browsers draw (the top
 * tags are being rewritten elsewhere and are left out).
 *
 * Until 11/2026 both counted a 45px title whether it was shown or not (up to 69px of blank
 * space with it hidden), the profile counted the 48px avatar where the name, username and
 * location row beside it draw 56 (15px cut), and the article rows 44px for the 36 they draw.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header), with every option that
 * changes the height and the mock changed as `VARIANTS` says.
 */

const VARIANTS = {
  mock: (m: DevToData): DevToData => m,
  "bare profile": (m: DevToData): DevToData => ({ ...m, profile: { ...m.profile, location: null, joinedAt: null } }),
  "no avatar": (m: DevToData): DevToData => ({
    ...m,
    profile: { ...m.profile, avatar: null, location: null, joinedAt: null },
  }),
  "12 articles": (m: DevToData): DevToData => ({
    ...m,
    recentArticles: Array.from({ length: 12 }, (_, i) => ({
      ...m.recentArticles[i % m.recentArticles.length]!,
      id: 500 + i,
    })),
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["profile"], "default", "half", "mock", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["profile"], "default", "full", "mock", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["profile"], "default", "half", "mock", { profile_hide_title: true }, [56, 56, 56]],
  [["profile"], "terminal", "half", "mock", { profile_hide_title: true }, [104, 104, 104]],
  [["profile"], "default", "full", "mock", { profile_hide_title: true }, [56, 56, 56]],
  [["profile"], "terminal", "full", "mock", { profile_hide_title: true }, [104, 104, 104]],
  [["profile"], "default", "half", "bare profile", {}, [98, 98, 98]],
  [["profile"], "terminal", "half", "bare profile", {}, [64, 64, 64]],
  [["profile"], "default", "full", "bare profile", {}, [100, 100, 100]],
  [["profile"], "terminal", "full", "bare profile", {}, [64, 64, 64]],
  [["profile"], "default", "half", "no avatar", {}, [90, 90, 90]],
  [["profile"], "terminal", "half", "no avatar", {}, [64, 64, 64]],
  [["profile"], "default", "full", "no avatar", {}, [92, 92, 92]],
  [["profile"], "terminal", "full", "no avatar", {}, [64, 64, 64]],
  [["profile"], "default", "half", "12 articles", {}, [106, 106, 106]],
  [["profile"], "terminal", "half", "12 articles", {}, [104, 104, 104]],
  [["profile"], "default", "full", "12 articles", {}, [108, 108, 108]],
  [["profile"], "terminal", "full", "12 articles", {}, [104, 104, 104]],
  [["recent_articles"], "default", "half", "mock", {}, [174, 174, 174]],
  [["recent_articles"], "terminal", "half", "mock", {}, [84, 84, 84]],
  [["recent_articles"], "default", "full", "mock", {}, [176, 176, 176]],
  [["recent_articles"], "terminal", "full", "mock", {}, [84, 84, 84]],
  [["recent_articles"], "default", "half", "mock", { recent_articles_hide_title: true }, [124, 124, 124]],
  [["recent_articles"], "terminal", "half", "mock", { recent_articles_hide_title: true }, [84, 84, 84]],
  [["recent_articles"], "default", "full", "mock", { recent_articles_hide_title: true }, [124, 124, 124]],
  [["recent_articles"], "terminal", "full", "mock", { recent_articles_hide_title: true }, [84, 84, 84]],
  [["recent_articles"], "default", "half", "mock", { recent_articles_max: 1 }, [86, 86, 86]],
  [["recent_articles"], "terminal", "half", "mock", { recent_articles_max: 1 }, [44, 44, 44]],
  [["recent_articles"], "default", "full", "mock", { recent_articles_max: 1 }, [88, 88, 88]],
  [["recent_articles"], "terminal", "full", "mock", { recent_articles_max: 1 }, [44, 44, 44]],
  [["recent_articles"], "default", "half", "mock", { recent_articles_max: 20 }, [174, 174, 174]],
  [["recent_articles"], "terminal", "half", "mock", { recent_articles_max: 20 }, [84, 84, 84]],
  [["recent_articles"], "default", "full", "mock", { recent_articles_max: 20 }, [176, 176, 176]],
  [["recent_articles"], "terminal", "full", "mock", { recent_articles_max: 20 }, [84, 84, 84]],
  [["recent_articles"], "default", "half", "bare profile", {}, [174, 174, 174]],
  [["recent_articles"], "terminal", "half", "bare profile", {}, [84, 84, 84]],
  [["recent_articles"], "default", "full", "bare profile", {}, [176, 176, 176]],
  [["recent_articles"], "terminal", "full", "bare profile", {}, [84, 84, 84]],
  [["recent_articles"], "default", "half", "no avatar", {}, [174, 174, 174]],
  [["recent_articles"], "terminal", "half", "no avatar", {}, [84, 84, 84]],
  [["recent_articles"], "default", "full", "no avatar", {}, [176, 176, 176]],
  [["recent_articles"], "terminal", "full", "no avatar", {}, [84, 84, 84]],
  [["recent_articles"], "default", "half", "12 articles", {}, [262, 262, 262]],
  [["recent_articles"], "terminal", "half", "12 articles", {}, [124, 124, 124]],
  [["recent_articles"], "default", "full", "12 articles", {}, [264, 264, 264]],
  [["recent_articles"], "terminal", "full", "12 articles", {}, [124, 124, 124]],
]

const plugin = PluginManager.getInstance().get("devto")!
let mock: DevToData

beforeAll(async () => {
  const sections = ["profile", "recent_articles"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("devto section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
