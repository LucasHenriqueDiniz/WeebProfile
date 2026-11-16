/** An anime's page on AniList, from the media id the GraphQL API returns. */
export function anilistAnimeUrl(id: number): string {
  return `https://anilist.co/anime/${id}`
}
