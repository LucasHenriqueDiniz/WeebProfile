/** Path segment of each favorites list on myanimelist.net. */
const SEGMENTS = {
  anime: "anime",
  manga: "manga",
  characters: "character",
  people: "people",
} as const

/** A favorite's page on MyAnimeList, from the mal_id Jikan returns. */
export function malFavoriteUrl(type: keyof typeof SEGMENTS, malId: number): string {
  return `https://myanimelist.net/${SEGMENTS[type]}/${malId}`
}
