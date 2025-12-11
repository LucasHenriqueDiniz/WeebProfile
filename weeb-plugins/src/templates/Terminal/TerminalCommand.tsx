/**
 * TerminalCommand - Exibe comando no estilo terminal Linux
 */

import React from 'react'

interface TerminalCommandProps {
  command: string
  prompt?: string
  className?: string
}

export function TerminalCommand({ 
  command, 
  prompt = '$',
  className = ''
}: TerminalCommandProps): React.ReactElement {
  return (
    <div className={`flex gap-2 px-1 ${className}`}>
      <span className="text-terminal-highlight font-bold text-sm">{prompt}</span>
      <span className="text-sm font-medium">{command}</span>
    </div>
  )
}

