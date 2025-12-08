/**
 * Statistics component for Steam plugin
 */

import React from 'react'
import { FaSteam } from 'react-icons/fa'
import { ImageComponent } from '../../../utils/image'
import type { SteamData, SteamNonEssentialConfig } from '../types'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../utils/pseudo-commands'

interface StatisticsProps {
  data: SteamData
  config: SteamNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h`
}

export function Statistics({ data, config, style = 'default', size = 'half' }: StatisticsProps): React.ReactElement {
  if (!data || !data.statistics) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const title = config.statistics_title || 'Statistics'
  const stats = data.statistics

  return (
    <section id="steam-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaSteam />} />}

            {/* Profile Header with Avatar */}
            {data.playerSummary && (
              <div className="w-full overflow-hidden flex items-center gap-1.5 border-0 border-b border-default-highlight border-solid pb-0.5 my-1.5">
                {data.playerSummary.avatarfull && (
                  <img
                    src={data.playerSummary.avatarfull}
                    alt={`${data.playerSummary.personaname}'s avatar`}
                    width={45}
                    height={45}
                    className="rounded-full pb-0.5"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold">{data.playerSummary.personaname}</h2>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-3 half:gap-2.5">
              <div className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted">
                  Total Hours
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {formatPlaytime(stats.totalPlaytime)}
                </p>
                <p className="text-xs half:text-[10px] text-default-muted">
                  {stats.totalGames} games in library
                </p>
              </div>

              <div className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted">
                  Last 2 weeks
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {formatPlaytime(stats.recentPlaytime)}
                </p>
                <p className="text-xs half:text-[10px] text-default-muted">
                  Active games: {data.games.filter((g) => (g.playtime_2weeks || 0) > 0).length}
                </p>
              </div>
            </div>

            {/* Most Played Game */}
            {stats.favoriteGame && (
              <div className="relative overflow-hidden rounded-xl border border-default-border/50 min-h-[100px] half:min-h-[90px]">
                {(() => {
                  const favoriteGame = data.games.find((g) => g.name === stats.favoriteGame)
                  return favoriteGame?.header_image ? (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${favoriteGame.header_image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'top',
                          filter: 'blur(2px)',
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70" />
                      <div className="relative flex items-center gap-3 px-4 py-3 half:px-3 half:py-2.5 h-full">
                        {favoriteGame.img_icon_url && (
                          <div className="relative w-14 h-14 half:w-12 half:h-12 flex-shrink-0 overflow-hidden rounded border-2 border-white/30 bg-black/20">
                            <img
                              src={`https://media.steampowered.com/steamcommunity/public/images/apps/${favoriteGame.appid}/${favoriteGame.img_icon_url}.jpg`}
                              alt={`${favoriteGame.name} icon`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">
                            Most Played Game
                          </p>
                          <p className="text-base half:text-sm font-bold text-white truncate mb-1 drop-shadow-lg">
                            {stats.favoriteGame}
                          </p>
                          <p className="text-xs half:text-[10px] text-white/90 font-semibold drop-shadow">
                            {formatPlaytime(favoriteGame.playtime_forever)} total
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 half:px-3 half:py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-1">
                        Most Played Game
                      </p>
                      <p className="text-base half:text-sm font-bold text-default-foreground truncate">
                        {stats.favoriteGame}
                      </p>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'steam',
                section: 'statistics',
                size,
              })}
            />
            <TerminalLineWithDots title="Total Games" value={String(stats.totalGames)} />
            <TerminalLineWithDots title="Total Playtime" value={formatPlaytime(stats.totalPlaytime)} />
            <TerminalLineWithDots title="Recent Playtime" value={formatPlaytime(stats.recentPlaytime)} />
            {stats.favoriteGame && (
              <TerminalLineWithDots title="Favorite Game" value={stats.favoriteGame} />
            )}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

