/**
 * Results - wins, draws and losses over the standard time controls, as one bar.
 *
 * Not the profile's overall count: Lichess' includes the variants (penguingim1: 78,141
 * games overall, 54,811 in bullet, blitz, rapid, classical and correspondence), which
 * Chess.com's stats do not split the same way.
 */

import React from "react"
import { FaTrophy } from "react-icons/fa"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { HorizontalMultipleItemsBar } from "../../../templates/Default/HorizontalMultipleItemsBar"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatNumber } from "../../shared/utils/formatting"
import type { ChessConfig, ChessData, ChessResult } from "../types"
import { hiddenTitle, RESULT_COLOR, resultsTotal } from "./shown"

/** Default: the 24px total line, the 10px bar and the 20px legend, `gap-2` apart. */
export const RESULTS_HEIGHT = 24 + 8 + 10 + 8 + 20
/** Terminal: games, wins, draws, losses. */
export const RESULTS_TERMINAL_LINES = 4

const LABEL: Record<ChessResult, string> = { win: "wins", draw: "draws", loss: "losses" }
const ORDER: ChessResult[] = ["win", "draw", "loss"]

interface ResultsProps {
  data: ChessData
  config: ChessConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function percent(n: number, total: number): string {
  return `${Math.round((n / total) * 100)}%`
}

export function Results({ data, config, style = "default", size = "half" }: ResultsProps): React.ReactElement {
  const total = resultsTotal(data)
  if (total === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.results_hide_title)
  const title = ne.results_title || "Chess Results"
  const r = data.results

  return (
    <section id="chess-results">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTrophy />} />}
            <div className="flex flex-col w-full" style={{ gap: "8px" }}>
              <p
                className="text-default-highlight"
                style={{ fontSize: "1rem", lineHeight: "24px", height: "24px", fontWeight: 600 }}
              >
                <AnimatedNumber value={formatNumber(total)} />
                <span className="text-default-muted font-normal"> standard games · {percent(r.win, total)} won</span>
              </p>
              <HorizontalMultipleItemsBar
                total={total}
                items={ORDER.map((k) => ({ value: r[k], style: { background: RESULT_COLOR[k] } }))}
              />
              <div
                className="flex items-center gap-3 overflow-hidden text-default-muted"
                style={{ fontSize: "0.75rem", lineHeight: "20px", height: "20px" }}
              >
                {ORDER.map((k) => (
                  <span key={k} className="flex items-center gap-1 whitespace-nowrap">
                    <span
                      className="rounded-full flex-shrink-0"
                      style={{ width: 8, height: 8, background: RESULT_COLOR[k] }}
                    />
                    {formatNumber(r[k])} {LABEL[k]} ({percent(r[k], total)})
                  </span>
                ))}
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "chess", section: "results", size })} />
            <CascadeGroup count={RESULTS_TERMINAL_LINES}>
              <TerminalLineWithDots title="Standard games" value={formatNumber(total)} />
              {ORDER.map((k) => (
                <TerminalLineWithDots
                  key={k}
                  title={LABEL[k].charAt(0).toUpperCase() + LABEL[k].slice(1)}
                  value={`${formatNumber(r[k])} (${percent(r[k], total)})`}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
