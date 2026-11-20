/**
 * Recent games - newest first: result, opponent, time control and date, each linking to
 * the game.
 */

import React from "react"
import { FaHistory } from "react-icons/fa"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLine } from "../../../templates/Terminal/TerminalLine"
import { ExternalLink } from "../../../utils/external-link"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { ChessConfig, ChessData, ChessGame } from "../types"
import { formatDate, hiddenTitle, RESULT_COLOR, RESULT_LETTER, shownRecentGames } from "./shown"

/** Default rows are 24px, `gap-1` apart; terminal lines are TerminalLine's 16px. */
export const RECENT_ROW_HEIGHT = 24
export const RECENT_ROW_GAP = 4
export const RECENT_TERMINAL_LINE_HEIGHT = 16

interface RecentGamesProps {
  data: ChessData
  config: ChessConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function opponent(game: ChessGame): string {
  const o = game.opponent
  return `${o.title ? `${o.title} ` : ""}${o.name}${o.rating ? ` (${o.rating})` : ""}`
}

function control(game: ChessGame): string {
  return game.control.replace(/([A-Z])/g, " $1").toLowerCase()
}

function DefaultRows({ games }: { games: ChessGame[] }): React.ReactElement {
  const cascade = useItemCascade(games.length)
  return (
    <div
      className={withCascade("flex flex-col w-full", cascade)}
      style={{ gap: `${RECENT_ROW_GAP}px`, ...cascade?.style }}
    >
      {games.map((game) => (
        <ExternalLink
          key={game.url}
          href={game.url}
          className="flex items-center gap-2 w-full overflow-hidden"
          style={{ height: `${RECENT_ROW_HEIGHT}px`, lineHeight: `${RECENT_ROW_HEIGHT}px` }}
        >
          <span
            className="rounded flex-shrink-0 flex items-center justify-center"
            style={{
              width: 20,
              height: 20,
              lineHeight: "20px",
              background: RESULT_COLOR[game.result],
              color: "#ffffff",
              fontSize: "0.6875rem",
              fontWeight: 700,
            }}
          >
            {RESULT_LETTER[game.result]}
          </span>
          <span className="flex-1 truncate text-default-highlight" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            <span className="text-default-muted font-normal">vs </span>
            {opponent(game)}
          </span>
          <span className="text-default-muted whitespace-nowrap flex-shrink-0" style={{ fontSize: "0.75rem" }}>
            {control(game)} · {formatDate(game.date)}
          </span>
        </ExternalLink>
      ))}
    </div>
  )
}

export function RecentGames({ data, config, style = "default", size = "half" }: RecentGamesProps): React.ReactElement {
  const games = shownRecentGames(data, config)
  if (games.length === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.recent_games_hide_title)
  const title = ne.recent_games_title || "Recent Games"

  return (
    <section id="chess-recent-games">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaHistory />} />}
            <DefaultRows games={games} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "chess", section: "recent_games", size })} />
            <CascadeGroup count={games.length}>
              {games.map((game) => (
                <TerminalLine
                  key={game.url}
                  href={game.url}
                  right={`${RESULT_LETTER[game.result]} vs ${opponent(game)}`}
                  left={`${control(game)} · ${formatDate(game.date)}`}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
