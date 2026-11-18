export const locales = ["pt", "en", "es"] as const
export type Locale = (typeof locales)[number]

// Adding a language: add it here and to supportedLngs in setup.ts, with its files in public/locales/<code> and
// messages/plugins/*/<code>.json. The header's switch lists exactly this array.
//
// Japanese was announced as "coming soon" until 08/2026 without a single
// translation file. The "coming soon" flag went with the language dialog it served
// (11/2026): announce the next language when its translation exists.

export const defaultLocale: Locale = "pt"

export const localeNames: Record<string, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
}
