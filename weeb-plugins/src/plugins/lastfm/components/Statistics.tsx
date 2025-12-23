import React from 'react'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { ImageComponent } from '../../../utils/image.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { LastFmData } from '../types.js'

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

const DefaultFeaturedTrack = ({
  track,
}: { track: { track: string; artist: string; image?: string } }): React.ReactElement => {
  return (
    <div className="relative flex flex-col px-4 py-3 half:px-3 half:py-2.5 flex-1 min-w-0">      
      {/* Título TOP TRACK */}
      <p className="relative text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2.5 half:mb-2 flex items-center w-full">
        Top Track
      </p>
      
      {/* Avatar | Título */}
      <div className="relative flex items-center gap-3 half:gap-2.5">
        {track.image ? (
          <div className="relative image-square-container-50 half:image-square-container-50 flex-shrink-0">
            <ImageComponent
              url64={track.image}
              alt={track.track}
              className="image-square w-full h-full object-cover rounded-lg shadow-lg"
              width={50}
              height={50}
            />
          </div>
        ) : (
          <div className="relative h-[60px] w-[60px] half:h-[50px] half:w-[50px] flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl half:text-xl">🎵</span>
          </div>
        )}
        
        {/* Texto */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <p
            className="relative truncate text-base half:text-sm font-bold text-default-foreground leading-tight"
            title={track.track}
          >
            {track.track}
          </p>
          <p
            className="relative truncate text-sm half:text-xs text-default-muted font-medium"
            title={track.artist}
          >
            {track.artist}
          </p>
        </div>
      </div>
    </div>
  )
}

const DefaultStatistic = ({ title, value }: { title: string; value: string }): React.ReactElement => (
  <div className="relative flex flex-col items-center px-4 py-3 half:px-3 half:py-2.5 w-auto flex-shrink-0 overflow-hidden">
    
    <p className="relative text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2 half:mb-1.5 whitespace-nowrap">
      {title}
    </p>
    
    <p className="relative text-xl half:text-lg font-black text-default-foreground tabular-nums tracking-tight whitespace-nowrap">
      {abbreviateNumber(value)}
    </p>
  </div>
)

const TerminalFeaturedTrack = ({ track }: { track: { track: string; artist: string } }): React.ReactElement => {
  return (
    <div className="flex flex-col items-start w-full text-nowrap">
      <span className="font-semibold text-terminal-warning shrink-0">Top Track:</span>
      <span className="truncate text-terminal-muted-light">{`${track.track} by ${track.artist}`}</span>
    </div>
  )
}

export function Statistics({ data, config, style = 'default', size = 'half' }: StatisticsProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const hideFeaturedTrack = config.statistics_hide_featured_track || false
  const title = config.statistics_title || 'Statistics'

  return (
    <section id="lastfm-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}

            {/* Layout horizontal responsivo */}
            <div className="flex gap-4 half:gap-3 items-start w-full">
              {statisticsList.map(({ title, key }) => (
                <DefaultStatistic
                  key={key}
                  title={title}
                  value={String(data.statistics[key as keyof typeof data.statistics] || '0')}
                />
              ))}
              {!hideFeaturedTrack && data.featuredTrack && (
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
                value={abbreviateNumber(String(data.statistics[key as keyof typeof data.statistics] || '0'))}
              />
            ))}
            {!hideFeaturedTrack && data.featuredTrack && <TerminalFeaturedTrack track={data.featuredTrack} />}
          </>
        }
      />
    </section>
  )
}