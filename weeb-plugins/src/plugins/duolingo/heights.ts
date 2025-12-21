/**
 * Cálculo de altura para o plugin Duolingo
 * 
 * NOTA: Este arquivo é opcional, mas ajuda a calcular a altura estimada do SVG
 */

import type { DuolingoConfig, DuolingoData } from './types'

export function calculateDuolingoHeight(
  config: DuolingoConfig,
  data: DuolingoData
): number {
  if (!config.enabled || config.sections.length === 0) {
    return 0
  }

  // Altura base por seção
  const SECTION_BASE_HEIGHT = 80
  const TITLE_HEIGHT = 30
  const ITEM_HEIGHT = 50

  let totalHeight = 0

  for (const section of config.sections) {
    const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] || false
    const sectionTitleHeight = hideTitle ? 0 : TITLE_HEIGHT

    switch (section) {
      case 'current_streak':
      case 'total_xp':
        totalHeight += SECTION_BASE_HEIGHT + sectionTitleHeight
        break
      case 'languages_learning': {
        const maxItems = config.nonEssential?.languages_learning_max || 5
        const itemCount = Math.min(data.languages.length, maxItems)
        // Increased height for cards with progress bars
        totalHeight += sectionTitleHeight + (itemCount * 90) + 20
        break
      }
    }

    // Espaçamento entre seções
    totalHeight += 20
  }

  return totalHeight
}


