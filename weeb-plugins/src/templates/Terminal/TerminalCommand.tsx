/**
 * TerminalCommand - Exibe comando no estilo terminal
 */

import React from 'react'

interface TerminalCommandProps {
  command: string
}

export function TerminalCommand({ command }: TerminalCommandProps): React.ReactElement {
  return (
    <div className="terminal-command">
      <span className="terminal-prompt">$</span>
      <span className="terminal-command-text">{command}</span>
    </div>
  )
}

