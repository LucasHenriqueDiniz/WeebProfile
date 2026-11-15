import { describe, it, expect } from "vitest"
import { generateMarkdown, generateMarkdownForMultipleHalf } from "./markdown"

const url = "https://weebprofile-dashboard.pages.dev/svg/abc.svg"
const other = "https://weebprofile-dashboard.pages.dev/svg/def.svg"

describe("generateMarkdown", () => {
  it("embeds a full SVG as a plain markdown image, which GitHub caps at the column width", () => {
    expect(generateMarkdown({ alt: "My stats", url, size: "full" })).toBe(`![My stats](${url})`)
  })

  it("centres a half SVG at its natural size, with no width that would shrink it when alone", () => {
    expect(generateMarkdown({ alt: "My stats", url, size: "half" })).toBe(
      `<p align="center"><img align="top" alt="My stats" src="${url}" /></p>`
    )
  })

  // The URL is stable and camo refetches after 60s; a frozen ?v= only made the
  // snippet look stale after every regeneration.
  it.each(["half", "full"] as const)("leaves the URL untouched for a %s SVG", (size) => {
    const snippet = generateMarkdown({ alt: "x", url, size })
    expect(snippet).toContain(url)
    expect(snippet).not.toContain("?")
  })

  it("escapes an alt text that would otherwise end the attribute or the tag", () => {
    expect(generateMarkdown({ alt: `Tom & "Jerry" <3`, url, size: "half" })).toContain(
      `alt="Tom &amp; &quot;Jerry&quot; &lt;3"`
    )
  })

  it("escapes brackets in a full SVG's alt text so they do not close it early", () => {
    expect(generateMarkdown({ alt: "Stats [beta]", url, size: "full" })).toBe(`![Stats \\[beta\\]](${url})`)
  })
})

describe("generateMarkdownForMultipleHalf", () => {
  it("is empty without images", () => {
    expect(generateMarkdownForMultipleHalf([])).toBe("")
  })

  it("is the single half snippet for one image", () => {
    expect(generateMarkdownForMultipleHalf([{ alt: "A", url }])).toBe(generateMarkdown({ alt: "A", url, size: "half" }))
  })

  it("puts two halves in one paragraph at 50% each, glued with no whitespace between the tags", () => {
    expect(
      generateMarkdownForMultipleHalf([
        { alt: "A", url },
        { alt: "B", url: other },
      ])
    ).toBe(
      `<p align="center">` +
        `<img align="top" width="50%" alt="A" src="${url}" />` +
        `<img align="top" width="50%" alt="B" src="${other}" />` +
        `</p>`
    )
  })

  it("keeps the order it was given", () => {
    const snippet = generateMarkdownForMultipleHalf([
      { alt: "B", url: other },
      { alt: "A", url },
    ])
    expect(snippet.indexOf(other)).toBeLessThan(snippet.indexOf(url))
  })

  it("has no whitespace anywhere between tags, for any number of images", () => {
    const snippet = generateMarkdownForMultipleHalf([
      { alt: "A", url },
      { alt: "B", url: other },
      { alt: "C", url },
    ])
    expect(snippet).not.toMatch(/>\s+</)
    expect(snippet.match(/width="50%"/g)).toHaveLength(3)
  })
})
