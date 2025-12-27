/**
 * Renderizador principal do Plugin Stack Overflow
 */

import React from 'react'
import type { StackOverflowConfig, StackOverflowData } from '../types'
import { Reputation } from './Reputation'
import { Badges } from './Badges'
import { AnswersQuestions } from './AnswersQuestions'
import { TagsExpertise } from './TagsExpertise'

interface RenderStackOverflowProps {
  config: StackOverflowConfig
  data: StackOverflowData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderStackOverflow({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderStackOverflowProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('reputation_') ||
        key.startsWith('badges_') ||
        key.startsWith('answers_questions_') ||
        key.startsWith('tags_expertise_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  const fullConfig = { ...config, nonEssential: sectionConfig as any }

  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'reputation':
        return (
          <Reputation
            key="reputation"
            reputation={data.reputation}
            reputationChange={data.reputationChange}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'badges':
        return (
          <Badges
            key="badges"
            badges={data.badges}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'answers_questions':
        return (
          <AnswersQuestions
            key="answers_questions"
            answers={data.answers}
            questions={data.questions}
            config={fullConfig}
            style={style}
            size={size}
          />
        )
      case 'tags_expertise':
        return (
          <TagsExpertise
            key="tags_expertise"
            data={data.topTags}
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
    <section id="stackoverflow-plugin">
      {renderedSections.filter(Boolean)}
    </section>
  )
}













