/**
 * Serviço para buscar e processar favoritos do MyAnimeList
 */

import type {
  BasicAnimeFavorite,
  BasicMangaFavorite,
  BasicCharacterFavorite,
  BasicPeopleFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
} from "../types"
import { jikanGet, getLimiter } from "./api-client"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

// No decode/resize happens anymore -- these are just upper bounds on the raw download,
// centralized here rather than treated as a universal constant (see urlToDataUriDirect's
// maxBytes doc). MAL's small_image_url thumbnails are a few KB, so this is generous
// headroom, not a target; exceeding it throws ImageTooLargeError rather than resizing.
const COVER_MAX_BYTES = 100_000
const AVATAR_MAX_BYTES = 100_000
import type { MalProfileResponse } from "./profile"
import type { MyAnimeListConfig } from "../types"

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

/**
 * Per-category outcome, distinct from "empty array":
 * - "complete": section wasn't requested, or every item's image embedded successfully (or had no image).
 * - "partial": section had items but at least one image failed to embed (urlToDataUriDirect threw).
 * - "empty": section was requested and the user genuinely has 0 favorites in it.
 * - "unavailable": the category's own processing threw before producing a result at all.
 */
export type FavoriteCategoryStatus = "complete" | "partial" | "empty" | "unavailable"

export interface FavoritesSectionsStatus {
  anime: FavoriteCategoryStatus
  manga: FavoriteCategoryStatus
  characters: FavoriteCategoryStatus
  people: FavoriteCategoryStatus
}

function sanitizedHost(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return "(invalid url)"
  }
}

async function embedFavoriteImage(
  image: string,
  maxBytes: number,
  previewMode: boolean,
  warnLabel: string
): Promise<{ image: string | null; failed: boolean }> {
  // null, not "" -- an absent image must never become an <img src=""> (or, in the
  // isolated SVG-native path, <image href="">). Callers/renderers treat null as
  // "omit/placeholder", never as a literal empty string attribute value.
  if (!image) return { image: null, failed: false }
  if (previewMode) return { image, failed: false }
  try {
    const result = await urlToDataUriDirect(image, { maxBytes })
    return { image: result.dataUri, failed: false }
  } catch (error: any) {
    // Sanitized: host + error type only, never the full URL (may carry sensitive query
    // params) and never the image bytes/base64.
    console.warn(`  ⚠️  Erro ao converter ${warnLabel} (host: ${sanitizedHost(image)}):`, error?.name || error?.message)
    return { image: null, failed: true }
  }
}

