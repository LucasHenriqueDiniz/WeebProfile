import Bottleneck from "bottleneck"
import imageToBase64 from "source/plugins/@utils/imageToBase64"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"

import {
  BasicAnimeFavorite,
  BasicCharacterFavorite,
  BasicMangaFavorite,
  BasicPeopleFavorite,
  MalBasicFavorites,
  MalFullFavorites,
} from "../types/malFavorites"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import { MalProfileResponse } from "../types/ProfileResponse"
import { axios } from "./fetchMyAnimeList"
import logger from "source/helpers/logger"

interface FavoritesResult {
  basic: MalBasicFavorites
  full: MalFullFavorites
}

export async function fetchFavorites(
  profile: MalProfileResponse,
  plugin: MyAnimeListPlugin,
  limiter: Bottleneck
): Promise<FavoritesResult> {
  try {
    const animeFavoritesMax =
      plugin.anime_favorites_max ?? (MAL_ENV_VARIABLES.anime_favorites_max.defaultValue as number)
    const mangaFavoritesMax =
      plugin.manga_favorites_max ?? (MAL_ENV_VARIABLES.manga_favorites_max.defaultValue as number)
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
    const fullFavorites = await getFullFavorites(basicFavorites, plugin.sections, limiter)

    return {
      basic: basicFavorites,
      full: fullFavorites,
    }
  } catch (error) {
    logger({
      message: `Error processing favorites: ${error}`,
      level: "error",
      __filename,
    })
    // Return empty favorites rather than throwing
    return {
      basic: { anime: [], manga: [], characters: [], people: [] },
      full: { anime: [], manga: [], characters: [], people: [] },
    }
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
): Promise<MalBasicFavorites> {
  const { animeFavoritesMax, mangaFavoritesMax, characterFavoritesMax, peopleFavoritesMax } = limits

  const favorites = profile.favorites || { anime: [], manga: [], characters: [], people: [] }

  // Add debug logging
  logger({
    message: `Processing favorites: ${JSON.stringify({
      animeCount: favorites.anime?.length || 0,
      mangaCount: favorites.manga?.length || 0,
      charactersCount: favorites.characters?.length || 0,
      peopleCount: favorites.people?.length || 0,
    })}`,
    level: "debug",
    __filename,
  })

  const processedFavorites = {
    anime: await Promise.all(
      (favorites.anime || []).slice(0, animeFavoritesMax).map(async (item) => {
        const image =
          item.images?.jpg?.image_url ||
          item.images?.jpg?.large_image_url ||
          item.images?.jpg?.small_image_url ||
          item.images?.webp?.image_url ||
          "https://placecats.com/300/300"

        return {
          image: (await imageToBase64(image)) || image,
          mal_id: item.mal_id,
          title: item.title,
          start_year: item.start_year,
          type: item.type,
        }
      })
    ),
    manga: await Promise.all(
      (favorites.manga || []).slice(0, mangaFavoritesMax).map(async (item) => {
        const image =
          item.images?.jpg?.image_url ||
          item.images?.jpg?.large_image_url ||
          item.images?.jpg?.small_image_url ||
          item.images?.webp?.image_url ||
          "https://placecats.com/300/300"

        return {
          image: (await imageToBase64(image)) || image,
          mal_id: item.mal_id,
          title: item.title,
          start_year: item.start_year,
          type: item.type,
        }
      })
    ),
    characters: await Promise.all(
      (favorites.characters || []).slice(0, characterFavoritesMax).map(async (item) => {
        const image =
          item.images?.jpg?.image_url ||
          item.images?.jpg?.large_image_url ||
          item.images?.jpg?.small_image_url ||
          item.images?.webp?.image_url ||
          "https://placecats.com/300/300"

        return {
          image: (await imageToBase64(image)) || image,
          mal_id: item.mal_id,
          name: item.name,
        }
      })
    ),
    people: await Promise.all(
      (favorites.people || []).slice(0, peopleFavoritesMax).map(async (item) => {
        const image =
          item.images?.jpg?.image_url ||
          item.images?.jpg?.large_image_url ||
          item.images?.jpg?.small_image_url ||
          item.images?.webp?.image_url ||
          "https://placecats.com/300/300"

        return {
          image: (await imageToBase64(image)) || image,
          mal_id: item.mal_id,
          name: item.name,
        }
      })
    ),
  }

  logger({
    message: `Processed favorites: ${JSON.stringify(processedFavorites).slice(0, 100)}`,
    level: "debug",
    __filename,
  })

  return processedFavorites
}

async function getFullFavorites(
  favorites: MalBasicFavorites,
  sections: string[],
  limiter: Bottleneck
): Promise<MalFullFavorites> {
  const fullFavorites: MalFullFavorites = {
    anime: [],
    manga: [],
    characters: [],
    people: [],
  }

  if (sections.includes("anime_favorites")) {
    fullFavorites.anime = await Promise.all(
      favorites.anime.map(async (item: BasicAnimeFavorite) => {
        const response = await limiter.schedule(() => axios.get(`https://api.jikan.moe/v4/anime/${item.mal_id}/full`))
        let genres: { name: string }[] = []

        if (response.data.data.genres) {
          genres = response.data.data.genres.map((genre: { name: string }) => ({ name: genre.name }))
        }

        if (response.data.data.themes) {
          genres = [...genres, ...response.data.data.themes.map((theme: { name: string }) => ({ name: theme.name }))]
        }

        if (response.data.data.explicit_genres) {
          genres = [
            ...genres,
            ...response.data.data.explicit_genres.map((theme: { name: string }) => ({ name: theme.name })),
          ]
        }
        return {
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          mal_id: item.mal_id,
          title: item.title,
          episodes: response.data.data.episodes ?? null,
          synopsis: response.data.data.synopsis,
          score: response.data.data.score,
          popularity: response.data.data.popularity,
          chapters: response.data.data.chapters ?? null,
          rank: response.data.data.rank,
          volumes: response.data.data.volumes ?? null,
          status: response.data.data.status,
          year: response.data.data.year ?? response.data.data.aired?.prop?.from?.year ?? null,
          genres,
        }
      })
    )
  }

  if (sections.includes("manga_favorites")) {
    fullFavorites.manga = await Promise.all(
      favorites.manga.map(async (item: BasicMangaFavorite) => {
        const response = await limiter.schedule(() => axios.get(`https://api.jikan.moe/v4/manga/${item.mal_id}/full`))
        let genres: { name: string }[] = []

        if (response.data.data.genres) {
          genres = response.data.data.genres.map((genre: { name: string }) => ({ name: genre.name }))
        }

        if (response.data.data.themes) {
          genres = [...genres, ...response.data.data.themes.map((theme: { name: string }) => ({ name: theme.name }))]
        }

        if (response.data.data.explicit_genres) {
          genres = [
            ...genres,
            ...response.data.data.explicit_genres.map((theme: { name: string }) => ({ name: theme.name })),
          ]
        }

        return {
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          synopsis: response.data.data.synopsis,
          score: response.data.data.score,
          popularity: response.data.data.popularity,
          chapters: response.data.data.chapters ?? null,
          rank: response.data.data.rank,
          volumes: response.data.data.volumes ?? null,
          status: response.data.data.status,
          year: response.data.data.year ?? response.data.data.aired?.prop?.from?.year ?? null,
          genres,
        }
      })
    )
  }

  // @TODO maybe make a better section for characters and people with full data
  if (sections.includes("characters")) {
    fullFavorites.characters = await Promise.all(
      favorites.characters.map(async (item: BasicCharacterFavorite) => {
        return {
          ...item,
        }
      })
    )
  }

  if (sections.includes("people")) {
    fullFavorites.people = await Promise.all(
      favorites.people.map(async (item: BasicPeopleFavorite) => {
        return {
          ...item,
        }
      })
    )
  }

  return fullFavorites
}
