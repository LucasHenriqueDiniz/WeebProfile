import { MalLastUpdatesResponse } from "../types/malLastUpdatesResponse"
import { MalProfileResponse } from "../types/malProfileResponse"
import MyAnimeListPlugin from "../types/MyAnimeListConfig"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import imageToBase64 from "source/plugins/@utils/imageToBase64"

async function fetchLastUpdates(
  profile: MalProfileResponse,
  plugin: MyAnimeListPlugin
): Promise<MalLastUpdatesResponse> {
  const lastUpdatesMax = plugin.last_activity_max ?? (MAL_ENV_VARIABLES.last_activity_max.defaultValue as number)

  const anime = await Promise.all(
    profile.data.updates.anime.slice(0, lastUpdatesMax).map(async (item) => ({
      ...item,
      entry: {
        ...item.entry,
        image: (await imageToBase64(item.entry.image)) || item.entry.image,
      },
    }))
  )

  const manga = await Promise.all(
    profile.data.updates.manga.slice(0, lastUpdatesMax).map(async (item) => ({
      ...item,
      entry: {
        ...item.entry,
        image: (await imageToBase64(item.entry.image)) || item.entry.image,
      },
    }))
  )

  return { anime, manga }
}

export default fetchLastUpdates
