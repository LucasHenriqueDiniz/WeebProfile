/**
 * 16personalities plugin specific types
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

/**
 * 16Personalities personality types
 */
export type PersonalityType =
  | 'ENFJ' // Protagonist
  | 'ENFP' // Campaigner
  | 'ENTJ' // Commander
  | 'ENTP' // Debater
  | 'ESFJ' // Consul
  | 'ESFP' // Entertainer
  | 'ESTJ' // Executive
  | 'ESTP' // Entrepreneur
  | 'INFJ' // Advocate
  | 'INFP' // Mediator
  | 'INTJ' // Architect
  | 'INTP' // Thinker
  | 'ISFJ' // Protector
  | 'ISFP' // Adventurer
  | 'ISTJ' // Logistician
  | 'ISTP' // Virtuoso

/**
 * Non-essential plugin configuration
 */
export interface Personality16NonEssentialConfig extends NonEssentialPluginConfig {
  personality_url?: string
  personality_hide_title?: boolean
  personality_title?: string
  personality_show_description?: boolean
  personality_show_link?: boolean
}

/**
 * Complete plugin configuration
 */
export interface Personality16Config extends BasePluginConfig {
  personality_url?: string
  personality_hide_title?: boolean
  personality_title?: string
  personality_show_description?: boolean
  personality_show_link?: boolean
  nonEssential?: Personality16NonEssentialConfig
  [key: string]: any // Index signature for compatibility with PluginConfig
}

/**
 * Data returned by the plugin
 */
export interface Personality16Data {
  type: PersonalityType
  name: string // Personality name (e.g., "Protagonist")
  emoji: string
  description: string
  url: string
  traits: {
    E: 'Extroverted' | 'Introverted'
    N: 'Intuitive' | 'Observant'
    F: 'Feeling' | 'Thinking'
    J: 'Judging' | 'Prospecting'
  }
}
