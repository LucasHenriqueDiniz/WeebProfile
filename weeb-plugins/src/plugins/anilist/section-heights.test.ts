import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { AniListData } from "./types"

/**
 * Height of every AniList section against what the browsers draw.
 *
 * Until 11/2026 every section counted a 45px title whether it was shown or not (up to 105px
 * of blank space), the favorites grid wrapped at four covers a row where the formula counted
 * five (a 1/5 width plus the 8px gaps does not fit five: 133px cut in half), statistics
 * counted 22px rows and no gap between the anime and manga blocks (29px cut), currently
 * watching counted every row with its 56px cover, also when the cover had failed to embed
 * (36px rows), and the terminal favorites 20px lines for TerminalLine's 16.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header): each section alone and all
 * of them in one card, with every option that changes the height, and the mock changed as
 * `VARIANTS` says.
 */

const PNG = "data:image/png;base64,iVBORw0KGgo="

const VARIANTS = {
  mock: (m: AniListData): AniListData => m,
  covers: (m: AniListData): AniListData => ({
    ...m,
    favoritesAnime: m.favoritesAnime.map((f) => ({ ...f, cover: PNG })),
    currentlyWatching: m.currentlyWatching.map((e) => ({ ...e, cover: PNG })),
  }),
  "12 favorites": (m: AniListData): AniListData => ({
    ...m,
    favoritesAnime: Array.from({ length: 12 }, (_, i) => ({
      ...m.favoritesAnime[i % m.favoritesAnime.length]!,
      id: 100 + i,
    })),
  }),
  // Rows of 56px and, without a cover, 36px in one list
  "one covered": (m: AniListData): AniListData => ({
    ...m,
    currentlyWatching: m.currentlyWatching.map((e, i) => ({ ...e, cover: i === 1 ? PNG : null })),
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["statistics"], "default", "half", "mock", {}, [250, 250, 250]],
  [["statistics"], "terminal", "half", "mock", {}, [184, 184, 184]],
  [["statistics"], "default", "full", "mock", {}, [144, 144, 144]],
  [["statistics"], "terminal", "full", "mock", {}, [184, 184, 184]],
  [["statistics"], "default", "half", "mock", { statistics_hide_title: true }, [200, 200, 200]],
  [["statistics"], "terminal", "half", "mock", { statistics_hide_title: true }, [184, 184, 184]],
  [["statistics"], "default", "full", "mock", { statistics_hide_title: true }, [92, 92, 92]],
  [["statistics"], "terminal", "full", "mock", { statistics_hide_title: true }, [184, 184, 184]],
  [["statistics"], "default", "half", "mock", { statistics_media: "anime" }, [142, 142, 142]],
  [["statistics"], "terminal", "half", "mock", { statistics_media: "anime" }, [104, 104, 104]],
  [["statistics"], "default", "full", "mock", { statistics_media: "anime" }, [144, 144, 144]],
  [["statistics"], "terminal", "full", "mock", { statistics_media: "anime" }, [104, 104, 104]],
  [["statistics"], "default", "half", "mock", { statistics_media: "manga" }, [142, 142, 142]],
  [["statistics"], "terminal", "half", "mock", { statistics_media: "manga" }, [104, 104, 104]],
  [["statistics"], "default", "full", "mock", { statistics_media: "manga" }, [144, 144, 144]],
  [["statistics"], "terminal", "full", "mock", { statistics_media: "manga" }, [104, 104, 104]],
  [["statistics"], "default", "half", "covers", {}, [250, 250, 250]],
  [["statistics"], "terminal", "half", "covers", {}, [184, 184, 184]],
  [["statistics"], "default", "full", "covers", {}, [144, 144, 144]],
  [["statistics"], "terminal", "full", "covers", {}, [184, 184, 184]],
  [["statistics"], "default", "half", "12 favorites", {}, [250, 250, 250]],
  [["statistics"], "terminal", "half", "12 favorites", {}, [184, 184, 184]],
  [["statistics"], "default", "full", "12 favorites", {}, [144, 144, 144]],
  [["statistics"], "terminal", "full", "12 favorites", {}, [184, 184, 184]],
  [["statistics"], "default", "half", "one covered", {}, [250, 250, 250]],
  [["statistics"], "terminal", "half", "one covered", {}, [184, 184, 184]],
  [["statistics"], "default", "full", "one covered", {}, [144, 144, 144]],
  [["statistics"], "terminal", "full", "one covered", {}, [184, 184, 184]],
  [["favorites_anime"], "default", "half", "mock", {}, [170, 170, 170]],
  [["favorites_anime"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["favorites_anime"], "default", "full", "mock", {}, [172, 172, 172]],
  [["favorites_anime"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["favorites_anime"], "default", "half", "mock", { favorites_anime_hide_title: true }, [120, 120, 120]],
  [["favorites_anime"], "terminal", "half", "mock", { favorites_anime_hide_title: true }, [104, 104, 104]],
  [["favorites_anime"], "default", "full", "mock", { favorites_anime_hide_title: true }, [120, 120, 120]],
  [["favorites_anime"], "terminal", "full", "mock", { favorites_anime_hide_title: true }, [104, 104, 104]],
  [["favorites_anime"], "default", "half", "mock", { favorites_anime_max: 1 }, [170, 170, 170]],
  [["favorites_anime"], "terminal", "half", "mock", { favorites_anime_max: 1 }, [40, 40, 40]],
  [["favorites_anime"], "default", "full", "mock", { favorites_anime_max: 1 }, [172, 172, 172]],
  [["favorites_anime"], "terminal", "full", "mock", { favorites_anime_max: 1 }, [40, 40, 40]],
  [["favorites_anime"], "default", "half", "mock", { favorites_anime_max: 20 }, [170, 170, 170]],
  [["favorites_anime"], "terminal", "half", "mock", { favorites_anime_max: 20 }, [104, 104, 104]],
  [["favorites_anime"], "default", "full", "mock", { favorites_anime_max: 20 }, [172, 172, 172]],
  [["favorites_anime"], "terminal", "full", "mock", { favorites_anime_max: 20 }, [104, 104, 104]],
  [["favorites_anime"], "default", "half", "covers", {}, [170, 170, 170]],
  [["favorites_anime"], "terminal", "half", "covers", {}, [104, 104, 104]],
  [["favorites_anime"], "default", "full", "covers", {}, [172, 172, 172]],
  [["favorites_anime"], "terminal", "full", "covers", {}, [104, 104, 104]],
  [["favorites_anime"], "default", "half", "12 favorites", {}, [298, 298, 298]],
  [["favorites_anime"], "terminal", "half", "12 favorites", {}, [184, 184, 184]],
  [["favorites_anime"], "default", "full", "12 favorites", {}, [300, 300, 300]],
  [["favorites_anime"], "terminal", "full", "12 favorites", {}, [216, 216, 216]],
  [["favorites_anime"], "default", "half", "one covered", {}, [170, 170, 170]],
  [["favorites_anime"], "terminal", "half", "one covered", {}, [104, 104, 104]],
  [["favorites_anime"], "default", "full", "one covered", {}, [172, 172, 172]],
  [["favorites_anime"], "terminal", "full", "one covered", {}, [104, 104, 104]],
  [["currently_watching"], "default", "half", "mock", {}, [234, 234, 234]],
  [["currently_watching"], "terminal", "half", "mock", {}, [84, 84, 84]],
  [["currently_watching"], "default", "full", "mock", {}, [236, 236, 236]],
  [["currently_watching"], "terminal", "full", "mock", {}, [84, 84, 84]],
  [["currently_watching"], "default", "half", "mock", { currently_watching_hide_title: true }, [184, 184, 184]],
  [["currently_watching"], "terminal", "half", "mock", { currently_watching_hide_title: true }, [84, 84, 84]],
  [["currently_watching"], "default", "full", "mock", { currently_watching_hide_title: true }, [184, 184, 184]],
  [["currently_watching"], "terminal", "full", "mock", { currently_watching_hide_title: true }, [84, 84, 84]],
  [["currently_watching"], "default", "half", "mock", { currently_watching_max: 1 }, [106, 106, 106]],
  [["currently_watching"], "terminal", "half", "mock", { currently_watching_max: 1 }, [44, 44, 44]],
  [["currently_watching"], "default", "full", "mock", { currently_watching_max: 1 }, [108, 108, 108]],
  [["currently_watching"], "terminal", "full", "mock", { currently_watching_max: 1 }, [44, 44, 44]],
  [["currently_watching"], "default", "half", "mock", { currently_watching_max: 20 }, [234, 234, 234]],
  [["currently_watching"], "terminal", "half", "mock", { currently_watching_max: 20 }, [84, 84, 84]],
  [["currently_watching"], "default", "full", "mock", { currently_watching_max: 20 }, [236, 236, 236]],
  [["currently_watching"], "terminal", "full", "mock", { currently_watching_max: 20 }, [84, 84, 84]],
  [["currently_watching"], "default", "half", "covers", {}, [234, 234, 234]],
  [["currently_watching"], "terminal", "half", "covers", {}, [84, 84, 84]],
  [["currently_watching"], "default", "full", "covers", {}, [236, 236, 236]],
  [["currently_watching"], "terminal", "full", "covers", {}, [84, 84, 84]],
  [["currently_watching"], "default", "half", "12 favorites", {}, [234, 234, 234]],
  [["currently_watching"], "terminal", "half", "12 favorites", {}, [84, 84, 84]],
  [["currently_watching"], "default", "full", "12 favorites", {}, [236, 236, 236]],
  [["currently_watching"], "terminal", "full", "12 favorites", {}, [84, 84, 84]],
  [["currently_watching"], "default", "half", "one covered", {}, [194, 194, 194]],
  [["currently_watching"], "terminal", "half", "one covered", {}, [84, 84, 84]],
  [["currently_watching"], "default", "full", "one covered", {}, [196, 196, 196]],
  [["currently_watching"], "terminal", "full", "one covered", {}, [84, 84, 84]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "half", "mock", {}, [654, 653, 654]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "half", "mock", {}, [372, 372, 372]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "full", "mock", {}, [552, 551, 552]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "full", "mock", {}, [372, 372, 372]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "half", "covers", {}, [654, 653, 654]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "half", "covers", {}, [372, 372, 372]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "full", "covers", {}, [552, 551, 552]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "full", "covers", {}, [372, 372, 372]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "half", "12 favorites", {}, [782, 781, 782]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "half", "12 favorites", {}, [452, 452, 452]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "full", "12 favorites", {}, [680, 679, 680]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "full", "12 favorites", {}, [484, 484, 484]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "half", "one covered", {}, [614, 613, 614]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "half", "one covered", {}, [372, 372, 372]],
  [["statistics", "favorites_anime", "currently_watching"], "default", "full", "one covered", {}, [512, 511, 512]],
  [["statistics", "favorites_anime", "currently_watching"], "terminal", "full", "one covered", {}, [372, 372, 372]],
]

const plugin = PluginManager.getInstance().get("anilist")!
let mock: AniListData

beforeAll(async () => {
  const sections = ["statistics", "favorites_anime", "currently_watching"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("anilist section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
