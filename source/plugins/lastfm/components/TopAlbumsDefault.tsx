import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { MdAlbum } from "react-icons/md"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import DefaultGrid from "templates/Default/DefaultGrid"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalTree from "templates/Terminal/Terminal_Tree"
import { GridItemProps } from "templates/types"
import { LastFmAlbum } from "../types/lastFmTypes"
import { abbreviateNumber } from "source/helpers/number"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"

interface Props {
  data: LastFmAlbum[]
  interval: string | undefined
}

function LastFmTopAlbumsDefault({ data, interval }: Props): JSX.Element {
  const { lastfm } = getEnvVariables()
  if (!lastfm) throw new Error("LastFM plugin not found in LastFmTopAlbumsDefault component")
  if (!data || data.length === 0) {
    return <ErrorMessage message='No data found in LastFmTopAlbumsDefault component' />
  }

  const title = lastfm.top_albums_title ?? (LASTFM_ENV_VARIABLES.top_albums_title.defaultValue as string)
  const hideTitle = lastfm.top_albums_hide_title
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

  const GridItems = data.map((artist) => ({
    title: artist.album,
    image: artist.image,
    value: abbreviateNumber(artist.plays) + " plays",
  })) as GridItemProps[]

  return (
    <section id='last-fm' className='top-albums'>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<MdAlbum />} />
            )}
            <DefaultGrid data={GridItems} />
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
            <TerminalTree data={GridItems} title={title} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default LastFmTopAlbumsDefault
