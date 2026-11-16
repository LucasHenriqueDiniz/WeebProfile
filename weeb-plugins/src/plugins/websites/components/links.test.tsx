import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Websites } from "./Websites"
import type { WebsiteEntry, WebsitesVariant } from "../types"

function site(url: string, domain: string): WebsiteEntry {
  return { url, domain, title: domain, description: null, thumbnail: null, favicon: null }
}

// fetchData already drops anything that is not a public http(s) URL. The render
// checks again, so a card never depends on where its data came from.
const websites = [site("https://example.com/", "example.com"), site("javascript:alert(document.domain)", "evil.test")]

const cases: Array<{ name: string; style: "default" | "terminal"; variant: WebsitesVariant }> = [
  { name: "grid", style: "default", variant: "grid" },
  { name: "list", style: "default", variant: "list" },
  { name: "featured", style: "default", variant: "featured" },
  { name: "terminal", style: "terminal", variant: "grid" },
]

describe.each(cases)("websites $name", ({ style, variant }) => {
  const html = renderToStaticMarkup(
    <Websites data={{ websites }} config={{ websites_variant: variant }} style={style} size="half" />
  )

  it("links each site with target _top", () => {
    expect(html).toContain('<a href="https://example.com/" target="_top" rel="noopener noreferrer"')
  })

  it("renders a javascript: URL as text, with no link", () => {
    expect(html).toContain("evil.test")
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).not.toMatch(/javascript:/i)
  })
})
