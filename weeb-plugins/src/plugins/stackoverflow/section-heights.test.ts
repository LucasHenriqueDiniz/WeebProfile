import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { type MeasuredCase, wrongHeights } from "../shared/measured-heights"
import type { StackOverflowData } from "./types"

/**
 * Height of every Stack Overflow section against what the browsers draw.
 *
 * Until 11/2026 the default style counted each title and its gap as 52px, shown or hidden:
 * 52px of blank space under a section with its title hidden, 2px in half, where the gap is
 * 10px. The tags list counted 8px of padding that is not drawn, and the terminal answers a
 * questions line that `answers_questions_hide_questions` takes away (20px).
 *
 * `MEASURED` is what Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60) drew on
 * 18/11/2026, measured by `pnpm --filter @weeb/svg-generator audit:heights -- --variants
 * --engine=all` (renderPlugins, theme CSS, no terminal header): each section alone and all
 * of them in one card, with every option that changes the height, and the mock changed as
 * `VARIANTS` says.
 */

const VARIANTS = {
  mock: (m: StackOverflowData): StackOverflowData => m,
  "12 tags": (m: StackOverflowData): StackOverflowData => ({
    ...m,
    topTags: Array.from({ length: 12 }, (_, i) => ({ ...m.topTags![i % m.topTags!.length]!, name: `tag-${i}` })),
  }),
}

