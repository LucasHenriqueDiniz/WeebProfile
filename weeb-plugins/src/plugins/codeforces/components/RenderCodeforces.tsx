import React from 'react'
import type { CodeforcesConfig, CodeforcesData } from '../types'
import { RatingRank } from './RatingRank'
import { ContestsParticipated } from './ContestsParticipated'
import { ProblemsSolved } from './ProblemsSolved'
import { RecentSubmissions } from './RecentSubmissions'
import { PluginError } from '../../../components/PluginError'

interface RenderCodeforcesProps {
  config: CodeforcesConfig
  data: CodeforcesData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderCodeforces({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderCodeforcesProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  // Verificar se há erro nos dados
  if ((data as any)._error) {
    return <PluginError
      pluginName="Codeforces"
      error={(data as any)._error}
      errorType="config"
      style={style}
      compact={true}
    />
  }

  const sections = config.sections

  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('rating_rank_') ||
        key.startsWith('contests_participated_') ||
        key.startsWith('problems_solved_') ||
        key.startsWith('recent_submissions_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  const fullConfig = { ...config, nonEssential: sectionConfig as any }

  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'rating_rank':
        return (
          <RatingRank
            key="rating_rank"
            rating={data.rating}
            rank={data.rank}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'contests_participated':
        return (
          <ContestsParticipated
            key="contests_participated"
            count={data.contestsCount}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'problems_solved':
        return (
          <ProblemsSolved
            key="problems_solved"
            total={data.problemsSolved.total}
            byDifficulty={data.problemsSolved.byDifficulty}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'recent_submissions':
        return (
          <RecentSubmissions
            key="recent_submissions"
            data={data.recentSubmissions}
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
    <section id="codeforces-plugin">
      {renderedSections.filter(Boolean)}
    </section>
  )
}




















