import { describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import { MOCK_DATA } from "./services/mock-data"
import type { WowForeverData } from "./types"

/**
 * Height of every WoW Forever section against what the browsers draw.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 19/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --plugin=wow_forever
 * --variants --engine=all --data-variants=<VARIANTS>` (renderPlugins, theme CSS, no terminal
 * header): each section alone and all three in one card, with every option that changes the
 * height and the mock changed as `VARIANTS` says. 164 cases, all exact in the three engines.
 * The region option is left out: it changes nothing in the mock.
 */

type Data = WowForeverData

const fewFields = (m: Data): Data => ({
  ...m,
  character: { ...m.character, guild: null, honorableKills: null, averageItemLevel: null },
})

const VARIANTS = {
  mock: (m: Data): Data => m,
  "no-image": (m: Data): Data => ({ ...m, image: null }),
  avatar: (m: Data): Data => ({ ...m, image: m.image ? { ...m.image, kind: "avatar" } : null }),
  "few-fields": fewFields,
  "few-fields-no-image": (m: Data): Data => ({ ...fewFields(m), image: null }),
  "three-items": (m: Data): Data => ({ ...m, equipment: m.equipment.slice(0, 3) }),
  "no-spirit": (m: Data): Data => ({ ...m, stats: m.stats.filter((s) => s.label !== "Spirit") }),
  // Every line ends in an ellipsis instead of wrapping: the height does not change.
  "long-names": (m: Data): Data => ({
    ...m,
    character: {
      ...m.character,
      name: "Thelandrielleon",
      surname: "Shadowmoonbrightwhisper",
      guild: "Knights of the Eternal Ebon Blade Vanguard",
    },
    equipment: m.equipment.map((i) => ({ ...i, name: `${i.name} of the Whispering Shadows` })),
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["character"], "default", "half", "mock", {}, [208, 208, 208]],
  [["character"], "terminal", "half", "mock", {}, [240, 240, 240]],
  [["character"], "default", "full", "mock", {}, [248, 248, 248]],
  [["character"], "terminal", "full", "mock", {}, [240, 240, 240]],
  [["character"], "default", "half", "mock", { character_hide_title: true }, [176, 176, 176]],
  [["character"], "terminal", "half", "mock", { character_hide_title: true }, [240, 240, 240]],
  [["character"], "default", "full", "mock", { character_hide_title: true }, [216, 216, 216]],
  [["character"], "terminal", "full", "mock", { character_hide_title: true }, [240, 240, 240]],
  [["character"], "default", "half", "mock", { character_image: "avatar" }, [200, 200, 200]],
  [["character"], "terminal", "half", "mock", { character_image: "avatar" }, [240, 240, 240]],
  [["character"], "default", "full", "mock", { character_image: "avatar" }, [218, 218, 218]],
  [["character"], "terminal", "full", "mock", { character_image: "avatar" }, [240, 240, 240]],
  [["character"], "default", "half", "mock", { character_image: "none" }, [200, 200, 200]],
  [["character"], "terminal", "half", "mock", { character_image: "none" }, [240, 240, 240]],
  [["character"], "default", "full", "mock", { character_image: "none" }, [218, 218, 218]],
  [["character"], "terminal", "full", "mock", { character_image: "none" }, [240, 240, 240]],
  [["character"], "default", "half", "no-image", {}, [200, 200, 200]],
  [["character"], "terminal", "half", "no-image", {}, [240, 240, 240]],
  [["character"], "default", "full", "no-image", {}, [218, 218, 218]],
  [["character"], "terminal", "full", "no-image", {}, [240, 240, 240]],
  [["character"], "default", "half", "avatar", {}, [200, 200, 200]],
  [["character"], "terminal", "half", "avatar", {}, [240, 240, 240]],
  [["character"], "default", "full", "avatar", {}, [218, 218, 218]],
  [["character"], "terminal", "full", "avatar", {}, [240, 240, 240]],
  [["character"], "default", "half", "few-fields", {}, [208, 208, 208]],
  [["character"], "terminal", "half", "few-fields", {}, [200, 200, 200]],
  [["character"], "default", "full", "few-fields", {}, [248, 248, 248]],
  [["character"], "terminal", "full", "few-fields", {}, [240, 240, 240]],
  [["character"], "default", "half", "few-fields-no-image", {}, [140, 140, 140]],
  [["character"], "terminal", "half", "few-fields-no-image", {}, [180, 180, 180]],
  [["character"], "default", "full", "few-fields-no-image", {}, [152, 152, 152]],
  [["character"], "terminal", "full", "few-fields-no-image", {}, [180, 180, 180]],
  [["character"], "default", "half", "three-items", {}, [208, 208, 208]],
  [["character"], "terminal", "half", "three-items", {}, [240, 240, 240]],
  [["character"], "default", "full", "three-items", {}, [248, 248, 248]],
  [["character"], "terminal", "full", "three-items", {}, [240, 240, 240]],
  [["character"], "default", "half", "no-spirit", {}, [208, 208, 208]],
  [["character"], "terminal", "half", "no-spirit", {}, [240, 240, 240]],
  [["character"], "default", "full", "no-spirit", {}, [248, 248, 248]],
  [["character"], "terminal", "full", "no-spirit", {}, [240, 240, 240]],
  [["character"], "default", "half", "long-names", {}, [208, 208, 208]],
  [["character"], "terminal", "half", "long-names", {}, [240, 240, 240]],
  [["character"], "default", "full", "long-names", {}, [248, 248, 248]],
  [["character"], "terminal", "full", "long-names", {}, [240, 240, 240]],
  [["equipment"], "default", "half", "mock", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "mock", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "mock", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "mock", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "mock", { equipment_hide_title: true }, [400, 400, 400]],
  [["equipment"], "terminal", "half", "mock", { equipment_hide_title: true }, [360, 360, 360]],
  [["equipment"], "default", "full", "mock", { equipment_hide_title: true }, [208, 208, 208]],
  [["equipment"], "terminal", "full", "mock", { equipment_hide_title: true }, [200, 200, 200]],
  [["equipment"], "default", "half", "mock", { equipment_max: 1 }, [72, 72, 72]],
  [["equipment"], "terminal", "half", "mock", { equipment_max: 1 }, [60, 60, 60]],
  [["equipment"], "default", "full", "mock", { equipment_max: 1 }, [72, 72, 72]],
  [["equipment"], "terminal", "full", "mock", { equipment_max: 1 }, [60, 60, 60]],
  [["equipment"], "default", "half", "no-image", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "no-image", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "no-image", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "no-image", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "avatar", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "avatar", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "avatar", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "avatar", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "few-fields", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "few-fields", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "few-fields", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "few-fields", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "few-fields-no-image", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "few-fields-no-image", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "few-fields-no-image", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "few-fields-no-image", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "three-items", {}, [120, 120, 120]],
  [["equipment"], "terminal", "half", "three-items", {}, [100, 100, 100]],
  [["equipment"], "default", "full", "three-items", {}, [96, 96, 96]],
  [["equipment"], "terminal", "full", "three-items", {}, [80, 80, 80]],
  [["equipment"], "default", "half", "no-spirit", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "no-spirit", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "no-spirit", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "no-spirit", {}, [200, 200, 200]],
  [["equipment"], "default", "half", "long-names", {}, [432, 432, 432]],
  [["equipment"], "terminal", "half", "long-names", {}, [360, 360, 360]],
  [["equipment"], "default", "full", "long-names", {}, [240, 240, 240]],
  [["equipment"], "terminal", "full", "long-names", {}, [200, 200, 200]],
  [["stats"], "default", "half", "mock", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "mock", {}, [120, 120, 120]],
  [["stats"], "default", "full", "mock", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "mock", {}, [80, 80, 80]],
  [["stats"], "default", "half", "mock", { stats_hide_title: true }, [120, 120, 120]],
  [["stats"], "terminal", "half", "mock", { stats_hide_title: true }, [120, 120, 120]],
  [["stats"], "default", "full", "mock", { stats_hide_title: true }, [64, 64, 64]],
  [["stats"], "terminal", "full", "mock", { stats_hide_title: true }, [80, 80, 80]],
  [["stats"], "default", "half", "no-image", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "no-image", {}, [120, 120, 120]],
  [["stats"], "default", "full", "no-image", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "no-image", {}, [80, 80, 80]],
  [["stats"], "default", "half", "avatar", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "avatar", {}, [120, 120, 120]],
  [["stats"], "default", "full", "avatar", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "avatar", {}, [80, 80, 80]],
  [["stats"], "default", "half", "few-fields", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "few-fields", {}, [120, 120, 120]],
  [["stats"], "default", "full", "few-fields", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "few-fields", {}, [80, 80, 80]],
  [["stats"], "default", "half", "few-fields-no-image", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "few-fields-no-image", {}, [120, 120, 120]],
  [["stats"], "default", "full", "few-fields-no-image", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "few-fields-no-image", {}, [80, 80, 80]],
  [["stats"], "default", "half", "three-items", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "three-items", {}, [120, 120, 120]],
  [["stats"], "default", "full", "three-items", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "three-items", {}, [80, 80, 80]],
  [["stats"], "default", "half", "no-spirit", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "no-spirit", {}, [120, 120, 120]],
  [["stats"], "default", "full", "no-spirit", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "no-spirit", {}, [80, 80, 80]],
  [["stats"], "default", "half", "long-names", {}, [152, 152, 152]],
  [["stats"], "terminal", "half", "long-names", {}, [120, 120, 120]],
  [["stats"], "default", "full", "long-names", {}, [96, 96, 96]],
  [["stats"], "terminal", "full", "long-names", {}, [80, 80, 80]],
  [["character", "equipment", "stats"], "default", "half", "mock", {}, [792, 791, 792]],
  [["character", "equipment", "stats"], "terminal", "half", "mock", {}, [720, 720, 720]],
  [["character", "equipment", "stats"], "default", "full", "mock", {}, [584, 583, 584]],
  [["character", "equipment", "stats"], "terminal", "full", "mock", {}, [520, 520, 520]],
  [["character", "equipment", "stats"], "default", "half", "no-image", {}, [784, 783, 784]],
  [["character", "equipment", "stats"], "terminal", "half", "no-image", {}, [720, 720, 720]],
  [["character", "equipment", "stats"], "default", "full", "no-image", {}, [554, 553, 554]],
  [["character", "equipment", "stats"], "terminal", "full", "no-image", {}, [520, 520, 520]],
  [["character", "equipment", "stats"], "default", "half", "avatar", {}, [784, 783, 784]],
  [["character", "equipment", "stats"], "terminal", "half", "avatar", {}, [720, 720, 720]],
  [["character", "equipment", "stats"], "default", "full", "avatar", {}, [554, 553, 554]],
  [["character", "equipment", "stats"], "terminal", "full", "avatar", {}, [520, 520, 520]],
  [["character", "equipment", "stats"], "default", "half", "few-fields", {}, [792, 791, 792]],
  [["character", "equipment", "stats"], "terminal", "half", "few-fields", {}, [680, 680, 680]],
  [["character", "equipment", "stats"], "default", "full", "few-fields", {}, [584, 583, 584]],
  [["character", "equipment", "stats"], "terminal", "full", "few-fields", {}, [520, 520, 520]],
  [["character", "equipment", "stats"], "default", "half", "few-fields-no-image", {}, [724, 723, 724]],
  [["character", "equipment", "stats"], "terminal", "half", "few-fields-no-image", {}, [660, 660, 660]],
  [["character", "equipment", "stats"], "default", "full", "few-fields-no-image", {}, [488, 487, 488]],
  [["character", "equipment", "stats"], "terminal", "full", "few-fields-no-image", {}, [460, 460, 460]],
  [["character", "equipment", "stats"], "default", "half", "three-items", {}, [480, 479, 480]],
  [["character", "equipment", "stats"], "terminal", "half", "three-items", {}, [460, 460, 460]],
  [["character", "equipment", "stats"], "default", "full", "three-items", {}, [440, 439, 440]],
  [["character", "equipment", "stats"], "terminal", "full", "three-items", {}, [400, 400, 400]],
  [["character", "equipment", "stats"], "default", "half", "no-spirit", {}, [792, 791, 792]],
  [["character", "equipment", "stats"], "terminal", "half", "no-spirit", {}, [720, 720, 720]],
  [["character", "equipment", "stats"], "default", "full", "no-spirit", {}, [584, 583, 584]],
  [["character", "equipment", "stats"], "terminal", "full", "no-spirit", {}, [520, 520, 520]],
  [["character", "equipment", "stats"], "default", "half", "long-names", {}, [792, 791, 792]],
  [["character", "equipment", "stats"], "terminal", "half", "long-names", {}, [720, 720, 720]],
  [["character", "equipment", "stats"], "default", "full", "long-names", {}, [584, 583, 584]],
  [["character", "equipment", "stats"], "terminal", "full", "long-names", {}, [520, 520, 520]],
]

const plugin = PluginManager.getInstance().get("wow_forever")!
/** The mock as a dev render returns it: the render embedded (any data URI does here). */
const mock: Data = { ...MOCK_DATA, image: { kind: "render", src: "data:image/png;base64," } }

/** What fetchData does with the picture option: the portrait, or no picture. */
const fetched = (data: Data, options: Record<string, unknown>): Data => {
  if (options.character_image === "none") return { ...data, image: null }
  if (options.character_image === "avatar" && data.image) return { ...data, image: { ...data.image, kind: "avatar" } }
  return data
}

describe("wow_forever section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED, { fetched })).toEqual([])
  })
})
