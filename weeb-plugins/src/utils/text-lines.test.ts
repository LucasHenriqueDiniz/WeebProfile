import { describe, expect, it } from "vitest"
import { wrappedLineCount } from "./text-lines"

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
