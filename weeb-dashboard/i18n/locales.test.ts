import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { locales } from "./config"

// The interface text the site serves. There used to be a second copy in messages/,
// and the en/es translations landed there while the site kept serving Portuguese.
function load(locale: string): Record<string, string> {
  const file = path.join(__dirname, "../public/locales", locale, "translation.json")
  const flat: Record<string, string> = {}
  const walk = (node: unknown, prefix: string) => {
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) walk(value, prefix ? `${prefix}.${key}` : key)
    } else {
      flat[prefix] = String(node)
    }
  }
  walk(JSON.parse(readFileSync(file, "utf-8")), "")
  return flat
}

// i18next plural forms differ by language (es and pt have _many in some setups),
// so a key is compared by its base name.
const baseKey = (key: string) => key.replace(/_(zero|one|two|few|many|other)$/, "")
const placeholders = (text: string) => [...text.matchAll(/\{\{?\s*(\w+)\s*\}?\}/g)].map((m) => m[1]).sort()

describe("public/locales", () => {
  const reference = load("pt")

  for (const locale of locales.filter((l) => l !== "pt")) {
    const other = load(locale)

    it(`${locale} has the same keys as pt`, () => {
      const keys = (t: Record<string, string>) => [...new Set(Object.keys(t).map(baseKey))].sort()
      expect(keys(other)).toEqual(keys(reference))
    })

    it(`${locale} keeps every placeholder pt uses`, () => {
      const mismatches = Object.keys(reference)
        .filter((key) => key in other)
        .filter((key) => placeholders(reference[key]).join() !== placeholders(other[key]).join())
      expect(mismatches).toEqual([])
    })
  }
})
