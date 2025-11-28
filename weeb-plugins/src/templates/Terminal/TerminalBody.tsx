/**
 * TerminalBody - Container para conteúdo terminal
 */

import React from 'react'

interface TerminalBodyProps {
  children: React.ReactNode
}

export function TerminalBody({ children }: TerminalBodyProps): React.ReactElement {
  return <div className="font-mono terminal-body">{children}</div>
}

