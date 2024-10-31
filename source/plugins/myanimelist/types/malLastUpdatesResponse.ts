import { MalImage } from "./malTypes";

interface UpdateEntry {
  mal_id: number;
  url: string;
  images: MalImage;
  title: string;
}

interface LastUpdatesAnime {
  entry: UpdateEntry;
  score: number;
  status: string;
  episodes_seen: number | null;
  episodes_total: number | null;
  date: string;
}

interface LastUpdatesManga {
  entry: UpdateEntry;
  score: number;
  status: string;
  chapters_read: number | null;
  chapters_total: number | null;
  date: string;
}

interface MalLastUpdatesResponse {
  [key: string]: any;
  anime: LastUpdatesAnime[];
  manga: LastUpdatesManga[];
}

type anyMalUpdate = LastUpdatesAnime | LastUpdatesManga;

export type { UpdateEntry, LastUpdatesAnime, LastUpdatesManga, MalLastUpdatesResponse, anyMalUpdate };
