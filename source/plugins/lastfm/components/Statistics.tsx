import getPseudoCommands from "core/utils/getPseudoCommands"
import { abbreviateNumber } from "helpers/number"
import React from "react"
import { IoStatsChartOutline } from "react-icons/io5"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import ImageComponent from "source/templates/ImageComponent"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineWithDots from "source/templates/Terminal/TerminalLineWithDots"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastFmData, LastFmFeaturedTrack } from "../types/lastFmTypes"

const statisticsList = [
  { title: "Scrobbles", key: "totalScrobbles" },
  { title: "Artists", key: "totalArtists" },
  // { title: "Loved Tracks", key: "lovedTracks" },
]

const DefaultFeaturedTrack = ({ track }: { track: LastFmFeaturedTrack }): JSX.Element => {
  return (
    <div className="flex items-center justify-center h-full w-full gap-1">
      <div className="flex flex-col items-start h-full justify-evenly w-full">
        <p className="font-bold">Top Track</p>
        <p className="truncate w-fit text-end text-sm">{track.track}</p>
        <p className="truncate w-fit text-end text-sm">{track.artist}</p>
      </div>
      <div className="image-square-container-60">
        <ImageComponent url64={track.image} alt={track.track} className="image-square" width={60} height={60} />
      </div>
    </div>
  )
}

const DefaultStatistic = ({ title, value }: { title: string; value: string }): JSX.Element => (
  <div className="text-center h-full">
    <h3 className="font-bold truncate">{title}</h3>
    <p className="uppercase">{abbreviateNumber(value)}</p>
  </div>
)

const TerminalFeaturedTrack = ({ track }: { track: LastFmFeaturedTrack }): JSX.Element => {
  return (
    <div className="flex flex-col items-start w-full text-nowrap">
      <span className="font-semibold text-terminal-warning shrink-0">Top Track:</span>
      <span className="truncate text-terminal-muted-light">{`${track.track} by ${track.artist}`}</span>
    </div>
  )
}

function LastFMStatistics({ data }: { data: LastFmData }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const lastfm = env.lastfm
  if (!lastfm) throw new Error("LastFM plugin not found in LastFMStatistics component")
  if (!data) return <ErrorMessage message="No data found in LastFMStatistics component" />

  const hideTitle = lastfm.statistics_hide_title
  const title = lastfm.statistics_title ?? (LASTFM_ENV_VARIABLES.statistics_title.defaultValue as string)

  return (
    <section id="lastfm-statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="grid grid-cols-[auto_auto_min-content] gap-1 h-full justify-between items-center w-full text-default-muted">
              {statisticsList.map(({ title, key }) => (
                <DefaultStatistic key={key} title={title} value={String(data[key])} />
              ))}
              {data.featuredTrack && <DefaultFeaturedTrack track={data.featuredTrack} />}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "statistics",
                username: lastfm.username,
              })}
            />
            {statisticsList.map(({ title, key }) => (
              <TerminalLineWithDots key={key} title={title} value={abbreviateNumber(String(data[key]))} />
            ))}
            {data.featuredTrack && <TerminalFeaturedTrack track={data.featuredTrack} />}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default LastFMStatistics
