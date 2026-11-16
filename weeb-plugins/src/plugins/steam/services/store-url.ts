/** A game's page on the Steam store, from the appid GetOwnedGames returns. */
export function steamStoreUrl(appid: number): string {
  return `https://store.steampowered.com/app/${appid}`
}
