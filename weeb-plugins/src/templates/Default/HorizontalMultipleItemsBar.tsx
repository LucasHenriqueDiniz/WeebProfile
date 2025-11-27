/**
 * HorizontalMultipleItemsBar - Barra horizontal com múltiplos itens para estilo default
 */

import React from 'react'

export interface HorizontalMultipleItem {
  value: number
  className?: string
  style?: React.CSSProperties
}

interface HorizontalMultipleItemsBarProps {
  items: HorizontalMultipleItem[]
  total?: number
}

export function HorizontalMultipleItemsBar({ items, total }: HorizontalMultipleItemsBarProps): React.ReactElement {
  const totalValue = total || items.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="flex h-2.5 w-full rounded overflow-hidden">
      {items.map((item, index) => (
        <span
          {...(item.className ? { className: item.className } : {})}
          style={{ width: `${(item.value / totalValue) * 100}%`, ...(item.style ? item.style : {}) }}
          key={`${index}-${item.value}`}
        />
      ))}
    </div>
  )
}
