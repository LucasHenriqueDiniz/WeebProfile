export const locales = ['pt', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

// All available locales including coming soon
export const allLocales = ['pt', 'en', 'es', 'ja'] as const
export type AllLocale = (typeof allLocales)[number]

export const defaultLocale: Locale = 'pt'

export const localeNames: Record<string, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  ja: '日本語',
}

export const localeComingSoon: Record<string, boolean> = {
  pt: false,
  en: false,
  es: false,
  ja: true, // Japonês em breve
}

