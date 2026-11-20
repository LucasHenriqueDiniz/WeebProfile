import React from "react"
import type { ChessConfig, ChessData } from "../types"
import { Profile } from "./Profile"
import { Ratings } from "./Ratings"
import { RecentGames } from "./RecentGames"
import { Results } from "./Results"

interface RenderChessProps {
  config: ChessConfig
  data: ChessData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderChess({ config, data, style = "default", size = "half" }: RenderChessProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  const renderedSections = config.sections.map((section) => {
    switch (section) {
      case "profile":
        return <Profile key="profile" data={data} config={config} style={style} size={size} />
      case "ratings":
        return <Ratings key="ratings" data={data} config={config} style={style} size={size} />
      case "results":
        return <Results key="results" data={data} config={config} style={style} size={size} />
      case "recent_games":
        return <RecentGames key="recent_games" data={data} config={config} style={style} size={size} />
      default:
        return null
    }
  })

  return <section id="chess-plugin">{renderedSections.filter(Boolean)}</section>
}
