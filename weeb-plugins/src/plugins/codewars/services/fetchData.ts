/**
 * Serviço de fetch de dados do Codewars
 * 
 * API: https://www.codewars.com/api/v1/users/{username}
 * Documentação: https://dev.codewars.com/
 */

import type { CodewarsConfig, CodewarsData, CodewarsKata, CodewarsLanguage } from '../types'
import { getMockCodewarsData } from './mock-data'
import { fetchJson } from '../../shared/utils/api'
import { ApiError } from '../../shared/utils/errors'

const CODEWARS_API_BASE = 'https://www.codewars.com/api/v1'

/**
 * Resposta da API do Codewars - User Info
 */
interface CodewarsUserResponse {
  username: string
  name?: string
  honor: number
  clan?: string
  leaderboardPosition?: number
  skills?: string[]
  ranks: {
    overall?: {
      rank: number
      name: string
      color: string
      score: number
    }
    languages: Record<string, {
      rank: number
      name: string
      color: string
      score: number
    }>
  }
  codeChallenges: {
    totalAuthored: number
    totalCompleted: number
  }
}

/**
 * Resposta da API do Codewars - Completed Kata
 */
interface CodewarsCompletedKataResponse {
  totalPages: number
  totalItems: number
  data: Array<{
    id: string
    name: string
    slug: string
    completedAt: string
    completedLanguages: string[]
  }>
}

/**
 * Busca dados do Codewars
 */
export async function fetchCodewarsData(
  config: CodewarsConfig,
  dev = false
): Promise<CodewarsData> {
  if (dev) {
    return getMockCodewarsData()
  }

  if (!config.username || typeof config.username !== 'string' || config.username.trim() === '') {
    throw new Error('Codewars username is required')
  }

  const username = config.username.trim()

  try {
    // Buscar informações do usuário
    const userUrl = `${CODEWARS_API_BASE}/users/${encodeURIComponent(username)}`
    const userResponse = await fetchJson<CodewarsUserResponse>(userUrl)

    if (!userResponse) {
      throw new ApiError('Invalid response from Codewars API', 500, 'Codewars')
    }

    // Buscar kata completados (limitado para performance)
    let completedKata: CodewarsKata[] = []
    try {
      const kataUrl = `${CODEWARS_API_BASE}/users/${encodeURIComponent(username)}/code-challenges/completed`
      const kataResponse = await fetchJson<CodewarsCompletedKataResponse>(kataUrl)
      
      if (kataResponse && kataResponse.data) {
        completedKata = kataResponse.data.slice(0, 50).map((kata) => {
          // Tentar extrair dificuldade do slug se possível
          // Ex: "persistent-bugger-6kyu" -> "6 kyu"
          let difficulty = 'Unknown'
          if (kata.slug) {
            const difficultyMatch = kata.slug.match(/(\d+)\s*kyu/i)
            if (difficultyMatch) {
              difficulty = `${difficultyMatch[1]} kyu`
            }
          }
          
          return {
            name: kata.name,
            difficulty,
            completedAt: kata.completedAt,
          }
        })
      }
    } catch (error) {
      // Se falhar ao buscar kata, continua com lista vazia
      console.warn('[Codewars] Failed to fetch completed kata:', error)
    }

    // Processar rank
    const overallRank = userResponse.ranks?.overall
    const rank = {
      name: overallRank?.name || 'Unranked',
      color: overallRank?.color || '#000000',
    }

    // Processar languages
    const languages: Record<string, CodewarsLanguage> = {}
    if (userResponse.ranks?.languages) {
      for (const [lang, langRank] of Object.entries(userResponse.ranks.languages)) {
        languages[lang] = {
          language: lang,
          score: langRank.score || 0,
        }
      }
    }

    return {
      rank,
      honor: userResponse.honor || 0,
      completedKata,
      languages,
      leaderboardPosition: userResponse.leaderboardPosition,
    }
  } catch (error) {
    console.error('[Codewars] Error fetching data:', error)
    
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new Error(`Codewars user "${username}" not found`)
    }

    // Retornar dados mock em caso de erro
    console.warn('[Codewars] API error, using mock data as fallback')
    return getMockCodewarsData()
  }
}

