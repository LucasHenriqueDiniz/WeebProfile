import Axios from "axios";
import { CacheOptions, setupCache } from "axios-cache-interceptor";
import Bottleneck from "bottleneck";
import { FullMalAnimeResponse, MalFavoritesResponse, MalFullFavoritesResponse, MalFullMangaResponse } from "../types/malFavoritesResponse";
import { MalLastUpdatesResponse } from "../types/malLastUpdatesResponse";
import MyAnimeListPlugin from "../types/envMal";
import { MalProfileResponse } from "../types/malProfileResponse";
import { MalData } from "../types/malTypes";
import imageToBase64 from "source/plugins/@utils/imageToBase64";
import generateTestMyAnimeListData from "../test/generateTestData";
import MAL_ENV_VARIABLES from "../ENV_VARIABLES";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
  reservoir: 60,
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000,
});

const axiosInstance = Axios.create();
const OPTIONS = {
  maxAge: 1 * 60 * 60 * 1000, // 1
  //don't cache != 200 responses
  shouldCacheResponse: (response: { status: number }) => response.status === 200,
  clearOnStale: true,
  cacheTakeover: false,
} as CacheOptions;
const axios = setupCache(axiosInstance, OPTIONS);

export async function getImageFavorites(data: MalFavoritesResponse): Promise<MalFavoritesResponse> {
  let anime = data.anime;
  let manga = data.manga;
  let characters = data.characters;
  let people = data.people;

  anime = await Promise.all(
    anime.map(async (item) => {
      const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.images.jpg) {
        item.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  manga = await Promise.all(
    manga.map(async (item) => {
      const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.images.jpg) {
        item.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  characters = await Promise.all(
    characters.map(async (item) => {
      const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.images.jpg) {
        item.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  people = await Promise.all(
    people.map(async (item) => {
      const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.images.jpg) {
        item.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  // Reconstruct the MalFavoritesResponse object with the updated data
  return {
    anime: anime as MalFavoritesResponse["anime"],
    manga: manga as MalFavoritesResponse["manga"],
    characters: characters as MalFavoritesResponse["characters"],
    people: people as MalFavoritesResponse["people"],
  };
}

export async function getImageLastUpdates(data: MalLastUpdatesResponse) {
  let anime = data.anime;
  let manga = data.manga;

  anime = await Promise.all(
    anime.map(async (item) => {
      const imageUrl = item.entry.images.jpg?.image_url || item.entry.images.jpg?.small_image_url || item.entry.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.entry.images.jpg) {
        item.entry.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  manga = await Promise.all(
    manga.map(async (item) => {
      const imageUrl = item.entry.images.jpg?.image_url || item.entry.images.jpg?.small_image_url || item.entry.images.jpg?.large_image_url || "";
      const base64Image = await imageToBase64(imageUrl);

      // create a new property in the object to store the base64 image
      if (item.entry.images.jpg) {
        item.entry.images.jpg.base64 = base64Image || "";
      }

      return item; // Return the modified item object
    })
  );

  // Reconstruct the MalFavoritesResponse object with the updated data
  return {
    anime: anime as MalLastUpdatesResponse["anime"],
    manga: manga as MalLastUpdatesResponse["manga"],
  };
}

export async function convertFavoritesFullImagesToBase64(data: MalFullFavoritesResponse): Promise<MalFullFavoritesResponse> {
  let anime = data.anime;
  let manga = data.manga;
  let characters = data.characters;
  let people = data.people;

  if (anime) {
    anime = await Promise.all(
      anime.map(async (item) => {
        const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
        const base64Image = await imageToBase64(imageUrl);

        // create a new property in the object to store the base64 image
        if (item.images.jpg) {
          item.images.jpg.base64 = base64Image || "";
        }

        return item; // Return the modified item object
      })
    );
  }

  if (manga) {
    manga = await Promise.all(
      manga.map(async (item) => {
        const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
        const base64Image = await imageToBase64(imageUrl);

        // create a new property in the object to store the base64 image
        if (item.images.jpg) {
          item.images.jpg.base64 = base64Image || "";
        }

        return item; // Return the modified item object
      })
    );
  }

  if (characters) {
    characters = await Promise.all(
      characters.map(async (item) => {
        const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
        const base64Image = await imageToBase64(imageUrl);

        // create a new property in the object to store the base64 image
        if (item.images.jpg) {
          item.images.jpg.base64 = base64Image || "";
        }

        return item; // Return the modified item object
      })
    );
  }

  if (people) {
    people = await Promise.all(
      people.map(async (item) => {
        const imageUrl = item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url || "";
        const base64Image = await imageToBase64(imageUrl);

        // create a new property in the object to store the base64 image
        if (item.images.jpg) {
          item.images.jpg.base64 = base64Image || "";
        }

        return item; // Return the modified item object
      })
    );
  }

  // Reconstruct the MalFavoritesResponse object with the updated data
  return {
    anime: anime as MalFullFavoritesResponse["anime"],
    manga: manga as MalFullFavoritesResponse["manga"],
    characters: characters as MalFullFavoritesResponse["characters"],
    people: people as MalFullFavoritesResponse["people"],
  };
}

export async function myAnimeListFullRequest(username: string): Promise<MalProfileResponse> {
  console.log("Started fetching Full MAL data for", username);
  const response = await axios.get(`https://api.jikan.moe/v4/users/${username}/full`);

  if (response.status === 429) {
    throw new Error("Rate limit exceeded");
  }

  if (!response || response.status !== 200) {
    throw new Error("Failed to fetch data from MyAnimeList");
  }

  const data = response.data;

  return data;
}

async function FullMalMediaRequest(media: string, malId: number): Promise<FullMalAnimeResponse | MalFullMangaResponse> {
  console.log("Fetching Full MAL data for", media, malId);
  // https://api.jikan.moe/v4/{media}/{MalId}/full

  const response = await axios.get(`https://api.jikan.moe/v4/${media}/${malId}/full`);

  if (response.status === 429) {
    throw new Error("Rate limit exceeded");
  }

  if (!response || response.status !== 200) {
    throw new Error("Failed to fetch data from MyAnimeList");
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  const data = response.data.data;

  return data;
}

export async function fetchMalData(plugin: MyAnimeListPlugin, dev = false): Promise<MalData> {
  if (dev) {
    return generateTestMyAnimeListData();
  }

  if (!plugin.username) {
    throw new Error("No username provided for MyAnimeList plugin");
  }

  const username = plugin.username;
  console.log("Fetching MyAnimeList data for", username);

  const fullRequest = await limiter.schedule(() => myAnimeListFullRequest(username));

  const sections = plugin.sections;

  // Get the last updates and favorites data
  const lastUpdatesMax = plugin.last_activity_max ?? (MAL_ENV_VARIABLES.last_activity_max.defaultValue as number);
  const lastUpdatesAnime = fullRequest.data.updates.anime.slice(0, lastUpdatesMax);
  const lastUpdatesManga = fullRequest.data.updates.manga.slice(0, lastUpdatesMax);

  const animeFavoritesMax = plugin.anime_favorites_max ?? (MAL_ENV_VARIABLES.anime_favorites_max.defaultValue as number);
  const animeFavorites = fullRequest.data.favorites.anime.slice(0, animeFavoritesMax);

  const mangaFavoritesMax = plugin.manga_favorites_max ?? (MAL_ENV_VARIABLES.manga_favorites_max.defaultValue as number);
  const mangaFavorites = fullRequest.data.favorites.manga.slice(0, mangaFavoritesMax);

  const characterFavoritesMax = plugin.character_favorites_max ?? (MAL_ENV_VARIABLES.character_favorites_max.defaultValue as number);
  const characterFavorites = fullRequest.data.favorites.characters.slice(0, characterFavoritesMax);

  const peopleFavoritesMax = plugin.people_favorites_max ?? (MAL_ENV_VARIABLES.people_favorites_max.defaultValue as number);
  const peopleFavorites = fullRequest.data.favorites.people.slice(0, peopleFavoritesMax);

  const malFavorites: MalFavoritesResponse = {
    anime: animeFavorites,
    manga: mangaFavorites,
    characters: characterFavorites,
    people: peopleFavorites,
  };

  // Initialize the full favorites data object
  let favorites_full_data = {
    anime: [],
    manga: [],
    characters: [],
    people: [],
  } as MalFullFavoritesResponse;

  // Fetch full data for each favorite if the section is enabled
  if (sections.includes("anime_favorites")) {
    for (const anime of animeFavorites) {
      await limiter.schedule(async () => {
        const fullAnime = await FullMalMediaRequest("anime", anime.mal_id);
        favorites_full_data.anime.push(fullAnime as FullMalAnimeResponse);
      });
    }
  }

  if (sections.includes("manga_favorites")) {
    for (const manga of mangaFavorites) {
      await limiter.schedule(async () => {
        const fullManga = await FullMalMediaRequest("manga", manga.mal_id);
        favorites_full_data.manga.push(fullManga as MalFullMangaResponse);
      });
    }
  }

  const malData: MalData = {
    favorites: await getImageFavorites(malFavorites),
    favorites_full: await convertFavoritesFullImagesToBase64(favorites_full_data),
    last_updated: await getImageLastUpdates({ anime: lastUpdatesAnime, manga: lastUpdatesManga }),
    statistics: await fullRequest.data.statistics,
  };
  console.log("Finished fetching MyAnimeList data for", username);

  return malData;
}
