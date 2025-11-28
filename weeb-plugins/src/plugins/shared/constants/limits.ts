/**
 * Limites padrão para plugins
 */

/**
 * Limites máximos comuns
 */
export const DEFAULT_LIMITS = {
  MAX_ITEMS_SMALL: 5,
  MAX_ITEMS_MEDIUM: 10,
  MAX_ITEMS_LARGE: 20,
  MAX_ITEMS_XLARGE: 50,
  MAX_ITEMS_XXLARGE: 100,
} as const

/**
 * Limites mínimos comuns
 */
export const MIN_LIMITS = {
  MIN_ITEMS: 1,
  MIN_PAGE: 1,
} as const

/**
 * Steps comuns para incrementos
 */
export const STEPS = {
  STEP_1: 1,
  STEP_5: 5,
  STEP_10: 10,
} as const

