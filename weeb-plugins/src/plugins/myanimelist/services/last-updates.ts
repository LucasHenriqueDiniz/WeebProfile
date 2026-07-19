import type { MalLastUpdates, MyAnimeListConfig } from "../types"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

type EdgeUpdate = {
  entry: { title: string; imageUrl: string | null }
  score: number | null
  status: string
  progress: number | null
  total: number | null
  date: string
}

type EdgeUpdatesResponse = { data: { anime: EdgeUpdate[]; manga: EdgeUpdate[] } }

const UPDATE_IMAGE_MAX_BYTES = 100_000

function titleCaseStatus(status: string): string {
  return status
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

async function imageDataUri(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) return null
  try {
    return (await urlToDataUriDirect(imageUrl, { maxBytes: UPDATE_IMAGE_MAX_BYTES })).dataUri
  } catch {
    return null
  }
}

export async function transformLastUpdates(response: EdgeUpdatesResponse, _config: MyAnimeListConfig): Promise<MalLastUpdates> {
  const data = response.data
  return {
    anime: await Promise.all(
      data.anime.map(async (update) => ({
        title: update.entry.title,
        image: await imageDataUri(update.entry.imageUrl),
        score: update.score,
        status: titleCaseStatus(update.status),
        episodes_seen: update.progress,
        episodes_total: update.total,
        date: update.date,
      }))
    ),
    manga: await Promise.all(
      data.manga.map(async (update) => ({
        title: update.entry.title,
        image: await imageDataUri(update.entry.imageUrl),
        score: update.score,
        status: titleCaseStatus(update.status),
        chapters_read: update.progress,
        chapters_total: update.total,
        date: update.date,
      }))
    ),
  }
}
