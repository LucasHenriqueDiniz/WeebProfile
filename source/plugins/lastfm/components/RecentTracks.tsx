import React from "react"
import { MdOutlineAudiotrack } from "react-icons/md"
import { LastFmTrack } from "../types/lastFmTypes"
import getPseudoCommands from "core/utils/getPseudoCommands"
import List from "templates/Default/Default_List"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalList from "templates/Terminal/Terminal_List"
import { ListItemProps } from "templates/types"
import ErrorMessage from "source/templates/Error_Style"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import logger from "source/helpers/logger"

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
  const { lastfm } = getEnvVariables()
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
    <section id="last-fm" className="recent-tracks">
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
            <List data={listItems} />
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
