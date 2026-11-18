import { describe, expect, it } from "vitest"
import { textWidth, wrappedLineCount, wrappedRows } from "./text-lines"

// Poppins 400 at 10px: "a" is 6.76px, a space 2.67px, "-" 5.51px. Monospace: 6px a character.
const A4 = 4 * 6.76

describe("wrappedLineCount", () => {
  it("is 0 for empty or blank text", () => {
    expect(wrappedLineCount("", { fontSize: 10, maxWidth: 100 })).toBe(0)
    expect(wrappedLineCount("   \n ", { fontSize: 10, maxWidth: 100 })).toBe(0)
  })

  it("keeps words on the line while they fit, space included", () => {
    const twoWords = A4 + 2.67 + A4
    expect(wrappedLineCount("aaaa aaaa", { fontSize: 10, maxWidth: twoWords + 0.01 })).toBe(1)
    expect(wrappedLineCount("aaaa aaaa", { fontSize: 10, maxWidth: twoWords - 0.01 })).toBe(2)
  })

  it("collapses runs of whitespace into one space", () => {
    const twoWords = A4 + 2.67 + A4
    expect(wrappedLineCount("  aaaa \n\t aaaa ", { fontSize: 10, maxWidth: twoWords + 0.01 })).toBe(1)
  })

  it("breaks after a hyphen, with no space before the next piece", () => {
    const hyphenated = A4 + 5.51 + A4
    expect(wrappedLineCount("aaaa-aaaa", { fontSize: 10, maxWidth: hyphenated + 0.01 })).toBe(1)
    expect(wrappedLineCount("aaaa-aaaa", { fontSize: 10, maxWidth: hyphenated - 0.01 })).toBe(2)
  })

  it("puts a word wider than the line on a line of its own", () => {
    expect(wrappedLineCount("a aaaaaaaaaaaa a", { fontSize: 10, maxWidth: 30 })).toBe(3)
  })

  it("stops at the line clamp", () => {
    expect(wrappedLineCount("aaaa aaaa aaaa aaaa", { fontSize: 10, maxWidth: A4 + 1, maxLines: 2 })).toBe(2)
    expect(wrappedLineCount("aaaa aaaa aaaa aaaa", { fontSize: 10, maxWidth: A4 + 1 })).toBe(4)
  })

  it("counts every monospace character 0.6em wide", () => {
    expect(wrappedLineCount("iiiii iiiii", { fontSize: 10, maxWidth: 66, font: "mono" })).toBe(1)
    expect(wrappedLineCount("iiiii iiiii", { fontSize: 10, maxWidth: 65, font: "mono" })).toBe(2)
  })

  it("counts accented letters and falls back for characters outside the table", () => {
    // "ã" is as wide as "a"; an emoji counts a full em.
    expect(wrappedLineCount("ãããã ãããã", { fontSize: 10, maxWidth: A4 + 2.67 + A4 + 0.01 })).toBe(1)
    expect(wrappedLineCount("🚀🚀", { fontSize: 10, maxWidth: 19.99 })).toBe(1)
    expect(wrappedLineCount("🚀 🚀", { fontSize: 10, maxWidth: 19.99 })).toBe(2)
  })

  it("breaks around CJK characters, each a full em, in Poppins and monospace", () => {
    // Five ideographs, 10px each, no spaces: they wrap like five words.
    expect(wrappedLineCount("技术面试必", { fontSize: 10, maxWidth: 30 })).toBe(2)
    expect(wrappedLineCount("技术面试必", { fontSize: 10, maxWidth: 30, font: "mono" })).toBe(2)
    expect(wrappedLineCount("技术面试必", { fontSize: 10, maxWidth: 50, font: "mono" })).toBe(1)
    // Latin around them keeps its own width and breaks next to them.
    expect(wrappedLineCount("abc技术", { fontSize: 10, maxWidth: 38, font: "mono" })).toBe(1)
    expect(wrappedLineCount("abc技术", { fontSize: 10, maxWidth: 37, font: "mono" })).toBe(2)
  })
})

describe("textWidth", () => {
  // Chrome 158, Firefox 150 and WebKit 26.4 drew these 65.2px and 84.6px wide in a card.
  it("measures Poppins 600 and 500 with their own advances", () => {
    expect(textWidth("TypeScript", 12, "poppins", 600)).toBeCloseTo(65.23, 2)
    expect(textWidth("github-profile", 12, "poppins", 500)).toBeCloseTo(84.62, 1)
    expect(textWidth("TypeScript", 12, "poppins", 600)).toBeGreaterThan(textWidth("TypeScript", 12))
  })

  it("draws the monospace 0.6em in any weight", () => {
    expect(textWidth("abc", 10, "mono", 600)).toBe(18)
  })

  it("wraps semibold text earlier than regular", () => {
    // "TypeScript TypeScript" at 12px: 128.6px regular, 136.0px semibold
    expect(wrappedLineCount("TypeScript TypeScript", { fontSize: 12, maxWidth: 130 })).toBe(1)
    expect(wrappedLineCount("TypeScript TypeScript", { fontSize: 12, maxWidth: 130, weight: 600 })).toBe(2)
  })
})

describe("wrappedRows", () => {
  it("packs items on a row while they fit with the gap, and starts a row for the rest", () => {
    expect(wrappedRows([], 100, 10)).toBe(0)
    expect(wrappedRows([45, 45], 100, 10)).toBe(1)
    expect(wrappedRows([45, 46], 100, 10)).toBe(2)
    expect(wrappedRows([120, 10, 10], 100, 10)).toBe(2)
  })
})
