/**
 * TerminalLineWithDots - Linha terminal com título e valor separados por pontos
 * Estilo terminal Linux - texto alinhado na base, dots na mesma linha
 */

import React from 'react'

interface TerminalLineWithDotsProps {
  title: string | React.ReactNode
  value: string | number
  className?: string
  titleClassName?: string
  valueClassName?: string
  titleStyle?: React.CSSProperties
}

export function TerminalLineWithDots({ 
  title, 
  value,
  className = '',
  titleClassName = '',
  valueClassName = '',
  titleStyle
}: TerminalLineWithDotsProps): React.ReactElement {
  return (
    <div 
      className={`flex items-baseline gap-1 w-full overflow-hidden px-1 ${className}`}
      style={{
        fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
        fontSize: "0.875rem",
        lineHeight: "1.25rem"
      }}
    >
      <span 
        className={`font-semibold whitespace-nowrap truncate flex-shrink-0 ${titleClassName}`}
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem",
          color: "var(--terminal-color-warning, #ffaa00)",
          ...(titleStyle || {})
        }}
      >
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
      <span 
        className={`text-terminal-muted whitespace-nowrap pr-1 flex-shrink-0 ${valueClassName}`}
        style={{
          fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
          fontSize: "0.875rem"
        }}
      >
        {String(value)}
      </span>
    </div>
  )
}

