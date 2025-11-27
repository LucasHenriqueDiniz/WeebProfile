/**
 * TerminalHeader - Header do terminal com dots
 */

import React from 'react'

export function TerminalHeader(): React.ReactElement {
  return (
    <div className="terminal-header">
      <div className="terminal-header-dots">
        <span className="terminal-dot terminal-dot-red"></span>
        <span className="terminal-dot terminal-dot-yellow"></span>
        <span className="terminal-dot terminal-dot-green"></span>
      </div>
      <div className="terminal-header-title">Terminal</div>
    </div>
  )
}

