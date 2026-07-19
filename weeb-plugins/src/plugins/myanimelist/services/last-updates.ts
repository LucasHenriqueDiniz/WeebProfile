/**
 * Serviço para processar últimas atualizações do MyAnimeList
 */

import type { LastUpdatesAnime, LastUpdatesManga, MalLastUpdates } from "../types"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import type { MalProfileResponse } from "./profile"
import type { MyAnimeListConfig } from "../types"

const COVER_MAX_BYTES = 100_000

async function embedOrNull(image: string): Promise<string | null> {
  // null, not "" -- an absent/failed image must never become <img src=""> downstream.
  if (!image) return null
  try {
    return (await urlToDataUriDirect(image, { maxBytes: COVER_MAX_BYTES })).dataUri
  } catch {
    return null
  }
}

/**
 * Transforma as atualizações do perfil em formato interno
 */
export async function transformLastUpdates(
  profile: MalProfileResponse,
  config: MyAnimeListConfig
): Promise<MalLastUpdates> {
  const maxItems = config.last_activity_max ?? 6

  const anime: LastUpdatesAnime[] = await Promise.all(
    (profile.updates.anime || []).slice(0, maxItems).map(async (item) => {
      // small_image_url has priority -- it's the smallest real variant Jikan provides.
      const image = item.entry.images?.jpg?.small_image_url || ""

      return {
        title: item.entry.title,
        image: await embedOrNull(image),
        score: item.score || 0,
        status: item.status || "",
        episodes_seen: item.episodes_seen ?? null,
        episodes_total: item.episodes_total ?? null,
        date: item.date || "",
      }
    })
  )

  const manga: LastUpdatesManga[] = await Promise.all(
    (profile.updates.manga || []).slice(0, maxItems).map(async (item) => {
      const image = item.entry.images?.jpg?.small_image_url || ""

      return {
        title: item.entry.title,
        image: await embedOrNull(image),
        score: item.score || 0,
        status: item.status || "",
        chapters_read: item.chapters_read ?? null,
        chapters_total: item.chapters_total ?? null,
        date: item.date || "",
      }
    })
  )

  return { anime, manga }
}
