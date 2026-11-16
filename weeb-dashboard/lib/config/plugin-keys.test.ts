import { describe, expect, it } from "vitest"
import { pluginKeyRows } from "./plugin-keys"

const card = (...plugins: string[]) => ({
  pluginsConfig: Object.fromEntries(plugins.map((p) => [p, { enabled: true, sections: ["any"] }])),
})

describe("pluginKeyRows", () => {
  const stored = [
    { plugin: "github", key: "pat", updatedAt: "2026-11-12T09:30:00.000Z" },
    { plugin: "steam", key: "steamid", updatedAt: "2026-11-01T00:00:00.000Z" },
  ]

  it("lists every key a plugin asks for, saved or not, and not the repository card's alias", () => {
    const rows = pluginKeyRows(stored, [])
    const ids = rows.map((r) => `${r.plugin}/${r.key}`)
    expect(ids).toEqual(expect.arrayContaining(["github/pat", "lastfm/apiKey", "lyfta/apiKey", "steam/steamId"]))
    expect(ids.some((id) => id.startsWith("github_repo/"))).toBe(false)
    expect(rows.find((r) => r.plugin === "github")?.updatedAt).toBe("2026-11-12T09:30:00.000Z")
    // Stored lowercase, declared camelCase: still the same key.
    expect(rows.find((r) => r.plugin === "steam")?.updatedAt).toBe("2026-11-01T00:00:00.000Z")
    expect(rows.find((r) => r.plugin === "lyfta")?.updatedAt).toBeUndefined()
  })

  it("counts the repository cards toward the GitHub token they read", () => {
    const rows = pluginKeyRows(stored, [card("github"), card("github_repo"), card("myanimelist"), card("steam")])
    const github = rows.find((r) => r.plugin === "github")!
    expect(github.usedBy).toBe(2)
    expect(github.sharedWith).toEqual(["github_repo"])
    expect(rows.find((r) => r.plugin === "steam")?.usedBy).toBe(1)
    expect(rows.find((r) => r.plugin === "lastfm")?.usedBy).toBe(0)
  })

  it("does not count a plugin that is switched off or has no sections", () => {
    const off = { pluginsConfig: { github: { enabled: false, sections: ["profile"] } } }
    const empty = { pluginsConfig: { github: { enabled: true, sections: [] } } }
    expect(pluginKeyRows(stored, [off, empty]).find((r) => r.plugin === "github")?.usedBy).toBe(0)
  })

  it("shows a stored key no plugin declares, so it can be removed too", () => {
    const rows = pluginKeyRows(
      [...stored, { plugin: "github_repo", key: "pat", updatedAt: "2026-10-01T00:00:00.000Z" }],
      [card("github_repo")]
    )
    const own = rows.find((r) => r.plugin === "github_repo")
    expect(own).toMatchObject({ key: "pat", updatedAt: "2026-10-01T00:00:00.000Z", usedBy: 1 })
  })
})
