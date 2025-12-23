/**
 * Height Calculator for Lyfta Plugin
 * 
 * Calculates the estimated height of Lyfta sections based on configuration.
 * Returns the height in pixels.
 */

import type { LyftaConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Calculates height for Lyfta sections
 */
export function calculateLyftaHeight(
  section: string,
  config: LyftaConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const nonEssential = config.nonEssential || {}
  const hideTitle = nonEssential[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Statistics section
  if (section === 'statistics') {
    // Grid 2x2 com 4 cards + possível favorite exercise
    const gridHeight = 200 // 4 cards em grid 2x2
    const favoriteHeight = 60 // Favorite exercise card (se existir)
    return titleSpace + gridHeight + favoriteHeight
  }

  // Recent Workouts section
  if (section === 'recent_workouts') {
    const maxWorkouts = nonEssential.workouts_max ?? 5
    const itemHeight = 80 // Altura de cada workout card
    const gapHeight = Math.max(0, maxWorkouts - 1) * 8 // gap-2 (8px)
    return titleSpace + (maxWorkouts * itemHeight) + gapHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

