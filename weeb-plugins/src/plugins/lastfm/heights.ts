/**
 * Height Calculator for LastFM Plugin
 * 
 * Calculates the estimated height of LastFM sections based on configuration.
 * Returns the height in pixels.
 */

import type { LastFmConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Layout heights for LastFM sections
 */
const LAYOUT_HEIGHTS = {
  small_list: {
    itemHeight: 50, // h-[50px]
    gapBetweenItems: 4, // gap-1 (4px)
  },
  grid: {
    fixedHeight: 304, // 200px (primeira linha) + 100px (segunda linha) + 4px (gap)
    itemsPerRowHalf: 4, // half:grid-cols-4
    itemsPerRowFull: 8, // grid-cols-8
  },
}

/**
 * Get max items for a section
 */
function getMaxItems(section: string, config: LastFmConfig): number {
  const nonEssential = config.nonEssential || {}
  if (section === 'recent_tracks') {
    return nonEssential.recent_tracks_max ?? 5
  }
  if (section.startsWith('top_artists')) {
    return nonEssential.top_artists_max ?? 5
  }
  if (section.startsWith('top_albums')) {
    return nonEssential.top_albums_max ?? 5
  }
  if (section.startsWith('top_tracks')) {
    return nonEssential.top_tracks_max ?? 5
  }
  return 5
}

/**
 * Calculates height for LastFM sections
 */
export function calculateLastFMHeight(
  section: string,
  config: LastFmConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const nonEssential = config.nonEssential || {}
  const hideTitle = nonEssential[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Recent Tracks (small_list layout)
  if (section === 'recent_tracks') {
    const maxItems = getMaxItems(section, config)
    const layout = LAYOUT_HEIGHTS.small_list
    const itemsHeight = maxItems * layout.itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * layout.gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Top Artists/Albums/Tracks
  // Pode ser grid (DefaultGrid/DefaultImageGrid) ou list (DefaultList)
  if (section.startsWith('top_')) {
    const maxItems = getMaxItems(section, config)
    const nonEssential = config.nonEssential || {}
    
    // Determinar estilo baseado na seção ou config
    let displayStyle: 'grid' | 'list' | 'default' = 'default'
    if (section.includes('_grid')) {
      displayStyle = 'grid'
    } else if (section.includes('_list')) {
      displayStyle = 'list'
    } else {
      // Usar estilo da config
      if (section.startsWith('top_artists')) {
        displayStyle = (nonEssential.top_artists_style || 'default') as 'grid' | 'list' | 'default'
      } else if (section.startsWith('top_albums')) {
        displayStyle = (nonEssential.top_albums_style || 'default') as 'grid' | 'list' | 'default'
      } else if (section.startsWith('top_tracks')) {
        displayStyle = (nonEssential.top_tracks_style || 'default') as 'grid' | 'list' | 'default'
      }
    }
    
    // Default e Grid usam DefaultGrid ou DefaultImageGrid
    if (displayStyle === 'grid' || displayStyle === 'default') {
      // DefaultGrid (default): grid-rows-2 fixo, primeiro item 200px (col-span-2 row-span-2), outros 100px
      // Altura fixa: 200px (primeira linha) + 100px (segunda linha) + gap-1 (4px) = 304px
      // DefaultImageGrid (grid): cada item 100px, altura = ceil(maxItems / cols) * 100px + gaps
      // Para half: grid-cols-4, para full: grid-cols-8
      if (displayStyle === 'default') {
        // DefaultGrid tem altura fixa de 2 linhas
        return titleSpace + 304 // 200px + 100px + 4px gap
      } else {
        // DefaultImageGrid: altura dinâmica baseada no número de itens
        const itemsPerRow = size === 'half' ? 4 : 8
        const rows = Math.ceil(maxItems / itemsPerRow)
        const itemHeight = 100 // Altura de cada item no grid
        const gapBetweenItems = 4 // gap-1 (4px)
        const itemsHeight = rows * itemHeight
        const gapHeight = Math.max(0, rows - 1) * gapBetweenItems
        return titleSpace + itemsHeight + gapHeight
      }
    } else {
      // List usa DefaultList: cada item 50px + gap-1 (4px)
      const layout = LAYOUT_HEIGHTS.small_list
      const itemsHeight = maxItems * layout.itemHeight
      const gapHeight = Math.max(0, maxItems - 1) * layout.gapBetweenItems
      return titleSpace + itemsHeight + gapHeight
    }
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

