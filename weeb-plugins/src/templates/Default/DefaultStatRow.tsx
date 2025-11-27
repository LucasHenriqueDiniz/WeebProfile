/**
 * DefaultStatRow - Linha de estatísticas para estilo default
 */

import React from 'react'

export interface StatProps {
  title: string
  value: string
  strong?: boolean
  icon?: React.ReactElement
  className?: string
  smallInHalf?: boolean
}

export function Stat({ icon, title, value, strong, className, smallInHalf }: StatProps): React.ReactElement {
  return (
    <li
      className={`flex justify-start gap-1 items-center truncate text-default-text w-full
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

export interface StatisticsRowProps {
  icon: React.ReactElement
  title: string
  value: string
  strong?: boolean
}

export function StatisticRow({ rows, className }: { rows: StatisticsRowProps[]; className?: string }): React.ReactElement {
  return (
    <ul className={`flex flex-col items-start w-full gap-1 ${className ?? ""}`}>
      {rows.map((row, index) => (
        <Stat key={index} title={row.title} value={row.value} icon={row.icon} strong={row.strong} />
      ))}
    </ul>
  )
}

