/**
 * TerminalStatisticRow - Linha de estatísticas para estilo terminal
 * Similar ao StatisticRow do default, mas adaptado para terminal
 */

import React from 'react'

export interface TerminalStatisticRowProps {
  icon?: React.ReactElement | null
  title: string
  value: string
  strong?: boolean
}

export function TerminalStatisticRow({ rows, className }: { rows: TerminalStatisticRowProps[]; className?: string }): React.ReactElement {
  return (
    <div className={`flex flex-col gap-1 w-full ${className ?? ""}`}>
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-1"
          style={{
            fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
            fontSize: "0.875rem",
            lineHeight: "1.25rem"
          }}
        >
          {row.icon && (
            <span className="text-terminal-highlight flex-shrink-0">
              {row.icon}
            </span>
          )}
          <span className={`text-terminal-warning font-semibold truncate flex-1 ${row.strong ? 'font-bold' : ''}`}>
            {row.title}
          </span>
          <span className="text-terminal-muted whitespace-nowrap flex-shrink-0">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

