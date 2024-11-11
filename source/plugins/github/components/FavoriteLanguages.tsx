import { FaCode } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import DefaultTitle from "templates/Default/Default_Title"
import PercentageBar from "templates/Default/PercentageBarMultiple"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalGrid from "source/templates/Terminal/TerminalGrid"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import { abbreviateNumber } from "source/helpers/number"
import ENV_VARIABLES from "../ENV_VARIABLES"
import { ProcessedLanguage } from "../types/LanguagesData.js"
import logger from "source/helpers/logger"

interface LanguagesProps {
  data: ProcessedLanguage[]
}

const DefaultFavoriteLanguages = ({ data }: LanguagesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <PercentageBar values={data} />

      {data.map((lang) => (
        <div key={lang.name} className="grid-cols-3">
          <span className="md-text flex items-center">
            <GoDotFill color={lang.color} className="mr-2" />
            {lang.name}
          </span>
          <span className="md-text flex items-center justify-end">{lang.percentage.toFixed(2)}%</span>
          <span className="md-text flex items-center justify-end">{abbreviateNumber(lang.size)} lines</span>
        </div>
      ))}
    </div>
  )
}

const TerminalFavoriteLanguages = ({ data }: { data: ProcessedLanguage[] }) => {
  const gridData = data.map((lang) => ({
    title: lang.name,
    value: `${abbreviateNumber(lang.size)} lines`,
  }))

  return <TerminalGrid data={gridData} rightText="Language" leftText="Lines of Code" />
}

const FavoriteLanguages = ({ data }: LanguagesProps) => {
  const { github } = getEnvVariables()
  if (!github) throw new Error("GitHub plugin not found")

  const title = (
    github.favorite_languages_title ?? (ENV_VARIABLES.favorite_languages_title.defaultValue as string)
  ).replace("<qnt>", data.length.toString())
  const hideTitle = github.favorite_languages_hide_title

  // Filter ignored languages if specified
  const ignoreLanguages = github.favorite_languages_ignore_languages ?? false
  let filteredLanguages = [...data]

  if (ignoreLanguages) {
    const ignoreLanguagesArray = ignoreLanguages.split(",").map((lang) => lang.trim())
    filteredLanguages = filteredLanguages.filter((lang) => !ignoreLanguagesArray.includes(lang.name))

    if (filteredLanguages.length === 0) {
      logger({ message: "No languages to display after ignoring", level: "warn" })
      return null
    }
  }

  return (
    <section id="github" className="favorite-languages">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLanguages data={filteredLanguages} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "favorite-languages",
                username: github.username,
              })}
            />
            <TerminalFavoriteLanguages data={filteredLanguages} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default FavoriteLanguages
