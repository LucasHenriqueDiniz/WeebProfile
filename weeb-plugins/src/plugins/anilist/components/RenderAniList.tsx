import React from "react"
import { PluginError } from "../../../components/PluginError"
import { CurrentlyWatching } from "./CurrentlyWatching"
import { FavoritesAnime } from "./FavoritesAnime"
import { Statistics } from "./Statistics"
import type { AniListConfig, AniListData } from "../types"

interface RenderAniListProps {
  config: AniListConfig
  data: AniListData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderAniList({
  config,
  data,
  style = "default",
  size = "half",
}: RenderAniListProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  if (data?._error) {
    return <PluginError pluginName="AniList" error={data._error} errorType="config" style={style} compact={true} />
  }

  // As opções de seção chegam tanto em nonEssential quanto na raiz do config,
  // dependendo de como o wizard montou o payload; achatar aqui evita que cada
  // componente tenha de olhar nos dois lugares.
  const merged = {
    ...config,
    ...(config.nonEssential || {}),
  } as AniListConfig

  const sections = config.sections.map((section) => {
    switch (section) {
      case "statistics":
        return <Statistics key={section} statistics={data.statistics} config={merged} style={style} size={size} />
      case "favorites_anime":
        return (
          <FavoritesAnime key={section} favorites={data.favoritesAnime} config={merged} style={style} size={size} />
        )
      case "currently_watching":
        return (
          <CurrentlyWatching key={section} entries={data.currentlyWatching} config={merged} style={style} size={size} />
        )
      default:
        return null
    }
  })

  return <section id="anilist-plugin">{sections.filter(Boolean)}</section>
}
