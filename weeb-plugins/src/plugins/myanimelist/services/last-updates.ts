/**
 * Serviço para processar últimas atualizações do MyAnimeList
 */

import type { LastUpdatesAnime, LastUpdatesManga, MalLastUpdates } from '../types.js'
import { urlToBase64 } from '../../../utils/image-to-base64.js'
import type { MalProfileResponse } from './profile.js'
import type { MyAnimeListConfig } from '../types.js'

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
      const image =
        item.entry.images?.jpg?.image_url ||
        item.entry.images?.jpg?.large_image_url ||
        item.entry.images?.jpg?.small_image_url ||
        item.entry.images?.webp?.image_url ||
        ''

      return {
        title: item.entry.title,
        image: image ? await urlToBase64(image) : '',
        score: item.score || 0,
        status: item.status || '',
        episodes_seen: item.episodes_seen ?? null,
        episodes_total: item.episodes_total ?? null,
        date: item.date || '',
      }
    })
  )

  const manga: LastUpdatesManga[] = await Promise.all(
    (profile.updates.manga || []).slice(0, maxItems).map(async (item) => {
      const image =
        item.entry.images?.jpg?.image_url ||
        item.entry.images?.jpg?.large_image_url ||
        item.entry.images?.jpg?.small_image_url ||
        item.entry.images?.webp?.image_url ||
        ''

      return {
        title: item.entry.title,
        image: image ? await urlToBase64(image) : '',
        score: item.score || 0,
        status: item.status || '',
        chapters_read: item.chapters_read ?? null,
        chapters_total: item.chapters_total ?? null,
        date: item.date || '',
      }
    })
  )

  return { anime, manga }
}



