import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle.js"
import type { MyAnimeListConfig, MyAnimeListData } from "../types.js"
import { FavoritesList } from "./FavoritesList.js"
import { LastUpdates } from "./LastUpdates.js"
import { SimpleStatistics } from "./SimpleStatistics.js"
import { Statistics } from "./Statistics.js"
import { StatisticsHorizontalBar } from "./StatisticsHorizontalBar.js"

interface RenderMyAnimeListProps {
  config: MyAnimeListConfig
  data: MyAnimeListData
  style?: "default" | "terminal"
  size?: "half" | "full"
  hideTerminalEmojis?: boolean
}

export function RenderMyAnimeList({
  config,
  data,
  style = "default",
  size = "half",
  hideTerminalEmojis = false,
}: RenderMyAnimeListProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Renderizar cada seção solicitada
  const renderedSections = sections.map((section) => {
    switch (section) {
      case "statistics":
        return (
          <Statistics
            key="statistics"
            data={data.statistics}
            config={config}
            style={style}
            size={size}
            hideTerminalEmojis={hideTerminalEmojis}
          />
        )
      case "last_activity":
        return (
          <LastUpdates
            key="last_activity"
            data={data.last_updated}
            config={config}
            style={style}
            size={size}
            hideTerminalEmojis={hideTerminalEmojis}
          />
        )
      case "statistics_simple":
        return (
          <SimpleStatistics
            key="statistics_simple"
            data={data.statistics}
            config={config}
            style={style}
            size={size}
            hideTerminalEmojis={hideTerminalEmojis}
          />
        )
      case "anime_bar":
        return (
          <StatisticsHorizontalBar
            key="anime_bar"
            data={data.statistics.anime}
            config={config}
            style={style}
            size={size}
            isAnime={true}
          />
        )
      case "manga_bar":
        return (
          <StatisticsHorizontalBar
            key="manga_bar"
            data={data.statistics.manga}
            config={config}
            style={style}
            size={size}
            isAnime={false}
          />
        )
      case "anime_favorites":
        return (
          <FavoritesList
            key="anime_favorites"
            data={data.favorites_full.anime}
            type="anime"
            config={config}
            style={style}
            size={size}
            listStyle={config.anime_favorites_list_style || "detailed"}
          />
        )
      case "manga_favorites":
        return (
          <FavoritesList
            key="manga_favorites"
            data={data.favorites_full.manga}
            type="manga"
            config={config}
            style={style}
            size={size}
            listStyle={config.manga_favorites_list_style || "detailed"}
          />
        )
      case "people_favorites":
        return (
          <FavoritesList
            key="people_favorites"
            data={data.favorites.people}
            type="people"
            config={config}
            style={style}
            size={size}
            listStyle={config.people_favorites_list_style || "compact"}
          />
        )
      case "character_favorites":
        return (
          <FavoritesList
            key="character_favorites"
            data={data.favorites.characters}
            type="characters"
            config={config}
            style={style}
            size={size}
            listStyle={config.character_favorites_list_style || "compact"}
          />
        )
      default:
        return (
          <div key={section} className="text-muted">
            MyAnimeList Section &quot;{section}&quot; - Coming Soon
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}
