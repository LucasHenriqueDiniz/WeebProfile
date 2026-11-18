type Translate = (key: string, fallback: string) => string

/** Lower case without accents, so "estatisticas" finds "Estatísticas". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

/**
 * Everything a person might type to find a plugin: its id, the English name and
 * description from the metadata, and the ones in the viewer's language, which is what
 * the list shows (PluginRow). The search compared only the English ones, so "Sobre"
 * found nothing while the list read "Sobre mim".
 */
export function pluginSearchTexts(
  plugin: string,
  metadata: { displayName: string; description: string },
  translate: Translate
): string[] {
  return [
    plugin,
    metadata.displayName,
    metadata.description,
    translate(`${plugin}.displayName`, metadata.displayName),
    translate(`${plugin}.description`, metadata.description),
  ]
}

/** Whether any of the texts holds the search, ignoring case and accents. */
export function pluginMatchesQuery(texts: Array<string | undefined>, query: string): boolean {
  const needle = normalizeSearchText(query.trim())
  if (!needle) return true
  return texts.some((text) => text !== undefined && normalizeSearchText(text).includes(needle))
}