const MEASURED: Array<MeasuredCase<keyof typeof VARIANTS>> = [
  [["reputation"], "default", "half", "mock", {}, [78, 78, 78]],
  [["reputation"], "terminal", "half", "mock", {}, [44, 44, 44]],
  [["reputation"], "default", "full", "mock", {}, [80, 80, 80]],
  [["reputation"], "terminal", "full", "mock", {}, [44, 44, 44]],
  [["reputation"], "default", "half", "mock", { reputation_hide_title: true }, [28, 28, 28]],
  [["reputation"], "terminal", "half", "mock", { reputation_hide_title: true }, [44, 44, 44]],
  [["reputation"], "default", "full", "mock", { reputation_hide_title: true }, [28, 28, 28]],
  [["reputation"], "terminal", "full", "mock", { reputation_hide_title: true }, [44, 44, 44]],
  [["reputation"], "default", "half", "12 tags", {}, [78, 78, 78]],
  [["reputation"], "terminal", "half", "12 tags", {}, [44, 44, 44]],
  [["reputation"], "default", "full", "12 tags", {}, [80, 80, 80]],
  [["reputation"], "terminal", "full", "12 tags", {}, [44, 44, 44]],
  [["badges"], "default", "half", "mock", {}, [106, 106, 106]],
  [["badges"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["badges"], "default", "full", "mock", {}, [108, 108, 108]],
  [["badges"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["badges"], "default", "half", "mock", { badges_hide_title: true }, [56, 56, 56]],
  [["badges"], "terminal", "half", "mock", { badges_hide_title: true }, [104, 104, 104]],
  [["badges"], "default", "full", "mock", { badges_hide_title: true }, [56, 56, 56]],
  [["badges"], "terminal", "full", "mock", { badges_hide_title: true }, [104, 104, 104]],
  [["badges"], "default", "half", "12 tags", {}, [106, 106, 106]],
  [["badges"], "terminal", "half", "12 tags", {}, [104, 104, 104]],
  [["badges"], "default", "full", "12 tags", {}, [108, 108, 108]],
  [["badges"], "terminal", "full", "12 tags", {}, [104, 104, 104]],
  [["answers_questions"], "default", "half", "mock", {}, [78, 78, 78]],
  [["answers_questions"], "terminal", "half", "mock", {}, [64, 64, 64]],
  [["answers_questions"], "default", "full", "mock", {}, [80, 80, 80]],
  [["answers_questions"], "terminal", "full", "mock", {}, [64, 64, 64]],
  [["answers_questions"], "default", "half", "mock", { answers_questions_hide_title: true }, [28, 28, 28]],
  [["answers_questions"], "terminal", "half", "mock", { answers_questions_hide_title: true }, [64, 64, 64]],
  [["answers_questions"], "default", "full", "mock", { answers_questions_hide_title: true }, [28, 28, 28]],
  [["answers_questions"], "terminal", "full", "mock", { answers_questions_hide_title: true }, [64, 64, 64]],
  [["answers_questions"], "default", "half", "mock", { answers_questions_hide_questions: true }, [78, 78, 78]],
  [["answers_questions"], "terminal", "half", "mock", { answers_questions_hide_questions: true }, [44, 44, 44]],
  [["answers_questions"], "default", "full", "mock", { answers_questions_hide_questions: true }, [80, 80, 80]],
  [["answers_questions"], "terminal", "full", "mock", { answers_questions_hide_questions: true }, [44, 44, 44]],
  [["answers_questions"], "default", "half", "12 tags", {}, [78, 78, 78]],
  [["answers_questions"], "terminal", "half", "12 tags", {}, [64, 64, 64]],
  [["answers_questions"], "default", "full", "12 tags", {}, [80, 80, 80]],
  [["answers_questions"], "terminal", "full", "12 tags", {}, [64, 64, 64]],
  [["tags_expertise"], "default", "half", "mock", {}, [316, 316, 316]],
  [["tags_expertise"], "terminal", "half", "mock", {}, [104, 104, 104]],
  [["tags_expertise"], "default", "full", "mock", {}, [318, 318, 318]],
  [["tags_expertise"], "terminal", "full", "mock", {}, [104, 104, 104]],
  [["tags_expertise"], "default", "half", "mock", { tags_expertise_hide_title: true }, [266, 266, 266]],
  [["tags_expertise"], "terminal", "half", "mock", { tags_expertise_hide_title: true }, [104, 104, 104]],
  [["tags_expertise"], "default", "full", "mock", { tags_expertise_hide_title: true }, [266, 266, 266]],
  [["tags_expertise"], "terminal", "full", "mock", { tags_expertise_hide_title: true }, [104, 104, 104]],
  [["tags_expertise"], "default", "half", "mock", { tags_expertise_max: 1 }, [100, 100, 100]],
  [["tags_expertise"], "terminal", "half", "mock", { tags_expertise_max: 1 }, [40, 40, 40]],
  [["tags_expertise"], "default", "full", "mock", { tags_expertise_max: 1 }, [102, 102, 102]],
  [["tags_expertise"], "terminal", "full", "mock", { tags_expertise_max: 1 }, [40, 40, 40]],
  [["tags_expertise"], "default", "half", "mock", { tags_expertise_max: 20 }, [316, 316, 316]],
  [["tags_expertise"], "terminal", "half", "mock", { tags_expertise_max: 20 }, [104, 104, 104]],
  [["tags_expertise"], "default", "full", "mock", { tags_expertise_max: 20 }, [318, 318, 318]],
  [["tags_expertise"], "terminal", "full", "mock", { tags_expertise_max: 20 }, [104, 104, 104]],
  [["tags_expertise"], "default", "half", "12 tags", {}, [316, 316, 316]],
  [["tags_expertise"], "terminal", "half", "12 tags", {}, [104, 104, 104]],
  [["tags_expertise"], "default", "full", "12 tags", {}, [318, 318, 318]],
  [["tags_expertise"], "terminal", "full", "12 tags", {}, [104, 104, 104]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "default", "half", "mock", {}, [578, 577, 578]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "terminal", "half", "mock", {}, [316, 316, 316]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "default", "full", "mock", {}, [586, 585, 586]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "terminal", "full", "mock", {}, [316, 316, 316]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "default", "half", "12 tags", {}, [578, 577, 578]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "terminal", "half", "12 tags", {}, [316, 316, 316]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "default", "full", "12 tags", {}, [586, 585, 586]],
  [["reputation", "badges", "answers_questions", "tags_expertise"], "terminal", "full", "12 tags", {}, [316, 316, 316]],
]

const plugin = PluginManager.getInstance().get("stackoverflow")!
let mock: StackOverflowData

beforeAll(async () => {
  const sections = ["reputation", "badges", "answers_questions", "tags_expertise"]
  mock = (await plugin.fetchData({ ...plugin.config, sections } as never, true, undefined, true)) as never
})

describe("stackoverflow section heights", () => {
  it("covers what Chrome, Firefox and WebKit draw, at most 2px over", () => {
    expect(wrongHeights(plugin, mock, VARIANTS, MEASURED)).toEqual([])
  })
})
