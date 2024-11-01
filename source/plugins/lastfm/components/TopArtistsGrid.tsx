import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { MdOutlinePersonOutline } from "react-icons/md"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import ImageGrid from "templates/Default/DefaultImageGrid"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalGrid from "templates/Terminal/Terminal_Grid"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import { GridItemProps } from "templates/types"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastFmArtist } from "../types/lastFmTypes"
import { abbreviateNumber } from "source/helpers/number"

interface Props {
  data: LastFmArtist[]
  interval: string | undefined
}

function TopArtistsGrid({ data, interval }: Props): JSX.Element {
  const { lastfm } = getEnvVariables()
  if (!lastfm) throw new Error("LastFM plugin not found in TopArtistsGrid component")
  if (!data || data.length === 0) {
    return <ErrorMessage message='No data found in TopArtistsGrid component' />
  }

  const title = lastfm.top_artists_title ?? (LASTFM_ENV_VARIABLES.top_artists_title.defaultValue as string)
  const hideTitle = lastfm.top_artists_hide_title
  const hideIntervals = lastfm.hide_intervals
  const customInterval = lastfm.top_artists_interval_text?.trim()
  if (customInterval) {
    interval = customInterval
  }
  const maxItems = lastfm.top_artists_max ?? (LASTFM_ENV_VARIABLES.top_artists_max.defaultValue as number)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    console.log(`Limiting data to ${maxItems} items`)
    data = data.slice(0, maxItems)
  }

  const GridItems = data.map((artist) => ({
    title: artist.artist,
    image: artist.image,
    value: abbreviateNumber(artist.totalPlays) + " plays",
  })) as GridItemProps[]

  return (
    <section id='last-fm' className='top-artists'>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : interval}
                icon={<MdOutlinePersonOutline />}
              />
            )}
            <ImageGrid data={GridItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "top_artists_default",
                username: lastfm.username,
                period: interval,
              })}
            />
            <TerminalGrid data={GridItems} rightText='Artist' leftText='Plays' />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default TopArtistsGrid
