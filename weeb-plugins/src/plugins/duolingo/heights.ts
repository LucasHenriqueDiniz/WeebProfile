/**
 * Height Calculator for Duolingo Plugin
 * 
 * Calculates the estimated height of Duolingo sections based on configuration.
 * Returns the height in pixels.
 */

import type { DuolingoConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Calculates height for Duolingo sections
 */
export function calculateDuolingoHeight(
  section: string,
  config: DuolingoConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Current Streak - large card (p-5) with mascot and content
  if (section === 'current_streak') {
    return titleSpace + 120
  }

  // Total XP - medium card (p-4) with trophy icon
  if (section === 'total_xp') {
    return titleSpace + 100
  }

  // Languages Learning - cards with progress bars (90px/item + gap-3 = 12px)
  if (section === 'languages_learning') {
    const maxItems = config.nonEssential?.languages_learning_max || 5
    const itemHeight = 90 // Cards with progress bars are taller
    const gapBetweenItems = 12 // gap-3 (12px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}


