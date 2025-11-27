/**
 * AnimeFavorites - Componente para exibir favorites completos de anime do MyAnimeList
 * 
 * Migrado do source original, adaptado para source-v2
 */

import React from 'react'
import { FaCalendar, FaHashtag, FaHeart, FaStar, FaVideo } from 'react-icons/fa'
import { GoDotFill } from 'react-icons/go'
import { ImageComponent } from '../../../weeb-plugins/utils/image'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { DefaultTag, TerminalTag } from '../../../weeb-plugins/templates/GenreTags'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type { MyAnimeListConfig, FullAnimeFavorite } from '../types'

interface AnimeFavoritesProps {
  data: FullAnimeFavorite[]
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

function DefaultFavoriteImage({
  favorite,
  isHalf,
  noSummary,
}: {
  favorite: FullAnimeFavorite
  isHalf: boolean
  noSummary: boolean
}): React.ReactElement {
  const imageUrl = favorite.image
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.year
  const synopsis = favorite.synopsis
  const num_episodes = favorite.episodes
  const genres = favorite.genres?.map((genre) => genre.name) ?? []
  const status = favorite.status
  const popularity = favorite.popularity

  if (isHalf) {
    genres.splice(4)
  }

  return (
    <div className={`flex ${noSummary ? 'h-[75px]' : 'h-[120px]'} overflow-hidden gap-4`}>
      <div className={`${noSummary ? 'image-square-container-75 h-full' : 'favorite-container'}`}>
        <ImageComponent
          url64={imageUrl}
          alt={title}
          className={noSummary ? 'image-square' : 'image-portrait'}
          width={75}
          height={noSummary ? 75 : 120}
        />
      </div>
      <div className="w-full flex flex-col justify-between overflow-hidden">
        <span className="text-lg font-semibold truncate text-default-muted">{title}</span>
        <div className="flex gap-2 items-baseline">
          {mean_score && (
            <span className="text-default-highlight font-semibold flex items-baseline gap-1">
              <FaStar className="text-default-highlight" size={14} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="font-semibold flex items-baseline gap-1">
              <FaHashtag size={14} className="text-default-highlight" />
              {popularity}
            </span>
          )}
          {num_episodes && (
            <span className="font-semibold flex items-baseline gap-1">
              <FaVideo size={14} className="text-default-highlight" />
              {num_episodes}
            </span>
          )}
          {release_year && (
            <span className="font-semibold flex items-baseline gap-1">
              <FaCalendar size={14} className="text-default-highlight" />
              {release_year}
            </span>
          )}
          {status && (
            <span className={`font-semibold flex items-baseline gap-1 half-mode:hidden`}>
              <GoDotFill
                size={14}
                className={`text-mal-${status === 'Finished Airing' || status === 'Finished' ? 'completed' : 'watching'}`}
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
  isHalf,
}: {
  favorite: FullAnimeFavorite
  noSummary: boolean
  isHalf: boolean
}): React.ReactElement {
  const title = favorite.title
  const mean_score = favorite.score
  const release_year = favorite.year
  const synopsis = favorite.synopsis
  const num_episodes = favorite.episodes
  const genres = favorite.genres?.map((genre) => genre.name) || []
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="mt-[0.5rem]">
      <div className="text-terminal-warning truncate">* {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-default-muted font-bold truncate">⭐{mean_score}</span>}
        {popularity && <span className="text-default-muted font-bold truncate"># {popularity}</span>}
        {num_episodes && <span className="text-default-muted font-bold truncate">🎞️ {num_episodes} EP&apos;s</span>}
        {release_year && <span className="text-default-muted font-bold truncate">📅 {release_year}</span>}
        {status && !isHalf && (
          <span
            className={`text-mal-${status === 'Finished Airing' || status === 'Finished' ? 'completed' : 'watching'} font-bold half-mode:hidden truncate`}
          >
            ● {status}
          </span>
        )}
      </div>
      <div className="flex mt-1 gap-1">
        {genres.map((genre) => (
          <TerminalTag text={genre} key={genre} />
        ))}
      </div>
      {!noSummary && (
        <div className="w-full overflow-hidden mt-2">
          <span className="synopsis-text line-clamp-2 truncate">{synopsis}</span>
        </div>
      )}
    </div>
  )
}

export function AnimeFavorites({ data, config, style, size }: AnimeFavoritesProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.anime_favorites_title || 'Anime Favorites'
  const maxItems = config.anime_favorites_max ?? 10
  const hideTitle = config.anime_favorites_hide_title ?? false
  const isHalf = size === 'half'
  const noSummary = config.anime_favorites_no_summary ?? false

  let displayData = data
  if (maxItems && data.length > maxItems) {
    displayData = data.slice(0, maxItems)
  }

  return (
    <section id="mal-default-favorites-anime">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {displayData.map((item) => (
                <DefaultFavoriteImage favorite={item} key={item.mal_id} isHalf={isHalf} noSummary={noSummary} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'mal',
                section: 'anime_favorites',
                username: config.username,
                limit: maxItems,
              })}
            />
            {displayData.map((item) => (
              <TerminalFavoriteImage favorite={item} key={item.mal_id} noSummary={noSummary} isHalf={isHalf} />
            ))}
            <TerminalLineBreak />
          </>
        }
        style={style}
      />
    </section>
  )
}



