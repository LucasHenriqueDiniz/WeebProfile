import type { BasicAnimeFavorite, BasicCharacterFavorite, BasicMangaFavorite, BasicPeopleFavorite, FullAnimeFavorite, FullMangaFavorite, MyAnimeListConfig } from "../types"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import type { EdgeFavorite, MalProfileResponse } from "./profile"

const COVER_MAX_BYTES = 100_000
export type FavoriteCategoryStatus = "complete" | "partial" | "empty" | "unavailable"
export interface FavoritesSectionsStatus { anime: FavoriteCategoryStatus; manga: FavoriteCategoryStatus; characters: FavoriteCategoryStatus; people: FavoriteCategoryStatus }
export interface BasicFavorites { anime: BasicAnimeFavorite[]; manga: BasicMangaFavorite[]; characters: BasicCharacterFavorite[]; people: BasicPeopleFavorite[] }
export interface FullFavorites { anime: FullAnimeFavorite[]; manga: FullMangaFavorite[]; characters: BasicCharacterFavorite[]; people: BasicPeopleFavorite[] }

async function image(imageUrl: string | null): Promise<{ image: string | null; failed: boolean }> {
  if (!imageUrl) return { image: null, failed: false }
  try { return { image: (await urlToDataUriDirect(imageUrl, { maxBytes: COVER_MAX_BYTES })).dataUri, failed: false } } catch { return { image: null, failed: true } }
}

async function category<T>(items: EdgeFavorite[], max: number, map: (item: EdgeFavorite, embedded: string | null) => T): Promise<{ items: T[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const selected = items.slice(0, max)
  if (!selected.length) return { items: [], status: "empty" }
  let partial = false
  const result: T[] = []
  for (const item of selected) { const embedded = await image(item.imageUrl ?? item.images?.jpg?.small_image_url ?? item.images?.jpg?.image_url ?? null); partial ||= embedded.failed; result.push(map(item, embedded.image)) }
  return { items: result, status: partial ? "partial" : "complete" }
}

export async function fetchFavorites(profile: MalProfileResponse, config: MyAnimeListConfig): Promise<{ basic: BasicFavorites; full: FullFavorites; sectionsStatus: FavoritesSectionsStatus }> {
  const sections = config.sections || []
  const none = { items: [], status: "complete" as FavoriteCategoryStatus }
  const results = await Promise.allSettled([
    sections.includes("anime_favorites") ? Promise.resolve().then(() => category(profile.favorites.anime, config.anime_favorites_max ?? config.favorites_max ?? 20, (x, image) => ({ mal_id: x.mal_id, title: x.title || "Unknown", image, start_year: 0, type: x.type || "" }))) : Promise.resolve(none),
    sections.includes("manga_favorites") ? Promise.resolve().then(() => category(profile.favorites.manga, config.manga_favorites_max ?? config.favorites_max ?? 20, (x, image) => ({ mal_id: x.mal_id, title: x.title || "Unknown", image, start_year: 0, type: x.type || "" }))) : Promise.resolve(none),
    sections.includes("character_favorites") ? Promise.resolve().then(() => category(profile.favorites.characters, config.character_favorites_max ?? config.favorites_max ?? 20, (x, image) => ({ mal_id: x.mal_id, name: x.name || "Unknown", image }))) : Promise.resolve(none),
    sections.includes("people_favorites") ? Promise.resolve().then(() => category(profile.favorites.people, config.people_favorites_max ?? config.favorites_max ?? 20, (x, image) => ({ mal_id: x.mal_id, name: x.name || "Unknown", image }))) : Promise.resolve(none),
  ])
  const unwrap = <T>(result: PromiseSettledResult<{ items: T[]; status: FavoriteCategoryStatus }>) => result.status === "fulfilled" ? result.value : { items: [], status: "unavailable" as FavoriteCategoryStatus }
  const [anime, manga, characters, people] = [unwrap(results[0]), unwrap(results[1]), unwrap(results[2]), unwrap(results[3])]
  const basic = { anime: anime.items as BasicAnimeFavorite[], manga: manga.items as BasicMangaFavorite[], characters: characters.items as BasicCharacterFavorite[], people: people.items as BasicPeopleFavorite[] }
  return { basic, full: { anime: basic.anime.map((x) => ({ ...x, synopsis: "", score: 0, popularity: 0, episodes: null, status: "", rank: 0, year: null, genres: [] })), manga: basic.manga.map((x) => ({ ...x, synopsis: "", score: 0, popularity: 0, chapters: null, volumes: null, status: "", rank: 0, year: null, genres: [] })), characters: basic.characters, people: basic.people }, sectionsStatus: { anime: anime.status, manga: manga.status, characters: characters.status, people: people.status } }
}

/** Exposed for unit tests and callers that only need the four independently-degraded categories. */
export async function getBasicFavorites(profile: MalProfileResponse, limits: { animeMax: number; mangaMax: number; charactersMax: number; peopleMax: number }, _options?: { previewMode?: boolean }): Promise<BasicFavorites & { sectionsStatus: FavoritesSectionsStatus }> {
  const config = { sections: ["anime_favorites", "manga_favorites", "character_favorites", "people_favorites"], anime_favorites_max: limits.animeMax, manga_favorites_max: limits.mangaMax, character_favorites_max: limits.charactersMax, people_favorites_max: limits.peopleMax } as MyAnimeListConfig
  const result = await fetchFavorites(profile, config)
  return { ...result.basic, sectionsStatus: result.sectionsStatus }
}
