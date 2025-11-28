/**
 * TerminalLineWithDots - Linha terminal com título e valor separados por pontos
 */

import React from 'react'

interface TerminalLineWithDotsProps {
  title: string
  value: string | number
}

export function TerminalLineWithDots({ title, value }: TerminalLineWithDotsProps): React.ReactElement {
  return (
    <div className="terminal-line-with-dots">
      <span className="terminal-line-title">{title}</span>
      <span className="terminal-line-dots"></span>
      <span className="terminal-line-value">{value}</span>
    </div>
  )
}

