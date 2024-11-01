import { FaHeart } from "react-icons/fa"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import treatJapaneseName from "core/utils/treatJapaneseName"
import Img64 from "core/src/base/ImageComponent"
import { PeopleFavorites } from "../types/malFavoritesResponse"
import React from "react"
import ErrorMessage from "source/templates/Error_Style"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"

function DefaultPeopleFavorite({ person, index }: { person: PeopleFavorites; index: number }): JSX.Element {
  const imgSrc = person.images.jpg?.base64
  const name = treatJapaneseName(person.name)

  return (
    <div className='h-50 flex radius-16 overflow-hidden border-primary-50'>
      <div className='favorite-index'>{index + 1}</div>
      <div className='fav-character-title'>{name}</div>
      <div className='character-favorite-image-container'>
        <Img64 url64={imgSrc} alt={name} className='image-center' />
      </div>
    </div>
  )
}

function TerminalPeopleFavorite({ person, index }: { person: PeopleFavorites; index: number }): JSX.Element {
  const name = treatJapaneseName(person.name)
  const url = person.url

  return (
    <div className='flex align-center sm-text gap-4'>
      <span className='text-raw'>[{index + 1}]</span>
      <a href={url ?? "#"} target='_blank' rel='noreferrer' className='text-warning md-2-text text-bold'>
        - {name}
      </a>
    </div>
  )
}

function MainPeopleFavorites({ data }: { data: PeopleFavorites[] }): JSX.Element {
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in DefaultPeopleFavorites component")
  if (!data) return <ErrorMessage message='No data found in MalStatistics component' />

  const hideTitle = myanimelist.people_favorites_hide_title
  const maxItems = myanimelist.people_favorites_max ?? (MAL_ENV_VARIABLES.people_favorites_max.defaultValue as number)
  const title = myanimelist.people_favorites_title ?? (MAL_ENV_VARIABLES.people_favorites_title.defaultValue as string)
  const dataLength = data.length

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    console.log(`Limiting data to ${maxItems} items`)
    data = data.slice(0, maxItems)
  }

  return (
    <section id='mal' className='people-favorites'>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title ?? "Favorite People"} icon={<FaHeart />} />}
            <div className='flex-d gap-4'>
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
                section: "people_favorites",
                username: myanimelist.username,
                limit: maxItems,
              })}
            />
            <div className='flex-d gap-4'>
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
