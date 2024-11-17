import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { MdOutlinePersonOutline } from "react-icons/md"
import logger from "source/helpers/logger"
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
import { LastFmArtist } from "../types/lastFmTypes"

interface Props {
  data: LastFmArtist[]
  interval: string | undefined
}

function TopArtistsList({ data, interval }: Props): JSX.Element {
  logger({
    message: `Rendering TopArtistsList component`,
    level: "debug",
    __filename,
  })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const lastfm = env.lastfm
  if (!lastfm) throw new Error("LastFM plugin not found in TopArtistsList component")
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in TopArtistsList component" />
  }

  const title = lastfm.top_artists_title ?? (LASTFM_ENV_VARIABLES.top_artists_title.defaultValue as string)
  const hideTitle =
    lastfm.top_artists_hide_title ?? (LASTFM_ENV_VARIABLES.top_artists_hide_title.defaultValue as string)
  const hideIntervals = lastfm.hide_intervals
  const customInterval = lastfm.top_artists_interval_text?.trim()
  if (customInterval) {
    interval = customInterval
  }

  const maxItems = lastfm.top_artists_max ?? (LASTFM_ENV_VARIABLES.top_artists_max.defaultValue as number)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  const ListItems = data.map((artist) => ({
    right: artist.artist,
    image: artist.image,
    left: abbreviateNumber(artist.totalPlays) + " plays",
  })) as ListItemProps[]

  return (
    <section id="last-fm" className="top-artists">
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
            <List data={ListItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lastfm",
                section: "top_artists",
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

export default TopArtistsList
