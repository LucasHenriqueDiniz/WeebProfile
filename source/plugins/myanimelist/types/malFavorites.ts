// Anime favorites
export interface BasicAnimeFavorite {
  mal_id: number
  title: string
  image: string
  start_year: number
  type: string
}

export interface FullAnimeFavorite extends BasicAnimeFavorite {
  synopsis: string
  score: number
  popularity: number
  episodes: number
  status: string
  rank: number
  year: number | null
  genres?: {
    name: string
  }[]
}

// Manga favorites
export interface BasicMangaFavorite {
  mal_id: number
  title: string
  image: string
  start_year: number
  type: string
}

export interface FullMangaFavorite extends BasicMangaFavorite {
  synopsis: string
  score: number
  popularity: number
  chapters: number | null
  rank: number
  volumes: number | null
  status: string
  year: number | null
  genres?: {
    name: string
  }[]
}

export interface BasicCharacterFavorite {
  mal_id: number
  name: string
  image: string
}

export interface BasicPeopleFavorite {
  mal_id: number
  name: string
  image: string
}

export interface MalBasicFavorites {
  anime: BasicAnimeFavorite[]
  manga: BasicMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}

export interface MalFullFavorites {
  anime: FullAnimeFavorite[]
  manga: FullMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}

//utils
export type AnyMalFavorite =
  | BasicAnimeFavorite[]
  | BasicMangaFavorite[]
  | BasicCharacterFavorite[]
  | BasicPeopleFavorite[]

export type AnyMalFavoriteUnique =
  | BasicAnimeFavorite
  | BasicMangaFavorite
  | BasicCharacterFavorite
  | BasicPeopleFavorite
