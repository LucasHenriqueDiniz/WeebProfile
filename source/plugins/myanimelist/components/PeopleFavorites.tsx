import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { FaHeart } from "react-icons/fa"
import logger from "source/helpers/logger"
import { treatJapaneseName } from "source/helpers/string"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import ImageComponent from "source/templates/ImageComponent"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { BasicPeopleFavorite } from "../types/malFavorites"

function DefaultPeopleFavorite({ person, index }: { person: BasicPeopleFavorite; index: number }): JSX.Element {
  const imgSrc = person.image
  const name = treatJapaneseName(person.name)

  return (
    <div className="h-[50px] flex rounded-2xl overflow-hidden border border-default-highlight border-solid">
      <div className="w-20 bg-default-highlight text-4xl font-bold flex items-center justify-center text-default-surface">
        {index + 1}
      </div>
      <div className="flex items-center pl-1 text-xl font-semibold truncate w-full text-default-hightlight">{name}</div>
      <div className="w-36 h-full aspect-character overflow-hidden">
        <ImageComponent url64={imgSrc} alt={name} className="image-square" width={144} height={144} />
      </div>
    </div>
  )
}

function TerminalPeopleFavorite({ person, index }: { person: BasicPeopleFavorite; index: number }): JSX.Element {
  const name = treatJapaneseName(person.name)

  return (
    <div className="flex align-center sm-text gap-1">
      <span className="text-raw">[{index + 1}]</span>
      <span className="text-terminal-warning md-2-text text-bold truncate no-underline">- {name}</span>
    </div>
  )
}

function MainPeopleFavorites({ data }: { data: BasicPeopleFavorite[] }): JSX.Element {
  logger({ message: `Fetching MAL favorites for people`, level: "info", __filename })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const myanimelist = env.myanimelist
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
