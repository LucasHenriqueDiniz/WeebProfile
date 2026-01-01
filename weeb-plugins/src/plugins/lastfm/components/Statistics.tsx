import React from 'react'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { ImageComponent } from '../../../utils/image'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { PluginError } from '../../../components/PluginError'
import type { LastFmData } from '../types'

interface StatisticsProps {
  data: LastFmData
  config: {
    statistics_title?: string
    statistics_hide_title?: boolean
    statistics_hide_featured_track?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

const statisticsList = [
  { title: 'Scrobbles', key: 'totalScrobbles' },
  { title: 'Artists', key: 'totalArtists' },
]

const DefaultFeaturedTrack = ({ track }: { track: { track: string; artist: string; image?: string } }) => (
  <div className="flex flex-col rounded-xl border border-default-muted/30 bg-default-surface/60 px-4 py-3 half:px-3 half:py-2.5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted">
        Top Track
      </p>
    </div>

    <div className="flex items-center gap-3 half:gap-2.5 min-w-0">
      {track.image ? (
        <div className="h-[50px] w-[50px] flex-shrink-0 overflow-hidden rounded-lg border border-default-muted/40">
          <ImageComponent
            url64={track.image}
            alt={track.track}
            className="w-full h-full object-cover"
            width={50}
            height={50}
          />
        </div>
      ) : (
        <div className="h-[50px] w-[50px] flex-shrink-0 rounded-lg border border-default-muted/40 flex items-center justify-center">
          <span className="text-xl">🎵</span>
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <p className="truncate text-base half:text-sm font-bold text-default-text leading-tight" title={track.track}>
          {track.track}
        </p>
        <p className="truncate text-sm half:text-xs text-default-muted font-medium" title={track.artist}>
          {track.artist}
        </p>
      </div>
    </div>
  </div>
)

const DefaultStatistic = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col items-center rounded-xl border border-default-muted/30 bg-default-surface/60 px-4 py-3 half:px-3 half:py-2.5">

    <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-1.5 whitespace-nowrap">
      {title}
    </p>

    <p className="text-xl half:text-lg font-black text-default-text tabular-nums tracking-tight whitespace-nowrap">
      {abbreviateNumber(value)}
    </p>
  </div>
)

const TerminalFeaturedTrack = ({ track }: { track: { track: string; artist: string } }): React.ReactElement => {
  return (
    <div className="flex flex-col items-start w-full whitespace-nowrap">
      <span className="font-semibold text-terminal-warning shrink-0">Top Track:</span>
      <span className="truncate text-terminal-muted-light">{`${track.track} by ${track.artist}`}</span>
    </div>
  )
}

export function Statistics({ data, config, style = 'default', size = 'half' }: StatisticsProps): React.ReactElement {
  // Ensure we have valid data with defaults
  if (!data || typeof data !== 'object') {
    return <></>
  }

  const statistics = data.statistics || { totalScrobbles: '0', totalArtists: '0', lovedTracks: '0' }

  return (
    <section id="lastfm-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full flex flex-col gap-3 half:gap-2.5">
            {!config?.statistics_hide_title && <DefaultTitle title={config?.statistics_title || 'Music Statistics'} icon={<IoStatsChartOutline />} />}

            {/* Layout mais bonito e estável */}
            <div className="flex flex-col gap-3 half:gap-2.5">
              <div className="grid grid-cols-2 gap-3 half:gap-2.5">
                {statisticsList.map(({ title, key }) => (
                  <DefaultStatistic
                    key={key}
                    title={title}
                    value={String((statistics as any)?.[key] || '0')}
                  />
                ))}
              </div>

              {!config?.statistics_hide_featured_track && data?.featuredTrack && (
                <DefaultFeaturedTrack track={data.featuredTrack} />
              )}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lastfm',
                section: 'statistics',
                size,
              })}
            />
            {statisticsList.map(({ title, key }) => (
              <TerminalLineWithDots
                key={key}
                title={title}
                value={abbreviateNumber(String((statistics as any)?.[key] || '0'))}
              />
            ))}
            {!config?.statistics_hide_featured_track && data?.featuredTrack && <TerminalFeaturedTrack track={data.featuredTrack} />}
          </>
        }
      />
    </section>
  )
}