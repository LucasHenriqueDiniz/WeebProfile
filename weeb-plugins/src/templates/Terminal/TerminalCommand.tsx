/**
 * TerminalCommand - Exibe comando no estilo terminal Linux
 * Estilo autêntico de terminal com prompt destacado e comando em monospace
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
    <div 
      className={`flex items-center gap-2 px-1 py-0.5 text-nowrap overflow-ellipsis overflow-hidden ${className}`} 
      style={{
        fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
        fontSize: "0.875rem",
        lineHeight: "1.25rem"
      }}
    >
      <span 
        className="text-terminal-highlight font-bold select-none"
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem",
          fontWeight: 700
        }}
      >
        {prompt}
      </span>
      <span 
        className="font-medium"
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem",
          color: "var(--terminal-color-default)"
        }}
      >
        {command}
      </span>
    </div>
  )
}

