import type { MalLastUpdates, MyAnimeListConfig } from "../types"

/** User updates have no verified Jikan Edge schema yet. Keep the section unavailable
 * rather than deriving updates from paginated lists or presenting an empty list. */
export async function transformLastUpdates(_response: unknown, _config: MyAnimeListConfig): Promise<MalLastUpdates> {
  return { anime: [], manga: [] }
}
