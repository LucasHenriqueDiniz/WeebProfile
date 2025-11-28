/**
 * Intervalos de tempo comuns para plugins
 */

/**
 * Intervalos padrão do LastFM
 */
export const LASTFM_INTERVALS = {
  OVERALL: 'overall',
  '7DAYS': '7day',
  '1MONTH': '1month',
  '3MONTHS': '3month',
  '6MONTHS': '6month',
  '12MONTHS': '12month',
} as const

/**
 * Intervalos padrão do GitHub
 */
export const GITHUB_INTERVALS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const

/**
 * Intervalos genéricos
 */
export const COMMON_INTERVALS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  ALL_TIME: 'all_time',
} as const

