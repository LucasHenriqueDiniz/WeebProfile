import type {
  BasicAnimeFavorite,
  BasicCharacterFavorite,
  BasicMangaFavorite,
  BasicPeopleFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
  MyAnimeListConfig,
} from "../types"
import { DEFAULT_FAVORITES_MAX } from "../constants"
import { embedImageOrNull } from "../../../utils/image-to-base64"
import type { EdgeFavorite, MalProfileResponse } from "./profile"
import { type DetailRequest, type EdgeMediaDetail, detailKey, fetchFavoriteDetails } from "./favorite-details"

const COVER_MAX_BYTES = 100_000
export type FavoriteCategoryStatus = "complete" | "partial" | "empty" | "unavailable"
export interface FavoritesSectionsStatus {
  anime: FavoriteCategoryStatus
  manga: FavoriteCategoryStatus
  characters: FavoriteCategoryStatus
  people: FavoriteCategoryStatus
}
export interface BasicFavorites {
  anime: BasicAnimeFavorite[]
  manga: BasicMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}
export interface FullFavorites {
  anime: FullAnimeFavorite[]
  manga: FullMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}

/** The list styles that draw score, popularity, genres and the rest of a title's page. */
const STYLES_WITH_DETAILS = new Set(["detailed", "minimal"])

/**
 * MAL's CDN serves any of its images resized under `/r/{w}x{h}/`, re-encoded as JPEG.
 * 150x240 is twice the largest box a favorite is drawn in (75x120, cropped to cover).
 */
