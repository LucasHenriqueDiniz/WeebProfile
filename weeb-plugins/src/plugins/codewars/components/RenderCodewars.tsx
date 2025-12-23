/**
 * Renderizador principal do Plugin Codewars
 */

import React from 'react'
import type { CodewarsConfig, CodewarsData } from '../types'
import { RankHonor } from './RankHonor'
import { CompletedKata } from './CompletedKata'
import { LanguagesProficiency } from './LanguagesProficiency'
import { LeaderboardPosition } from './LeaderboardPosition'

interface RenderCodewarsProps {
  config: CodewarsConfig
  data: CodewarsData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderCodewars({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderCodewarsProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Combinar nonEssential com propriedades do nível raiz do config
  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('rank_honor_') ||
        key.startsWith('completed_kata_') ||
        key.startsWith('languages_proficiency_') ||
        key.startsWith('leaderboard_position_')
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
      case 'rank_honor':
        return (
          <RankHonor
            key="rank_honor"
            rank={data.rank}
            honor={data.honor}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'completed_kata':
        return (
          <CompletedKata
            key="completed_kata"
            data={data.completedKata}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'languages_proficiency':
        return (
          <LanguagesProficiency
            key="languages_proficiency"
            languages={data.languages}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'leaderboard_position':
        return (
          <LeaderboardPosition
            key="leaderboard_position"
            position={data.leaderboardPosition}
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
    <section id="codewars-plugin">
      {renderedSections.filter(Boolean)}
    </section>
  )
}









