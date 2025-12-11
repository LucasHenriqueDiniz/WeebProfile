/**
 * TerminalHeader - Header do terminal com dots
 */

import React from 'react'

interface TerminalHeaderProps {
  title?: string
  className?: string
}

export function TerminalHeader({ title = 'Terminal', className = '' }: TerminalHeaderProps): React.ReactElement {
  return (
    <div className={`terminal-header ${className}`}>
      <div className="terminal-header-dots">
        <span className="terminal-dot terminal-dot-red"></span>
        <span className="terminal-dot terminal-dot-yellow"></span>
        <span className="terminal-dot terminal-dot-green"></span>
      </div>
      <div className="terminal-header-title">{title}</div>
    </div>
  )
}

