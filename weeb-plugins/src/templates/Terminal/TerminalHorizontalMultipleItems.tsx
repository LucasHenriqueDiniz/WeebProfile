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
  const barWidth = size === 'half' ? 49 : 99

  return (
    <div className="font-mono tracking-tighter text-center mx-1 overflow-hidden w-full">
      {items.map((item, index) => (
        <span
          {...(item.className ? { className: item.className } : {})}
          style={{ ...(item.style ? item.style : {}) }}
          key={`${index}-${item.value}`}
        >
          {'█'.repeat(Math.round((item.value / totalValue) * barWidth))}
        </span>
      ))}
    </div>
  )
}

