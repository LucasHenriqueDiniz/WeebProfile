/**
 * Solved - problems solved by difficulty, against how many LeetCode has.
 */

import React from "react"
import { FaCheckCircle } from "react-icons/fa"
import { SiLeetcode } from "react-icons/si"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useAnimations, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatNumber } from "../../shared/utils/formatting"
import type { LeetCodeConfig, LeetCodeData, LeetCodeDifficulty } from "../types"
import { hiddenTitle } from "./shown"

/** The difficulty colours of leetcode.com, on the bars only: text stays in the theme. */
const DIFFICULTY_COLOR: Record<LeetCodeDifficulty, string> = {
  Easy: "#00b8a3",
  Medium: "#ffc01e",
  Hard: "#ef4743",
}

/** The total line, then one 20px row per difficulty, `gap-2` apart. */
export const SOLVED_TOTAL_HEIGHT = 24
export const SOLVED_ROW_HEIGHT = 20
export const SOLVED_ROW_GAP = 8

interface SolvedProps {
  solved: LeetCodeData["solved"]
  config: LeetCodeConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function share(solved: number, total: number): string {
  return `${total > 0 ? Math.min(100, (solved / total) * 100) : 0}%`
}

function DifficultyRows({ solved }: { solved: LeetCodeData["solved"] }): React.ReactElement {
  const animations = useAnimations()
  const cascade = useItemCascade(solved.byDifficulty.length)
  const countCh = Math.max(
    ...solved.byDifficulty.map((d) => `${formatNumber(d.solved)} / ${formatNumber(d.total)}`.length)
  )

  return (
    <div
      className={withCascade("flex flex-col w-full", cascade)}
      style={{ gap: `${SOLVED_ROW_GAP}px`, ...cascade?.style }}
    >
      {solved.byDifficulty.map((d) => (
        <div
          key={d.difficulty}
          className="flex items-center gap-2 w-full"
          style={{ height: `${SOLVED_ROW_HEIGHT}px`, lineHeight: `${SOLVED_ROW_HEIGHT}px`, fontSize: "0.875rem" }}
        >
          <span className="font-semibold text-default-highlight flex-shrink-0" style={{ width: "4.5rem" }}>
            {d.difficulty}
          </span>
          <span className="flex-1 h-2 rounded-sm overflow-hidden bg-default-15">
            <span
              className={`block h-full rounded-sm${animations ? " weeb-bar" : ""}`}
              style={{ width: share(d.solved, d.total), background: DIFFICULTY_COLOR[d.difficulty] }}
            />
          </span>
          <span
            className="text-default-muted whitespace-nowrap text-right flex-shrink-0"
            style={{ width: `${countCh + 1}ch` }}
          >
            <AnimatedNumber value={formatNumber(d.solved)} /> / {formatNumber(d.total)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Solved({ solved, config, style = "default", size = "half" }: SolvedProps): React.ReactElement {
  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.solved_hide_title)
  const title = ne.solved_title || "LeetCode Problems Solved"

  return (
    <section id="leetcode-solved">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<SiLeetcode />} />}
            <div className="flex flex-col w-full" style={{ gap: `${SOLVED_ROW_GAP}px` }}>
              <div className="flex items-center gap-2" style={{ height: `${SOLVED_TOTAL_HEIGHT}px` }}>
                <FaCheckCircle className="text-green-500" />
                <p className="text-base font-semibold text-default-highlight" style={{ lineHeight: "24px" }}>
                  <AnimatedNumber value={formatNumber(solved.total)} />
                  <span className="font-normal text-default-muted"> / {formatNumber(solved.questions)} solved</span>
                </p>
              </div>
              <DifficultyRows solved={solved} />
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "leetcode", section: "solved", size })} />
            <CascadeGroup count={solved.byDifficulty.length + 1}>
              <TerminalLineWithDots
                title="Solved"
                value={`${formatNumber(solved.total)} / ${formatNumber(solved.questions)}`}
              />
              {solved.byDifficulty.map((d) => (
                <TerminalLineWithDots
                  key={d.difficulty}
                  title={d.difficulty}
                  value={`${formatNumber(d.solved)} / ${formatNumber(d.total)}`}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
