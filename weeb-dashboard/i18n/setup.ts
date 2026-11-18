import i18n from "i18next"
import type { ReadCallback } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpBackend from "i18next-http-backend"

// Plugin strings (names, descriptions, option labels) live apart from the rest, one
// file per plugin and language in messages/plugins/<id>/<lng>.json, which is where
// generate-metadata writes them. The wizard looks them up as plugins.<id>.* through
// usePluginI18n. Under Next.js, i18n/request.ts merged them in; the move to Vite
// dropped that, so every lookup missed and the wizard showed the English metadata.
// Lazy, so a language's plugin files are fetched only when that language loads.
const pluginMessageFiles = import.meta.glob<Record<string, unknown>>("../messages/plugins/*/*.json", {
  import: "default",
})

async function loadPluginMessages(language: string): Promise<Record<string, unknown>> {
  const loads = Object.entries(pluginMessageFiles).flatMap(([file, load]) => {
    const match = file.match(/\/plugins\/([^/]+)\/([^/]+)\.json$/)
    return match && match[2] === language ? [load().then((messages) => [match[1], messages] as const)] : []
  })
  return Object.fromEntries(await Promise.all(loads))
}

/**
 * The HTTP backend, with the plugin files attached under `plugins` in the same load,
 * so the first render already has them: added afterwards, they would need a second
 * render that react-i18next does not trigger by default.
 */
class TranslationBackend extends HttpBackend {
  read(language: string, namespace: string, callback: ReadCallback) {
    super.read(language, namespace, (error, data) => {
      if (error || !data || typeof data !== "object") return callback(error, data)
      loadPluginMessages(language).then(
        (plugins) => callback(null, { ...data, plugins }),
        // The rest of the interface still loads; plugin text falls back to English.
        (pluginError) => {
          console.warn(`Could not load plugin translations for ${language}:`, pluginError)
          callback(null, data)
        }
      )
    })
  }
}

i18n
  .use(TranslationBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "pt", "es"],
    defaultNS: "translation",
    ns: ["translation"],
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  })

// The page's own language follows the interface: screen readers and the browser's
// translate prompt read <html lang>, which index.html fixes at one value.
i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") document.documentElement.lang = language
})

export default i18n
