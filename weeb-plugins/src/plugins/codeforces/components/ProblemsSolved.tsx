/**
 * ProblemsSolved - Componente para exibir problemas resolvidos do Codeforces
 */

import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { CodeforcesConfig } from '../types'

interface ProblemsSolvedProps {
  total: number
  byDifficulty: Record<string, number>
  config: CodeforcesConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function ProblemsSolved({ total, byDifficulty, config, style = 'default', size = 'half' }: ProblemsSolvedProps): React.ReactElement {
  const hideTitle = config.nonEssential?.problems_solved_hide_title || false
  const title = config.nonEssential?.problems_solved_title || 'Problems Solved'

  const difficultyOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const sortedDifficulties = Object.entries(byDifficulty)
    .filter(([_, count]) => count > 0)
    .sort(([a], [b]) => {
      const aIndex = difficultyOrder.indexOf(a)
      const bIndex = difficultyOrder.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

  return (
    <section id="codeforces-problems-solved">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-start w-full">
              <div className="flex flex-col items-start w-full gap-2">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <p className="text-base font-semibold text-default-highlight">Total: {abbreviateNumber(total)}</p>
                </div>
                {sortedDifficulties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sortedDifficulties.map(([difficulty, count]) => (
                      <span key={difficulty} className="text-sm text-default-muted">
                        {difficulty}: {abbreviateNumber(count)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codeforces',
                section: 'problems_solved',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Total Problems Solved"
              value={abbreviateNumber(total)}
            />
            {sortedDifficulties.map(([difficulty, count]) => (
              <TerminalLineWithDots
                key={difficulty}
                title={`Difficulty ${difficulty}`}
                value={abbreviateNumber(count)}
              />
            ))}
          </>
        }
      />
    </section>
  )
}













