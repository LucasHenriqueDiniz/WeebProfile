import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ExternalLink, safeHref, withDefaultScheme } from "./external-link"

describe("safeHref", () => {
  it.each([
    ["https://example.com", "https://example.com/"],
    ["http://example.com/path?q=1#x", "http://example.com/path?q=1#x"],
    ["  https://example.com/a  ", "https://example.com/a"],
    ["HTTPS://Example.COM/A", "https://example.com/A"],
  ])("keeps the http(s) URL %s", (input, expected) => {
    expect(safeHref(input)).toBe(expected)
  })

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "\u0000javascript:alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "ftp://example.com",
    "mailto:me@example.com",
  ])("refuses the scheme in %j", (input) => {
    expect(safeHref(input)).toBeNull()
  })

  it.each(["example.com", "/relative", "//example.com", "", "   ", "https://", "not a url"])(
    "refuses %j, which is not an absolute URL",
    (input) => {
      expect(safeHref(input)).toBeNull()
    }
  )

  it("refuses credentials in the authority, which can pass for another host", () => {
    expect(safeHref("https://github.com@evil.example/")).toBeNull()
    expect(safeHref("https://user:pass@example.com/")).toBeNull()
  })

  it.each([null, undefined, 42, {}, ["https://example.com"]])("refuses the non-string %j", (input) => {
    expect(safeHref(input)).toBeNull()
  })
})

describe("withDefaultScheme", () => {
  it.each([
    ["www.example.com", "https://www.example.com/"],
    ["example.com/about", "https://example.com/about"],
    ["//example.com", "https://example.com/"],
    ["http://example.com", "http://example.com/"],
  ])("makes %j linkable", (input, expected) => {
    expect(safeHref(withDefaultScheme(input))).toBe(expected)
  })

  it.each(["javascript:alert(1)", " JavaScript:alert(1)", "data:text/html,x"])(
    "keeps the scheme of %j, so safeHref still refuses it",
    (input) => {
      expect(safeHref(withDefaultScheme(input))).toBeNull()
    }
  )
})

describe("ExternalLink", () => {
  it("links with target _top, which navigates under the route's sandbox", () => {
    const html = renderToStaticMarkup(
      <ExternalLink href="https://example.com/a" className="flex gap-2">
        <span>site</span>
      </ExternalLink>
    )
    expect(html).toBe(
      '<a href="https://example.com/a" target="_top" rel="noopener noreferrer" class="flex gap-2"><span>site</span></a>'
    )
  })

  it("renders javascript: as a plain element, with no href anywhere", () => {
    const html = renderToStaticMarkup(
      <ExternalLink href="javascript:alert(document.domain)" className="flex gap-2">
        <span>site</span>
      </ExternalLink>
    )
    expect(html).toBe('<div class="flex gap-2"><span>site</span></div>')
    expect(html).not.toContain("javascript")
  })

  it("uses the requested fallback element for inline items", () => {
    const html = renderToStaticMarkup(
      <ExternalLink href={null} fallback="span">
        text
      </ExternalLink>
    )
    expect(html).toBe("<span>text</span>")
  })

  it("cannot be broken out of through the href attribute", () => {
    const html = renderToStaticMarkup(
      <ExternalLink href={'https://example.com/?q="><script>alert(1)</script>'}>x</ExternalLink>
    )
    expect(html).not.toContain("<script>")
    expect(html).toMatch(/^<a href="https:\/\/example\.com\/\?q=[^"]*" target="_top"/)
  })
})
