/**
 * Cálculo de altura para o plugin Stack Overflow
 */

import type { StackOverflowConfig, StackOverflowData } from './types'

export function calculateStackOverflowHeight(
  config: StackOverflowConfig,
  data: StackOverflowData
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
      case 'reputation':
      case 'badges':
      case 'answers_questions':
        totalHeight += SECTION_BASE_HEIGHT + sectionTitleHeight
        break
      case 'tags_expertise': {
        const maxItems = config.nonEssential?.tags_expertise_max || 5
        const itemCount = Math.min(data.topTags.length, maxItems)
        totalHeight += sectionTitleHeight + (itemCount * ITEM_HEIGHT) + 20
        break
      }
    }

    totalHeight += 20
  }

  return totalHeight
}




