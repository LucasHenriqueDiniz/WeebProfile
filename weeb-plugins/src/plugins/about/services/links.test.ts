import { describe, expect, it } from "vitest"
import { iconForHref, linkHref, resolveLink, resolveLinks } from "./links"

describe("linkHref", () => {
  it("adds https:// to a bare domain, as a GitHub profile keeps its website", () => {
    expect(linkHref("lucashdo.com")).toBe("https://lucashdo.com/")
    expect(linkHref("  https://www.linkedin.com/in/someone/ ")).toBe("https://www.linkedin.com/in/someone/")
  })

  it("turns an email, typed with or without mailto:, into a mailto: href", () => {
    expect(linkHref("someone@example.com")).toBe("mailto:someone@example.com")
    expect(linkHref("MAILTO:someone@example.com")).toBe("mailto:someone@example.com")
  })

  // A badge is a link on the user's profile: nothing that runs, nothing that reads as
  // another site, no mailto: that adds recipients or headers.
  it.each([
    "javascript:alert(1)",
    "javascript://example.com/%0aalert(1)",
    "data:text/html,<script>alert(1)</script>",
    "https://github.com@evil.example/",
    "ftp://example.com",
    "mailto:a@b.co?bcc=c@d.co",
    "mailto:a@b.co,c@d.co",
    "mailto:someone",
    "",
    "   ",
  ])("refuses %j", (raw) => {
    expect(linkHref(raw)).toBeNull()
  })
})

describe("iconForHref", () => {
  it.each([
    ["https://www.linkedin.com/in/someone/", "linkedin"],
    ["https://github.com/someone", "github"],
    ["https://x.com/someone", "x"],
    ["https://twitter.com/someone", "x"],
    ["https://bsky.app/profile/someone", "bluesky"],
    ["https://youtu.be/abc", "youtube"],
    ["https://www.twitch.tv/someone", "twitch"],
    ["https://discord.gg/abc", "discord"],
    ["https://dev.to/someone", "devto"],
    ["https://someone.medium.com/", "medium"],
    ["https://ko-fi.com/someone", "kofi"],
    ["https://mastodon.social/@someone", "mastodon"],
    ["https://blog.example/feed.xml", "rss"],
    ["https://blog.example/rss", "rss"],
    ["https://lucashdo.com/", "website"],
    // A host that only contains a brand's name is not that brand.
    ["https://notgithub.com/", "website"],
    ["mailto:someone@example.com", "email"],
  ])("%s draws the %s icon", (href, icon) => {
    expect(iconForHref(href)).toBe(icon)
  })
})

describe("resolveLink", () => {
  it("labels a site with its domain and a known one with its name, unless the user typed a text", () => {
    expect(resolveLink({ url: "https://www.lucashdo.com/about" })).toEqual({
      href: "https://www.lucashdo.com/about",
      label: "lucashdo.com",
      icon: "website",
    })
    expect(resolveLink({ url: "https://www.linkedin.com/in/someone/" })?.label).toBe("LinkedIn")
    expect(resolveLink({ url: "someone@example.com" })?.label).toBe("Email")
    expect(resolveLink({ url: "lucashdo.com", label: "  My   site " })?.label).toBe("My site")
  })

  it("keeps the icon the user chose, but an email always draws the email icon", () => {
    expect(resolveLink({ url: "https://lucashdo.com", icon: "github" })?.icon).toBe("github")
    expect(resolveLink({ url: "https://lucashdo.com", icon: "auto" })?.icon).toBe("website")
    expect(resolveLink({ url: "someone@example.com", icon: "linkedin" })?.icon).toBe("email")
    // An empty select ("" from the wizard's new row) or a stale value falls back to auto.
    expect(resolveLink({ url: "https://github.com/x", icon: "" as never })?.icon).toBe("github")
    expect(resolveLink({ url: "https://github.com/x", icon: "myspace" as never })?.icon).toBe("github")
  })

  it("cuts a label past 40 characters with an ellipsis", () => {
    const label = resolveLink({ url: "lucashdo.com", label: "x".repeat(60) })!.label
    expect([...label]).toHaveLength(40)
    expect(label.endsWith("…")).toBe(true)
  })
})

describe("resolveLinks", () => {
  it("keeps the user's order, drops what cannot be linked and stops at 8", () => {
    const items = [
      { url: "javascript:alert(1)" },
      ...Array.from({ length: 10 }, (_, i) => ({ url: `https://site${i}.example` })),
    ]
    expect(resolveLinks(items).map((link) => link.href)).toEqual(
      Array.from({ length: 8 }, (_, i) => `https://site${i}.example/`)
    )
  })

  it("answers nothing for a config without links", () => {
    expect(resolveLinks(undefined)).toEqual([])
    expect(resolveLinks("https://lucashdo.com")).toEqual([])
    expect(resolveLinks([null, 3, { label: "no url" }])).toEqual([])
  })
})
