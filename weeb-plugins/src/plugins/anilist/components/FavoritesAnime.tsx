import React from "react"
import { FaHeart } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLine } from "../../../templates/Terminal/TerminalLine"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { AniListConfig, AniListMedia } from "../types"
import { ExternalLink } from "../../../utils/external-link"
import { anilistAnimeUrl } from "../services/anime-url"

interface FavoritesAnimeProps {
  favorites: AniListMedia[]
  config: AniListConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** Mantido em sincronia com calculateHeight em index.tsx. */
export const FAVORITES_COLUMNS = { half: 5, full: 10 } as const
export const FAVORITES_COVER_HEIGHT = 120
export const FAVORITES_GAP = 8

export function FavoritesAnime({
  favorites,
  config,
  style = "default",
  size = "half",
}: FavoritesAnimeProps): React.ReactElement {
  const columns = FAVORITES_COLUMNS[size]
  const shown = (favorites ?? []).slice(0, config.favorites_anime_max ?? columns * 2)
  const cascade = useItemCascade(shown.length)

  // Sem favoritos não há o que mostrar, e devolver <></> aqui é o que mantém
  // calculateHeight em zero para a mesma entrada — a invariante coberta por
  // calculate-height.test.ts.
  if (!favorites || favorites.length === 0) return <></>

  const hideTitle = config.favorites_anime_hide_title === true || config.favorites_anime_hide_title === "true"
  const title = config.favorites_anime_title || "Favorite Anime"

  return (
    <section id="anilist-favorites-anime">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div
              className={withCascade("flex flex-wrap", cascade)}
              style={{ gap: `${FAVORITES_GAP}px`, ...cascade?.style }}
            >
              {shown.map((item) => (
                <ExternalLink
                  key={item.id}
                  href={anilistAnimeUrl(item.id)}
                  className="flex flex-col"
                  // The gaps come out of the row: a plain 1/columns width fit one cover
                  // less per row (4 in half) and wrapped the card past its height.
                  style={{ width: `calc((100% - ${(columns - 1) * FAVORITES_GAP}px) / ${columns})` }}
                >
                  {/* Capa ausente vira um bloco do mesmo tamanho: sem isso a grade
                      se desalinha e a altura real deixa de bater com a calculada. */}
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full object-cover rounded"
                      style={{ height: `${FAVORITES_COVER_HEIGHT}px` }}
                    />
                  ) : (
                    <div
                      className="w-full rounded bg-default-surface"
                      style={{ height: `${FAVORITES_COVER_HEIGHT}px` }}
                    />
                  )}
                </ExternalLink>
              ))}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "anilist", section: "favorites_anime", size })} />
            {/* left vazio: um favorito não tem valor à direita, só o título. */}
            <CascadeGroup count={shown.length}>
              {shown.map((item) => (
                <TerminalLine key={item.id} href={anilistAnimeUrl(item.id)} right={item.title} left="" />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
