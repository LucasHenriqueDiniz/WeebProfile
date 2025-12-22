/**
 * Renderizador principal do Plugin Duolingo
 */

import React from 'react'
import type { DuolingoConfig, DuolingoData } from '../types'
import { CurrentStreak } from './CurrentStreak'
import { TotalXP } from './TotalXP'
import { LanguagesLearning } from './LanguagesLearning'

interface RenderDuolingoProps {
  config: DuolingoConfig
  data: DuolingoData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderDuolingo({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderDuolingoProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Combinar nonEssential com propriedades do nível raiz do config
  const sectionConfig = {
    ...(config.nonEssential || {}),
    // Incluir propriedades do nível raiz que são configurações de seção
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('current_streak_') ||
        key.startsWith('total_xp_') ||
        key.startsWith('languages_learning_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  const fullConfig = { ...config, nonEssential: sectionConfig as any }

  // Renderizar cada seção solicitada
  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'current_streak':
        return (
          <CurrentStreak
            key="current_streak"
            streak={data.streak}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'total_xp':
        return (
          <TotalXP
            key="total_xp"
            totalXP={data.totalXP}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'languages_learning':
        return (
          <LanguagesLearning
            key="languages_learning"
            data={data.languages}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      default:
        return null
    }
  })

  return (
    <section id="duolingo-plugin">
      {renderedSections.filter(Boolean)}
    </section>
  )
}


