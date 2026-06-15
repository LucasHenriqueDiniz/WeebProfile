import { useTranslation } from "react-i18next"

/**
 * Translates plugin metadata strings (section/option labels, descriptions, etc.)
 * using the "plugins.*" namespace, falling back to the metadata's default
 * (English) value when no translation exists.
 */
export function usePluginI18n() {
  const { t, i18n } = useTranslation()

  const tWithFallback = (key: string, fallback: string): string => {
    const fullKey = `plugins.${key}`
    return i18n.exists(fullKey) ? (t(fullKey) as string) : fallback
  }

  return { tWithFallback }
}
