/**
 * Serviço para buscar e processar favoritos do MyAnimeList
 */

import type {
  BasicAnimeFavorite,
  BasicMangaFavorite,
  BasicCharacterFavorite,
  BasicPeopleFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
} from '../types'
import { jikanGet, limiter } from './api-client'
import { urlToBase64, IMAGE_OPTIMIZATION } from '../../../utils/image-to-base64'
import type { MalProfileResponse } from './profile'
import type { MyAnimeListConfig } from '../types'

export interface BasicFavorites {
  anime: BasicAnimeFavorite[]
  manga: BasicMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}

export interface FullFavorites {
  anime: FullAnimeFavorite[]
  manga: FullMangaFavorite[]
  characters: BasicCharacterFavorite[]
  people: BasicPeopleFavorite[]
}

/**
 * Busca favoritos básicos do perfil
 */
export async function getBasicFavorites(
  profile: MalProfileResponse,
  limits: {
    animeMax: number
    mangaMax: number
    charactersMax: number
    peopleMax: number
  },
  config: { previewMode?: boolean }
): Promise<BasicFavorites> {
  const favorites = profile.favorites || { anime: [], manga: [], characters: [], people: [] }

  // Processar em sequência para evitar sobrecarga
  const animeResults = []
  const animeList = (favorites.anime || []).slice(0, limits.animeMax)
  for (let index = 0; index < animeList.length; index++) {
    const item = animeList[index]
    if (!item) continue
    const image =
      item.images?.jpg?.image_url ||
      item.images?.jpg?.large_image_url ||
      item.images?.jpg?.small_image_url ||
      item.images?.webp?.image_url ||
      ''

    let imageBase64 = ''
    if (image) {
      if (config.previewMode) {
        // Em modo preview, usar URLs originais sem conversão
        imageBase64 = image
      } else {
        try {
          console.log(`  [${index + 1}/${animeList.length}] Convertendo imagem: ${item.title}`)
          imageBase64 = await urlToBase64(image, 15000, IMAGE_OPTIMIZATION)
          console.log(`  ✅ Imagem convertida: ${item.title}`)
        } catch (error: any) {
          console.warn(`  ⚠️  Erro ao converter imagem de ${item.title}:`, error.message)
          imageBase64 = ''
        }
      }
    }

    animeResults.push({
      mal_id: item.mal_id,
      title: item.title,
      image: imageBase64,
      start_year: item.start_year || 0,
      type: item.type || 'TV',
    })
  }

  // Processar manga em sequência
  const mangaResults = []
  const mangaList = (favorites.manga || []).slice(0, limits.mangaMax)
  for (let index = 0; index < mangaList.length; index++) {
    const item = mangaList[index]
    if (!item) continue
    const image =
      item.images?.jpg?.image_url ||
      item.images?.jpg?.large_image_url ||
      item.images?.jpg?.small_image_url ||
      item.images?.webp?.image_url ||
      ''

    let imageBase64 = ''
    if (image) {
      if (config.previewMode) {
        // Em modo preview, usar URLs originais sem conversão
        imageBase64 = image
      } else {
        try {
          console.log(`  [${index + 1}/${mangaList.length}] Convertendo imagem: ${item.title}`)
          imageBase64 = await urlToBase64(image, 15000, IMAGE_OPTIMIZATION)
          console.log(`  ✅ Imagem convertida: ${item.title}`)
        } catch (error: any) {
          console.warn(`  ⚠️  Erro ao converter imagem de ${item.title}:`, error.message)
          imageBase64 = ''
        }
      }
    }

    mangaResults.push({
      mal_id: item.mal_id,
      title: item.title,
      image: imageBase64,
      start_year: item.start_year || 0,
      type: item.type || 'Manga',
    })
  }

  // Processar characters em sequência
  const charactersResults = []
  const charactersList = (favorites.characters || []).slice(0, limits.charactersMax)
  for (let index = 0; index < charactersList.length; index++) {
    const item = charactersList[index]
    if (!item) continue
    const image =
      item.images?.jpg?.image_url ||
      item.images?.webp?.image_url ||
      ''

    let imageBase64 = ''
    if (image) {
      try {
        console.log(`  [${index + 1}/${charactersList.length}] Convertendo imagem: ${item.name}`)
        imageBase64 = await urlToBase64(image, 15000, IMAGE_OPTIMIZATION)
        console.log(`  ✅ Imagem convertida: ${item.name}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao converter imagem de ${item.name}:`, error.message)
        imageBase64 = ''
      }
    }

    charactersResults.push({
      mal_id: item.mal_id,
      name: item.name,
      image: imageBase64,
    })
  }

  // Processar people em sequência
  const peopleResults = []
  const peopleList = (favorites.people || []).slice(0, limits.peopleMax)
  for (let index = 0; index < peopleList.length; index++) {
    const item = peopleList[index]
    if (!item) continue
    const image =
      item.images?.jpg?.image_url ||
      item.images?.webp?.image_url ||
      ''

    let imageBase64 = ''
    if (image) {
      try {
        console.log(`  [${index + 1}/${peopleList.length}] Convertendo imagem: ${item.name}`)
        imageBase64 = await urlToBase64(image, 15000, IMAGE_OPTIMIZATION)
        console.log(`  ✅ Imagem convertida: ${item.name}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao converter imagem de ${item.name}:`, error.message)
        imageBase64 = ''
      }
    }

    peopleResults.push({
      mal_id: item.mal_id,
      name: item.name,
      image: imageBase64,
    })
  }

  return {
    anime: animeResults,
    manga: mangaResults,
    characters: charactersResults,
    people: peopleResults,
  }
}

/**
 * Busca dados completos dos favoritos (anime e manga)
 */
