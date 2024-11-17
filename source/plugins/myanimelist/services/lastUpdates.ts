import { MalLastUpdates } from "../types/malLastUpdates"
import { MalProfileResponse } from "../types/ProfileResponse"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import imageToBase64 from "source/plugins/@utils/imageToBase64"

async function transformLastUpdates(profile: MalProfileResponse, plugin: MyAnimeListPlugin): Promise<MalLastUpdates> {
  const lastUpdatesMax = plugin.last_activity_max ?? (MAL_ENV_VARIABLES.last_activity_max.defaultValue as number)

  const anime = await Promise.all(
    profile.updates.anime.slice(0, lastUpdatesMax).map(async (item) => ({
      title: item.entry.title,
      image: await imageToBase64(
        item.entry.images.jpg.image_url ||
          item.entry.images.jpg.large_image_url ||
          item.entry.images.jpg.small_image_url ||
          item.entry.images.webp?.image_url ||
          "https://placecats.com/300/300"
      ),
      score: item.score,
      status: item.status,
      episodes_seen: item.episodes_seen,
      episodes_total: item.episodes_total,
      date: item.date,
    }))
  )

  const manga = await Promise.all(
    profile.updates.manga.slice(0, lastUpdatesMax).map(async (item) => ({
      title: item.entry.title,
      image: await imageToBase64(
        item.entry.images.jpg.image_url ||
          item.entry.images.jpg.large_image_url ||
          item.entry.images.jpg.small_image_url ||
          item.entry.images.webp?.image_url ||
          "https://placecats.com/300/300"
      ),
      score: item.score,
      status: item.status,
      chapters_read: item.chapters_read,
      chapters_total: item.chapters_total,
      date: item.date,
    }))
  )

  return { anime, manga }
}

export default transformLastUpdates
