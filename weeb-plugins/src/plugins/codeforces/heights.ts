/**
 * Cálculo de altura para o plugin Codeforces
 */

import type { CodeforcesConfig, CodeforcesData } from './types'

export function calculateCodeforcesHeight(
  config: CodeforcesConfig,
  data: CodeforcesData
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
      case 'rating_rank':
      case 'contests_participated':
      case 'problems_solved':
        totalHeight += SECTION_BASE_HEIGHT + sectionTitleHeight
        break
      case 'recent_submissions': {
        const maxItems = config.nonEssential?.recent_submissions_max || 5
        const itemCount = Math.min(data.recentSubmissions.length, maxItems)
        totalHeight += sectionTitleHeight + (itemCount * ITEM_HEIGHT) + 20
        break
      }
    }

    totalHeight += 20
  }

  return totalHeight
}




