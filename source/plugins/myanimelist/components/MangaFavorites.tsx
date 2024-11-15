import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { FaBook, FaCalendar, FaHashtag, FaHeart, FaStar } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import ImageComponent from "source/templates/ImageComponent"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import DefaultTitle from "templates/Default/DefaultTitle"
import { DefaultTag, TerminalTag } from "templates/GenreTags"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { FullMangaFavorite } from "../types/malFavorites"

function DefaultFavoriteImage({
  favorite,
  isHalf,
  noSummary,
}: {
  favorite: FullMangaFavorite
  isHalf: boolean
  noSummary: boolean
}): JSX.Element {
  const imageUrl = favorite.image
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.start_year
  const synopsis = favorite.synopsis
  const chapters = favorite.chapters
  const genres = favorite.genres?.map((genre) => genre.name) ?? []
  if (isHalf) {
    genres.splice(4)
  }
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className={`flex ${noSummary ? "h-[75px]" : "h-[120px]"} overflow-hidden gap-4`}>
      <div className={`${noSummary ? "image-square-container-75 h-full" : "favorite-container"}`}>
        <ImageComponent
          url64={imageUrl}
          alt={title}
          className={noSummary ? "image-square" : "image-portrait"}
          width={75}
          height={noSummary ? 75 : 120}
        />
      </div>
      <div className="w-full flex flex-col justify-between overflow-hidden">
        <span className="text-lg font-semibold truncate text-default-muted">{title}</span>
        <div className="flex gap-2 items-baseline">
          {mean_score && (
            <span className="text-default-highlight font-bold flex items-center gap-1">
              <FaStar className="text-default-highlight" size={14} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="font-bold flex items-center gap-1">
              <FaHashtag size={14} className="text-default-highlight" />
              {popularity}
            </span>
          )}
          {chapters && (
            <span className="font-bold flex items-center gap-1">
              <FaBook size={14} className="text-default-highlight" />
              {chapters}
            </span>
          )}
          {release_year && (
            <span className="font-bold flex items-center gap-1">
              <FaCalendar size={14} className="text-default-highlight" />
              {release_year}
            </span>
          )}
          {status && (
            <span className={`font-bold flex items-center gap-1 half-mode:hidden`}>
              <GoDotFill
                size={14}
                color={`text-mal-${status === "Finished Airing" || status === "Finished" ? "complete" : "watching"}`}
              />
              {status}
            </span>
          )}
        </div>
        <div className="flex mt-1 gap-1">
          {genres.map((genre) => (
            <DefaultTag key={genre} text={genre} />
          ))}
        </div>
        {!noSummary && (
          <div className="w-full overflow-hidden mt-4">
            <span className="synopsis-text line-clamp-2">{synopsis}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TerminalFavoriteImage({
  favorite,
  noSummary,
}: {
  favorite: FullMangaFavorite
  noSummary: boolean
}): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()

  const isHalf = env.size === "half"
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.start_year
  const synopsis = favorite.synopsis
  const chapters = favorite.chapters
  const genres = favorite.genres?.map((genre) => genre.name) || []
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="mt-[0.5rem]">
      <div className="text-terminal-warning truncate">* {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-default-muted font-bold truncate">⭐{mean_score}</span>}
        {popularity && <span className="text-default-muted font-bold truncate"># {popularity}</span>}
        {chapters && <span className="text-default-muted font-bold truncate">📚 {chapters} ch&apos;s</span>}
        {release_year && <span className="text-default-muted font-bold truncate">📅 {release_year}</span>}
        {status && !isHalf && (
          <span className={`${status.toLowerCase().split(" ").join("-")} text-default-muted truncate`}>● {status}</span>
        )}
      </div>
      <div className="flex mt-2 gap-2">
        {genres.map((genre) => (
          <TerminalTag text={genre} key={genre} />
        ))}
      </div>
      {!noSummary && (
        <div className="w-full overflow-hidden mt-2">
          <span className="synopsis-text line-clamp-2">{synopsis}</span>
        </div>
      )}
    </div>
  )
}

function MangaFavorites({ data }: { data: FullMangaFavorite[] }): JSX.Element {
  logger({ message: `Fetching MAL favorites for manga`, level: "info", __filename })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const myanimelist = env.myanimelist
  if (!myanimelist) throw new Error("myanimelist not found in env variables")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const isHalf = env.size === "half"
  const title = myanimelist.manga_favorites_title ?? (MAL_ENV_VARIABLES.manga_favorites_title.defaultValue as string)
  const maxItems = myanimelist.manga_favorites_max ?? (MAL_ENV_VARIABLES.manga_favorites_max.defaultValue as number)
  const hideTitle = myanimelist.manga_favorites_hide_title
  const dataLength = data.length
  const noSummary =
    myanimelist.manga_favorites_no_summary ?? (MAL_ENV_VARIABLES.manga_favorites_no_summary.defaultValue as boolean)

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  return (
    <section id="mal-default-favorites-manga">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {data.map((data) => (
                <DefaultFavoriteImage favorite={data} key={data.mal_id} isHalf={isHalf} noSummary={noSummary} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "manga_favorites",
                username: myanimelist.username,
                limit: maxItems,
              })}
            />
            {data.map((data) => (
              <TerminalFavoriteImage favorite={data} key={data.mal_id} noSummary={noSummary} />
            ))}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default MangaFavorites
