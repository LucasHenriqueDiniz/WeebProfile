/**
 * Height Calculator for 16personalities Plugin
 * 
 * Calculates the estimated height of 16personalities sections based on configuration.
 * Returns the height in pixels.
 */

import type { Personality16Config } from './types.js'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights.js'

/**
 * Calculates height for 16personalities sections
 */
export function calculatePersonality16Height(
  section: string,
  config: Personality16Config,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = config.personality_hide_title ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  if (section === 'personality') {
    if (style === 'terminal') {
      // Terminal: calculate by number of lines (20px each)
      // 1. TerminalCommand (1 line = 20px)
      // 2. Type and name line (1 line = 20px)
      // 3. Description line (if shown, 1 line = 20px)
      // 4. Link line (if shown, 1 line = 20px)
      
      const showDescription = config.personality_show_description !== false
      const showLink = config.personality_show_link !== false
      
      let lines = 1 // TerminalCommand
      lines += 1 // Type and name
      if (showDescription) lines += 1
      if (showLink) lines += 1
      
      return titleSpace + (lines * 20)
    }

    // Default style
    // Approximate heights:
    // - Title section: ~60px (icon + text)
    // - Description: ~40px (if shown)
    // - Link: ~30px (if shown)
    // - Gaps: ~16px (gap-4)
    const showDescription = config.personality_show_description !== false
    const showLink = config.personality_show_link !== false
    
    let contentHeight = 60 // Type and name section
    if (showDescription) contentHeight += 40
    if (showLink) contentHeight += 30
    contentHeight += 16 // gap-4
    
    return titleSpace + contentHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

