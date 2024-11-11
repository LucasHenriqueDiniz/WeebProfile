import { FaBook, FaCalendar, FaHashtag, FaHeart, FaStar } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import DefaultTitle from "templates/Default/Default_Title"
import { DefaultTag, TerminalTag } from "templates/GenreTags"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import Img64 from "core/src/base/ImageComponent"
import { MalFullMangaResponse } from "../types/malFavoritesResponse"
import React from "react"
import ErrorMessage from "source/templates/Error_Style"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import logger from "source/helpers/logger"

function DefaultFavoriteImage({
  favorite,
  isHalf,
  noSummary,
}: {
  favorite: MalFullMangaResponse
  isHalf: boolean
  noSummary: boolean
}): JSX.Element {
  const imageUrl = favorite.image
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.published.prop.from.year
  const synopsis = favorite.synopsis
  const chapters = favorite.chapters
  const genres = favorite.genres?.map((genre) => genre.name) ?? []
  if (isHalf) {
    genres.splice(4)
  }
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className={`flex ${noSummary ? "h-[80px]" : "h-[120px]"} overflow-hidden gap-4`}>
      <div className={`${noSummary ? "square-container h-full" : "favorite-container"}`}>
        <Img64 url64={imageUrl} alt={title} className={noSummary ? "image-square" : "image-portrait"} />
      </div>
      <div className="w-full flex flex-col justify-between overflow-hidden">
        <span className="text-lg font-bold truncate">{title}</span>
        <div className="flex gap-4 items-baseline">
          {mean_score && (
            <span className="text-primary font-bold flex items-center gap-1">
              <FaStar className="text-primary" size={14} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="font-bold flex items-center gap-1">
              <FaHashtag size={14} color="inherit" />
              {popularity}
            </span>
          )}
          {chapters && (
            <span className="font-bold flex items-center gap-1">
              <FaBook size={14} />
              {chapters}
            </span>
          )}
          {release_year && (
            <span className="font-bold flex items-center gap-1">
              <FaCalendar size={14} />
              {release_year}
            </span>
          )}
          {status && (
            <span
              className={`${status.toLowerCase().split(" ").join("-")} font-bold flex items-center gap-1 half-mode:hidden`}
            >
              <GoDotFill size={14} color="inherit" />
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
  favorite: MalFullMangaResponse
  noSummary: boolean
}): JSX.Element {
  const { size } = getEnvVariables()
  const isHalf = size === "half"
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.published.prop.from.year
  const synopsis = favorite.synopsis
  const chapters = favorite.chapters
  const genres = favorite.genres?.map((genre) => genre.name) || []
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="mt-[0.5rem]">
      <div className="text-terminal-warning truncate">* {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-primary-75 font-bold truncate">⭐{mean_score}</span>}
        {popularity && <span className="text-primary-75 font-bold truncate"># {popularity}</span>}
        {chapters && <span className="text-primary-75 font-bold truncate">📚 {chapters} ch&apos;s</span>}
        {release_year && <span className="text-primary-75 font-bold truncate">📅 {release_year}</span>}
        {status && !isHalf && (
          <span className={`${status.toLowerCase().split(" ").join("-")} text-primary-75 truncate`}>● {status}</span>
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

function MangaFavorites({ data }: { data: MalFullMangaResponse[] }): JSX.Element {
  logger({ message: `Fetching MAL favorites for manga`, level: "info", __filename })
  const { myanimelist, size } = getEnvVariables()
  if (!myanimelist) throw new Error("myanimelist not found in env variables")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const isHalf = size === "half"
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
