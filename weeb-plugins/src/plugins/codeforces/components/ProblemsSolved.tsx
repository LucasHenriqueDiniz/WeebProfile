/**
 * ProblemsSolved - Componente para exibir problemas resolvidos do Codeforces
 */

import React from "react"
import { FaCheckCircle } from "react-icons/fa"
import { IoStatsChartOutline } from "react-icons/io5"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatNumber } from "../../shared/utils/formatting"
import type { CodeforcesConfig } from "../types"

/**
 * Columns of the breakdown grid, matching `grid-cols-10 half:grid-cols-5` below. A
 * fixed grid gives a row count calculateHeight can know; the wrapping row it replaced
 * spilled out of the section once the whole history brought nine or more groups.
 */
export const DIFFICULTY_COLUMNS = { half: 5, full: 10 } as const

interface ProblemsSolvedProps {
  total: number
  byDifficulty: Record<string, number>
  /** The total is a lower bound: it is shown with a trailing "+". */
  capped?: boolean
  config: CodeforcesConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function ProblemsSolved({
  total,
  byDifficulty,
  capped = false,
  config,
  style = "default",
  size = "half",
}: ProblemsSolvedProps): React.ReactElement {
  const hideTitle = config.nonEssential?.problems_solved_hide_title || false
  const title = config.nonEssential?.problems_solved_title || "Programming Problems Solved"
  // Exact, so the card reads the same number as the Codeforces profile.
  const totalLabel = `${formatNumber(total)}${capped ? "+" : ""}`

  const difficultyOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I+", "Other"]
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
                  <p className="text-base font-semibold text-default-highlight">Total: {totalLabel}</p>
                </div>
                {sortedDifficulties.length > 0 && (
                  <div className="grid grid-cols-10 half:grid-cols-5 gap-2 w-full">
                    {sortedDifficulties.map(([difficulty, count]) => (
                      <span key={difficulty} className="text-sm text-default-muted whitespace-nowrap">
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
                plugin: "codeforces",
                section: "problems_solved",
                size,
              })}
            />
            <TerminalLineWithDots title="Total Problems Solved" value={totalLabel} />
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
