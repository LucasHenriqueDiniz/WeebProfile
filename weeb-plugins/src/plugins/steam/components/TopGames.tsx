import React from "react"
import { FaTrophy } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { SteamData, SteamNonEssentialConfig } from "../types"
import { ExternalLink } from "../../../utils/external-link"
import { steamStoreUrl } from "../services/store-url"
import { formatPlaytime } from "../format-playtime"

interface TopGamesProps {
  data: SteamData
  config: SteamNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// A miniatura é quadrada, então quer o ícone quadrado -- não um recorte da capa
// larga, que cortava o logo no meio ("COUNTER STRIK", "DOT A"). O `img_icon_url` da
// API não era "invalid" como dizia o comentário antigo: é um hash, e a URL precisa
// ser montada (ver docs/steam-images.md). A capa continua como fundo do card.
function getSteamIconUrl(game: { icon_image?: string; header_image?: string }): string | null {
  return game.icon_image || game.header_image || null
}

export function TopGames({ data, config, style = "default", size = "half" }: TopGamesProps): React.ReactElement {
  const maxGames = config.top_games_max || 5

  // Get top games by total playtime
  const topGames = (data?.games ?? [])
    .filter((game) => game.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, maxGames)
  const cascade = useItemCascade(topGames.length)

  if (!data || !data.games || data.games.length === 0) {
    return <></>
  }

  const hideTitle = config.top_games_hide_title || false
  const title = config.top_games_title || "Most Played Games"
  const displayStyle = config.top_games_style || "list"

  if (topGames.length === 0) {
    return <></>
  }

  return (
    <section id="steam-top-games">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTrophy />} />}

            {displayStyle === "compact" ? (
              <div
                className={withCascade("grid grid-cols-4 gap-3 half:grid-cols-3 half:gap-2.5", cascade)}
                style={cascade?.style}
              >
                {topGames.map((game) => (
                  <ExternalLink
                    key={game.appid}
                    href={steamStoreUrl(game.appid)}
                    className="flex flex-col items-center gap-2 half:gap-1.5 group"
                  >
                    {game.header_image && (
                      <div className="relative w-full aspect-video overflow-hidden rounded-lg border-2 border-default-border/60 group-hover:border-default-highlight transition-all shadow-md group-hover:shadow-lg">
                        <img
                          src={game.header_image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="text-center w-full px-1">
                      <p className="text-xs half:text-[11px] font-bold text-default-text truncate w-full leading-tight mb-1">
                        {game.name}
                      </p>
                      <p className="text-[11px] half:text-[10px] text-default-highlight font-semibold">
                        {formatPlaytime(game.playtime_forever)}
                      </p>
                    </div>
                  </ExternalLink>
                ))}
              </div>
            ) : (
              <div className={withCascade("flex flex-col gap-3 half:gap-2.5", cascade)} style={cascade?.style}>
                {topGames.map((game) => {
                  const gameIconUrl = getSteamIconUrl(game)

                  return (
                    <ExternalLink
                      key={game.appid}
                      href={steamStoreUrl(game.appid)}
                      className="block relative overflow-hidden rounded-xl border border-default-border/50 min-h-[80px] half:min-h-[70px] group hover:border-default-highlight/50 transition-all"
                    >
                      {/* Background com blur */}
                      {game.header_image && (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${game.header_image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(2px)",
                          }}
                        />
                      )}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9))",
                        }}
                      />

                      {/* Conteúdo */}
                      <div className="relative flex items-center gap-3 px-4 py-3 half:px-3 half:py-2.5 h-full">
                        {gameIconUrl && (
                          <div className="relative w-14 h-14 half:w-12 half:h-12 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/50 bg-black/40 shadow-xl p-1">
                            <img
                              src={gameIconUrl}
                              alt={`${game.name} icon`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm half:text-xs font-bold text-white truncate mb-1">{game.name}</p>
                          <p className="text-xs half:text-[11px] text-white font-semibold">
                            {formatPlaytime(game.playtime_forever)} total
                          </p>
                        </div>
                      </div>
                    </ExternalLink>
                  )
                })}
              </div>
            )}
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "steam",
                section: "top_games",
                size,
              })}
            />
            <TerminalGrid
              data={topGames.map((game) => ({
                title: game.name,
                value: formatPlaytime(game.playtime_forever),
              }))}
              leftText="Playtime"
              rightText="Game"
            />
          </>
        }
      />
    </section>
  )
}
