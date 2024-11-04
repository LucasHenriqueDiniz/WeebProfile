import { FaHeart } from "react-icons/fa"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import { treatJapaneseName } from "source/helpers/string"
import Img64 from "core/src/base/ImageComponent"
import { CharacterFavorites } from "../types/malFavoritesResponse"
import React from "react"
import ErrorMessage from "source/templates/Error_Style"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import logger from "source/helpers/logger"

function DefaultCharacterFavorite({ character, index }: { character: CharacterFavorites; index: number }): JSX.Element {
  const imgSrc = character.images.jpg?.base64
  const name = treatJapaneseName(character.name)

  return (
    <div className="h-50 flex radius-16 overflow-hidden border-primary-50">
      <div className="favorite-index">{index + 1}</div>
      <div className="fav-character-title">{name}</div>
      <div className="character-favorite-image-container">
        <Img64 url64={imgSrc} alt={name} className="image-center" />
      </div>
    </div>
  )
}

function TerminalCharacterFavorite({
  character,
  index,
}: {
  character: CharacterFavorites
  index: number
}): JSX.Element {
  const name = treatJapaneseName(character.name)
  const url = character.url

  return (
    <div className="flex align-center sm-text gap-4">
      <span className="text-raw">[{index + 1}]</span>
      <a href={url ?? "#"} target="_blank" rel="noreferrer" className="text-warning md-2-text text-bold">
        - {name}
      </a>
    </div>
  )
}

function DefaultCharactersFavorites({ data }: { data: CharacterFavorites[] }): JSX.Element {
  logger({ message: `Fetching MAL favorites for characters`, level: "info", __filename })
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in DefaultCharactersFavorites component")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const hideTitle = myanimelist.character_favorites_hide_title
  const maxItems =
    myanimelist.character_favorites_max ?? (MAL_ENV_VARIABLES.character_favorites_max.defaultValue as number)
  const title =
    myanimelist.character_favorites_title ?? (MAL_ENV_VARIABLES.character_favorites_title.defaultValue as string)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems)
  }

  return (
    <section id="mal" className="characters-favorites">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title ?? "Favorite Characters"} icon={<FaHeart />} />}
            <div className="flex-d gap-4">
              {data.map((data, index) => (
                <DefaultCharacterFavorite character={data} index={index} key={data.mal_id} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "characters_favorites",
                username: myanimelist.username,
                limit: maxItems,
              })}
            />
            <div className="flex-d gap-4">
              {data.map((data, index) => (
                <TerminalCharacterFavorite character={data} index={index} key={data.mal_id} />
              ))}
            </div>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default DefaultCharactersFavorites
