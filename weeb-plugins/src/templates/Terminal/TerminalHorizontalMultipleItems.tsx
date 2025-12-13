/**
 * TerminalHorizontalMultipleItemsBar - Barra horizontal para terminal
 */

import React from 'react'

interface HorizontalMultipleItem {
  value: number
  className?: string
  style?: React.CSSProperties
}

interface TerminalHorizontalMultipleItemsBarProps {
  items: HorizontalMultipleItem[]
  total?: number
  size?: 'half' | 'full'
}

export function TerminalHorizontalMultipleItemsBar({
  items,
  total,
  size = 'full',
}: TerminalHorizontalMultipleItemsBarProps): React.ReactElement {
  const totalValue = total || items.reduce((acc, item) => acc + item.value, 0)
  // Limite fixo de caracteres: 58 para half (400px), 116 para full (800px)
  const maxChars = size === 'half' ? 58 : 116

  return (
    <div 
      className="font-mono tracking-tighter text-center mx-1 overflow-hidden w-full"
      style={{
        fontFamily: "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        padding: 0,
        margin: 0
      }}
    >
      {items.map((item, index) => {
        const blockCount = Math.round((item.value / totalValue) * maxChars)
        // Se for muito pequeno (menos de 1 caractere), não renderiza
        if (blockCount < 1) {
          return null
        }
        return (
          <span
            {...(item.className ? { className: item.className } : {})}
            style={{ ...(item.style ? item.style : {}) }}
            key={`${index}-${item.value}`}
          >
            {'█'.repeat(blockCount)}
          </span>
        )
      })}
    </div>
  )
}

