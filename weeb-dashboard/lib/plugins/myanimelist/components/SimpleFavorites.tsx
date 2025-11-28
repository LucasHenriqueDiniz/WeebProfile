/**
 * SimpleFavorites - Componente para exibir favorites simples do MyAnimeList
 * 
 * Migrado do source original, adaptado para source-v2
 */

import React from 'react'
import { FaHeart } from 'react-icons/fa'
import { treatJapaneseName } from '../../../weeb-plugins/utils/string'
import { ImageComponent } from '../../../weeb-plugins/utils/image'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type {
  MyAnimeListConfig,
  AnyMalFavorite,
  AnyMalFavoriteUnique,
  BasicAnimeFavorite,
  BasicMangaFavorite,
} from '../types'

interface SimpleFavoritesProps {
  data: AnyMalFavorite
  type: 'anime' | 'manga' | 'people' | 'characters'
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

function FavoriteImage({
  favorite,
  hideOverlay,
}: {
  favorite: AnyMalFavoriteUnique
  hideOverlay: boolean
}): React.ReactElement {
  const imageUrl = favorite.image
  const title = 'name' in favorite ? treatJapaneseName(favorite.name) : favorite.title

  return (
    <div className="favorite-container relative">
      <ImageComponent
        url64={imageUrl}
        alt={title ?? 'Name not found'}
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
}): React.ReactElement {
  return (
    <div className="grid grid-cols-10 half-mode:grid-cols-5 gap-4 half-mode:gap-2">
      {data.map((item) => (
        <FavoriteImage favorite={item} key={item.mal_id} hideOverlay={hideOverlay ?? false} />
      ))}
    </div>
  )
}

export function SimpleFavorites({
  data,
  type,
  config,
  style,
  size,
}: SimpleFavoritesProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  let maxItems: number
  let hideTitle: boolean
  let title: string
  const hideOverlay = config.favorites_hide_overlay ?? false

  switch (type) {
    case 'anime':
      maxItems = config.anime_favorites_max ?? 10
      hideTitle = config.anime_favorites_hide_title ?? false
      title = config.anime_favorites_title || 'Anime Favorites'
      break
    case 'manga':
      maxItems = config.manga_favorites_max ?? 10
      hideTitle = config.manga_favorites_hide_title ?? false
      title = config.manga_favorites_title || 'Manga Favorites'
      break
    case 'people':
      maxItems = config.people_favorites_max ?? 10
      hideTitle = config.people_favorites_hide_title ?? false
      title = config.people_favorites_title || 'People Favorites'
      break
    default:
      maxItems = config.character_favorites_max ?? 10
      hideTitle = config.character_favorites_hide_title ?? false
      title = config.character_favorites_title || 'Character Favorites'
  }

  const dataLength = data.length
  let displayData = data

  // Limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    displayData = data.slice(0, maxItems) as AnyMalFavorite
  }

  return (
    <section id={`mal-simple-favorites-${type}`}>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <RenderFavorites data={displayData} hideOverlay={hideOverlay} />
          </>
        }
        terminalComponent={
          <>
            {!hideTitle && (
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: 'mal',
                  section: 'favorites',
                  username: config.username,
                  type,
                  limit: maxItems,
                })}
              />
            )}
            {displayData.map((item) => (
              <div className="truncate" key={item.mal_id}>
                <p className="sm-text font-semibold text-terminal-warning">
                  * {'name' in item ? treatJapaneseName(item.name) : item.title}
                </p>
                {'type' in item && 'start_year' in item && (
                  <p className="sm-text font-semibold text-overflow text-terminal-muted">
                    ({item.type}, {item.start_year})
                  </p>
                )}
              </div>
            ))}
            <TerminalLineBreak />
          </>
        }
        style={style}
      />
    </section>
  )
}



