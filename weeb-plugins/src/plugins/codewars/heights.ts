/**
 * Height Calculator for Codewars Plugin
 * 
 * Calculates the estimated height of Codewars sections based on configuration.
 * Returns the height in pixels.
 */

import type { CodewarsConfig } from './types.js'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights.js'

/**
 * Calculates height for Codewars sections
 */
export function calculateCodewarsHeight(
  section: string,
  config: CodewarsConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Rank & Honor - simple content (1 line)
  if (section === 'rank_honor') {
    return titleSpace + 60
  }

  // Leaderboard Position - simple content (1 line)
  if (section === 'leaderboard_position') {
    return titleSpace + 60
  }

  // Completed Kata - list with items (50px/item + 4px gap)
  if (section === 'completed_kata') {
    const maxItems = config.nonEssential?.completed_kata_max || 5
    const itemHeight = 50
    const gapBetweenItems = 4 // gap-1 (4px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Languages Proficiency - list with items (50px/item + 4px gap)
  if (section === 'languages_proficiency') {
    const maxItems = config.nonEssential?.languages_proficiency_max || 5
    const itemHeight = 50
    const gapBetweenItems = 4 // gap-1 (4px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}




