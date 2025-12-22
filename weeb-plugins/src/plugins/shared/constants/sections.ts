/**
 * Constantes de seções comuns entre plugins
 */

/**
 * Seções padrão que muitos plugins podem ter
 */
export const COMMON_SECTIONS = {
  PROFILE: 'profile',
  STATISTICS: 'statistics',
  ACTIVITY: 'activity',
  FAVORITES: 'favorites',
  RECENT: 'recent',
  TOP: 'top',
} as const

/**
 * Tipos de visualização comuns
 */
export const VIEW_TYPES = {
  DEFAULT: 'default',
  GRID: 'grid',
  LIST: 'list',
  SIMPLE: 'simple',
} as const

