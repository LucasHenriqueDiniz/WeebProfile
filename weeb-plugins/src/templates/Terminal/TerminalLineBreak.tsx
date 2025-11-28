/**
 * TerminalLineBreak - Quebra de linha no terminal
 */

import React from 'react'

interface TerminalLineBreakProps {
  className?: string
}

export function TerminalLineBreak({ className }: TerminalLineBreakProps = {}): React.ReactElement {
  return <div className={`terminal-line-break ${className || ''}`}></div>
}

