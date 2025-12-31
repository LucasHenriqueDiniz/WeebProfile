/**
 * Tipos do Plugin Codeforces
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

export interface CodeforcesSubmission {
  problem: string
  verdict: string
  date: string
  contestId?: number
  index?: string
}

/**
 * Configurações não-essenciais do Codeforces
 */
export interface CodeforcesNonEssentialConfig extends NonEssentialPluginConfig {
  rating_rank_title?: string
  rating_rank_hide_title?: boolean
  contests_participated_title?: string
  contests_participated_hide_title?: boolean
  problems_solved_title?: string
  problems_solved_hide_title?: boolean
  recent_submissions_max?: number
  recent_submissions_title?: string
  recent_submissions_hide_title?: boolean
}

/**
 * Configuração completa do plugin Codeforces
 */
export interface CodeforcesConfig extends BasePluginConfig {
  username?: string
  nonEssential?: CodeforcesNonEssentialConfig
  [key: string]: unknown
}

export interface CodeforcesData {
  rating: number
  rank: string
  contestsCount: number
  problemsSolved: {
    total: number
    byDifficulty: Record<string, number>
  }
  recentSubmissions: CodeforcesSubmission[]
}

















