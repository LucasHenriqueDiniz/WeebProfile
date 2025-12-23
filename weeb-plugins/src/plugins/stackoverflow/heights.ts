/**
 * Height Calculator for StackOverflow Plugin
 * 
 * Calculates the estimated height of StackOverflow sections based on configuration.
 * Returns the height in pixels.
 */

import type { StackOverflowConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Calculates height for StackOverflow sections
 */
export function calculateStackOverflowHeight(
  section: string,
  config: StackOverflowConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Reputation - single line with reputation value and change badge
  if (section === 'reputation') {
    return titleSpace + 60 // Title + content (1 line)
  }

  // Badges - total + gold/silver/bronze (2 lines)
  if (section === 'badges') {
    return titleSpace + 80 // Title + content (2 lines)
  }

  // Answers & Questions - single line with answers and questions
  if (section === 'answers_questions') {
    return titleSpace + 60 // Title + content (1 line)
  }

  // Tags Expertise - list of tags (50px/item + gap 4px)
  if (section === 'tags_expertise') {
    const maxItems = config.nonEssential?.tags_expertise_max || 5
    const itemHeight = 50 // DefaultList item height
    const gapBetweenItems = 4 // gap-1 (4px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}
