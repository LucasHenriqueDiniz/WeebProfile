import React from 'react'
import { CurrentStreak } from './CurrentStreak'
import { TotalXP } from './TotalXP'
import { LanguagesLearning } from './LanguagesLearning'
import { PluginError } from '../../../components/PluginError'
import type { DuolingoConfig, DuolingoData } from '../types'

interface RenderDuolingoProps {
  config: DuolingoConfig
  data: DuolingoData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderDuolingo({ config, data, style = 'default', size = 'half' }: RenderDuolingoProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return React.createElement(React.Fragment, null)
  }

  // Verificar se há erro nos dados
  if ((data as any)._error) {
    return React.createElement(PluginError, {
      pluginName: "Duolingo",
      error: (data as any)._error,
      errorType: "config",
      style: style,
      compact: true
    })
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
        acc[key] = config[key]
      }
      return acc
    }, {} as Record<string, unknown>),
  }

  const fullConfig = { ...config, nonEssential: sectionConfig }

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
    <section id="duolingo-plugin" className="duolingo-plugin-section">
      {renderedSections.filter(Boolean)}
    </section>
  )
}
