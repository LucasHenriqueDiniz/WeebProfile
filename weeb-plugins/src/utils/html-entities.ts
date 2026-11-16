/**
 * Turns HTML entities back into the characters they stand for.
 *
 * For text that reached us already escaped for HTML: scraped pages (a site's <title>,
 * MyAnimeList's profile page through Jikan). React escapes text again when it renders,
 * so without this "Guardian&#039;s" is drawn as the six characters "&#039;".
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
  "#x27": "'",
  "#x2F": "/",
  "#47": "/",
}

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    const direct = NAMED_ENTITIES[entity] ?? NAMED_ENTITIES[entity.toLowerCase()]
    if (direct !== undefined) return direct
    if (/^#\d+$/.test(entity)) return String.fromCodePoint(Number(entity.slice(1)))
    if (/^#x[0-9a-fA-F]+$/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2), 16))
    return match
  })
}
