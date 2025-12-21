/**
 * Cálculo de altura para o plugin Codewars
 */

import type { CodewarsConfig, CodewarsData } from './types'

export function calculateCodewarsHeight(
  config: CodewarsConfig,
  data: CodewarsData
): number {
  if (!config.enabled || config.sections.length === 0) {
    return 0
  }

  const SECTION_BASE_HEIGHT = 80
  const TITLE_HEIGHT = 30
  const ITEM_HEIGHT = 50

  let totalHeight = 0

  for (const section of config.sections) {
    const hideTitle = (config.nonEssential as any)?.[`${section}_hide_title`] || false
    const sectionTitleHeight = hideTitle ? 0 : TITLE_HEIGHT

    switch (section) {
      case 'rank_honor':
      case 'leaderboard_position':
        totalHeight += SECTION_BASE_HEIGHT + sectionTitleHeight
        break
      case 'completed_kata': {
        const maxItems = config.nonEssential?.completed_kata_max || 5
        const itemCount = Math.min(data.completedKata.length, maxItems)
        totalHeight += sectionTitleHeight + (itemCount * ITEM_HEIGHT) + 20
        break
      }
      case 'languages_proficiency': {
        const maxItems = config.nonEssential?.languages_proficiency_max || 5
        const itemCount = Math.min(Object.keys(data.languages).length, maxItems)
        totalHeight += sectionTitleHeight + (itemCount * ITEM_HEIGHT) + 20
        break
      }
    }

    totalHeight += 20
  }

  return totalHeight
}




