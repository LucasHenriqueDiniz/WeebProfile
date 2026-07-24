import React from "react"
import { FaChartLine } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { StarSparkline } from "./StarSparkline"

interface StarGraphProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function StarGraph({ config, data, style = "default", size = "half" }: StarGraphProps): React.ReactElement {
  if (!config.enabled || !data || data.starHistory.length < 2) return <></>

  const title = config.star_graph_title ?? "Star growth"
  const hideTitle = config.star_graph_hide_title ?? false
  const accent = data.primaryLanguage?.color || "#8957e5"

  return (
    <section id="github-repo-star_graph">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaChartLine />} />}
            <div className="rounded-lg border border-default-border p-4">
              <StarSparkline points={data.starHistory} color={accent} />
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "star_graph", size })} />
            <div className="px-1 pb-1">
              <StarSparkline points={data.starHistory} color={accent} />
            </div>
          </>
        }
      />
    </section>
  )
}
