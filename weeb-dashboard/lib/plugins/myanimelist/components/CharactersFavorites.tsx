/**
 * CharactersFavorites - Componente para exibir favorites de personagens do MyAnimeList
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
import type { MyAnimeListConfig, BasicCharacterFavorite } from '../types'

interface CharactersFavoritesProps {
  data: BasicCharacterFavorite[]
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

function DefaultCharacterFavorite({
  character,
  index,
}: {
  character: BasicCharacterFavorite
  index: number
}): React.ReactElement {
  const img = character.image
  const name = treatJapaneseName(character.name)

  return (
    <div className="h-[50px] flex rounded-2xl overflow-hidden border border-default-highlight border-solid">
      <div className="w-20 bg-default-highlight text-4xl font-bold flex items-center justify-center text-default-surface">
        {index + 1}
      </div>
      <div className="flex items-center pl-1 text-xl font-semibold truncate w-full text-default-highlight">{name}</div>
      <div className="w-36 h-full aspect-character overflow-hidden">
        <ImageComponent url64={img} alt={name} className="image-square" width={144} height={144} />
      </div>
    </div>
  )
}

function TerminalCharacterFavorite({
  character,
  index,
}: {
  character: BasicCharacterFavorite
  index: number
}): React.ReactElement {
  const name = treatJapaneseName(character.name)

  return (
    <div className="flex align-center sm-text gap-1">
      <span className="text-terminal-raw">[{index + 1}]</span>
      <span className="text-terminal-warning md-2-text text-bold truncate no-underline">- {name}</span>
    </div>
  )
}

export function CharactersFavorites({
  data,
  config,
  style,
  size,
}: CharactersFavoritesProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const hideTitle = config.character_favorites_hide_title ?? false
  const maxItems = config.character_favorites_max ?? 10
  const title = config.character_favorites_title || 'Character Favorites'

  let displayData = data
  if (maxItems && data.length > maxItems) {
    displayData = data.slice(0, maxItems)
  }

  return (
    <section id="mal-characters-favorites">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {displayData.map((item, index) => (
                <DefaultCharacterFavorite character={item} index={index} key={item.mal_id} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'mal',
                section: 'characters_favorites',
                username: config.username,
                limit: maxItems,
              })}
            />
            <div className="flex flex-col gap-1">
              {displayData.map((item, index) => (
                <TerminalCharacterFavorite character={item} index={index} key={item.mal_id} />
              ))}
            </div>
            <TerminalLineBreak />
          </>
        }
        style={style}
      />
    </section>
  )
}



