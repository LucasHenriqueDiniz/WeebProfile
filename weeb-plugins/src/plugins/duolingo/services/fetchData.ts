/**
 * Serviço de fetch de dados do Duolingo
 * 
 * API não oficial: https://www.duolingo.com/2017-06-30/users?username={username}
 * 
 * WARNING: Esta é uma API não oficial e pode quebrar se a estrutura mudar.
 * Fonte: https://github.com/KartikTalwar/Duolingo
 */

import type { DuolingoConfig, DuolingoData, DuolingoLanguage } from '../types.js'
import { getMockDuolingoData } from './mock-data.js'
import { fetchJson } from '../../shared/utils/api.js'
import { ApiError } from '../../shared/utils/errors.js'

const DUOLINGO_API_BASE = 'https://www.duolingo.com/2017-06-30/users'

/**
 * Resposta da API do Duolingo (não oficial)
 * A API retorna um objeto com um array 'users'
 */
interface DuolingoApiResponse {
  users: Array<{
    username: string
    name?: string
    picture?: string // URL relativa, precisa adicionar domínio
    streakData?: {
      currentStreak?: {
        length?: number
      }
    }
    totalXp?: number
    courses?: Array<{
      title?: string
      learningLanguage?: string
      fromLanguage?: string
      xp?: number
      crowns?: number
    }>
  }>
}

/**
 * Busca dados do Duolingo
 * 
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock)
 */
export async function fetchDuolingoData(
  config: DuolingoConfig,
  dev = false
): Promise<DuolingoData> {
  // Modo desenvolvimento - retornar dados mock
  if (dev) {
    return getMockDuolingoData()
  }

  // Validar username
  if (!config.username || typeof config.username !== 'string' || config.username.trim() === '') {
    throw new Error('Duolingo username is required')
  }

  const username = config.username.trim()

  try {
    // Buscar dados da API não oficial
    const url = `${DUOLINGO_API_BASE}?username=${encodeURIComponent(username)}`
    
    // WARNING: API não oficial - pode quebrar
    const response = await fetchJson<DuolingoApiResponse>(url)

    // Validar resposta
    if (!response || !response.users || !Array.isArray(response.users) || response.users.length === 0) {
      throw new ApiError('Invalid response from Duolingo API or user not found', 404, 'Duolingo')
    }

    const user = response.users[0]
    if (!user) {
      throw new ApiError('User data not found in response', 404, 'Duolingo')
    }

    // Extrair streak do streakData
    const streak = user.streakData?.currentStreak?.length || 0
    const totalXP = user.totalXp || 0

    // Processar languages dos courses
    const languages: DuolingoLanguage[] = (user.courses || []).map((course) => ({
      language: course.title || course.learningLanguage || 'Unknown',
      xp: course.xp || 0,
      level: course.crowns ? Math.floor(course.crowns / 5) + 1 : undefined, // Aproximação de level baseado em crowns
    }))

    return {
      streak,
      totalXP,
      languages,
    }
  } catch (error) {
    console.error('[Duolingo] Error fetching data:', error)
    
    // Se for erro 404, usuário não encontrado
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new Error(`Duolingo user "${username}" not found`)
    }

    // Para outros erros, retornar dados mock como fallback
    // (Isso permite que o SVG seja gerado mesmo se a API estiver indisponível)
    console.warn('[Duolingo] API error, using mock data as fallback')
    return getMockDuolingoData()
  }
}