async function processAnime(
  favorites: NonNullable<MalProfileResponse["favorites"]>,
  max: number,
  previewMode: boolean
): Promise<{ items: BasicAnimeFavorite[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const list = (favorites.anime || []).slice(0, max)
  if (list.length === 0) return { items: [], status: "empty" }

  let anyFailed = false
  const items: BasicAnimeFavorite[] = []
  for (const item of list) {
    if (!item) continue
    // small_image_url has priority -- it's the smallest real variant Jikan provides,
    // not a fallback chain through progressively larger images.
    const image = item.images?.jpg?.small_image_url || ""
    const { image: imageBase64, failed } = await embedFavoriteImage(
      image,
      COVER_MAX_BYTES,
      previewMode,
      `imagem de anime favorito (id ${item.mal_id})`
    )
    if (failed) anyFailed = true
    items.push({
      mal_id: item.mal_id,
      title: item.title,
      image: imageBase64,
      start_year: item.start_year || 0,
      type: item.type || "TV",
    })
  }
  return { items, status: anyFailed ? "partial" : "complete" }
}

async function processManga(
  favorites: NonNullable<MalProfileResponse["favorites"]>,
  max: number,
  previewMode: boolean
): Promise<{ items: BasicMangaFavorite[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const list = (favorites.manga || []).slice(0, max)
  if (list.length === 0) return { items: [], status: "empty" }

  let anyFailed = false
  const items: BasicMangaFavorite[] = []
  for (const item of list) {
    if (!item) continue
    const image = item.images?.jpg?.small_image_url || ""
    const { image: imageBase64, failed } = await embedFavoriteImage(
      image,
      COVER_MAX_BYTES,
      previewMode,
      `imagem de manga favorito (id ${item.mal_id})`
    )
    if (failed) anyFailed = true
    items.push({
      mal_id: item.mal_id,
      title: item.title,
      image: imageBase64,
      start_year: item.start_year || 0,
      type: item.type || "Manga",
    })
  }
  return { items, status: anyFailed ? "partial" : "complete" }
}

async function processCharacters(
  favorites: NonNullable<MalProfileResponse["favorites"]>,
  max: number,
  previewMode: boolean
): Promise<{ items: BasicCharacterFavorite[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const list = (favorites.characters || []).slice(0, max)
  if (list.length === 0) return { items: [], status: "empty" }

  let anyFailed = false
  const items: BasicCharacterFavorite[] = []
  for (const item of list) {
    if (!item) continue
    // Jikan doesn't provide a small/thumbnail variant for characters -- jpg.image_url
    // is the only real option, not an invented or upscaled one.
    const image = item.images?.jpg?.image_url || ""
    const { image: imageBase64, failed } = await embedFavoriteImage(
      image,
      AVATAR_MAX_BYTES,
      previewMode,
      `imagem de personagem favorito (id ${item.mal_id})`
    )
    if (failed) anyFailed = true
    items.push({ mal_id: item.mal_id, name: item.name, image: imageBase64 })
  }
  return { items, status: anyFailed ? "partial" : "complete" }
}

async function processPeople(
  favorites: NonNullable<MalProfileResponse["favorites"]>,
  max: number,
  previewMode: boolean
): Promise<{ items: BasicPeopleFavorite[]; status: FavoriteCategoryStatus }> {
  if (max <= 0) return { items: [], status: "complete" }
  const list = (favorites.people || []).slice(0, max)
  if (list.length === 0) return { items: [], status: "empty" }

  let anyFailed = false
  const items: BasicPeopleFavorite[] = []
  for (const item of list) {
    if (!item) continue
    const image = item.images?.jpg?.image_url || ""
    const { image: imageBase64, failed } = await embedFavoriteImage(
      image,
      AVATAR_MAX_BYTES,
      previewMode,
      `imagem de pessoa favorita (id ${item.mal_id})`
    )
    if (failed) anyFailed = true
    items.push({ mal_id: item.mal_id, name: item.name, image: imageBase64 })
  }
  return { items, status: anyFailed ? "partial" : "complete" }
}

/**
 * Busca favoritos básicos do perfil.
 *
 * The four categories are independent: one throwing (e.g. an unexpected shape in the
 * profile payload) must not sink the other three. Promise.allSettled -- rather than a
 * shared try/catch -- is what makes that isolation real instead of incidental.
 */
export async function getBasicFavorites(
  profile: MalProfileResponse,
  limits: {
    animeMax: number
    mangaMax: number
    charactersMax: number
    peopleMax: number
  },
  config: { previewMode?: boolean }
): Promise<BasicFavorites & { sectionsStatus: FavoritesSectionsStatus }> {
  const favorites = profile.favorites || { anime: [], manga: [], characters: [], people: [] }
  const previewMode = !!config.previewMode

  const [animeResult, mangaResult, charactersResult, peopleResult] = await Promise.allSettled([
    processAnime(favorites, limits.animeMax, previewMode),
    processManga(favorites, limits.mangaMax, previewMode),
    processCharacters(favorites, limits.charactersMax, previewMode),
    processPeople(favorites, limits.peopleMax, previewMode),
  ])

  const unwrap = <T>(
    result: PromiseSettledResult<{ items: T[]; status: FavoriteCategoryStatus }>,
    label: string
  ): { items: T[]; status: FavoriteCategoryStatus } => {
    if (result.status === "fulfilled") return result.value
    console.warn(`  ⚠️  Categoria de favoritos indisponível (${label}):`, result.reason)
    return { items: [], status: "unavailable" }
  }

  const anime = unwrap(animeResult, "anime")
  const manga = unwrap(mangaResult, "manga")
  const characters = unwrap(charactersResult, "characters")
  const people = unwrap(peopleResult, "people")

  return {
    anime: anime.items,
    manga: manga.items,
    characters: characters.items,
    people: people.items,
    sectionsStatus: { anime: anime.status, manga: manga.status, characters: characters.status, people: people.status },
  }
}

/**
 * Busca dados completos dos favoritos (anime e manga)
 */
export async function getFullFavorites(
  basicFavorites: BasicFavorites,
  sections: string[],
  config: { previewMode?: boolean }
): Promise<FullFavorites> {
  const fullFavorites: FullFavorites = {
    anime: [],
    manga: [],
    characters: basicFavorites.characters,
    people: basicFavorites.people,
  }

  // Buscar dados completos de anime se necessário
  if (sections.includes("anime_favorites")) {
    console.log(`📥 Processando favoritos completos de anime (${basicFavorites.anime.length} itens)...`)
    const animeFullResults = []
    for (let index = 0; index < basicFavorites.anime.length; index++) {
      const item = basicFavorites.anime[index]
      if (!item) continue

      try {
        console.log(`  [${index + 1}/${basicFavorites.anime.length}] Buscando dados completos: ${item.title}`)
        const response = await getLimiter().schedule(() =>
          jikanGet<{
            data: {
              episodes: number | null
              synopsis: string
              score: number
              popularity: number
              rank: number
              status: string
              year: number | null
              aired: { prop: { from: { year: number | null } } }
              genres: Array<{ name: string }>
              themes: Array<{ name: string }>
              explicit_genres: Array<{ name: string }>
            }
          }>(`/anime/${item.mal_id}/full`)
        )

        const genres = [
          ...(response.data.genres?.map((g) => ({ name: g.name })) || []),
          ...(response.data.themes?.map((t) => ({ name: t.name })) || []),
          ...(response.data.explicit_genres?.map((e) => ({ name: e.name })) || []),
        ]

        animeFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          episodes: response.data.episodes ?? null,
          synopsis: response.data.synopsis || "",
          score: response.data.score || 0,
          popularity: response.data.popularity || 0,
          rank: response.data.rank || 0,
          status: response.data.status || "",
          year: response.data.year ?? response.data.aired?.prop?.from?.year ?? null,
          genres,
        })
        console.log(`  ✅ Dados completos obtidos: ${item.title}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao buscar dados completos de ${item.title}:`, error.message)
        // Adicionar dados básicos como fallback
        animeFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          episodes: null,
          synopsis: "",
          score: 0,
          popularity: 0,
          rank: 0,
          status: "",
          year: item.start_year,
          genres: [],
        })
      }
    }
    fullFavorites.anime = animeFullResults
    console.log(`✅ Favoritos completos de anime processados`)
  }

  // Buscar dados completos de manga se necessário
  if (sections.includes("manga_favorites")) {
    console.log(`📥 Processando favoritos completos de manga (${basicFavorites.manga.length} itens)...`)
    const mangaFullResults = []
    for (let index = 0; index < basicFavorites.manga.length; index++) {
      const item = basicFavorites.manga[index]
      if (!item) continue

      try {
        console.log(`  [${index + 1}/${basicFavorites.manga.length}] Buscando dados completos: ${item.title}`)
        const response = await getLimiter().schedule(() =>
          jikanGet<{
            data: {
              chapters: number | null
              synopsis: string
              score: number
              popularity: number
              rank: number
              volumes: number | null
              status: string
              year: number | null
              published: { prop: { from: { year: number | null } } }
              genres: Array<{ name: string }>
              themes: Array<{ name: string }>
              explicit_genres: Array<{ name: string }>
            }
          }>(`/manga/${item.mal_id}/full`)
        )

        const genres = [
          ...(response.data.genres?.map((g) => ({ name: g.name })) || []),
          ...(response.data.themes?.map((t) => ({ name: t.name })) || []),
          ...(response.data.explicit_genres?.map((e) => ({ name: e.name })) || []),
        ]

        mangaFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          chapters: response.data.chapters ?? null,
          synopsis: response.data.synopsis || "",
          score: response.data.score || 0,
          popularity: response.data.popularity || 0,
          rank: response.data.rank || 0,
          volumes: response.data.volumes ?? null,
          status: response.data.status || "",
          year: response.data.year ?? response.data.published?.prop?.from?.year ?? null,
          genres,
        })
        console.log(`  ✅ Dados completos obtidos: ${item.title}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao buscar dados completos de ${item.title}:`, error.message)
        // Adicionar dados básicos como fallback
        mangaFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          chapters: null,
          synopsis: "",
          score: 0,
          popularity: 0,
          rank: 0,
          volumes: null,
          status: "",
          year: item.start_year,
          genres: [],
        })
      }
    }
    fullFavorites.manga = mangaFullResults
    console.log(`✅ Favoritos completos de manga processados`)
  }

  return fullFavorites
}

