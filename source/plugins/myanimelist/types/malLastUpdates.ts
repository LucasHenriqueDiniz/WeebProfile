interface LastUpdatesAnime {
  title: string
  image: string
  score: number
  status: string
  episodes_seen: number | null
  episodes_total: number | null
  date: string
}

interface LastUpdatesManga {
  title: string
  image: string
  score: number
  status: string
  chapters_read: number | null
  chapters_total: number | null
  date: string
}

interface MalLastUpdates {
  anime: LastUpdatesAnime[]
  manga: LastUpdatesManga[]
}

export type { MalLastUpdates, LastUpdatesAnime, LastUpdatesManga }
