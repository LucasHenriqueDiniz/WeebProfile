import React from 'react'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import type { LyftaConfig, LyftaData } from '../types'
import { Exercises } from './Exercises'
import { LastWorkout } from './LastWorkout'
import { Overview } from './Overview'
import { RecentWorkouts } from './RecentWorkouts'
import { Statistics } from './Statistics'

interface RenderLyftaProps {
  config: LyftaConfig
  data: LyftaData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

/**
 * Renders the Lyfta plugin
 */
export function RenderLyfta({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderLyftaProps): React.ReactElement {
  // If not enabled or no data, return empty
  if (!config.enabled || !data) {
    return <></>
  }

  const sections = config.sections || []

  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'statistics':
        return (
          <Statistics
            key={section}
            data={data}
            config={config.nonEssential || {}}
            style={style}
            size={size}
          />
        )
      case 'recent_workouts':
        return (
          <RecentWorkouts
            key={section}
            data={data}
            config={config.nonEssential || {}}
            style={style}
            size={size}
          />
        )
      case 'exercises':
        return (
          <Exercises
            key={section}
            data={data}
            config={config.nonEssential || {}}
            style={style}
            size={size}
          />
        )
      case 'overview':
        return (
          <Overview
            key={section}
            data={data}
            config={config.nonEssential || {}}
            style={style}
            size={size}
          />
        )
      case 'last_workout':
        return (
          <LastWorkout
            key={section}
            data={data}
            config={config.nonEssential || {}}
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

