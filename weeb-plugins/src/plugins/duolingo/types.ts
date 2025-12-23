/**
 * Tipos do Plugin Duolingo
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base.js'

export interface DuolingoLanguage {
  language: string
  xp: number
  level?: number
}

/**
 * Configurações não-essenciais do Duolingo (preferências do usuário)
 * Essas configs são armazenadas em pluginsConfig no banco
 */
export interface DuolingoNonEssentialConfig extends NonEssentialPluginConfig {
  current_streak_max?: number
  current_streak_title?: string
  current_streak_hide_title?: boolean
  total_xp_title?: string
  total_xp_hide_title?: boolean
  languages_learning_max?: number
  languages_learning_title?: string
  languages_learning_hide_title?: boolean
  languages_learning_hide_languages?: string[]
}

/**
 * Configuração completa do plugin Duolingo
 */
export interface DuolingoConfig extends BasePluginConfig {
  username?: string
  nonEssential?: DuolingoNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface DuolingoData {
  streak: number
  totalXP: number
  languages: DuolingoLanguage[]
}


