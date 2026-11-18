import { describe, it, expect } from "vitest"
import {
  generateBadgesMarkdown,
  generateMarkdown,
  generateMarkdownForMultipleHalf,
  generateTilesMarkdown,
  linkableUrl,
} from "./markdown"

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

  it("escapes the punctuation that markdown would turn into emphasis, code or HTML in a full SVG's alt", () => {
    expect(generateMarkdown({ alt: "*a* `b` <i>", url, size: "full" })).toBe(`![\\*a\\* \\\`b\\\` \\<i\\>](${url})`)
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
  })

  it("leaves the last of an odd count at its natural size, since it is alone on its row", () => {
    const snippet = generateMarkdownForMultipleHalf([
      { alt: "A", url },
      { alt: "B", url: other },
      { alt: "C", url: `${url}?c` },
    ])
    const tags = snippet.match(/<img [^>]*>/g) ?? []
    expect(tags.map((tag) => tag.includes('width="50%"'))).toEqual([true, true, false])
  })
})

describe("generateTilesMarkdown", () => {
  const src = (n: number) => `https://weebprofile-dashboard.pages.dev/svg/abc/${n}.svg`

  it("links each site's image to the site, 33% wide and glued together so three fit a row", () => {
    expect(
      generateTilesMarkdown([
        { href: "https://one.example/", title: "One", src: src(0) },
        { href: "https://two.example/blog", title: "Two", src: src(1) },
      ])
    ).toBe(
      '<p align="center">' +
        `<a href="https://one.example/"><img align="top" width="33%" alt="One" src="${src(0)}" /></a>` +
        `<a href="https://two.example/blog"><img align="top" width="33%" alt="Two" src="${src(1)}" /></a>` +
        "</p>"
    )
  })

  it("escapes what would end the attribute or the tag", () => {
    const snippet = generateTilesMarkdown([
      { href: 'https://one.example/?q="><script>', title: 'A "quoted" <b>title</b>', src: src(0) },
    ])
    expect(snippet).not.toContain("<script>")
    expect(snippet).not.toContain("<b>")
    expect(snippet).toContain('alt="A &quot;quoted&quot; &lt;b&gt;title&lt;/b&gt;"')
  })

  // The generator already refused these; this is the last step before the profile.
  it.each(["javascript:alert(1)", " JavaScript:alert(1)", "data:text/html,x", "https://github.com@evil.example/"])(
    "leaves out a site whose link would be %j",
    (href) => {
      const snippet = generateTilesMarkdown([
        { href, title: "Bad", src: src(0) },
        { href: "https://good.example/", title: "Good", src: src(1) },
      ])
      expect(snippet).not.toContain("Bad")
      expect(snippet).toContain(`src="${src(1)}"`)
      expect(snippet.match(/<a /g)).toHaveLength(1)
    }
  )

  it("answers nothing when there is no site", () => {
    expect(generateTilesMarkdown([])).toBe("")
  })
})

describe("generateBadgesMarkdown", () => {
  const src = (n: number) => `https://weebprofile-dashboard.pages.dev/svg/abc/${n}.svg`

  // The README buttons they replace: each in its link, at its natural size, a space
  // between them as the gap, so a narrow screen wraps the row like words.
  it("links each badge's image at its natural size, separated by a space", () => {
    expect(
      generateBadgesMarkdown([
        { href: "https://lucashdo.com/", title: "lucashdo.com", src: src(0) },
        { href: "mailto:someone@example.com", title: "Email", src: src(1) },
      ])
    ).toBe(
      '<p align="center">' +
        `<a href="https://lucashdo.com/"><img alt="lucashdo.com" src="${src(0)}" /></a> ` +
        `<a href="mailto:someone@example.com"><img alt="Email" src="${src(1)}" /></a>` +
        "</p>"
    )
  })

  it.each(["javascript:alert(1)", "mailto:a@b.co?bcc=c@d.co", "mailto:a@b.co,c@d.co", "mailto:"])(
    "leaves out a badge whose link would be %j",
    (href) => {
      const snippet = generateBadgesMarkdown([
        { href, title: "Bad", src: src(0) },
        { href: "https://good.example/", title: "Good", src: src(1) },
      ])
      expect(snippet).not.toContain("Bad")
      expect(snippet.match(/<a /g)).toHaveLength(1)
    }
  )

  it("answers nothing when there is no badge", () => {
    expect(generateBadgesMarkdown([])).toBe("")
  })
})

describe("linkableUrl", () => {
  it("normalizes an http(s) URL and refuses anything else", () => {
    expect(linkableUrl("HTTPS://Example.COM")).toBe("https://example.com/")
    expect(linkableUrl("example.com")).toBeNull()
    expect(linkableUrl("ftp://example.com")).toBeNull()
  })

  it("takes a mailto: with one plain address and nothing after it", () => {
    expect(linkableUrl("mailto:someone@example.com")).toBe("mailto:someone@example.com")
    expect(linkableUrl("MAILTO:someone@example.com")).toBe("mailto:someone@example.com")
    expect(linkableUrl("mailto:someone@example.com?subject=hi")).toBeNull()
    expect(linkableUrl("mailto:a@b.co;c@d.co")).toBeNull()
    expect(linkableUrl("mailto:someone")).toBeNull()
  })
})
