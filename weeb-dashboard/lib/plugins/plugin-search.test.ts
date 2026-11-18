import { describe, expect, it } from "vitest"
import { PLUGINS_METADATA } from "../../../weeb-plugins/src/plugins/metadata"
import { locales } from "../../i18n/config"
import { pluginMatchesQuery, pluginSearchTexts } from "./plugin-search"
import { pluginMessages, translator } from "./plugin-messages.testutil"

describe("pluginMatchesQuery", () => {
  it("ignores case and accents both ways", () => {
    expect(pluginMatchesQuery(["Estatísticas de Anime"], "estatisticas")).toBe(true)
    expect(pluginMatchesQuery(["Sobre mi"], "Sobre mí")).toBe(true)
    expect(pluginMatchesQuery(["GitHub"], "  git ")).toBe(true)
  })

  it("matches nothing that is not there", () => {
    expect(pluginMatchesQuery(["About me", undefined], "sobre")).toBe(false)
  })

  it("lets an empty search through", () => {
    expect(pluginMatchesQuery([], "   ")).toBe(true)
  })
})

describe("pluginSearchTexts", () => {
  // The wizard compared only the English metadata, so "Sobre" found nothing while the
  // list read "Sobre mim". Each plugin has to be found by the name the list shows.
  for (const locale of locales) {
    it(`finds every plugin by the first word of its ${locale} name`, () => {
      const lost = Object.entries(PLUGINS_METADATA).filter(([plugin, meta]) => {
        const shown = pluginMessages(plugin, locale).displayName as string
        const texts = pluginSearchTexts(plugin, meta, translator(locale))
        return !pluginMatchesQuery(texts, shown.split(" ")[0]!)
      })
      expect(lost.map(([plugin]) => plugin)).toEqual([])
    })
  }

  it("finds About me by Sobre in Portuguese", () => {
    const texts = pluginSearchTexts("about", PLUGINS_METADATA.about, translator("pt"))
    expect(pluginMatchesQuery(texts, "Sobre")).toBe(true)
    expect(pluginMatchesQuery(texts, "apresentação")).toBe(true)
  })
})
