import { FaHeart } from "react-icons/fa"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import { treatJapaneseName } from "source/helpers/string"
import Img64 from "core/src/base/ImageComponent"
import { PeopleFavorites } from "../types/malFavoritesResponse"
import React from "react"
import ErrorMessage from "source/templates/Error_Style"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import logger from "source/helpers/logger"

function DefaultPeopleFavorite({ person, index }: { person: PeopleFavorites; index: number }): JSX.Element {
  const imgSrc = person.image
  const name = treatJapaneseName(person.name)

  return (
    <div className="h-[50px] flex rounded-2xl overflow-hidden border border-primary-50 border-solid">
      <div className="w-20 bg-primary text-4xl font-bold flex items-center justify-center text-shadow">{index + 1}</div>
      <div className="flex items-center pl-2 text-2xl font-bold truncate text-shadow w-full">{name}</div>
      <div className="w-36 h-full aspect-character overflow-hidden">
        <Img64 url64={imgSrc} alt={name} className="image-square" />
      </div>
    </div>
  )
}

function TerminalPeopleFavorite({ person, index }: { person: PeopleFavorites; index: number }): JSX.Element {
  const name = treatJapaneseName(person.name)
  const url = person.url

  return (
    <div className="flex align-center sm-text gap-1">
      <span className="text-raw">[{index + 1}]</span>
      <a
        href={url ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="text-terminal-warning md-2-text text-bold truncate no-underline"
      >
        - {name}
      </a>
    </div>
  )
}

function MainPeopleFavorites({ data }: { data: PeopleFavorites[] }): JSX.Element {
  logger({ message: `Fetching MAL favorites for people`, level: "info", __filename })
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in DefaultPeopleFavorites component")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const hideTitle = myanimelist.people_favorites_hide_title
  const maxItems = myanimelist.people_favorites_max ?? (MAL_ENV_VARIABLES.people_favorites_max.defaultValue as number)
  const title = myanimelist.people_favorites_title ?? (MAL_ENV_VARIABLES.people_favorites_title.defaultValue as string)
  const dataLength = data.length

  // Limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  return (
    <section id="mal-people-favorites">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {data.map((data, index) => (
                <DefaultPeopleFavorite person={data} index={index} key={data.mal_id} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "people_fav",
                username: myanimelist.username,
                limit: maxItems,
              })}
            />
            <div className="flex flex-col gap-1">
              {data.map((data, index) => (
                <TerminalPeopleFavorite person={data} index={index} key={data.mal_id} />
              ))}
            </div>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default MainPeopleFavorites
