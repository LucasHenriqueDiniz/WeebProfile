/**
 * TerminalLineWithDots - Linha terminal com título e valor separados por pontos
 * Estilo terminal Linux - texto alinhado na base, dots na mesma linha
 */

import React from 'react'

interface TerminalLineWithDotsProps {
  title: string
  value: string | number
  className?: string
  titleClassName?: string
  valueClassName?: string
}

export function TerminalLineWithDots({ 
  title, 
  value,
  className = '',
  titleClassName = '',
  valueClassName = ''
}: TerminalLineWithDotsProps): React.ReactElement {
  return (
    <div className={`flex items-baseline gap-1 w-full overflow-hidden px-1 ${className}`}>
      <span className={`text-terminal-warning text-sm font-semibold whitespace-nowrap truncate flex-shrink-0 ${titleClassName}`}>
        {title}
      </span>
      <span 
        className="flex-1 h-px opacity-50 self-end mb-1"
        style={{
          background: `repeating-linear-gradient(
            to right,
            var(--terminal-color-muted) 0,
            var(--terminal-color-muted) 2px,
            transparent 2px,
            transparent 4px
          )`
        }}
      ></span>
      <span className={`text-terminal-muted text-sm whitespace-nowrap pr-1 flex-shrink-0 ${valueClassName}`}>
        {String(value)}
      </span>
    </div>
  )
}

