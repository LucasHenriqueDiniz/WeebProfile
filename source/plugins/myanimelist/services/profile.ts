import logger from "source/helpers/logger"
import { MalProfileResponse } from "../types/ProfileResponse"
import { axios } from "./fetchMyAnimeList"

export async function fetchFullProfile(username: string): Promise<MalProfileResponse> {
  const response = await axios.get(`https://api.jikan.moe/v4/users/${username}/full`)

  if (response.status === 429) {
    logger({ message: `Rate limit exceeded`, level: "error", __filename })
    throw new Error("Rate limit exceeded")
  }

  if (!response || response.status !== 200) {
    logger({ message: `Failed to fetch data from MyAnimeList: ${response.statusText}`, level: "error", __filename })
    throw new Error("Failed to fetch data from MyAnimeList")
  }

  logger({
    message: `Response structure: ${JSON.stringify({
      favorites: response.data.data.favorites ? Object.keys(response.data.data.favorites) : "no favorites",
      updates: response.data.data.updates ? Object.keys(response.data.data.updates) : "no updates",
      statistics: response.data.data.statistics ? Object.keys(response.data.data.statistics) : "no statistics",
    })}`,
    level: "debug",
    __filename,
  })

  const data = {
    mal_id: response.data.data.mal_id,
    username: response.data.data.username,
    url: response.data.data.url,
    images: response.data.data.images,
    last_online: response.data.data.last_online,
    gender: response.data.data.gender,
    birthday: response.data.data.birthday,
    location: response.data.data.location,
    joined: response.data.data.joined,
    statistics: response.data.data.statistics,
    favorites: response.data.data.favorites,
    updates: response.data.data.updates,
  }

  logger({ message: `Full profile data: ${JSON.stringify(data).slice(0, 200)}...`, level: "debug", __filename })

  return data
}
