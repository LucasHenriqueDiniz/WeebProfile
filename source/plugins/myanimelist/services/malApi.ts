import Axios from "axios"
import { CacheOptions, setupCache } from "axios-cache-interceptor"
import Bottleneck from "bottleneck"
import logger from "source/helpers/logger"
import generateTestMyAnimeListData from "../test/generateTestData"
import { MalData } from "../types/malTypes"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import { fetchFavorites } from "./favorites"
import fetchLastUpdates from "./lastUpdates"
import { fetchFullProfile } from "./profile"

// Setup rate limiting
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
  reservoir: 60,
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000,
})

// Setup axios with cache
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

  // Get favorites and last updates with configured limits
  const favorites = await fetchFavorites(fullProfile, plugin)
  const lastUpdates = await fetchLastUpdates(fullProfile, plugin)

  const malData: MalData = {
    favorites: favorites.basic,
    favorites_full: favorites.full,
    last_updated: lastUpdates,
    statistics: fullProfile.data.statistics,
  }

  logger({ message: `Finished fetching MyAnimeList data for ${username}`, level: "info", __filename })
  return malData
}

export default fetchMalData