export async function getFullFavorites(
  basicFavorites: BasicFavorites,
  sections: string[],
  config: { previewMode?: boolean }
): Promise<FullFavorites> {
  const fullFavorites: FullFavorites = {
    anime: [],
    manga: [],
    characters: basicFavorites.characters,
    people: basicFavorites.people,
  }

  // Buscar dados completos de anime se necessário
  if (sections.includes('anime_favorites')) {
    console.log(`📥 Processando favoritos completos de anime (${basicFavorites.anime.length} itens)...`)
    const animeFullResults = []
    for (let index = 0; index < basicFavorites.anime.length; index++) {
      const item = basicFavorites.anime[index]
      if (!item) continue
      
      try {
        console.log(`  [${index + 1}/${basicFavorites.anime.length}] Buscando dados completos: ${item.title}`)
        const response = await limiter.schedule(() =>
          jikanGet<{
            data: {
              episodes: number | null
              synopsis: string
              score: number
              popularity: number
              rank: number
              status: string
              year: number | null
              aired: { prop: { from: { year: number | null } } }
              genres: Array<{ name: string }>
              themes: Array<{ name: string }>
              explicit_genres: Array<{ name: string }>
            }
          }>(`/anime/${item.mal_id}/full`)
        )

        const genres = [
          ...(response.data.genres?.map((g) => ({ name: g.name })) || []),
          ...(response.data.themes?.map((t) => ({ name: t.name })) || []),
          ...(response.data.explicit_genres?.map((e) => ({ name: e.name })) || []),
        ]

        animeFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          episodes: response.data.episodes ?? null,
          synopsis: response.data.synopsis || '',
          score: response.data.score || 0,
          popularity: response.data.popularity || 0,
          rank: response.data.rank || 0,
          status: response.data.status || '',
          year: response.data.year ?? response.data.aired?.prop?.from?.year ?? null,
          genres,
        })
        console.log(`  ✅ Dados completos obtidos: ${item.title}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao buscar dados completos de ${item.title}:`, error.message)
        // Adicionar dados básicos como fallback
        animeFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          episodes: null,
          synopsis: '',
          score: 0,
          popularity: 0,
          rank: 0,
          status: '',
          year: item.start_year,
          genres: [],
        })
      }
    }
    fullFavorites.anime = animeFullResults
    console.log(`✅ Favoritos completos de anime processados`)
  }

  // Buscar dados completos de manga se necessário
  if (sections.includes('manga_favorites')) {
    console.log(`📥 Processando favoritos completos de manga (${basicFavorites.manga.length} itens)...`)
    const mangaFullResults = []
    for (let index = 0; index < basicFavorites.manga.length; index++) {
      const item = basicFavorites.manga[index]
      if (!item) continue
      
      try {
        console.log(`  [${index + 1}/${basicFavorites.manga.length}] Buscando dados completos: ${item.title}`)
        const response = await limiter.schedule(() =>
          jikanGet<{
            data: {
              chapters: number | null
              synopsis: string
              score: number
              popularity: number
              rank: number
              volumes: number | null
              status: string
              year: number | null
              published: { prop: { from: { year: number | null } } }
              genres: Array<{ name: string }>
              themes: Array<{ name: string }>
              explicit_genres: Array<{ name: string }>
            }
          }>(`/manga/${item.mal_id}/full`)
        )

        const genres = [
          ...(response.data.genres?.map((g) => ({ name: g.name })) || []),
          ...(response.data.themes?.map((t) => ({ name: t.name })) || []),
          ...(response.data.explicit_genres?.map((e) => ({ name: e.name })) || []),
        ]

        mangaFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          chapters: response.data.chapters ?? null,
          synopsis: response.data.synopsis || '',
          score: response.data.score || 0,
          popularity: response.data.popularity || 0,
          rank: response.data.rank || 0,
          volumes: response.data.volumes ?? null,
          status: response.data.status || '',
          year: response.data.year ?? response.data.published?.prop?.from?.year ?? null,
          genres,
        })
        console.log(`  ✅ Dados completos obtidos: ${item.title}`)
      } catch (error: any) {
        console.warn(`  ⚠️  Erro ao buscar dados completos de ${item.title}:`, error.message)
        // Adicionar dados básicos como fallback
        mangaFullResults.push({
          mal_id: item.mal_id,
          title: item.title,
          image: item.image,
          start_year: item.start_year,
          type: item.type,
          chapters: null,
          synopsis: '',
          score: 0,
          popularity: 0,
          rank: 0,
          volumes: null,
          status: '',
          year: item.start_year,
          genres: [],
        })
      }
    }
    fullFavorites.manga = mangaFullResults
    console.log(`✅ Favoritos completos de manga processados`)
  }

  return fullFavorites
}

/**
 * Busca todos os favoritos (básicos e completos)
 */
export async function fetchFavorites(
  profile: MalProfileResponse,
  config: MyAnimeListConfig,
  previewMode = false
): Promise<{ basic: BasicFavorites; full: FullFavorites }> {
  try {
    console.log(`📥 Processando favoritos básicos...`)
    const maxFavorites = config.favorites_max ?? 20
    const basicFavorites = await getBasicFavorites(profile, {
      animeMax: maxFavorites,
      mangaMax: maxFavorites,
      charactersMax: maxFavorites,
      peopleMax: maxFavorites,
    }, { previewMode })
    console.log(`✅ Favoritos básicos processados`)

    const fullFavorites = await getFullFavorites(basicFavorites, config.sections || [], { previewMode })

    return {
      basic: basicFavorites,
      full: fullFavorites,
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    // Retornar favoritos vazios em caso de erro
    return {
      basic: { anime: [], manga: [], characters: [], people: [] },
      full: { anime: [], manga: [], characters: [], people: [] },
    }
  }
}

