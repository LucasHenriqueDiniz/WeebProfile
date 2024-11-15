import React from "react"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"

interface HorizontalMultipleItem {
  value: number
  className?: string
  style?: React.CSSProperties
}

const TerminalHorizontalMultipleItemsBar = ({
  items,
  total,
}: {
  items: HorizontalMultipleItem[]
  total?: number
}): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()

  const totalValue = total || items.reduce((acc, item) => acc + item.value, 0)
  const barWidth = env.size === "half" ? 49 : 99

  return (
    <>
      <div className="font-mono tracking-tighter text-center mx-1 overflow-hidden">
        {items.map((item, index) => (
          <span
            {...(item.className ? { className: item.className } : {})}
            style={{ ...(item.style ? item.style : {}) }}
            key={`${index}-${item.value}`}
          >
            {"█".repeat(Math.round((item.value / totalValue) * barWidth))}
          </span>
        ))}
      </div>
    </>
  )
}

export default TerminalHorizontalMultipleItemsBar
