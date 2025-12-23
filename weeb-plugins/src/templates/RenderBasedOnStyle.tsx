/**
 * Renderiza componente baseado no estilo (default ou terminal)
 * Automaticamente envolve o terminalComponent com TerminalBody apenas se wrapTerminalBody for true
 */

import React from 'react'
import { TerminalBody } from './Terminal/TerminalBody.js'

interface RenderBasedOnStyleProps {
  style: 'default' | 'terminal'
  terminalComponent: React.ReactNode
  defaultComponent: React.ReactNode
  wrapTerminalBody?: boolean // Controla se deve envolver com TerminalBody (padrão: false)
}

export function RenderBasedOnStyle({
  style,
  terminalComponent,
  defaultComponent,
  wrapTerminalBody = false,
}: RenderBasedOnStyleProps): React.ReactElement {
  switch (style) {
    case 'default':
      // Wrap in fragment to ensure proper rendering
      return <>{defaultComponent}</>
    case 'terminal':
      // Envolve com TerminalBody apenas se wrapTerminalBody for true
      // Isso evita múltiplos TerminalBody aninhados
      if (wrapTerminalBody) {
        return <TerminalBody>{terminalComponent}</TerminalBody>
      }
      return <>{terminalComponent}</>
    default:
      return <div>Unknown style: {style}</div>
  }
}

