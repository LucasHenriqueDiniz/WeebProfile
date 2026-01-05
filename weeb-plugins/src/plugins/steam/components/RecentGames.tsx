import React from 'react'
import { FaClock } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { SteamData, SteamNonEssentialConfig } from '../types'

interface RecentGamesProps {
  data: SteamData
  config: SteamNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  if (hours > 0) {
    return `${hours}h`
  }
  return `${minutes}m`
}

// Note: img_logo_url and img_icon_url from Steam API are often invalid
// We'll use header_image instead when available
function getSteamImageUrl(game: { appid: number; header_image?: string }): string | null {
  return game.header_image || null
}

export function RecentGames({
  data,
  config,
  style = 'default',
  size = 'half',
}: RecentGamesProps): React.ReactElement {
  if (!data || !data.games || data.games.length === 0) {
    return <></>
  }

  const hideTitle = config.recent_games_hide_title || false
  const title = config.recent_games_title || 'Recently Played Games'
  const maxGames = config.recent_games_max || 5
  const displayStyle = config.recent_games_style || 'list'

  // Filter games with recent playtime (last 2 weeks)
  const recentGames = data.games
    .filter((game) => (game.playtime_2weeks || 0) > 0)
    .sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))
    .slice(0, maxGames)

  if (recentGames.length === 0) {
    return <></>
  }

  return (
    <section id="steam-recent-games">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}

            {displayStyle === 'compact' ? (
              <div className="grid grid-cols-4 gap-3 half:grid-cols-3 half:gap-2.5">
                {recentGames.map((game) => (
                  <div
                    key={game.appid}
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
                        {formatPlaytime(game.playtime_2weeks || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3 half:gap-2.5">
                {recentGames.map((game) => {
                  const gameIconUrl = getSteamImageUrl(game)
                  
                  return (
                    <div
                      key={game.appid}
                      className="relative overflow-hidden rounded-xl border border-default-border/50 min-h-[80px] half:min-h-[70px] group hover:border-default-highlight/50 transition-all"
                    >
                      {/* Background com blur */}
                      {game.header_image && (
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${game.header_image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(2px)',
                          }}
                        />
                      )}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9))',
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
                          <p className="text-sm half:text-xs font-bold text-white truncate mb-1">
                            {game.name}
                          </p>
                          <p className="text-xs half:text-[11px] text-white font-semibold">
                            {formatPlaytime(game.playtime_2weeks || 0)} in last 2 weeks
                          </p>
                        </div>
                      </div>
                    </div>
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
                plugin: 'steam',
                section: 'recent_games',
                size,
              })}
            />
            <TerminalGrid
              data={recentGames.map((game) => ({
                title: game.name,
                subtitle: formatPlaytime(game.playtime_2weeks || 0),
                value: formatPlaytime(game.playtime_forever),
              }))}
              leftText="Total"
              centerText="Recent"
              rightText="Game"
            />
          </>
        }
      />
    </section>
  )
}

