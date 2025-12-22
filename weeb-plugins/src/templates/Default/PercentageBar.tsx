/**
 * PercentageBar - Barra de progresso para estilo default
 */

import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { FiClock } from 'react-icons/fi'

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-mal-completed'
    case 'Plan to Watch':
      return 'bg-mal-plan-to-watch'
    case 'Plan to Read':
      return 'bg-mal-plan-to-read'
    case 'Watching':
      return 'bg-mal-watching'
    case 'Reading':
      return 'bg-mal-reading'
    case 'On Hold':
      return 'bg-mal-on-hold'
    case 'Dropped':
      return 'bg-mal-dropped'
    default:
      return 'bg-mal-watching'
  }
}

interface PercentageBarProps {
  current: number
  total: number
  status: string
}

export function PercentageBar({ current, total, status }: PercentageBarProps): React.ReactElement {
  let percentage = total > 0 ? (current / total) * 100 : 50
  const isCompleted = status === 'Completed'
  const isPlanTo = status === 'Plan to Watch' || status === 'Plan to Read'

  if (isCompleted) percentage = 100
  if (isPlanTo) percentage = -1

  return (
    <div className="w-full flex shadow-md bg-default-15 rounded-2xl h-[15px] relative">
      <span
        className={`${
          isCompleted || isPlanTo ? 'flex items-center justify-center' : 'flex items-center justify-end'
        } ${getStatusColor(status)} text-shadow text-center rounded-2xl text-sm`}
        style={{ width: `${isCompleted || isPlanTo ? 100 : percentage > 15 ? percentage : 15}%` }}
      >
        {isPlanTo ? (
          <FiClock />
        ) : isCompleted ? (
          <FaCheck />
        ) : (
          <span className="pr-2 font-bold">{current ? `${percentage.toFixed(0)}%` : '?'}</span>
        )}
      </span>
      {percentage < 97 && !isPlanTo && (
        <p className="flex items-center justify-end pr-2 text-sm text-center text-white/50 absolute right-0 h-full half:text-xs">
          {total === 0 ? '?' : total}
        </p>
      )}
    </div>
  )
}



