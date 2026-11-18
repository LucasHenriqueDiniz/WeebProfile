import { describe, expect, it } from "vitest"
import { devToPlugin } from "./index"
import { tagChipWidth } from "./components/TopTags"
import type { DevToData, DevToTag } from "./types"

/** The eight top tags of dev.to/ben's last 30 posts, 18/11/2026. */
const BEN: DevToTag[] = [
  { name: "discuss", count: 17 },
  { name: "jokes", count: 16 },
  { name: "watercooler", count: 16 },
  { name: "ai", count: 9 },
  { name: "agents", count: 3 },
  { name: "architecture", count: 3 },
  { name: "aie", count: 2 },
  { name: "community", count: 2 },
]

function height(tags: DevToTag[], size: "half" | "full", extra: Record<string, unknown> = {}): number {
  const config = { enabled: true, sections: ["top_tags"], username: "ben", ...extra }
  const data = { profile: {}, recentArticles: [], topTags: tags } as unknown as DevToData
  return devToPlugin.calculateHeight!(config as never, data as never, size)
}

describe("devto top_tags height", () => {
  // Expected values are what Chrome drew for the same data (Playwright, 18/11/2026).
  it("counts the rows the chips wrap to, by their width", () => {
    expect(height(BEN, "half")).toBe(134) // 3 rows
    expect(height(BEN, "full")).toBe(76) // 1 row
  })

  it("leaves the title and its gap out when the title is hidden", () => {
    expect(height(BEN, "half", { top_tags_hide_title: true })).toBe(84)
    expect(height(BEN, "full", { top_tags_hide_title: "true" })).toBe(24)
  })

  it("is one row for one tag", () => {
    expect(height([{ name: "javascript", count: 3 }], "half")).toBe(74)
    expect(height([{ name: "javascript", count: 3 }], "full")).toBe(76)
  })

  it("is zero with no tags, as the component draws nothing", () => {
    expect(height([], "half")).toBe(0)
  })

  it("is the command plus one line per tag in the terminal", () => {
    expect(height(BEN, "half", { style: "terminal" })).toBe(24 + 8 * 20)
    expect(height(BEN, "half", { style: "terminal", top_tags_max: 3 })).toBe(24 + 3 * 20)
  })

  it("matches the chip widths Chrome drew, to a tenth of a pixel", () => {
    // getBoundingClientRect().width of each chip, Chrome, Poppins.
    const drawn = [89.92, 76.8, 117.72, 52.3, 83.02, 114.91, 59.08, 110.34]
    BEN.forEach((tag, i) => expect(tagChipWidth(tag)).toBeCloseTo(drawn[i]!, 1))
  })
})
