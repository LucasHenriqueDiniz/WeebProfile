import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import type { MyAnimeListConfig, MyAnimeListData } from "../types"
import { FavoritesList } from "./FavoritesList"
import { LastUpdates } from "./LastUpdates"
import { SimpleStatistics } from "./SimpleStatistics"
import { Statistics } from "./Statistics"
import { StatisticsHorizontalBar } from "./StatisticsHorizontalBar"
import { PluginError } from '../../../components/PluginError'

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
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  // Verificar se há erro nos dados
  if ((data as any)._error) {
    return <PluginError
      pluginName="MyAnimeList"
      error={(data as any)._error}
      errorType="config"
      style={style}
      compact={true}
    />
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
          <div key="statistics_simple" style={{ border: '2px solid red', padding: '10px', margin: '5px' }}>
            <SimpleStatistics
              data={data.statistics}
              config={config}
              style={style}
              size={size}
              hideTerminalEmojis={hideTerminalEmojis}
            />
          </div>
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
          <div key="anime_favorites" style={{ border: '2px solid blue', padding: '10px', margin: '5px' }}>
            <FavoritesList
              data={data.favorites_full.anime}
              type="anime"
              config={config}
              style={style}
              size={size}
              listStyle={config.anime_favorites_list_style || "detailed"}
            />
          </div>
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
          <div key="character_favorites" style={{ border: '2px solid green', padding: '10px', margin: '5px' }}>
            <FavoritesList
              data={data.favorites.characters}
              type="characters"
              config={config}
              style={style}
              size={size}
              listStyle={config.character_favorites_list_style || "compact"}
            />
          </div>
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
