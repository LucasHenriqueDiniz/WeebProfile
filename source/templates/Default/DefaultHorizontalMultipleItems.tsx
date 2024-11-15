import React from "react"

interface HorizontalMultipleItem {
  value: number
  className?: string
  style?: React.CSSProperties
}

const HorizontalMultipleItemsBar = ({
  items,
  total,
}: {
  items: HorizontalMultipleItem[]
  total?: number
}): JSX.Element => {
  const totalValue = total || items.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="flex h-2.5 w-full rounded overflow-hidden">
      {items.map((item, index) => (
        <span
          {...(item.className ? { className: item.className } : {})}
          style={{ width: `${(item.value / totalValue) * 100}%`, ...(item.style ? item.style : {}) }}
          key={`${index}-${item}`}
        />
      ))}
    </div>
  )
}

export default HorizontalMultipleItemsBar
