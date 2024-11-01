import { FaCode } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import DefaultTitle from "templates/Default/Default_Title"
import PercentageBar from "templates/Default/PercentageBarMultiple"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalGrid from "templates/Terminal/Terminal_Grid"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import { RepositoriesData } from "../types"
import React from "react"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import { abbreviateNumber } from "source/helpers/number"

const DefaultFavoriteLanguages = ({
  repositoriesData,
  maxLanguages: maxLanguages,
}: {
  repositoriesData: RepositoriesData
  maxLanguages: number
}) => {
  const { totalLanguages } = repositoriesData

  const totalSize = totalLanguages.reduce((sum, lang) => sum + lang.size, 0)
  const topLanguages = totalLanguages.sort((a, b) => b.size - a.size).slice(0, maxLanguages)

  return (
    <div className='flex-d gap-4'>
      <PercentageBar values={topLanguages} />

      {topLanguages.map((lang) => (
        <div key={lang.name} className='grid-col-3'>
          <span className='md-text flex items-center'>
            <GoDotFill color={lang.color} className='mr-2' />
            {lang.name}
          </span>
          <span className='md-text flex-center'>{((lang.size / totalSize) * 100).toFixed(2)}%</span>
          <span className='md-text flex-end'>{abbreviateNumber(lang.size)} lines</span>
        </div>
      ))}
    </div>
  )
}

const TerminalFavoriteLanguages = ({
  repositoriesData,
  maxLanguages: maxLanguages,
}: {
  repositoriesData: RepositoriesData
  maxLanguages: number
}) => {
  const { totalLanguages } = repositoriesData

  // Sort languages by size in descending order and take top 4
  const topLanguages = totalLanguages.sort((a, b) => b.size - a.size).slice(0, maxLanguages)

  const gridData = topLanguages.map((lang) => ({
    title: lang.name,
    value: `${abbreviateNumber(lang.size)} lines`,
  }))

  return <TerminalGrid data={gridData} rightText='Language' leftText='Lines of Code' />
}

const FavoriteLanguages = ({ repositoriesData }: { repositoriesData: RepositoriesData }) => {
  const { pluginGithub } = getEnvVariables()
  if (!pluginGithub) throw new Error("GitHub plugin not found")

  const title = pluginGithub.favorite_languages_title.replace(
    "<qnt>",
    repositoriesData.totalLanguages.length.toString()
  )
  const hideTitle = pluginGithub.favorite_languages_hide_title
  const maxLanguages = 4 // pluginGithub.favorite_languages_max_languages

  return (
    <section id='github' className='favorite-languages'>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLanguages repositoriesData={repositoriesData} maxLanguages={maxLanguages} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "favorite-languages",
                username: pluginGithub.username,
              })}
            />
            <TerminalFavoriteLanguages repositoriesData={repositoriesData} maxLanguages={maxLanguages} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default FavoriteLanguages
