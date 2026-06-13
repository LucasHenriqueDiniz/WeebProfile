import { useTranslations } from "@/i18n/use-translations"

/**
 * Helper hook for plugin i18n with safe fallback
 *
 * Uses try/catch to handle missing translations gracefully,
 * falling back to the original English text from metadata.
 */
export function usePluginI18n() {
  // Use 'plugins' namespace - then t('16personalities.description') looks for plugins.16personalities.description
  const t = useTranslations("plugins")

  /**
   * Translate with fallback to English original
   *
   * @param key - i18n key without "plugins." prefix (e.g., "github.displayName" or "16personalities.description")
   * @param fallback - Original English text from metadata
   * @returns Translated text or fallback if translation fails
   */
  function tWithFallback(key: string, fallback: string): string {
    try {
      // With useTranslations('plugins'), t('16personalities.description') looks for plugins.16personalities.description
      // key is already without 'plugins.' prefix (e.g., "16personalities.description")
      // So we pass it directly to t() which is scoped to 'plugins' namespace
      const translated = t(key as any)

      // If translation is empty or undefined, use fallback
      if (!translated || typeof translated !== "string") {
        return fallback
      }

      // next-intl returns the key itself when translation is not found
      // Simple check: if translated equals the key or the full key path, it's not translated
      if (translated === key || translated === `plugins.${key}`) {
        return fallback
      }

      // Return the translated value
      return translated
    } catch (error) {
      // If next-intl throws (key doesn't exist), use fallback
      return fallback
    }
  }

  return { tWithFallback, t }
}
