import React from 'react'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import type { SteamConfig, SteamData } from '../types'
import { Statistics } from './Statistics'
import { RecentGames } from './RecentGames'
import { TopGames } from './TopGames'

interface RenderSteamProps {
  config: SteamConfig
  data: SteamData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

/**
 * Renders the Steam plugin
 */
export function RenderSteam({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderSteamProps): React.ReactElement {
  // If not enabled or no data, return empty
  if (!config.enabled || !data) {
    return <></>
  }

  const sections = config.sections || []

  // Combinar nonEssential com propriedades do nível raiz do config
  // Isso permite que configurações como recent_games_style funcionem mesmo quando
  // estão no nível raiz do config (vindo do server.mjs ou sectionConfigs)
  const sectionConfig = {
    ...(config.nonEssential || {}),
    // Incluir propriedades do nível raiz que são configurações de seção
    ...Object.keys(config).reduce((acc, key) => {
      // Incluir propriedades que começam com o nome de uma seção
      if (
        key.startsWith('statistics_') ||
        key.startsWith('recent_games_') ||
        key.startsWith('top_games_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'statistics':
        return (
          <Statistics
            key={section}
            data={data}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'recent_games':
        return (
          <RecentGames
            key={section}
            data={data}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'top_games':
        return (
          <TopGames
            key={section}
            data={data}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      default:
        return (
          <div key={section} className="text-muted">
            Section &quot;{section}&quot; not yet implemented
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}

