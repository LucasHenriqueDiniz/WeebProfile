import Axios from "axios"
import { CacheOptions, setupCache } from "axios-cache-interceptor"
import Bottleneck from "bottleneck"
import logger from "source/helpers/logger"
import generateTestMyAnimeListData from "../test/generateTestData"
import { MalData } from "../types/malTypes"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import { fetchFavorites } from "./favorites"
import transformLastUpdates from "./lastUpdates"
import { fetchFullProfile } from "./profile"
import { transformStatistics } from "./statistics"

// Setup rate limiting | 1 request per second with a reservoir of 60 requests is the limit for this API
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
  reservoir: 60,
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000,
})

// Setup axios with cache | dont know if this is needed anymore or even working need to test :/
const axiosInstance = Axios.create()
const OPTIONS = {
  maxAge: 1 * 60 * 60 * 1000,
  shouldCacheResponse: (response: { status: number }) => response.status === 200,
  clearOnStale: true,
  cacheTakeover: false,
} as CacheOptions
export const axios = setupCache(axiosInstance, OPTIONS)

export async function fetchMalData(plugin: MyAnimeListPlugin, dev = false): Promise<MalData> {
  if (dev) {
    logger({ message: `Using test data for MyAnimeList`, level: "warn", __filename })
    return generateTestMyAnimeListData()
  }

  if (!plugin.username) {
    throw new Error("No username provided for MyAnimeList plugin")
  }

  const username = plugin.username
  logger({ message: `Fetching MyAnimeList data for ${username}`, level: "info", __filename })

  // Get full profile data
  const fullProfile = await limiter.schedule(() => fetchFullProfile(username))

  // Treat the data and get favorites and last updates
  const favorites = await fetchFavorites(fullProfile, plugin, limiter)
  const lastUpdates = await transformLastUpdates(fullProfile, plugin)
  const statistics = transformStatistics(fullProfile.statistics)

  const malData: MalData = {
    favorites: favorites.basic,
    favorites_full: favorites.full,
    last_updated: lastUpdates,
    statistics,
  }

  logger({
    message: `Favorites data: ${JSON.stringify({
      basicCount: {
        anime: favorites.basic.anime.length,
        manga: favorites.basic.manga.length,
        characters: favorites.basic.characters.length,
        people: favorites.basic.people.length,
      },
      fullCount: {
        anime: favorites.full.anime.length,
        manga: favorites.full.manga.length,
        characters: favorites.full.characters.length,
        people: favorites.full.people.length,
      },
    })}`,
    level: "debug",
    __filename,
  })

  logger({ message: `Finished fetching MyAnimeList data for ${username}`, level: "info", __filename })
  return malData
}

export default fetchMalData
