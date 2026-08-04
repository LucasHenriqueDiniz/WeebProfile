import React from "react"
import { PluginError } from "../../../components/PluginError"
import { Profile } from "./Profile"
import { RecentArticles } from "./RecentArticles"
import { TopTags } from "./TopTags"
import type { DevToConfig, DevToData } from "../types"

interface RenderDevToProps {
  config: DevToConfig
  data: DevToData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderDevTo({ config, data, style = "default", size = "half" }: RenderDevToProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  if (data?._error) {
    return <PluginError pluginName="Dev.to" error={data._error} errorType="config" style={style} compact={true} />
  }

  // As opções chegam tanto em nonEssential quanto na raiz do config, dependendo de
  // como o wizard montou o payload; achatar aqui evita que cada componente olhe nos
  // dois lugares.
  const merged = { ...config, ...(config.nonEssential || {}) } as DevToConfig

  const sections = config.sections.map((section) => {
    switch (section) {
      case "profile":
        return <Profile key={section} profile={data.profile} config={merged} style={style} size={size} />
      case "recent_articles":
        return <RecentArticles key={section} articles={data.recentArticles} config={merged} style={style} size={size} />
      case "top_tags":
        return <TopTags key={section} tags={data.topTags} config={merged} style={style} size={size} />
      default:
        return null
    }
  })

  return <section id="devto-plugin">{sections.filter(Boolean)}</section>
}
