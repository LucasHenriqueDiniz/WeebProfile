/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { FaCode } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import logger from "source/helpers/logger"
import { abbreviateNumber } from "source/helpers/number"
import randomColorWithString from "source/helpers/string"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import HorizontalMultipleItemsBar from "source/templates/Default/DefaultHorizontalMultipleItems"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalHorizontalMultipleItemsBar from "source/templates/Terminal/TerminalHorizontalMultipleItems"
import TerminalLine from "source/templates/Terminal/TerminalLine"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import ENV_VARIABLES from "../ENV_VARIABLES"
import { ProcessedLanguage } from "../types/LanguagesData"
import { RepositoriesData } from "../types/RepositoryData"
import getPseudoCommands from "core/utils/getPseudoCommands"

interface LanguagesProps {
  data: ProcessedLanguage[]
  maxItems: number
  totalSize: number
}

const DefaultFavoriteLanguages = ({ data, totalSize, maxItems }: LanguagesProps) => {
  return (
    <div className="flex flex-col gap-1">
      <HorizontalMultipleItemsBar
        items={data.map((lang) => ({
          value: lang.size,
          style: { backgroundColor: lang.color ?? randomColorWithString(lang.name) },
        }))}
        total={totalSize}
      />

      {data.slice(0, maxItems).map((lang) => (
        <div key={lang.name} className="grid grid-cols-3 items-center">
          <span className="text-base flex items-center">
            <GoDotFill color={lang.color} className="mr-2" />
            {lang.name}
          </span>
          <span className="text-base flex items-center justify-end">{((lang.size / totalSize) * 100).toFixed(2)}%</span>
          <span className="text-base flex items-center justify-end">{abbreviateNumber(lang.size)} lines</span>
        </div>
      ))}
    </div>
  )
}

const TerminalFavoriteLanguages = ({ data, totalSize, maxItems }: LanguagesProps) => {
  return (
    <>
      <TerminalHorizontalMultipleItemsBar
        items={data.map((lang) => ({
          value: lang.size,
          style: { color: lang.color ?? randomColorWithString(lang.name) },
        }))}
        total={totalSize}
      />
      {data.slice(0, maxItems).map((lang) => (
        <span className="flex flex-col" key={lang.name}>
          <TerminalLine
            className={{ right: "mt-[0.25rem]" }}
            style={{ right: { color: lang.color ?? randomColorWithString(lang.name) } }}
            right={`██ ${lang.name}`}
            left={abbreviateNumber(lang.size)}
          />
        </span>
      ))}
    </>
  )
}

interface FavoriteLanguagesProps {
  languageData?: ProcessedLanguage[]
  repositoriesData?: RepositoriesData
}

const FavoriteLanguages = ({ languageData, repositoriesData }: FavoriteLanguagesProps) => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("GitHub plugin not found")

  logger({
    message: `FavoriteLanguages data: ${languageData ? "yes" : "no"} ${repositoriesData ? "yes" : "no"}`,
    level: "debug",
  })

  let processedLanguages = languageData

  if (!processedLanguages && repositoriesData) {
    logger({ message: "Processing languages from repositories data", level: "debug" })
    const languagesMap = new Map<string, { color: string; size: number }>()

    try {
      repositoriesData.repositories.forEach((repo) => {
        logger({
          message: `Processing repo: ${repo.name}`,
          level: "debug",
        })

        if (repo.languages?.edges) {
          repo.languages.edges.forEach((edge: any) => {
            const current = languagesMap.get(edge.node.name) || {
              color: edge.node.color,
              size: 0,
            }
            languagesMap.set(edge.node.name, {
              color: edge.node.color,
              size: current.size + edge.size,
            })
          })
        }
      })

      processedLanguages = Array.from(languagesMap.entries()).map(([name, data]) => ({
        name,
        color: data.color,
        size: data.size,
      }))

      logger({
        message: `Processed languages result: ${processedLanguages.length}`,
        level: "debug",
      })
    } catch (error) {
      logger({
        message: `Error processing languages: ${error}`,
        level: "error",
      })
    }
  }

  if (!processedLanguages || processedLanguages.length === 0) {
    logger({ message: "No language data available", level: "warn" })
    return null
  }

  // Filter ignored languages if specified
  const ignoreLanguages = github.favorite_languages_ignore_languages ?? false
  let filteredLanguages = [...processedLanguages]

  if (ignoreLanguages) {
    const ignoreLanguagesArray = ignoreLanguages.split(",").map((lang) => lang.trim())
    filteredLanguages = filteredLanguages.filter((lang) => !ignoreLanguagesArray.includes(lang.name))

    if (filteredLanguages.length === 0) {
      logger({ message: "No languages to display after ignoring", level: "warn" })
      return null
    }
  }

  const totalSize = filteredLanguages.reduce((acc, lang) => acc + lang.size, 0)
  const maxItems = github.favorite_languages_max_languages ?? 10

  filteredLanguages = filteredLanguages.sort((a, b) => b.size - a.size)

  const languageCount = filteredLanguages?.length ?? 0
  const title = (
    github.favorite_languages_title ?? (ENV_VARIABLES.favorite_languages_title.defaultValue as string)
  ).replace("<qnt>", languageCount.toString())
  const hideTitle = github.favorite_languages_hide_title

  return (
    <section id="github-favorite-languages">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLanguages data={filteredLanguages} totalSize={totalSize} maxItems={maxItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: "gh",
                plugin: "github",
                section: "languages",
                username: github.username,
              })}
            />
            <TerminalFavoriteLanguages data={filteredLanguages} totalSize={totalSize} maxItems={maxItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default FavoriteLanguages
