import React from "react"

export interface StatProps {
  title: string
  value: string
  strong?: boolean
  icon?: JSX.Element
  className?: string
  smallInHalf?: boolean
}

function Stat({ icon, title, value, strong, className, smallInHalf }: StatProps): JSX.Element {
  return (
    <li
      className={`flex justify-start gap-1 items-center truncate
        ${strong ? "text-base" : "text-sm"} 
        ${smallInHalf ? "half:text-sm" : ""} 
        ${className ?? ""}`}
    >
      {icon && icon}
      <span>{value}</span>
      <span>{title}</span>
    </li>
  )
}

interface StatisticsRowProps {
  icon: JSX.Element
  title: string
  value: string
  strong?: boolean
}

function StatisticRow({ rows, className }: { rows: StatisticsRowProps[]; className?: string }): JSX.Element {
  return (
    <ul className={`flex flex-col items-start w-full gap-1 ${className ?? ""}`}>
      {rows.map((row, index) => (
        <Stat key={index} title={row.title} value={row.value} icon={row.icon} strong={row.strong} />
      ))}
    </ul>
  )
}

export { Stat, StatisticRow }
