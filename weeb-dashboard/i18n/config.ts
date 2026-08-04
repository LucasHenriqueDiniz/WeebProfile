export const locales = ["pt", "en", "es"] as const
export type Locale = (typeof locales)[number]

// Todos os idiomas exibidos, incluindo os marcados como "em breve".
//
// O japonês saiu daqui em 08/2026. Ele era anunciado como "em breve" sem nenhum
// arquivo de tradução — nem `messages/ja.json`, nem os de plugin — desde que o
// i18n existe. Uma promessa sem data e sem trabalho iniciado envelhece mal: quem
// vê passa a duvidar do resto da interface. Melhor reanunciar quando a tradução
// começar de fato.
//
// O mecanismo de "em breve" continua aqui de propósito: é como o próximo idioma
// seria anunciado, e é usado por LanguageSelector e pela página de settings.
export const allLocales = ["pt", "en", "es"] as const
export type AllLocale = (typeof allLocales)[number]

export const defaultLocale: Locale = "pt"

export const localeNames: Record<string, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
}

export const localeComingSoon: Record<string, boolean> = {
  pt: false,
  en: false,
  es: false,
}
