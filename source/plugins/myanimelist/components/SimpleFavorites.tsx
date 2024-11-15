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
import { AnyMalFavorite, AnyMalFavoriteUnique } from "../types/malFavorites"

interface DefaultSimpleFavoritesProps {
  data: AnyMalFavorite
  type: string
}

function FavoriteImage({
  favorite,
  hideOverlay,
}: {
  favorite: AnyMalFavoriteUnique
  hideOverlay: boolean
}): JSX.Element {
  const imageUrl = favorite.image
  const title = "name" in favorite ? treatJapaneseName(favorite.name) : favorite.title

  return (
    <div className="favorite-container relative">
      <ImageComponent
        url64={imageUrl}
        alt={title ?? "Name not found"}
        className="image-portrait"
        width={120}
        height={75}
      />
      {!hideOverlay && <div className="favorite-overlay">{title}</div>}
    </div>
  )
}

function RenderFavorites({
  data,
  hideOverlay,
}: {
  data: AnyMalFavorite
  hideOverlay: boolean | undefined
}): JSX.Element {
  return (
    <div className="grid grid-cols-10 half-mode:grid-cols-5 gap-4 half-mode:gap-2">
      {data.map((data) => (
        <FavoriteImage favorite={data} key={data.mal_id} hideOverlay={hideOverlay ?? false} />
      ))}
    </div>
  )
}

function SimpleFavorites({ data, type }: DefaultSimpleFavoritesProps): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const myanimelist = env.myanimelist
  logger({ message: `Fetching MAL favorites for ${type}`, level: "info", __filename })
  if (!myanimelist) throw new Error("MAL plugin not found in DefaultSimpleFavorites component")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  let maxItems: number
  let hideTitle: boolean
  let title: string
  const hideOverlay = myanimelist.favorites_hide_overlay

  switch (type) {
    case "anime":
      maxItems = myanimelist.anime_favorites_max ?? (MAL_ENV_VARIABLES.anime_favorites_max.defaultValue as number)
      hideTitle = myanimelist.anime_favorites_hide_title ?? false
      title = myanimelist.anime_favorites_title ?? (MAL_ENV_VARIABLES.anime_favorites_title.defaultValue as string)
      break
    case "manga":
      maxItems = myanimelist.manga_favorites_max ?? (MAL_ENV_VARIABLES.manga_favorites_max.defaultValue as number)
      hideTitle = myanimelist.manga_favorites_hide_title ?? false
      title = myanimelist.manga_favorites_title ?? (MAL_ENV_VARIABLES.manga_favorites_title.defaultValue as string)
      break
    case "people":
      maxItems = myanimelist.people_favorites_max ?? (MAL_ENV_VARIABLES.people_favorites_max.defaultValue as number)
      hideTitle = myanimelist.people_favorites_hide_title ?? false
      title = myanimelist.people_favorites_title ?? (MAL_ENV_VARIABLES.people_favorites_title.defaultValue as string)
      break
    default:
      maxItems =
        myanimelist.character_favorites_max ?? (MAL_ENV_VARIABLES.character_favorites_max.defaultValue as number)
      hideTitle = myanimelist.character_favorites_hide_title ?? false
      title =
        myanimelist.character_favorites_title ?? (MAL_ENV_VARIABLES.character_favorites_title.defaultValue as string)
  }

  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  return (
    <section id={`mal-simple-favorites-${type}`}>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <RenderFavorites data={data} hideOverlay={hideOverlay} />
          </>
        }
        terminalComponent={
          <>
            {!hideTitle && (
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: "mal",
                  section: "favorites",
                  username: "username",
                  type,
                  limit: maxItems,
                })}
              />
            )}
            {data.map((data) => (
              <div className="truncate" key={data.mal_id}>
                <p className="sm-text font-semibold text-terminal-warning">
                  * {"name" in data ? treatJapaneseName(data.name) : data.title}
                </p>
                <p className="sm-text font-semibold text-overflow text-terminal-muted">
                  {"type" in data && "start_year" in data && `(${data.type}, ${data.start_year})`}
                </p>
              </div>
            ))}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default SimpleFavorites
