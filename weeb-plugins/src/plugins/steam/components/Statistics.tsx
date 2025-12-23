import React from 'react'
import { FaSteam, FaGamepad } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { SteamData, SteamNonEssentialConfig } from '../types.js'

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

function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  if (hours > 0) {
    return `${hours}h`
  }
  return `${minutes}m`
}

// Note: img_logo_url and img_icon_url from Steam API are often invalid
// We'll use header_image instead when available, or show a placeholder
function getSteamImageUrl(game: { appid: number; header_image?: string }): string | null {
  // Use header_image as a small thumbnail instead of broken icon URLs
  // We can create a smaller version or use the header directly
  return game.header_image || null
}

function getSteamCoverImageUrl(game: { appid: number; header_image?: string }): string | null {
  if (game.header_image) {
    return game.header_image
  }
  // Fallback: try to construct URL from appid
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_hero.jpg`
}

export function Statistics({ data, config, style = 'default', size = 'half' }: StatisticsProps): React.ReactElement {
  if (!data || !data.statistics) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const title = config.statistics_title || 'Statistics'
  const showFeatured = config.statistics_show_featured !== false // Default: true
  const stats = data.statistics
  const activeGames = data.games.filter((g) => (g.playtime_2weeks || 0) > 0)
  
  // Get featured game (most played in last 2 weeks)
  const featuredGame = activeGames.length > 0
    ? activeGames.sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))[0]
    : null

  return (
    <section id="steam-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaSteam />} />}

            {/* Profile Header */}
            {data.playerSummary && (
              <div className="w-full overflow-hidden flex items-center gap-3">
                {data.playerSummary.avatarfull && (
                  <img
                    src={data.playerSummary.avatarfull}
                    alt={`${data.playerSummary.personaname}'s avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 half:w-10 half:h-10 rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg half:text-base font-semibold text-default-fg">
                    {data.playerSummary.personaname}
                  </h2>
                  <p className="text-sm half:text-xs text-default-muted mt-0.5">
                    {stats.totalGames} jogos na biblioteca
                  </p>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-3 half:gap-2.5">
              <div className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted">
                  Horas totais
                </p>
                <p className="text-xl half:text-lg font-black text-default-highlight tabular-nums">
                  {formatPlaytime(stats.totalPlaytime)}
                </p>
                <p className="text-xs half:text-[10px] text-default-muted">
                  Jogos na biblioteca: {stats.totalGames}
                </p>
              </div>

              <div className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted">
                  Últimas 2 semanas
                </p>
                <p className="text-xl half:text-lg font-black text-default-highlight tabular-nums">
                  {formatPlaytime(stats.recentPlaytime)}
                </p>
                <p className="text-xs half:text-[10px] text-default-muted">
                  Jogos ativos: {activeGames.length}
                </p>
              </div>
            </div>

            {/* Featured Game (Destaque recente) */}
            {showFeatured && featuredGame && (
              <div className="relative overflow-hidden rounded-xl border border-default-border/50 min-h-[120px] half:min-h-[100px]">
                {(() => {
                  const coverUrl = getSteamCoverImageUrl(featuredGame)
                  const imageUrl = getSteamImageUrl(featuredGame)
                  
                  return coverUrl ? (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${coverUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(2px)',
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70" />
                      <div className="relative flex items-center gap-4 px-4 py-4 half:px-3 half:py-3 h-full">
                        {imageUrl ? (
                          <div className="relative w-20 h-20 half:w-16 half:h-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/30 bg-black/20 shadow-lg">
                            <img
                              src={imageUrl}
                              alt={`${featuredGame.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative w-16 h-16 half:w-14 half:h-14 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/30 bg-black/20 flex items-center justify-center">
                            <FaGamepad className="h-8 w-8 half:h-6 half:w-6 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">
                            Destaque recente
                          </p>
                          <p className="text-base half:text-sm font-bold text-white truncate mb-1 drop-shadow-lg">
                            {featuredGame.name}
                          </p>
                          <div className="flex flex-col gap-0.5 text-xs half:text-[10px] text-white/90 font-semibold drop-shadow">
                            <p>
                              Últimas 2 semanas: {formatHours(featuredGame.playtime_2weeks || 0)}
                            </p>
                            <p>
                              Tempo total jogado: {formatPlaytime(featuredGame.playtime_forever)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-4 half:px-3 half:py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2">
                        Destaque recente
                      </p>
                      <div className="flex items-center gap-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={featuredGame.name}
                            className="w-20 h-20 half:w-16 half:h-16 rounded-lg object-cover border border-default-border/50"
                          />
                        ) : (
                          <div className="w-14 h-14 half:w-12 half:h-12 rounded-lg bg-default-muted/20 flex items-center justify-center">
                            <FaGamepad className="h-6 w-6 half:h-5 half:w-5 text-default-muted" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base half:text-sm font-bold text-default-fg truncate mb-1">
                            {featuredGame.name}
                          </p>
                          <div className="flex flex-col gap-0.5 text-xs half:text-[10px] text-default-muted">
                            <p>
                              Últimas 2 semanas: {formatHours(featuredGame.playtime_2weeks || 0)}
                            </p>
                            <p>
                              Tempo total jogado: {formatPlaytime(featuredGame.playtime_forever)}
                            </p>
                          </div>
                        </div>
                      </div>
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
            {data.playerSummary && (
              <TerminalLineWithDots title="Profile" value={data.playerSummary.personaname} />
            )}
            <TerminalLineWithDots title="Total Games" value={String(stats.totalGames)} />
            <TerminalLineWithDots title="Total Playtime" value={formatPlaytime(stats.totalPlaytime)} />
            <TerminalLineWithDots title="Recent Playtime" value={formatPlaytime(stats.recentPlaytime)} />
            {stats.favoriteGame && (
              <TerminalLineWithDots title="Favorite Game" value={stats.favoriteGame} />
            )}
          </>
        }
      />
    </section>
  )
}

