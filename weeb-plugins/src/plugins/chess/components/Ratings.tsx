/**
 * Ratings - current and best rating per time control, and the games played in it.
 */

import React from "react"
import { FaBolt, FaChartLine, FaChessPawn, FaClock, FaEnvelope, FaHourglassHalf, FaPuzzlePiece } from "react-icons/fa"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatNumber } from "../../shared/utils/formatting"
import type { ChessConfig, ChessControl, ChessData, ChessRating } from "../types"
import { controlLabel, currentRating, hiddenTitle, showsBest, shownRatings } from "./shown"

/** Default rows are 24px, `gap-1` apart. */
export const RATING_ROW_HEIGHT = 24
export const RATING_ROW_GAP = 4

const ICONS: Record<ChessControl, React.ComponentType<{ style?: React.CSSProperties }>> = {
  bullet: FaChessPawn,
  blitz: FaBolt,
  rapid: FaClock,
  classical: FaHourglassHalf,
  daily: FaEnvelope,
  puzzle: FaPuzzlePiece,
}

interface RatingsProps {
  data: ChessData
  config: ChessConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function terminalValue(r: ChessRating, best: boolean): string {
  const parts = [currentRating(r)]
  if (best && r.best !== undefined) parts.push(`best ${r.best}`)
  if (r.games) parts.push(`${formatNumber(r.games)} ${r.control === "puzzle" ? "solved" : "games"}`)
  return parts.join(" · ")
}

function DefaultRows({
  data,
  rows,
  best,
}: {
  data: ChessData
  rows: ChessRating[]
  best: boolean
}): React.ReactElement {
  const cascade = useItemCascade(rows.length)
  return (
    <div
      className={withCascade("flex flex-col w-full", cascade)}
      style={{ gap: `${RATING_ROW_GAP}px`, ...cascade?.style }}
    >
      {rows.map((r) => {
        const Icon = ICONS[r.control]
        return (
          <div
            key={r.control}
            className="flex items-center gap-2 w-full overflow-hidden"
            style={{ height: `${RATING_ROW_HEIGHT}px`, lineHeight: `${RATING_ROW_HEIGHT}px`, fontSize: "0.875rem" }}
          >
            <span className="text-default-highlight flex-shrink-0 flex items-center">
              <Icon style={{ width: 14, height: 14 }} />
            </span>
            <span className="flex-1 truncate text-default">{controlLabel(r.control, data.platform)}</span>
            <span
              className="font-semibold text-default-highlight text-right flex-shrink-0"
              style={{ width: "3.75rem" }}
            >
              {r.rating === undefined ? currentRating(r) : <AnimatedNumber value={currentRating(r)} />}
            </span>
            {best && (
              <span
                className="text-default-muted text-right flex-shrink-0"
                style={{ width: "4.5rem", fontSize: "0.75rem" }}
              >
                {r.best === undefined ? "" : `best ${r.best}`}
              </span>
            )}
            <span
              className="text-default-muted text-right flex-shrink-0"
              style={{ width: "5.75rem", fontSize: "0.75rem" }}
            >
              {r.games ? `${formatNumber(r.games)} ${r.control === "puzzle" ? "solved" : "games"}` : ""}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function Ratings({ data, config, style = "default", size = "half" }: RatingsProps): React.ReactElement {
  const rows = shownRatings(data, config)
  if (rows.length === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.ratings_hide_title)
  const title = ne.ratings_title || "Chess Ratings"
  const best = showsBest(config)

  return (
    <section id="chess-ratings">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaChartLine />} />}
            <DefaultRows data={data} rows={rows} best={best} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "chess", section: "ratings", size })} />
            <CascadeGroup count={rows.length}>
              {rows.map((r) => (
                <TerminalLineWithDots
                  key={r.control}
                  title={controlLabel(r.control, data.platform)}
                  value={terminalValue(r, best)}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
