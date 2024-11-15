import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { MdOutlineAudiotrack } from "react-icons/md"
import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalList from "source/templates/Terminal/TerminalList"
import DefaultList from "templates/Default/DefaultList"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { ListItemProps } from "templates/types"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastFmTrack } from "../types/lastFmTypes"

interface Props {
  data: LastFmTrack[]
  interval?: string
}

function LastFMRecentTracks({ data, interval }: Props): JSX.Element {
  logger({
    message: `Rendering LastFMRecentTracks component`,
    level: "debug",
    __filename,
  })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const lastfm = env.lastfm
  if (!lastfm) throw new Error("LastFM plugin not found in LastFMRecentTracks component")
  if (!data) return <ErrorMessage message="No data found in LastFMRecentTracks component" />

  const title = lastfm.recent_tracks_title ?? (LASTFM_ENV_VARIABLES.recent_tracks_title.defaultValue as string)
  const hideTitle = lastfm.recent_tracks_hide_title
  const hideIntervals = lastfm.hide_intervals
  const maxItems = lastfm.recent_tracks_max ?? (LASTFM_ENV_VARIABLES.recent_tracks_max.defaultValue as number)

  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  const listItems = data.map((track) => ({
    right: track.track,
    center: track.artist,
    left: track.date,
    image: track.image,
  })) as ListItemProps[]

  return (
    <section id="lastfm-recent-tracks">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : interval}
                icon={<MdOutlineAudiotrack />}
              />
            )}
            <DefaultList data={listItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "recent_tracks",
                username: lastfm.username,
                period: interval,
                limit: maxItems,
              })}
            />
            <TerminalList data={listItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default LastFMRecentTracks
