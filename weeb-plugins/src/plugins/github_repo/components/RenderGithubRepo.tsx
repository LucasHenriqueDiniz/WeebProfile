import React from "react"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { Banner } from "./Banner"
import { Insights } from "./Insights"

interface RenderGithubRepoProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Dispatcher: cada seção do config vira seu próprio bloco visual (Banner e Insights
// têm designs bem diferentes entre si - não reusam o padrão "header + card" genérico
// dos outros plugins), na mesma ordem em que aparecem em config.sections.
export function RenderGithubRepo({ config, data, style = "default", size = "half" }: RenderGithubRepoProps): React.ReactElement {
  if (!config.enabled || !data) {
    return <></>
  }

  return (
    <>
      {config.sections.map((section) => {
        switch (section) {
          case "banner":
            return <Banner key={section} config={config} data={data} style={style} size={size} />
          case "insights":
            return <Insights key={section} config={config} data={data} style={style} size={size} />
          default:
            return null
        }
      })}
    </>
  )
}
