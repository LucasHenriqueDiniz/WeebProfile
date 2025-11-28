/**
 * Height Calculator for MyAnimeList Plugin
 * 
 * Calculates the estimated height of MyAnimeList sections based on configuration.
 * Returns the height in pixels.
 */

import type { MyAnimeListConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../../weeb-plugins/plugins/shared/types/heights'

/**
 * Calculates height for MyAnimeList sections
 */
export function calculateMyAnimeListHeight(
  section: string,
  config: MyAnimeListConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (config as any)[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Statistics
  if (section === 'statistics' || section === 'statistics_simple') {
    const statisticsMedia = config.statistics_media ?? 'both'
    const showAnime = statisticsMedia === 'both' || statisticsMedia === 'anime'
    const showManga = statisticsMedia === 'both' || statisticsMedia === 'manga'
    
    const rowHeight = 140 // Each StatisticRow: 6 items × 20px + 5 gaps × 4px = 140px
    const gapBetweenSections = 8 // gap-2 (8px) between sections in half-mode
    const sectionTitleHeight = hideTitle ? 0 : titleHeight
    
    if (style === 'terminal') {
      const terminalGridHeight = 120
      return sectionTitleHeight + terminalGridHeight
    }

    if (size === 'half') {
      let contentHeight = 0
      
      if (showAnime) {
        contentHeight += sectionTitleHeight + rowHeight
      }
      
      if (showManga) {
        if (showAnime) {
          contentHeight += gapBetweenSections
        }
        contentHeight += sectionTitleHeight + rowHeight
      }
      
      return contentHeight
    } else {
      // Full mode: sections side-by-side
      return sectionTitleHeight + rowHeight
    }
  }

  // Last Activity
  if (section === 'last_activity') {
    const maxItems = getMaxItems('last_activity', config)
    const hideAnime = config.last_activity_hide_anime ?? false
    const hideManga = config.last_activity_hide_manga ?? false
    
    if (hideAnime && hideManga) {
      return titleSpace
    }
    
    // Item height: measured from actual render
    // Item structure: grid with 75px image + content (title, bar, status, date)
    // min-h-[75px] but actual rendered height varies
    // NOTE: This calculation uses maxItems from config, but actual rendered items
    // may be less if data doesn't have enough items. The SVG will have extra space
    // in that case, which is acceptable for now.
    const itemHeight = 75 // Using min-height as base
    const gapBetweenItems = 4 // gap-1 (4px) between items
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    const calculatedHeight = titleSpace + itemsHeight + gapHeight
    
    console.log(`[MyAnimeList Height] 📊 last_activity calculation:`, {
      section,
      maxItems,
      hideAnime,
      hideManga,
      titleSpace,
      itemHeight,
      itemsHeight,
      gapHeight,
      calculatedHeight,
    })
    
    return calculatedHeight
  }

  // Favorites sections
  if (section === 'anime_favorites' || section === 'manga_favorites' || 
      section === 'people_favorites' || section === 'character_favorites') {
    const listStyle = config[`${section}_list_style`] ?? 'detailed'
    const maxItems = getMaxItems(section, config)
    
    // Get layout heights based on style
    const layout = getFavoritesLayout(listStyle, size)
    
    if (layout.type === 'grid') {
      // Simple grid style
      const itemsPerRow = size === 'half' ? (layout.itemsPerRowHalf ?? 5) : (layout.itemsPerRowFull ?? 10)
      const rows = Math.ceil(maxItems / itemsPerRow)
      const itemsHeight = rows * layout.itemHeight
      const rowGaps = Math.max(0, rows - 1) * (layout.gap ?? 8)
      return titleSpace + itemsHeight + rowGaps
    } else {
      // List style (compact, detailed, minimal)
      const itemsHeight = maxItems * layout.itemHeight
      const gapHeight = Math.max(0, maxItems - 1) * (layout.gapBetweenItems ?? 4)
      return titleSpace + itemsHeight + gapHeight
    }
  }

  // Bars (anime_bar, manga_bar)
  if (section === 'anime_bar' || section === 'manga_bar') {
    const barHeight = 10 // h-2.5 (10px)
    const gapAfterBar = 8 // mt-2 (8px)
    const gridHeight = 76 // Altura fixa do grid
    const contentHeight = barHeight + gapAfterBar + gridHeight
    return titleSpace + contentHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

/**
 * Get max items for a section
 */
function getMaxItems(section: string, config: MyAnimeListConfig): number {
  if (section === 'last_activity') {
    return config.last_activity_max ?? 6
  }
  
  if (section === 'anime_favorites') {
    return config.anime_favorites_max ?? config.favorites_max ?? 20
  }
  if (section === 'manga_favorites') {
    return config.manga_favorites_max ?? config.favorites_max ?? 20
  }
  if (section === 'people_favorites') {
    return config.people_favorites_max ?? config.favorites_max ?? 20
  }
  if (section === 'character_favorites') {
    return config.character_favorites_max ?? config.favorites_max ?? 20
  }
  
  return 20
}

/**
 * Get layout configuration for favorites based on style
 */
function getFavoritesLayout(
  listStyle: string,
  size: 'half' | 'full'
): {
  type: 'grid' | 'list'
  itemHeight: number
  gap?: number
  gapBetweenItems?: number
  itemsPerRowHalf?: number
  itemsPerRowFull?: number
} {
  switch (listStyle) {
    case 'simple':
      return {
        type: 'grid',
        itemHeight: 120, // favorite-container height
        gap: 8, // gap-2 (8px)
        itemsPerRowHalf: 5, // half:grid-cols-5
        itemsPerRowFull: 10, // grid-cols-10
      }
    case 'compact':
      return {
        type: 'list',
        itemHeight: 50, // h-[50px]
        gapBetweenItems: 4, // gap-1 (4px)
      }
    case 'minimal':
      return {
        type: 'list',
        itemHeight: 75, // h-[75px]
        gapBetweenItems: 4, // gap-1 (4px)
      }
    case 'detailed':
      return {
        type: 'list',
        itemHeight: 120, // h-[120px]
        gapBetweenItems: 4, // gap-1 (4px)
      }
    default:
      return {
        type: 'list',
        itemHeight: 120,
        gapBetweenItems: 4,
      }
  }
}

