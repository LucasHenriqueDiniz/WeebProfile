import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
// The generated metadata from source, not the package build: the test must see the
// plugins as they are in this checkout.
import { PLUGINS_METADATA, PLUGIN_CATEGORIES } from "../../../weeb-plugins/src/plugins/metadata"
import { locales } from "../../i18n/config"
import { LANDING_PLUGINS, NOT_A_PLATFORM, PLATFORM_STRIP_PLUGINS } from "./landing-plugins"

const registered = Object.keys(PLUGINS_METADATA)

function translation(locale: string) {
  const file = path.join(__dirname, "../../public/locales", locale, "translation.json")
  return JSON.parse(readFileSync(file, "utf-8"))
}

describe("landing plugins", () => {
  it("lists every registered plugin in the grid", () => {
    expect([...LANDING_PLUGINS].sort()).toEqual([...registered].sort())
  })

  // The strip listed 10 platforms by hand under a hero that counted 14 plugins.
  it("puts every plugin on the platform strip unless it is not a platform of its own", () => {
    const expected = registered.filter((id) => !NOT_A_PLATFORM.has(id))
    expect([...PLATFORM_STRIP_PLUGINS].sort()).toEqual(expected.sort())
  })
})

describe("plugin category labels", () => {
  // Duolingo, 16Personalities and Websites read "Coding" and Lyfta "Gaming" because the
  // category list had nothing else. Each category now needs a label wherever one shows.
  for (const locale of locales) {
    it(`labels every category on the landing and in the wizard (${locale})`, () => {
      const { landing, wizard } = translation(locale)
      const missing = PLUGIN_CATEGORIES.flatMap((category) => [
        ...(landing.plugins.categories[category] ? [] : [`landing.plugins.categories.${category}`]),
        ...(category === "repository" || wizard.plugins.categories[category]
          ? []
          : [`wizard.plugins.categories.${category}`]),
      ])
      expect(missing).toEqual([])
    })
  }
})
