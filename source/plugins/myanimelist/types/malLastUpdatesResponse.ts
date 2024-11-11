interface UpdateEntry {
  mal_id: number
  url: string
  image: string
  title: string
}

interface BaseUpdate {
  entry: UpdateEntry
  score: number
  status: string
  date: string
}

interface LastUpdatesAnime extends BaseUpdate {
  episodes_seen: number | null
  episodes_total: number | null
}

interface LastUpdatesManga extends BaseUpdate {
  chapters_read: number | null
  chapters_total: number | null
}

interface MalLastUpdatesResponse {
  anime: LastUpdatesAnime[]
  manga: LastUpdatesManga[]
}

type AnyMalUpdate = LastUpdatesAnime | LastUpdatesManga

export type { UpdateEntry, LastUpdatesAnime, LastUpdatesManga, MalLastUpdatesResponse, AnyMalUpdate }
