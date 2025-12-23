/**
 * Height Calculator for Steam Plugin
 * 
 * Calculates the estimated height of Steam sections based on configuration.
 * Returns the height in pixels.
 */

import type { SteamConfig } from './types.js'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights.js'

/**
 * Calculates height for Steam sections
 */
export function calculateSteamHeight(
  section: string,
  config: SteamConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const nonEssential = config.nonEssential || {}
  const hideTitle = nonEssential[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Statistics section
  if (section === 'statistics') {
    // Grid 2x2 com 4 cards
    const gridHeight = 200 // 4 cards em grid 2x2
    return titleSpace + gridHeight
  }

  // Recent Games section
  if (section === 'recent_games') {
    const maxGames = nonEssential.recent_games_max ?? 5
    const displayStyle = nonEssential.recent_games_style || 'list'
    
    if (displayStyle === 'compact') {
      // Grid compacto: 5 por linha
      const itemsPerRow = 5
      const rows = Math.ceil(maxGames / itemsPerRow)
      const itemHeight = 120 // Altura de cada card no grid compacto
      const gapHeight = Math.max(0, rows - 1) * 8 // gap-2 (8px)
      return titleSpace + (rows * itemHeight) + gapHeight
    } else {
      // List style
      const itemHeight = 80 // Altura de cada game card
      const gapHeight = Math.max(0, maxGames - 1) * 8 // gap-2 (8px)
      return titleSpace + (maxGames * itemHeight) + gapHeight
    }
  }

  // Top Games section
  if (section === 'top_games') {
    const maxGames = nonEssential.top_games_max ?? 5
    const displayStyle = nonEssential.top_games_style || 'list'
    
    if (displayStyle === 'compact') {
      // Grid compacto: 5 por linha
      const itemsPerRow = 5
      const rows = Math.ceil(maxGames / itemsPerRow)
      const itemHeight = 120 // Altura de cada card no grid compacto
      const gapHeight = Math.max(0, rows - 1) * 8 // gap-2 (8px)
      return titleSpace + (rows * itemHeight) + gapHeight
    } else {
      // List style
      const itemHeight = 80 // Altura de cada game card
      const gapHeight = Math.max(0, maxGames - 1) * 8 // gap-2 (8px)
      return titleSpace + (maxGames * itemHeight) + gapHeight
    }
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

