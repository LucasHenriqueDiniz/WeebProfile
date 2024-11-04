import React from "react"
import { MdAlbum } from "react-icons/md"
import getPseudoCommands from "core/utils/getPseudoCommands"
import List from "templates/Default/Default_List"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalList from "templates/Terminal/Terminal_List"
import { ListItemProps } from "templates/types"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastFmAlbum } from "../types/lastFmTypes"
import ErrorMessage from "source/templates/Error_Style"
import { abbreviateNumber } from "source/helpers/number"

interface Props {
  data: LastFmAlbum[]
  interval: string | undefined
}

function lastfmTopAlbumsList({ data, interval }: Props): JSX.Element {
  const { lastfm } = getEnvVariables()
  if (!lastfm) throw new Error("LastFM plugin not found in TopAlbumsList component")
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in lastfmTopAlbumsList component" />
  }

  const title = lastfm.top_albums_title ?? (LASTFM_ENV_VARIABLES.top_albums_title.defaultValue as string)
  const hideTitle = lastfm.top_albums_hide_title ?? (LASTFM_ENV_VARIABLES.top_albums_hide_title.defaultValue as string)
  const hideIntervals = lastfm.hide_intervals
  const customInterval = lastfm.top_albums_interval_text?.trim()
  if (customInterval) {
    interval = customInterval
  }

  const maxItems = lastfm.top_albums_max ?? (LASTFM_ENV_VARIABLES.top_albums_max.defaultValue as number)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  const ListItems = data.map((artist) => ({
    right: artist.album,
    image: artist.image,
    center: artist.artist,
    left: abbreviateNumber(artist.plays) + " plays",
  })) as ListItemProps[]

  return (
    <section id="last-fm" className="top-albums">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<MdAlbum />} />
            )}
            <List data={ListItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "top-albums",
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

export default lastfmTopAlbumsList
