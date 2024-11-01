import { MalImage } from "./malTypes"

interface BaseFavorite {
  mal_id: number
  url: string
  images: MalImage
}

interface AnimeFavorites extends BaseFavorite {
  title: string | null
  type: string | null
  start_year?: number | null
}

interface MangaFavorites extends BaseFavorite {
  title: string | null
  type: string | null
  start_year?: number | null
}

interface CharacterFavorites extends BaseFavorite {
  name: string
}

interface PeopleFavorites extends BaseFavorite {
  name: string
}

interface MalFavoritesDynamicResponse {
  [key: string]: AnimeFavorites[] | MangaFavorites[] | CharacterFavorites[] | PeopleFavorites[]
}

interface MalFavoritesResponse extends MalFavoritesDynamicResponse {
  anime: AnimeFavorites[]
  manga: MangaFavorites[]
  characters: CharacterFavorites[]
  people: PeopleFavorites[]
}

interface TitlesEntity {
  type: string
  title: string
}

interface FromOrTo {
  day: number | null
  month: number | null
  year: number | null
}

interface BasicMalEntity {
  mal_id: number
  type: string
  name: string
  url: string
}

interface RelationsEntity {
  relation: string
  entry: BasicMalEntity[]
}

interface FullMalAnimeResponse {
  mal_id: number
  url: string
  images: MalImage
  trailer: {
    youtube_id: string | null
    url: string | null
    embed_url: string | null
    images: {
      image_url: string | null
      small_image_url: string | null
      medium_image_url: string | null
      large_image_url: string | null
      maximum_image_url: string | null
    }
  }
  approved: boolean
  titles?: TitlesEntity[] | null
  title: string
  title_english?: string | null
  title_japanese?: string
  title_synonyms?: string[]
  type: string
  source: string
  episodes: number | null
  status: string
  airing: boolean
  aired: {
    from: string
    to: string | null
    prop: {
      from: FromOrTo
      to: FromOrTo
    }
    string?: string
  }
  duration: string
  rating: string
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number | null
  favorites: number | null
  synopsis: string | null
  background: string
  season: string | null
  year: number | null
  broadcast: {
    day: string | null
    time: string | null
    timezone: string | null
    string: string | null
  }
  producers: BasicMalEntity[] | null
  licensors: BasicMalEntity[] | null
  studios: BasicMalEntity[] | null
  genres?: BasicMalEntity[]
  themes?: BasicMalEntity[]
  relations?: RelationsEntity[]
  streaming?: BasicMalEntity[]
  external?: BasicMalEntity[]
  explicit_genres?: BasicMalEntity[]
  demographics: BasicMalEntity[]
  theme: {
    openings: string[]
    endings: string[]
  }
}

export interface MalFullMangaResponse {
  mal_id: number
  url: string
  images: MalImage
  approved: boolean
  titles?: TitlesEntity[] | null
  title: string
  title_english?: string | null
  title_japanese?: string | null
  title_synonyms?: string[]
  type: string
  chapters: number | null
  volumes: number | null
  status: string
  publishing: boolean
  published: {
    from: string
    to: string | null
    prop: {
      from: FromOrTo
      to: FromOrTo
    }
    string?: string
  }
  score: number
  scored: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  background: string
  authors?: BasicMalEntity[]
  serializations?: BasicMalEntity[]
  genres?: BasicMalEntity[]
  themes?: BasicMalEntity[]
  demographics?: BasicMalEntity[]
  relations?: RelationsEntity[]
  external?: BasicMalEntity[]
  explicit_genres?: BasicMalEntity[]
}

interface MalFullFavoritesResponse {
  [key: string]: FullMalAnimeResponse[] | MalFullMangaResponse[] | { images: MalImage }[]
  anime: FullMalAnimeResponse[]
  manga: MalFullMangaResponse[]
  characters: { images: MalImage }[]
  people: { images: MalImage }[]
}

type AnyMalFavoriteUnique = AnimeFavorites | MangaFavorites | CharacterFavorites | PeopleFavorites
type AnyMalFavorite = AnimeFavorites[] | MangaFavorites[] | CharacterFavorites[] | PeopleFavorites[]

export type {
  MalFavoritesResponse,
  AnimeFavorites,
  MangaFavorites,
  CharacterFavorites,
  PeopleFavorites,
  AnyMalFavorite,
  AnyMalFavoriteUnique,
  FullMalAnimeResponse,
  MalFullFavoritesResponse,
}
