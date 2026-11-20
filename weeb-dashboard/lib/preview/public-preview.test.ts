import { describe, expect, it } from "vitest"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import {
  PREVIEW_PLUGINS,
  parsePreviewRequest,
  previewQuery,
  previewToTemplate,
  wizardPathFor,
  type PreviewRequest,
} from "./public-preview"

const parse = (query: string) => parsePreviewRequest(new URLSearchParams(query))

describe("PREVIEW_PLUGINS", () => {
  it.each(Object.entries(PREVIEW_PLUGINS))("%s names sections the plugin has", (plugin, { sections }) => {
    const metadata = PLUGINS_METADATA[plugin as keyof typeof PLUGINS_METADATA] as { sections: { id: string }[] }
    const known = metadata.sections.map((section) => section.id)
    expect(sections.length).toBeGreaterThan(0)
    for (const section of sections) expect(known).toContain(section)
  })

  // A preview has no user, so no plugin_secrets. Any secret a plugin needs has to be
  // supplied by the generator's previewCredentials: GitHub's token, Steam's ID and key.
  it("holds only plugins whose secrets the generator can supply for a preview", () => {
    const suppliedForPreview: Record<string, string[]> = { github: ["pat"], steam: ["steamId"] }
    for (const plugin of Object.keys(PREVIEW_PLUGINS)) {
      const keys = (PLUGINS_METADATA[plugin as keyof typeof PLUGINS_METADATA] as { essentialConfigKeys: string[] })
        .essentialConfigKeys
      expect(keys.filter((key) => !suppliedForPreview[plugin]?.includes(key))).toEqual([])
    }
  })
})

describe("parsePreviewRequest", () => {
  it("fills style, theme and size with the defaults", () => {
    expect(parse("plugin=codewars&username=%20g964%20")).toEqual({
      ok: true,
      value: { plugin: "codewars", username: "g964", style: "default", theme: "default", size: "half" },
    })
  })

  it.each([
    ["plugin=lastfm&username=a", "plugin"],
    ["plugin=__proto__&username=a", "plugin"],
    ["plugin=github&username=", "username"],
    ["plugin=github&username=a%20b", "username"],
    ["plugin=github&username=" + "a".repeat(41), "username"],
    ["plugin=github&username=a&style=fancy", "style"],
    ["plugin=github&username=a&style=terminal&theme=purple", "theme"],
    ["plugin=github&username=a&size=xl", "size"],
  ])("rejects %s on %s", (query, field) => {
    const result = parse(query)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.field).toBe(field)
  })

  it.each([
    "https://lichess.org/@/thibault",
    "lichess.org/@/DrNykterstein",
    "https://www.chess.com/member/Hikaru",
    "chess.com/pt-BR/member/gothamchess/",
    "lichess:thibault",
    "chess.com:hikaru",
  ])("takes a chess profile link or site:name: %s", (username) => {
    expect(parse(`plugin=chess&username=${encodeURIComponent(username)}`).ok).toBe(true)
  })

  // The same name can be two different people on Lichess and Chess.com.
  it.each(["thibault", "https://example.com/@/thibault", "lichess:a b", "lichess.org/@/x/../y"])(
    "refuses a chess identifier that does not name the site: %s",
    (username) => {
      const result = parse(`plugin=chess&username=${encodeURIComponent(username)}`)
      expect(result.ok === false && result.field).toBe("username")
    }
  )

  it("takes a Steam profile URL as the Steam identifier", () => {
    const result = parse("plugin=steam&username=https://steamcommunity.com/id/gabelogannewell")
    expect(result.ok).toBe(true)
  })
})

describe("the wizard hand-off", () => {
  const request: PreviewRequest = {
    plugin: "anilist",
    username: "Josh",
    style: "terminal",
    theme: "dracula",
    size: "full",
  }

  it("round-trips through the wizard URL", () => {
    const url = new URL(wizardPathFor(request), "https://weebprofile.test")
    expect(url.pathname).toBe("/dashboard/new/profile")
    expect(url.searchParams.get("source")).toBe("preview")
    expect(parsePreviewRequest(url.searchParams)).toEqual({ ok: true, value: request })
  })

  it("is the card the visitor saw, in loadFromTemplate's shape", () => {
    expect(previewToTemplate(request)).toEqual({
      style: "terminal",
      size: "full",
      theme: "dracula",
      pluginsOrder: ["anilist"],
      pluginsConfig: { anilist: { enabled: true, sections: ["statistics", "favorites_anime"], username: "Josh" } },
      uiConfig: { hideTerminalEmojis: false, hideTerminalHeader: false, hideTerminalCommand: false },
    })
  })

  it("does not put a Steam identifier in the plugin config, which keeps it in the profile", () => {
    const template = previewToTemplate({ ...request, plugin: "steam", username: "76561197960287930" })
    expect(template.pluginsConfig.steam).toEqual({ enabled: true, sections: ["statistics", "top_games"] })
  })

  it("encodes the username in the query", () => {
    expect(previewQuery({ ...request, username: "a.b-c_d" })).toContain("username=a.b-c_d")
  })
})
