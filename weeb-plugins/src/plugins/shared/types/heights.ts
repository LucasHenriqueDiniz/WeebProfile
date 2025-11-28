/**
 * Shared types for height calculation across all plugins
 * 
 * This file defines the standard interface that all plugin height calculators must implement.
 */

/**
 * Standard height calculator function signature
 * Each plugin should export a function that takes:
 * - section: string - the section name
 * - config: T - the plugin's typed config
 * - size: 'half' | 'full' - the size mode
 * - style: 'default' | 'terminal' - the style mode
 * And returns: number - the calculated height in pixels
 */
export type HeightCalculator<T = any> = (
  section: string,
  config: T,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
) => number

/**
 * Standard section title heights
 * These values are consistent across all plugins
 */
export const SECTION_TITLE_HEIGHT = {
  default: 35, // DefaultTitle: 23px element + 6px margin-top + 6px margin-bottom
  terminal: 30, // TerminalCommand é mais compacto
} as const