const MAL_IMAGE = /^https:\/\/cdn\.myanimelist\.net\/images\/([^?#]+)/
export function malResizedImageUrl(url: string): string | null {
  const match = MAL_IMAGE.exec(url)
  return match ? `https://cdn.myanimelist.net/r/150x240/images/${match[1]}` : null
}

async function image(imageUrl: string | null): Promise<{ image: string | null; failed: boolean }> {
  // Sem URL não é falha: o favorito simplesmente não tem imagem. A distinção
  // alimenta o status `partial` da categoria.
  if (!imageUrl) return { image: null, failed: false }

  const options = { maxBytes: COVER_MAX_BYTES, context: "myanimelist/favorites" }
  const embedded = await embedImageOrNull(imageUrl, options)
  if (embedded) return { image: embedded, failed: false }

  // The original can be larger than the limit (Aisaka Taiga's is 450x700, 158 KB) or a
  // PNG served as image/jpeg, which the magic-byte check refuses. The resized copy is a
  // real JPEG of ~12 KB, so it rescues both.
  const resized = malResizedImageUrl(imageUrl)
  const fallback = resized ? await embedImageOrNull(resized, options) : null
  return { image: fallback, failed: fallback === null }
}

function favoriteId(item: EdgeFavorite): number {
  return item.malId ?? item.mal_id ?? 0
}

function startYear(item: EdgeFavorite): number | null {
  return item.startYear ?? item.start_year ?? null
}

async function category<T>(
  items: EdgeFavorite[],
  max: number,
  map: (item: EdgeFavorite, embedded: string | null) => T
): Promise<{ items: T[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const selected = items.slice(0, max)
  if (!selected.length) return { items: [], status: "empty" }
  let partial = false
  const result: T[] = []
  for (const item of selected) {
    const embedded = await image(
      item.imageUrl ?? item.images?.jpg?.small_image_url ?? item.images?.jpg?.image_url ?? null
    )
    partial ||= embedded.failed
    result.push(map(item, embedded.image))
  }
  return { items: result, status: partial ? "partial" : "complete" }
}

/** The favorites a section will draw, when its list style shows what their pages say. */
function detailRequests(
  media: "anime" | "manga",
  wanted: boolean,
  favorites: () => EdgeFavorite[],
  max: number
): DetailRequest[] {
  if (!wanted || max <= 0) return []
  try {
    return favorites()
      .slice(0, max)
      .map((item) => ({ media, malId: favoriteId(item) }))
  } catch {
    // A malformed category already degrades on its own (status "unavailable").
    return []
  }
}

function genreNames(detail: EdgeMediaDetail | null | undefined): { name: string }[] {
  return (detail?.genres ?? []).flatMap((genre) => (genre?.name ? [{ name: genre.name }] : []))
}

/** A favorite as the profile lists it, plus whatever its page said. Unknown stays null. */
function fullAnime(favorite: BasicAnimeFavorite, detail: EdgeMediaDetail | null | undefined): FullAnimeFavorite {
  return {
    ...favorite,
    synopsis: detail?.synopsis ?? null,
    score: detail?.score ?? null,
    popularity: detail?.popularity ?? null,
    episodes: detail?.episodes ?? null,
    status: detail?.status ?? null,
    rank: detail?.rank ?? null,
    year: detail?.year ?? null,
    genres: genreNames(detail),
  }
}

function fullManga(favorite: BasicMangaFavorite, detail: EdgeMediaDetail | null | undefined): FullMangaFavorite {
  return {
    ...favorite,
    synopsis: detail?.synopsis ?? null,
    score: detail?.score ?? null,
    popularity: detail?.popularity ?? null,
    chapters: detail?.chapters ?? null,
    volumes: detail?.volumes ?? null,
    status: detail?.status ?? null,
    rank: detail?.rank ?? null,
    year: detail?.year ?? null,
    genres: genreNames(detail),
  }
}

export async function fetchFavorites(
  profile: MalProfileResponse,
  config: MyAnimeListConfig,
  options: { details?: boolean } = {}
): Promise<{ basic: BasicFavorites; full: FullFavorites; sectionsStatus: FavoritesSectionsStatus }> {
  const sections = config.sections || []
  const withDetails = options.details ?? true
  const none = { items: [], status: "complete" as FavoriteCategoryStatus }
  const animeMax = config.anime_favorites_max ?? config.favorites_max ?? DEFAULT_FAVORITES_MAX
  const mangaMax = config.manga_favorites_max ?? config.favorites_max ?? DEFAULT_FAVORITES_MAX
  // Same defaults as RenderMyAnimeList.
  const animeStyle = config.anime_favorites_list_style || "detailed"
  const mangaStyle = config.manga_favorites_list_style || "detailed"

  const requests = [
    ...detailRequests(
      "anime",
      withDetails && sections.includes("anime_favorites") && STYLES_WITH_DETAILS.has(animeStyle),
      () => profile.favorites.anime,
      animeMax
    ),
    ...detailRequests(
      "manga",
      withDetails && sections.includes("manga_favorites") && STYLES_WITH_DETAILS.has(mangaStyle),
      () => profile.favorites.manga,
      mangaMax
    ),
  ]

  // The pages are fetched next to the image downloads, not after them.
  const [results, details] = await Promise.all([
    Promise.allSettled([
      sections.includes("anime_favorites")
        ? Promise.resolve().then(() =>
            category(profile.favorites.anime, animeMax, (x, image) => ({
              mal_id: favoriteId(x),
              title: x.title || "Unknown",
              image,
              start_year: startYear(x),
              type: x.type || "",
            }))
          )
        : Promise.resolve(none),
      sections.includes("manga_favorites")
        ? Promise.resolve().then(() =>
            category(profile.favorites.manga, mangaMax, (x, image) => ({
              mal_id: favoriteId(x),
              title: x.title || "Unknown",
              image,
              start_year: startYear(x),
              type: x.type || "",
            }))
          )
        : Promise.resolve(none),
      sections.includes("character_favorites")
        ? Promise.resolve().then(() =>
            category(
              profile.favorites.characters,
              config.character_favorites_max ?? config.favorites_max ?? DEFAULT_FAVORITES_MAX,
              (x, image) => ({ mal_id: favoriteId(x), name: x.name || "Unknown", image })
            )
          )
        : Promise.resolve(none),
      sections.includes("people_favorites")
        ? Promise.resolve().then(() =>
            category(
              profile.favorites.people,
              config.people_favorites_max ?? config.favorites_max ?? DEFAULT_FAVORITES_MAX,
              (x, image) => ({ mal_id: favoriteId(x), name: x.name || "Unknown", image })
            )
          )
        : Promise.resolve(none),
    ]),
    requests.length > 0
      ? fetchFavoriteDetails(requests).catch(() => new Map<string, EdgeMediaDetail>())
      : Promise.resolve(new Map<string, EdgeMediaDetail>()),
  ])
  const unwrap = <T>(result: PromiseSettledResult<{ items: T[]; status: FavoriteCategoryStatus }>) =>
    result.status === "fulfilled" ? result.value : { items: [], status: "unavailable" as FavoriteCategoryStatus }
  const [anime, manga, characters, people] = [
    unwrap(results[0]),
    unwrap(results[1]),
    unwrap(results[2]),
    unwrap(results[3]),
  ]
  const basic = {
    anime: anime.items as BasicAnimeFavorite[],
    manga: manga.items as BasicMangaFavorite[],
    characters: characters.items as BasicCharacterFavorite[],
    people: people.items as BasicPeopleFavorite[],
  }
  return {
    basic,
    full: {
      anime: basic.anime.map((x) => fullAnime(x, details.get(detailKey("anime", x.mal_id)))),
      manga: basic.manga.map((x) => fullManga(x, details.get(detailKey("manga", x.mal_id)))),
      characters: basic.characters,
      people: basic.people,
    },
    sectionsStatus: { anime: anime.status, manga: manga.status, characters: characters.status, people: people.status },
  }
}

/** Exposed for unit tests and callers that only need the four independently-degraded categories. */
export async function getBasicFavorites(
  profile: MalProfileResponse,
  limits: { animeMax: number; mangaMax: number; charactersMax: number; peopleMax: number },
  _options?: { previewMode?: boolean }
): Promise<BasicFavorites & { sectionsStatus: FavoritesSectionsStatus }> {
  const config = {
    sections: ["anime_favorites", "manga_favorites", "character_favorites", "people_favorites"],
    anime_favorites_max: limits.animeMax,
    manga_favorites_max: limits.mangaMax,
    character_favorites_max: limits.charactersMax,
    people_favorites_max: limits.peopleMax,
  } as MyAnimeListConfig
  const result = await fetchFavorites(profile, config, { details: false })
  return { ...result.basic, sectionsStatus: result.sectionsStatus }
}
