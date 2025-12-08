/**
 * Tipos do Plugin Steam
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

export interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_2weeks?: number
  img_icon_url?: string
  img_logo_url?: string
  header_image?: string
}

export interface SteamPlayerSummary {
  steamid: string
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  personastate: number
  communityvisibilitystate: number
  profilestate: number
  lastlogoff: number
  commentpermission?: number
}

export interface SteamStatistics {
  totalGames: number
  totalPlaytime: number
  recentPlaytime: number
  favoriteGame: string | null
  topGames: Array<{ name: string; playtime: number }>
}

/**
 * Configurações não-essenciais do Steam (preferências do usuário)
 * Essas configs são armazenadas em pluginsConfig no banco
 */
export interface SteamNonEssentialConfig extends NonEssentialPluginConfig {
  statistics_hide_title?: boolean
  statistics_title?: string
  recent_games_hide_title?: boolean
  recent_games_title?: string
  recent_games_max?: number
  recent_games_style?: 'list' | 'compact'
  top_games_hide_title?: boolean
  top_games_title?: string
  top_games_max?: number
  top_games_style?: 'list' | 'compact'
}

/**
 * Configuração completa do plugin Steam
 */
export interface SteamConfig extends BasePluginConfig {
  nonEssential?: SteamNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface SteamData {
  playerSummary: SteamPlayerSummary | null
  games: SteamGame[]
  statistics: SteamStatistics
}

