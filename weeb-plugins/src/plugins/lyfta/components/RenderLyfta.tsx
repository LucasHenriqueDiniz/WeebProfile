/**
 * Main rendering component for the Lyfta plugin
 */

import React from 'react'
import type { LyftaConfig, LyftaData } from '../types'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { Statistics } from './Statistics'
import { RecentWorkouts } from './RecentWorkouts'

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

  return (
    <section id="lyfta-plugin">
      {sections.includes('statistics') && (
        <Statistics
          data={data}
          config={config.nonEssential || {}}
          style={style}
          size={size}
        />
      )}
      {sections.includes('recent_workouts') && (
        <RecentWorkouts
          data={data}
          config={config.nonEssential || {}}
          style={style}
          size={size}
        />
      )}
    </section>
  )
}

