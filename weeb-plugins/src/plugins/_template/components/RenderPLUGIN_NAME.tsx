/**
 * Main rendering component for the PLUGIN_NAME plugin
 */

import React from 'react'
import type { PLUGIN_NAMEConfig, PLUGIN_NAMEData } from '../types'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'

interface RenderPLUGIN_NAMEProps {
  config: PLUGIN_NAMEConfig
  data: PLUGIN_NAMEData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

/**
 * Renders the PLUGIN_NAME plugin
 */
export function RenderPLUGIN_NAME({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderPLUGIN_NAMEProps): React.ReactElement {
  // If not enabled or no data, return empty
  if (!config.enabled || !data) {
    return <></>
  }

  return (
    <section id="PLUGIN_NAME-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {/* Implement your default rendering here */}
            <div>PLUGIN_NAME Plugin - Default Style</div>
          </>
        }
        terminalComponent={
          <>
            {/* Implement your terminal rendering here */}
            <div>PLUGIN_NAME Plugin - Terminal Style</div>
          </>
        }
      />
    </section>
  )
}
