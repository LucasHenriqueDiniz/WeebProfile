/**
 * Tipos do Plugin Stack Overflow
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

export interface StackOverflowTag {
  name: string
  score: number
}

/**
 * Configurações não-essenciais do Stack Overflow
 */
export interface StackOverflowNonEssentialConfig extends NonEssentialPluginConfig {
  reputation_title?: string
  reputation_hide_title?: boolean
  badges_title?: string
  badges_hide_title?: boolean
  answers_questions_title?: string
  answers_questions_hide_title?: boolean
  answers_questions_hide_questions?: boolean
  tags_expertise_max?: number
  tags_expertise_title?: string
  tags_expertise_hide_title?: boolean
}

/**
 * Configuração completa do plugin Stack Overflow
 */
export interface StackOverflowConfig extends BasePluginConfig {
  userId?: string // ID numérico como string
  nonEssential?: StackOverflowNonEssentialConfig
  [key: string]: unknown
}

export interface StackOverflowData {
  reputation: number
  reputationChange: number
  badges: {
    gold: number
    silver: number
    bronze: number
  }
  answers: number
  questions: number
  topTags: StackOverflowTag[]
}


