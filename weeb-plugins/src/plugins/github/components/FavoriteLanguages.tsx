import React from "react"
import { FaCode } from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle.js"
import { HorizontalMultipleItemsBar } from "../../../templates/Default/HorizontalMultipleItemsBar.js"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle.js"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand.js"
import { TerminalHorizontalMultipleItemsBar } from "../../../templates/Terminal/TerminalHorizontalMultipleItems.js"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots.js"
import { abbreviateNumber } from "../../../utils/number.js"
import { getPseudoCommands } from "../../../utils/pseudo-commands.js"
import { randomColorWithString } from "../../../utils/string.js"
import type { GithubConfig, GithubData } from "../types.js"

interface FavoriteLanguagesProps {
  languageData: GithubData["languages"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

const DefaultFavoriteLanguages = ({
  data,
  totalSize,
  maxItems,
}: {
  data: GithubData["languages"]
  totalSize: number
  maxItems: number
}) => {
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

const TerminalFavoriteLanguages = ({
  data,
  totalSize,
  maxItems,
  size,
}: {
  data: GithubData["languages"]
  totalSize: number
  maxItems: number
  size: "half" | "full"
}) => {
  return (
    <div className="flex flex-col gap-1">
      <TerminalHorizontalMultipleItemsBar
        items={data.map((lang) => ({
          value: lang.size,
          style: { color: lang.color ?? randomColorWithString(lang.name) },
        }))}
        total={totalSize}
        size={size}
      />
      {data.slice(0, maxItems).map((lang) => {
        const percentage = ((lang.size / totalSize) * 100).toFixed(1)
        const langColor = lang.color ?? randomColorWithString(lang.name)
        return (
          <TerminalLineWithDots
            key={lang.name}
            title={`██ ${lang.name}`}
            value={`${percentage}% • ${abbreviateNumber(lang.size)} lines`}
            titleClassName="font-semibold"
            titleStyle={{ color: langColor }}
          />
        )
      })}
    </div>
  )
}

export function FavoriteLanguages({ languageData, config, style, size }: FavoriteLanguagesProps): React.ReactElement {
  if (!languageData || languageData.length === 0) {
    return <></>
  }

  // Filtrar linguagens ignoradas (case-insensitive)
  let filteredLanguages = [...languageData]
  if (config.favorite_languages_ignore_languages) {
    const ignoreLanguagesArray = config.favorite_languages_ignore_languages
      .split(",")
      .map((lang) => lang.trim().toLowerCase())
    filteredLanguages = filteredLanguages.filter((lang) => !ignoreLanguagesArray.includes(lang.name.toLowerCase()))
  }

  if (filteredLanguages.length === 0) {
    return <></>
  }

  const totalSize = filteredLanguages.reduce((acc, lang) => acc + lang.size, 0)
  const maxItems = config.favorite_languages_max_languages ?? 10
  const sortedLanguages = filteredLanguages.sort((a, b) => b.size - a.size)

  const title = (config.favorite_languages_title ?? "<qnt> Languages").replace(
    "<qnt>",
    sortedLanguages.length.toString()
  )
  const hideTitle = config.favorite_languages_hide_title ?? false

  return (
    <section id="github-favorite-languages">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLanguages data={sortedLanguages} totalSize={totalSize} maxItems={maxItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "favorite_languages",
                size,
              })}
            />
            <TerminalFavoriteLanguages data={sortedLanguages} totalSize={totalSize} maxItems={maxItems} size={size} />
          </>
        }
      />
    </section>
  )
}
