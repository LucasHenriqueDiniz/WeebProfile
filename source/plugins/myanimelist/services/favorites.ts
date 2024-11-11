import { MalFavoritesResponse, MalFullFavoritesResponse } from "../types/malFavoritesResponse"
import { MalProfileResponse } from "../types/malProfileResponse"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import imageToBase64 from "source/plugins/@utils/imageToBase64"
import { axios } from "./malApi"

interface FavoritesResult {
  basic: MalFavoritesResponse
  full: MalFullFavoritesResponse
}

export async function fetchFavorites(profile: MalProfileResponse, plugin: MyAnimeListPlugin): Promise<FavoritesResult> {
  const animeFavoritesMax = plugin.anime_favorites_max ?? (MAL_ENV_VARIABLES.anime_favorites_max.defaultValue as number)
  const mangaFavoritesMax = plugin.manga_favorites_max ?? (MAL_ENV_VARIABLES.manga_favorites_max.defaultValue as number)
  const characterFavoritesMax =
    plugin.character_favorites_max ?? (MAL_ENV_VARIABLES.character_favorites_max.defaultValue as number)
  const peopleFavoritesMax =
    plugin.people_favorites_max ?? (MAL_ENV_VARIABLES.people_favorites_max.defaultValue as number)

  // Get basic favorites with images converted to base64
  const basicFavorites = await getBasicFavorites(profile, {
    animeFavoritesMax,
    mangaFavoritesMax,
    characterFavoritesMax,
    peopleFavoritesMax,
  })

  // Get full favorites data if sections are enabled
  const fullFavorites = await getFullFavorites(basicFavorites, plugin.sections)

  return {
    basic: basicFavorites,
    full: fullFavorites,
  }
}

async function getBasicFavorites(
  profile: MalProfileResponse,
  limits: {
    animeFavoritesMax: number
    mangaFavoritesMax: number
    characterFavoritesMax: number
    peopleFavoritesMax: number
  }
): Promise<MalFavoritesResponse> {
  const { animeFavoritesMax, mangaFavoritesMax, characterFavoritesMax, peopleFavoritesMax } = limits

  const favorites = profile.data.favorites
  const processedFavorites = {
    anime: await Promise.all(
      favorites.anime.slice(0, animeFavoritesMax).map(async (item) => ({
        ...item,
        image: (await imageToBase64(item.image)) || item.image,
      }))
    ),
    manga: await Promise.all(
      favorites.manga.slice(0, mangaFavoritesMax).map(async (item) => ({
        ...item,
        image: (await imageToBase64(item.image)) || item.image,
      }))
    ),
    characters: await Promise.all(
      favorites.characters.slice(0, characterFavoritesMax).map(async (item) => ({
        ...item,
        image: (await imageToBase64(item.image)) || item.image,
      }))
    ),
    people: await Promise.all(
      favorites.people.slice(0, peopleFavoritesMax).map(async (item) => ({
        ...item,
        image: (await imageToBase64(item.image)) || item.image,
      }))
    ),
  }

  return processedFavorites
}

async function getFullFavorites(
  favorites: MalFavoritesResponse,
  sections: string[]
): Promise<MalFullFavoritesResponse> {
  const fullFavorites: MalFullFavoritesResponse = {
    anime: [],
    manga: [],
    characters: [],
    people: [],
  }

  if (sections.includes("anime_favorites")) {
    fullFavorites.anime = await Promise.all(
      favorites.anime.map(async (item) => {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${item.mal_id}/full`)
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          ...response.data.data,
          image: item.image,
        }
      })
    )
  }

  if (sections.includes("manga_favorites")) {
    fullFavorites.manga = await Promise.all(
      favorites.manga.map(async (item) => {
        const response = await axios.get(`https://api.jikan.moe/v4/manga/${item.mal_id}/full`)
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          ...response.data.data,
          image: item.image,
        }
      })
    )
  }

  return fullFavorites
}
