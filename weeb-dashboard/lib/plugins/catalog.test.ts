import { describe, expect, it } from "vitest"
// The generated metadata from source, not the package build: the test must see the
// plugins as they are in this checkout.
import { PLUGINS_METADATA, PLUGIN_CATEGORIES } from "../../../weeb-plugins/src/plugins/metadata"
import type { PluginMetadata } from "../../../weeb-plugins/src/plugins/metadata"
import { locales } from "../../i18n/config"
import { catalogSearchTexts, describeSection, groupByCategory, titleOptionOf } from "./catalog"
import { translator } from "./plugin-messages.testutil"
import { pluginMatchesQuery } from "./plugin-search"

const plugins = Object.values(PLUGINS_METADATA) as PluginMetadata[]
const english = (_key: string, fallback: string) => fallback

describe("describeSection", () => {
  it("folds only the title pair and keeps every other option", () => {
    for (const plugin of plugins) {
      for (const section of plugin.sections) {
        const view = describeSection(section, english)
        const titleKeys = (section.configOptions ?? []).filter((o) => titleOptionOf(section.id, o.key)).length
        expect(view.options.length + titleKeys).toBe(section.configOptions?.length ?? 0)
        expect(view.options.map((o) => o.key)).not.toContain(`${section.id}_title`)
      }
    }
  })

  it("names the default of every choice among its choices", () => {
    const wrong = plugins.flatMap((plugin) =>
      plugin.sections.flatMap((section) =>
        describeSection(section, english)
          .options.filter((o) => o.kind === "choice" && o.defaultValue !== undefined)
          .filter((o) => o.kind === "choice" && !o.choices.some((c) => c.value === o.defaultValue))
          .map((o) => `${plugin.name}.${o.key}`)
      )
    )
    expect(wrong).toEqual([])
  })

  // The catalog reads the labels from the same files as the wizard; a label that fell
  // back to English in pt or es would be the metadata's text, not a translation.
  for (const locale of locales.filter((l) => l !== "en")) {
    it(`shows Steam's options in ${locale}, not in English`, () => {
      const section = PLUGINS_METADATA.steam.sections.find((s) => s.id === "recent_games")!
      const view = describeSection(section as any, translator(locale))
      const style = view.options.find((o) => o.key === "recent_games_style")!
      expect(style.label).not.toBe("Display style")
      expect(style.kind === "choice" && style.choices.map((c) => c.label)).not.toContain("List")
    })
  }
})

describe("catalogSearchTexts", () => {
  const search = (query: string, locale = "en") =>
    plugins
      .filter((plugin) => pluginMatchesQuery(catalogSearchTexts(plugin, translator(locale), plugin.category), query))
      .map((plugin) => plugin.name)
      .sort()

  it("finds a plugin by the name of one of its sections", () => {
    expect(search("recent games")).toContain("steam")
    expect(search("jogos recentes", "pt")).toContain("steam")
  })

  it("finds the plugins of a category by its name", () => {
    const anime = plugins.filter((p) => p.category === "anime").map((p) => p.name)
    expect(search("anime")).toEqual(expect.arrayContaining(anime))
  })
})

describe("groupByCategory", () => {
  it("puts every plugin in one group, in the categories' order", () => {
    const groups = groupByCategory(plugins, PLUGIN_CATEGORIES)
    expect(groups.flatMap((g) => g.plugins).length).toBe(plugins.length)
    expect(groups.map((g) => g.category)).toEqual(PLUGIN_CATEGORIES.filter((c) => groups.some((g) => g.category === c)))
    expect(groups.every((g) => g.plugins.length > 0)).toBe(true)
  })
})
