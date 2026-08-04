import React from "react"
import { FaPlay } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { AniListConfig, AniListWatchingEntry } from "../types"

interface CurrentlyWatchingProps {
  entries: AniListWatchingEntry[]
  config: AniListConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** Mantido em sincronia com calculateHeight em index.tsx. */
export const WATCHING_ROW_HEIGHT = 56
export const WATCHING_ROW_GAP = 8

/** Séries em exibição não têm total; "12/?" é o que o AniList mostra nesse caso. */
const formatProgress = (entry: AniListWatchingEntry) =>
  `${entry.progress}/${entry.totalEpisodes === null ? "?" : entry.totalEpisodes}`

export function CurrentlyWatching({
  entries,
  config,
  style = "default",
  size = "half",
}: CurrentlyWatchingProps): React.ReactElement {
  // A lista pode ser privada, e nesse caso a API devolve vazio. A seção some em vez
  // de mostrar um bloco sem conteúdo -- e calculateHeight devolve zero para a mesma
  // entrada, que é a invariante verificada em calculate-height.test.ts.
  if (!entries || entries.length === 0) return <></>

  const hideTitle = config.currently_watching_hide_title === true || config.currently_watching_hide_title === "true"
  const title = config.currently_watching_title || "Currently Watching"
  const shown = entries.slice(0, config.currently_watching_max ?? 5)

  return (
    <section id="anilist-currently-watching">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaPlay />} />}
            <div className="flex flex-col" style={{ gap: `${WATCHING_ROW_GAP}px` }}>
              {shown.map((entry) => (
                <div key={entry.id} className="flex items-center gap-2 w-full">
                  {entry.cover && (
                    <img
                      src={entry.cover}
                      alt={entry.title}
                      className="object-cover rounded flex-shrink-0"
                      style={{ width: "40px", height: `${WATCHING_ROW_HEIGHT}px` }}
                    />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm truncate text-default-highlight">{entry.title}</p>
                    <p className="text-xs text-default-muted">{formatProgress(entry)} episodes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "anilist", section: "currently_watching", size })} />
            {shown.map((entry) => (
              <TerminalLineWithDots key={entry.id} title={entry.title} value={formatProgress(entry)} />
            ))}
          </>
        }
      />
    </section>
  )
}
