/**
 * Height Calculator for Codeforces Plugin
 * 
 * Calculates the estimated height of Codeforces sections based on configuration.
 * Returns the height in pixels.
 */

import type { CodeforcesConfig } from './types.js'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights.js'

/**
 * Calculates height for Codeforces sections
 */
export function calculateCodeforcesHeight(
  section: string,
  config: CodeforcesConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Rating & Rank - simple content (1 line)
  if (section === 'rating_rank') {
    return titleSpace + 60
  }

  // Contests Participated - simple content (1 line)
  if (section === 'contests_participated') {
    return titleSpace + 60
  }

  // Problems Solved - content with 2-3 lines (total + difficulties)
  if (section === 'problems_solved') {
    return titleSpace + 80
  }

  // Recent Submissions - list with items (50px/item + 4px gap)
  if (section === 'recent_submissions') {
    const maxItems = config.nonEssential?.recent_submissions_max || 5
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




