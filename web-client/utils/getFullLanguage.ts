function getFullLanguage(lang: string) {
  switch (lang) {
    case "en":
      return "English"
    case "es":
      return "Spanish"
    case "pt-BR":
      return "Portuguese (Brazil)"
    default:
      return null
  }
}

export default getFullLanguage
