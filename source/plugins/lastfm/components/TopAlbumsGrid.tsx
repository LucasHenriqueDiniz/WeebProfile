import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { MdAlbum } from "react-icons/md"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalGrid from "source/templates/Terminal/TerminalGrid"
import ImageGrid from "templates/Default/DefaultImageGrid"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { GridItemProps } from "templates/types"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastFmAlbum } from "../types/lastFmTypes"

interface Props {
  data: LastFmAlbum[]
  interval: string | undefined
}

function LastFmTopAlbumsGrid({ data, interval }: Props): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const lastfm = env.lastfm
  if (!lastfm) throw new Error("LastFM plugin not found in LastFmTopAlbumsGrid component")
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in LastFmTopAlbumsGrid component" />
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
    <section id="lastfm-top-albums">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<MdAlbum />} />
            )}
            <ImageGrid data={GridItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "top_albums",
                username: lastfm.username,
                period: interval,
                limit: maxItems,
              })}
            />
            <TerminalGrid data={GridItems} rightText="Album" leftText="Plays" />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default LastFmTopAlbumsGrid
