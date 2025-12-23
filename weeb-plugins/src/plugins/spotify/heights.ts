/**
 * Height Calculator for spotify Plugin
 * 
 * Calculates the estimated height of spotify sections based on configuration.
 * Returns the height in pixels.
 */

import type { SpotifyConfig } from './types.js'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights.js'

/**
 * Calculates height for spotify sections
 * 
 * @param section - The section name
 * @param config - The plugin's typed configuration
 * @param size - 'half' or 'full'
 * @param style - 'default' or 'terminal'
 * @returns Height in pixels
 */
export function calculateSpotifyHeight(
  section: string,
  config: SpotifyConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config as any)[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // TODO: Implement height calculation for each section
  // Example for a simple section:
  // if (section === 'your_section') {
  //   const contentHeight = 100 // Your section's content height
  //   return titleSpace + contentHeight
  // }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

