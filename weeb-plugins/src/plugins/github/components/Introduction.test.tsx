import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { GithubIntroduction } from "./Introduction"
import type { GithubConfig } from "../types"

// GitHub keeps a profile's website as typed, usually without a scheme.
function render(websiteUrl: string): string {
  return renderToStaticMarkup(
    <GithubIntroduction data={{ websiteUrl }} config={{} as GithubConfig} style="default" size="half" />
  )
}

describe("GithubIntroduction website link", () => {
  it.each([
    ["example.com", "https://example.com/"],
    ["localhost:3000", "https://localhost:3000/"],
  ])("links %j as %j", (websiteUrl, href) => {
    expect(render(websiteUrl)).toContain(`href="${href}"`)
  })

  it("shows a javascript: website as text, with no link", () => {
    const html = render("javascript:alert(1)")
    expect(html).toContain("javascript:alert(1)")
    expect(html).not.toContain("href=")
  })
})
