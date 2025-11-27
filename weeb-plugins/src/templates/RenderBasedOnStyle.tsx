/**
 * Renderiza componente baseado no estilo (default ou terminal)
 */

import React from 'react'

interface RenderBasedOnStyleProps {
  style: 'default' | 'terminal'
  terminalComponent: React.ReactNode
  defaultComponent: React.ReactNode
}

export function RenderBasedOnStyle({
  style,
  terminalComponent,
  defaultComponent,
}: RenderBasedOnStyleProps): React.ReactElement {
  switch (style) {
    case 'default':
      // Wrap in fragment to ensure proper rendering
      return <>{defaultComponent}</>
    case 'terminal':
      return <>{terminalComponent}</>
    default:
      return <div>Unknown style: {style}</div>
  }
}

