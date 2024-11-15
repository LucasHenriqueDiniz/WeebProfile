import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { AiOutlineTrophy } from "react-icons/ai"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalList from "source/templates/Terminal/TerminalList"
import List from "templates/Default/DefaultList"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { ListItemProps } from "templates/types"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { TopTrack } from "../types/lastFmTypes"

interface Props {
  data: TopTrack[]
  interval: string | undefined
}

function LastFmTopTracksList({ data, interval }: Props): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const lastfm = env.lastfm
  if (!lastfm) throw new Error("LastFM plugin not found in TopTracksList component")
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in LastFmTopTracksList component" />
  }
  const title = lastfm.top_tracks_title ?? (LASTFM_ENV_VARIABLES.top_tracks_title.defaultValue as string)
  const hideTitle = lastfm.top_tracks_hide_title
  const hideIntervals = lastfm.hide_intervals
  const customInterval = lastfm.top_tracks_interval_text?.trim()
  if (customInterval) {
    interval = customInterval
  }

  const maxItems = lastfm.top_tracks_max ?? (LASTFM_ENV_VARIABLES.top_tracks_max.defaultValue as number)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  const ListItems = data.map((track) => ({
    right: track.track,
    image: track.image,
    center: track.artist,
    left: abbreviateNumber(track.plays) + " plays",
  })) as ListItemProps[]

  return (
    <section id="lastfm-top-tracks">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<AiOutlineTrophy />} />
            )}
            <List data={ListItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "top_tracks",
                username: lastfm.username,
                period: interval,
                limit: maxItems,
              })}
            />
            <TerminalList data={ListItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default LastFmTopTracksList
