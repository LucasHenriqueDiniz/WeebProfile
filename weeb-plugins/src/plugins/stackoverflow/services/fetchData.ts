/**
 * Serviço de fetch de dados do Stack Overflow
 * 
 * API: https://api.stackexchange.com/2.3
 * Documentação: https://api.stackexchange.com/docs
 * 
 * Rate Limit: 300 requests/day without key, more with key (optional)
 */

import type { StackOverflowConfig, StackOverflowData, StackOverflowTag } from '../types'
import { getMockStackOverflowData } from './mock-data'
import { fetchJson, buildQueryString } from '../../shared/utils/api'
import { ApiError } from '../../shared/utils/errors'

const STACKEXCHANGE_API_BASE = 'https://api.stackexchange.com/2.3'
const SITE = 'stackoverflow'

/**
 * Resposta genérica da API do Stack Exchange
 */
interface StackExchangeApiResponse<T> {
  items: T[]
  has_more: boolean
  quota_max: number
  quota_remaining: number
  page: number
  page_size: number
  total: number
  type: string
}

/**
 * Resposta do endpoint users
 */
interface StackOverflowUser {
  user_id: number
  display_name: string
  reputation: number
  reputation_change_day: number
  reputation_change_week: number
  reputation_change_month: number
  reputation_change_quarter: number
  reputation_change_year: number
  badge_counts: {
    bronze: number
    silver: number
    gold: number
  }
  answer_count: number
  question_count: number
  account_id: number
  is_employee: boolean
  last_modified_date: number
  last_access_date: number
  creation_date: number
  user_type: string
  profile_image: string
  link: string
}

/**
 * Resposta do endpoint users/{ids}/tags
 */
interface StackOverflowTagResponse {
  user_id: number
  answer_count: number
  answer_score: number
  question_count: number
  question_score: number
  tag_name: string
}

/**
 * Busca dados do Stack Overflow
 */
export async function fetchStackOverflowData(
  config: StackOverflowConfig,
  dev = false
): Promise<StackOverflowData> {
  if (dev) {
    return getMockStackOverflowData()
  }

  if (!config.userId || typeof config.userId !== 'string' || config.userId.trim() === '') {
    throw new Error('Stack Overflow user ID is required (numeric ID, not username)')
  }

  const userId = config.userId.trim()

  // Validar que é um número
  if (!/^\d+$/.test(userId)) {
    throw new Error('Stack Overflow user ID must be a numeric ID')
  }

  try {
    // Buscar informações do usuário
    const userParams = buildQueryString({
      ids: userId,
      site: SITE,
    })
    const userUrl = `${STACKEXCHANGE_API_BASE}/users${userParams}`
    const userResponse = await fetchJson<StackExchangeApiResponse<StackOverflowUser>>(userUrl)

    if (!userResponse.items || userResponse.items.length === 0) {
      throw new ApiError('User not found', 404, 'StackOverflow')
    }

    const user = userResponse.items?.[0]
    if (!user) {
      throw new ApiError('User not found in response', 404, 'StackOverflow')
    }

    // Buscar tags do usuário (top tags)
    const tagsParams = buildQueryString({
      ids: userId,
      site: SITE,
      order: 'desc',
      sort: 'popular',
      page: 1,
      pagesize: 10,
    })
    const tagsUrl = `${STACKEXCHANGE_API_BASE}/users/${userId}/tags${tagsParams.replace(/^\?/, '&')}`
    const tagsResponse = await fetchJson<StackExchangeApiResponse<StackOverflowTagResponse>>(tagsUrl)

    const topTags: StackOverflowTag[] = (tagsResponse.items || []).map((tag) => ({
      name: tag.tag_name,
      score: tag.answer_score + tag.question_score,
    }))

    return {
      reputation: user.reputation || 0,
      reputationChange: user.reputation_change_month || 0,
      badges: {
        gold: user.badge_counts?.gold || 0,
        silver: user.badge_counts?.silver || 0,
        bronze: user.badge_counts?.bronze || 0,
      },
      answers: user.answer_count || 0,
      questions: user.question_count || 0,
      topTags,
    }
  } catch (error) {
    console.error('[StackOverflow] Error fetching data:', error)
    
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new Error(`Stack Overflow user with ID "${userId}" not found`)
    }

    // Retornar dados mock em caso de erro
    console.warn('[StackOverflow] API error, using mock data as fallback')
    return getMockStackOverflowData()
  }
}

