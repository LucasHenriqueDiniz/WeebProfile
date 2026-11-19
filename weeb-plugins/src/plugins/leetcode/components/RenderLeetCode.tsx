import React from "react"
import type { LeetCodeConfig, LeetCodeData } from "../types"
import { Languages } from "./Languages"
import { Recent } from "./Recent"
import { Skills } from "./Skills"
import { Solved } from "./Solved"

interface RenderLeetCodeProps {
  config: LeetCodeConfig
  data: LeetCodeData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderLeetCode({
  config,
  data,
  style = "default",
  size = "half",
}: RenderLeetCodeProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  const renderedSections = config.sections.map((section) => {
    switch (section) {
      case "solved":
        return <Solved key="solved" solved={data.solved} config={config} style={style} size={size} />
      case "skills":
        return <Skills key="skills" data={data} config={config} style={style} size={size} />
      case "languages":
        return <Languages key="languages" data={data} config={config} style={style} size={size} />
      case "recent":
        return <Recent key="recent" data={data} config={config} style={style} size={size} />
      default:
        return null
    }
  })

  return <section id="leetcode-plugin">{renderedSections.filter(Boolean)}</section>
}
