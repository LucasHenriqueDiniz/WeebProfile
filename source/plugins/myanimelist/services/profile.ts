import { MalProfileResponse } from "../types/malProfileResponse"
import { axios } from "./malApi"

export async function fetchFullProfile(username: string): Promise<MalProfileResponse> {
  const response = await axios.get(`https://api.jikan.moe/v4/users/${username}/full`)

  if (response.status === 429) {
    throw new Error("Rate limit exceeded")
  }

  if (!response || response.status !== 200) {
    throw new Error("Failed to fetch data from MyAnimeList")
  }

  return response.data
}
