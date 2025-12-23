/**
 * Tipos do Plugin Codewars
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

export interface CodewarsKata {
  name: string
  difficulty: string
  completedAt?: string
}

export interface CodewarsLanguage {
  language: string
  score: number
}

/**
 * Configurações não-essenciais do Codewars (preferências do usuário)
 */
export interface CodewarsNonEssentialConfig extends NonEssentialPluginConfig {
  rank_honor_max?: number
  rank_honor_title?: string
  rank_honor_hide_title?: boolean
  completed_kata_max?: number
  completed_kata_title?: string
  completed_kata_hide_title?: boolean
  languages_proficiency_max?: number
  languages_proficiency_title?: string
  languages_proficiency_hide_title?: boolean
  leaderboard_position_title?: string
  leaderboard_position_hide_title?: boolean
}

/**
 * Configuração completa do plugin Codewars
 */
export interface CodewarsConfig extends BasePluginConfig {
  username?: string
  nonEssential?: CodewarsNonEssentialConfig
  [key: string]: unknown
}

export interface CodewarsData {
  rank: {
    name: string
    color: string
  }
  honor: number
  completedKata: CodewarsKata[]
  languages: Record<string, CodewarsLanguage>
  leaderboardPosition?: number
}









