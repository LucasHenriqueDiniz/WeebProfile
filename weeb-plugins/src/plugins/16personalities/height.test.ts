import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import { PERSONALITY_DATA } from "./services/personality-data"
import type { Personality16Data, PersonalityType } from "./types"

/**
 * Height of the personality section, for each of the 16 types, against what the browsers draw.
 *
 * Until 11/2026 `calculateHeight` was the ENFJ card measured once plus a 10px buffer,
 * whatever the options: 10px of blank space under every card, 50 with the title hidden, up
 * to 80 with the description off, and the terminal of the P types 20px short in half, where
 * "Extroverted • Intuitive • Feeling • Perceiving" wraps.
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header). The variants are the types.
 */

type Variant = "mock" | PersonalityType
const VARIANTS = Object.fromEntries([
  ["mock", (m: Personality16Data) => m],
  ...Object.entries(PERSONALITY_DATA).map(([type, data]) => [
    type,
    (m: Personality16Data): Personality16Data => ({ ...m, ...data, type: type as PersonalityType }),
  ]),
]) as Record<Variant, (m: Personality16Data) => Personality16Data>

const MEASURED: Array<MeasuredCase<Variant>> = [
  [["personality"], "default", "half", "mock", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "mock", {}, [174, 174, 174]],
  [["personality"], "default", "full", "mock", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "mock", {}, [154, 154, 154]],
  [["personality"], "default", "half", "mock", { personality_hide_title: true }, [153, 153, 153]],
  [["personality"], "terminal", "half", "mock", { personality_hide_title: true }, [174, 174, 174]],
  [["personality"], "default", "full", "mock", { personality_hide_title: true }, [130, 130, 130]],
  [["personality"], "terminal", "full", "mock", { personality_hide_title: true }, [154, 154, 154]],
  [["personality"], "default", "half", "mock", { personality_show_description: false }, [131, 131, 131]],
  [["personality"], "terminal", "half", "mock", { personality_show_description: false }, [104, 104, 104]],
  [["personality"], "default", "full", "mock", { personality_show_description: false }, [131, 131, 131]],
  [["personality"], "terminal", "full", "mock", { personality_show_description: false }, [104, 104, 104]],
  [["personality"], "default", "half", "mock", { personality_show_link: false }, [157, 156, 157]],
  [["personality"], "terminal", "half", "mock", { personality_show_link: false }, [150, 150, 150]],
  [["personality"], "default", "full", "mock", { personality_show_link: false }, [134, 134, 134]],
  [["personality"], "terminal", "full", "mock", { personality_show_link: false }, [130, 130, 130]],
  [["personality"], "default", "half", "ENFJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ENFJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "ENFJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ENFJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ENFP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ENFP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ENFP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ENFP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ENTJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ENTJ", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ENTJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ENTJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ENTP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ENTP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ENTP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ENTP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ESFJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ESFJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "ESFJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ESFJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ESFP", {}, [216, 215, 216]],
  [["personality"], "terminal", "half", "ESFP", {}, [214, 214, 214]],
  [["personality"], "default", "full", "ESFP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ESFP", {}, [174, 174, 174]],
  [["personality"], "default", "half", "ESTJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ESTJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "ESTJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ESTJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ESTP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ESTP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ESTP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ESTP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "INFJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "INFJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "INFJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "INFJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "INFP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "INFP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "INFP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "INFP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "INTJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "INTJ", {}, [194, 194, 194]],
  [["personality"], "default", "full", "INTJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "INTJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "INTP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "INTP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "INTP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "INTP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ISFJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ISFJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "ISFJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ISFJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ISFP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ISFP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ISFP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ISFP", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ISTJ", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ISTJ", {}, [174, 174, 174]],
  [["personality"], "default", "full", "ISTJ", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ISTJ", {}, [154, 154, 154]],
  [["personality"], "default", "half", "ISTP", {}, [193, 192, 193]],
  [["personality"], "terminal", "half", "ISTP", {}, [194, 194, 194]],
  [["personality"], "default", "full", "ISTP", {}, [170, 170, 170]],
  [["personality"], "terminal", "full", "ISTP", {}, [154, 154, 154]],
]

const plugin = PluginManager.getInstance().get("16personalities")!
let mock: Personality16Data

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["personality"] } as never, true)) as never
})

describe("16personalities height", () => {
  it("covers what Chrome, Firefox and WebKit draw for every type, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
