import React from "react"
import { useTranslation } from "react-i18next"

type RichTagFn = (chunks: React.ReactNode) => React.ReactNode

/**
 * Compatibility shim: drop-in replacement for next-intl's useTranslations.
 * Components change only the import — t('key') usage stays identical.
 */
export function useTranslations(namespace?: string) {
  const { t, i18n } = useTranslation()

  const resolve = (key: string, params?: Record<string, unknown>): string =>
    namespace ? (t(`${namespace}.${key}`, params as any) as string) : (t(key, params as any) as string)

  /**
   * t.raw: returns the raw translation value (object/array) from the i18next store.
   * next-intl uses this to get structured data arrays from translation files.
   */
  const raw = (key: string): any => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    // i18next stores the resolved resource; getResourceBundle returns the entire namespace
    const parts = fullKey.split(".")
    let value: any = i18n.getDataByLanguage(i18n.language)
    if (!value) return []
    for (const part of parts) {
      value = value?.[part]
    }
    return value ?? []
  }

  /**
   * t.rich: renders rich text with React component tags.
   * next-intl uses this for inline JSX in translations, e.g. t.rich('title', { strong: (c) => <strong>{c}</strong> })
   * The translation string marks the spot with a single-brace placeholder (e.g. "{zero}"); the
   * sibling key of the same name (e.g. "zero") holds the text to wrap with the tag's render function.
   */
  const rich = (key: string, tags?: Record<string, RichTagFn>): React.ReactNode => {
    const template = resolve(key)
    const tagNames = tags ? Object.keys(tags) : []
    if (!tags || tagNames.length === 0) return template

    const pattern = new RegExp(`\\{(${tagNames.join("|")})\\}`, "g")
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let partKey = 0

    while ((match = pattern.exec(template)) !== null) {
      if (match.index > lastIndex) {
        parts.push(template.slice(lastIndex, match.index))
      }
      const tagName = match[1]
      const chunkText = resolve(tagName)
      parts.push(React.createElement(React.Fragment, { key: partKey++ }, tags[tagName](chunkText)))
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < template.length) {
      parts.push(template.slice(lastIndex))
    }
    return parts
  }

  const tFn = Object.assign(resolve, { raw, rich })
  return tFn
}

/**
 * Compatibility shim: drop-in replacement for next-intl's useLocale.
 * Returns the current language from i18next.
 */
export function useLocale(): string {
  const { i18n } = useTranslation()
  return i18n.language || "en"
}
