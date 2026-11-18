import { describe, expect, it } from "vitest"
// The generated metadata from source, not the package build: the test must see the
// plugins as they are in this checkout.
import { PLUGINS_METADATA, type SectionConfigOption } from "../../../weeb-plugins/src/plugins/metadata"
import { locales } from "../../i18n/config"
import { translateItemFields } from "./item-fields-i18n"
import { translator } from "./plugin-messages.testutil"

const listOptions = Object.entries(PLUGINS_METADATA).flatMap(([plugin, meta]) =>
  (meta.sections as ReadonlyArray<{ id: string; configOptions?: readonly SectionConfigOption[] }>).flatMap((section) =>
    (section.configOptions ?? [])
      .filter((option) => option.type === "object-array")
      .map((option) => ({ plugin, id: `${plugin}.${section.id}.${option.key}`, itemFields: option.itemFields ?? [] }))
  )
)

describe("list item fields", () => {
  it("finds the list options", () => {
    expect(listOptions.map((o) => o.id)).toEqual(
      expect.arrayContaining([
        "about.neofetch.neofetch_fields",
        "about.links.links_items",
        "websites.websites.websites_items",
      ])
    )
  })

  // Every text of every item field has a key, and the key is in each language's file.
  // generate-metadata extracts them; before, the list editor had no keys at all and
  // showed "Label", "Address", "Thumbnail" in every language. A new key lands in pt and
  // es in English, for someone to translate.
  for (const locale of locales) {
    it(`has every item field text in ${locale}`, () => {
      const missing: string[] = []
      for (const option of listOptions) {
        for (const field of option.itemFields) {
          const keys = [field.i18nKey?.label, field.i18nKey?.placeholder, field.i18nKey?.description]
          if (!field.i18nKey?.label) missing.push(`${option.id}.${field.key}: no i18nKey`)
          if (field.placeholder && !field.i18nKey?.placeholder) missing.push(`${option.id}.${field.key}.placeholder`)
          if (field.description && !field.i18nKey?.description) missing.push(`${option.id}.${field.key}.description`)
          for (const opt of field.options ?? []) keys.push(field.i18nKey?.options?.[opt.value])
          const t = translator(locale)
          for (const key of keys.filter((k): k is string => Boolean(k))) {
            if (t(key.replace(/^plugins\./, ""), "\u0000") === "\u0000") missing.push(key)
          }
        }
      }
      expect(missing).toEqual([])
    })
  }

  it("shows the Portuguese labels in the about links editor", () => {
    const links = listOptions.find((o) => o.id === "about.links.links_items")!
    const fields = translateItemFields(links.itemFields, translator("pt"))
    expect(fields.map((f) => f.label)).toEqual(["Endereço", "Texto", "Ícone"])
    expect(fields[2]!.options!.find((o) => o.value === "auto")!.label).toBe("Pelo endereço")
    expect(fields[2]!.options!.find((o) => o.value === "linkedin")!.label).toBe("LinkedIn")
  })

  it("keeps the English text when a key is missing", () => {
    const fields = translateItemFields(
      [{ key: "a", label: "Label", type: "string", placeholder: "Location" }],
      (_key, fallback) => fallback
    )
    expect(fields[0]).toMatchObject({ label: "Label", placeholder: "Location" })
  })
})
