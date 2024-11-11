/* eslint-disable @typescript-eslint/no-empty-object-type */
// Base interfaces
interface BaseMalEntity {
  mal_id: number
  url: string
  image: string
}

interface BaseMediaEntity extends BaseMalEntity {
  title: string | null
  type: string | null
  start_year?: number | null
}

interface BasePersonEntity extends BaseMalEntity {
  name: string
}

// Full response interfaces
interface TitlesEntity {
  type: string
  title: string
}

interface DateProp {
  day: number | null
  month: number | null
  year: number | null
}

interface AiredPublishedInfo {
  from: string
  to: string | null
  prop: {
    from: DateProp
    to: DateProp
  }
  string?: string
}

interface GenreTheme {
  mal_id: number
  type: string
  name: string
  url: string
}

// Full Media Response interfaces
interface BaseFullMediaResponse extends BaseMalEntity {
  titles?: TitlesEntity[] | null
  title: string
  title_english?: string | null
  title_japanese?: string | null
  title_synonyms?: string[]
  type: string
  status: string
  score: number
  rank: number
  popularity: number
  synopsis: string | null
  year: number | null
  genres?: GenreTheme[]
  themes?: GenreTheme[]
}

interface FullMalAnimeResponse extends BaseFullMediaResponse {
  episodes: number | null
  airing: boolean
  aired: AiredPublishedInfo
}

interface MalFullMangaResponse extends BaseFullMediaResponse {
  chapters: number | null
  volumes: number | null
  publishing: boolean
  published: AiredPublishedInfo
}

// Define the missing favorite interfaces
interface AnimeFavorites extends BaseMediaEntity {}
interface MangaFavorites extends BaseMediaEntity {}
interface CharacterFavorites extends BasePersonEntity {}
interface PeopleFavorites extends BasePersonEntity {}

// Response type interfaces
interface MalFavoritesDynamicResponse {
  [key: string]: AnimeFavorites[] | MangaFavorites[] | CharacterFavorites[] | PeopleFavorites[]
}

interface MalFavoritesResponse extends MalFavoritesDynamicResponse {
  anime: AnimeFavorites[]
  manga: MangaFavorites[]
  characters: CharacterFavorites[]
  people: PeopleFavorites[]
}

interface MalFullFavoritesResponse {
  [key: string]: FullMalAnimeResponse[] | MalFullMangaResponse[] | { image: string }[]
  anime: FullMalAnimeResponse[]
  manga: MalFullMangaResponse[]
  characters: { image: string }[] // TODO: Add type for characters
  people: { image: string }[] // TODO: Add type for people
}

// Utility types
type AnyMalFavoriteUnique = AnimeFavorites | MangaFavorites | CharacterFavorites | PeopleFavorites
type AnyMalFavorite = AnimeFavorites[] | MangaFavorites[] | CharacterFavorites[] | PeopleFavorites[]

export type {
  // Base types
  BaseMalEntity,
  BaseMediaEntity,
  BasePersonEntity,

  // Favorite types
  AnimeFavorites,
  MangaFavorites,
  CharacterFavorites,
  PeopleFavorites,

  // Full response types
  FullMalAnimeResponse,
  MalFullMangaResponse,

  // Response interfaces
  MalFavoritesResponse,
  MalFullFavoritesResponse,

  // Utility types
  AnyMalFavorite,
  AnyMalFavoriteUnique,

  // Shared types
  TitlesEntity,
  DateProp,
  AiredPublishedInfo,
  GenreTheme,
}