/**
 * Busca todos os favoritos (básicos e completos)
 */
export async function fetchFavorites(
  profile: MalProfileResponse,
  config: MyAnimeListConfig,
  previewMode = false
): Promise<{ basic: BasicFavorites; full: FullFavorites; sectionsStatus: FavoritesSectionsStatus }> {
  // No top-level catch here: a real failure (malformed profile, unexpected exception outside
  // the per-item try/catches below) must propagate as an actual Error, not come back as
  // "success" with empty arrays. Per-item failures are still swallowed individually further
  // down (a single bad image/entry doesn't sink the whole section) -- this only guards the
  // difference between "user genuinely has 0 favorites" and "the fetch pipeline broke".
  const sections = config.sections || []

  // Determinar quais tipos de favoritos precisam ser processados baseado nas seções ativadas
  const needsAnime = sections.includes("anime_favorites")
  const needsManga = sections.includes("manga_favorites")
  const needsCharacters = sections.includes("character_favorites")
  const needsPeople = sections.includes("people_favorites")

  // Usar limites específicos por tipo, com fallback para favorites_max ou 20
  // Se a seção não estiver ativada, usar limite 0 para não processar
  const basicFavorites = await getBasicFavorites(
    profile,
    {
      animeMax: needsAnime ? (config.anime_favorites_max ?? config.favorites_max ?? 20) : 0,
      mangaMax: needsManga ? (config.manga_favorites_max ?? config.favorites_max ?? 20) : 0,
      charactersMax: needsCharacters ? (config.character_favorites_max ?? config.favorites_max ?? 20) : 0,
      peopleMax: needsPeople ? (config.people_favorites_max ?? config.favorites_max ?? 20) : 0,
    },
    { previewMode }
  )

  const fullFavorites = await getFullFavorites(basicFavorites, config.sections || [], { previewMode })

  return {
    basic: basicFavorites,
    full: fullFavorites,
    sectionsStatus: basicFavorites.sectionsStatus,
  }
}
