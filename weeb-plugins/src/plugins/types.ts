/**
 * Plugin types
 * 
 * @deprecated Use shared/types/plugin.ts instead
 * Kept for compatibility during migration
 */

// Re-export shared types
export type {
  Plugin,
  ValidationResult,
} from './shared/types/plugin'
export type { 
  BasePluginConfig, 
  EssentialPluginConfig, 
  NonEssentialPluginConfig 
} from './shared/types/base'

import type { PluginConfig, PluginData } from '../types/index'

export interface PluginRegistry {
  github: {
    config: import('./github/types.js').GithubConfig
    data: import('./github/types.js').GithubData
  }
  lastfm?: {
    config: PluginConfig
    data: PluginData
  }
  myanimelist?: {
    config: PluginConfig
    data: PluginData
  }
}

