/**
 * TerminalBody - Container para conteúdo terminal
 */

import React from 'react'

interface TerminalBodyProps {
  children: React.ReactNode
  className?: string
}

export function TerminalBody({ children, className = '' }: TerminalBodyProps): React.ReactElement {
  return <div className={`font-mono terminal-container terminal-body ${className}`}>{children}</div>
}

