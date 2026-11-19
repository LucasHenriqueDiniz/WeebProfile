import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { WebsitesData } from "./types"

/**
 * Height of the websites section, in every variant, against what the browsers draw.
 *
 * Until 11/2026 the terminal counted 17px a line for TerminalLine's 16 (10px of blank space
 * for six sites), and the default style rounded each block up: 5px a grid row in half (15px
 * for six sites), 1.5px a list row, 3 to 16px for the featured layout. The `half:text-xs`
 * and `half:text-sm` titles take Tailwind's own line-height, which wins over `leading-tight`.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header), with every option that
 * changes the height and the mock changed as `VARIANTS` says.
 */

const VARIANTS = {
  mock: (m: WebsitesData): WebsitesData => m,
  // A grid row of a card with a description and one without: the row takes the taller
  "mixed descriptions": (m: WebsitesData): WebsitesData => ({
    ...m,
    websites: m.websites.map((w, i) => ({ ...w, description: i % 2 ? null : w.description })),
  }),
  "5 sites": (m: WebsitesData): WebsitesData => ({ ...m, websites: m.websites.slice(0, 5) }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["websites"], "default", "half", "mock", {}, [457, 457, 457]],
  [["websites"], "terminal", "half", "mock", {}, [128, 128, 128]],
  [["websites"], "default", "full", "mock", {}, [358, 358, 358]],
  [["websites"], "terminal", "full", "mock", {}, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_variant: "list" }, [299, 299, 299]],
  [["websites"], "terminal", "half", "mock", { websites_variant: "list" }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_variant: "list" }, [340, 340, 340]],
  [["websites"], "terminal", "full", "mock", { websites_variant: "list" }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_variant: "featured" }, [435, 434, 435]],
  [["websites"], "terminal", "half", "mock", { websites_variant: "featured" }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_variant: "featured" }, [490, 489, 490]],
  [["websites"], "terminal", "full", "mock", { websites_variant: "featured" }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_max: 1 }, [179, 179, 179]],
  [["websites"], "terminal", "half", "mock", { websites_max: 1 }, [48, 48, 48]],
  [["websites"], "default", "full", "mock", { websites_max: 1 }, [199, 199, 199]],
  [["websites"], "terminal", "full", "mock", { websites_max: 1 }, [48, 48, 48]],
  [["websites"], "default", "half", "mock", { websites_max: 12 }, [457, 457, 457]],
  [["websites"], "terminal", "half", "mock", { websites_max: 12 }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_max: 12 }, [358, 358, 358]],
  [["websites"], "terminal", "full", "mock", { websites_max: 12 }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_autofill: false }, [457, 457, 457]],
  [["websites"], "terminal", "half", "mock", { websites_autofill: false }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_autofill: false }, [358, 358, 358]],
  [["websites"], "terminal", "full", "mock", { websites_autofill: false }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_show_thumbnail: false }, [241, 241, 241]],
  [["websites"], "terminal", "half", "mock", { websites_show_thumbnail: false }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_show_thumbnail: false }, [182, 182, 182]],
  [["websites"], "terminal", "full", "mock", { websites_show_thumbnail: false }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_show_description: false }, [414, 414, 414]],
  [["websites"], "terminal", "half", "mock", { websites_show_description: false }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_show_description: false }, [327, 327, 327]],
  [["websites"], "terminal", "full", "mock", { websites_show_description: false }, [128, 128, 128]],
  [["websites"], "default", "half", "mock", { websites_hide_title: true }, [407, 407, 407]],
  [["websites"], "terminal", "half", "mock", { websites_hide_title: true }, [128, 128, 128]],
  [["websites"], "default", "full", "mock", { websites_hide_title: true }, [308, 308, 308]],
  [["websites"], "terminal", "full", "mock", { websites_hide_title: true }, [128, 128, 128]],
  [["websites"], "default", "half", "mixed descriptions", {}, [457, 457, 457]],
  [["websites"], "terminal", "half", "mixed descriptions", {}, [128, 128, 128]],
  [["websites"], "default", "full", "mixed descriptions", {}, [358, 358, 358]],
  [["websites"], "terminal", "full", "mixed descriptions", {}, [128, 128, 128]],
  [["websites"], "default", "half", "5 sites", {}, [457, 457, 457]],
  [["websites"], "terminal", "half", "5 sites", {}, [112, 112, 112]],
  [["websites"], "default", "full", "5 sites", {}, [358, 358, 358]],
  [["websites"], "terminal", "full", "5 sites", {}, [112, 112, 112]],
]

const plugin = PluginManager.getInstance().get("websites")!
let mock: WebsitesData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["websites"] } as never, true, undefined, true)) as never
})

describe("websites section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    // fetchData keeps the first `websites_max` sites; the mock is fetched once, with all six.
    const fetched = (data: WebsitesData, options: Record<string, unknown>): WebsitesData =>
      typeof options.websites_max === "number"
        ? { ...data, websites: data.websites.slice(0, options.websites_max) }
        : data
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED, { fetched })).toEqual([])
  })
})
