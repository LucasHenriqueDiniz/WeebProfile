import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "./manager"

/**
 * Production sends a plugin's section options at the root of its config; the plugin
 * types, the audit scripts and calculate-height.test.ts put them under `nonEssential`.
 * Nothing compared the two, so code reading `nonEssential` fell back to its defaults in
 * production while code reading the root did not, and measured in a browser, 35 of 68
 * list sizes came out cut or padded. These cases set each list's length in both shapes,
 * to a value that is not its default, and require the same markup and the same height.
 */

const manager = PluginManager.getInstance()

const LISTS: Array<[plugin: string, section: string, key: string, n: number]> = [
  ["steam", "recent_games", "recent_games_max", 2],
  ["steam", "top_games", "top_games_max", 2],
  ["lyfta", "exercises", "exercises_max", 2],
  ["lyfta", "recent_workouts", "workouts_max", 2],
  ["codeforces", "recent_submissions", "recent_submissions_max", 2],
  ["codewars", "completed_kata", "completed_kata_max", 2],
  ["codewars", "languages_proficiency", "languages_proficiency_max", 2],
  ["duolingo", "languages_learning", "languages_learning_max", 1],
  ["stackoverflow", "tags_expertise", "tags_expertise_max", 2],
  ["lastfm", "recent_tracks", "recent_tracks_max", 2],
  ["lastfm", "top_artists", "top_artists_max", 2],
  ["lastfm", "top_tracks", "top_tracks_max", 2],
]

// Plugin mock loaders are chatty.
beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe.each(LISTS)("%s/%s with %s=%i", (pluginName, section, key, n) => {
  it.each(["default", "terminal"])(
    "draws and sizes the same whether the option is at the root or under nonEssential (%s)",
    async (style) => {
      const plugin = manager.get(pluginName)!
      const base = { enabled: true, sections: [section], username: "test-user", style, size: "half" }
      const atRoot = { ...base, [key]: n }
      const underNonEssential = { ...base, nonEssential: { [key]: n } }
      // dev + previewMode: mock data, no image embedding, no network.
      const data = await plugin.fetchData(atRoot as never, true, undefined, true)

      expect(plugin.calculateHeight(atRoot as never, data, "half")).toBe(
        plugin.calculateHeight(underNonEssential as never, data, "half")
      )
      expect(renderToStaticMarkup(plugin.render(atRoot as never, data))).toBe(
        renderToStaticMarkup(plugin.render(underNonEssential as never, data))
      )
    }
  )

  // Without this the case could pass with n equal to the default, where both shapes
  // agree for the wrong reason.
  it("is a value the section actually reacts to", async () => {
    const plugin = manager.get(pluginName)!
    const base = { enabled: true, sections: [section], username: "test-user", style: "default", size: "half" }
    const data = await plugin.fetchData(base as never, true, undefined, true)

    expect(renderToStaticMarkup(plugin.render({ ...base, [key]: n } as never, data))).not.toBe(
      renderToStaticMarkup(plugin.render(base as never, data))
    )
  })
})
