import React from "react"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { Banner } from "./Banner"
import { Languages } from "./Languages"
import { StarGraph } from "./StarGraph"
import { Stats } from "./Stats"
import { Topics } from "./Topics"

interface RenderGithubRepoProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Dispatcher: cada seção do config vira seu próprio bloco visual, na mesma ordem em
// que aparecem em config.sections. Banner tem design próprio (não reusa o padrão
// "header + card" dos outros plugins); Stats/StarGraph/Languages/Topics são blocos
// independentes - alguém pode querer só o gráfico de estrelas sem o resto, por exemplo.
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
          case "stats":
            return <Stats key={section} config={config} data={data} style={style} size={size} />
          case "star_graph":
            return <StarGraph key={section} config={config} data={data} style={style} size={size} />
          case "languages":
            return <Languages key={section} config={config} data={data} style={style} size={size} />
          case "topics":
            return <Topics key={section} config={config} data={data} style={style} size={size} />
          default:
            return null
        }
      })}
    </>
  )
}
