/**
 * Height Calculator for Stack Overflow Plugin
 * 
 * Calculates the estimated height of Stack Overflow sections based on configuration.
 * Returns the height in pixels.
 */

import type { StackOverflowConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Calculates height for Stack Overflow sections
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

  // Reputation - simple content (1 line)
  if (section === 'reputation') {
    return titleSpace + 60
  }

  // Badges - content with 2 lines
  if (section === 'badges') {
    return titleSpace + 80
  }

  // Answers & Questions - simple content (1 line)
  if (section === 'answers_questions') {
    return titleSpace + 60
  }

  // Tags Expertise - list with items (50px/item + 4px gap)
  if (section === 'tags_expertise') {
    const maxItems = config.nonEssential?.tags_expertise_max || 5
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




