/**
 * TerminalHeader - Header do terminal com dots
 */

import React from 'react'

interface TerminalHeaderProps {
  title?: string
  className?: string
}

export function TerminalHeader({
  title = 'weeb@profile:~',
  className = '',
}: TerminalHeaderProps): React.ReactElement {
  return (
    <div className={`terminal-header ${className}`}>
      <div className="terminal-header-dots">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
      </div>
      <div className="terminal-header-title text-overflow">
        {title}
      </div>
    </div>
  )
}

