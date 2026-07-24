import React from "react"
import { FaCodeBranch, FaStar } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

interface StatsProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function DefaultStats({ data }: { data: GithubRepoData }): React.ReactElement {
  return (
    <div className="flex items-center gap-6 rounded-lg border border-default-border p-4">
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-none text-default-text">{abbreviateNumber(data.stargazerCount)}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-default-muted">
          <FaStar className="fill-yellow-500 text-yellow-500" size={10} /> Stars
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-none text-default-text">{abbreviateNumber(data.forkCount)}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-default-muted">
          <FaCodeBranch size={10} /> Forks
        </span>
      </div>
    </div>
  )
}

export function Stats({ config, data, style = "default", size = "half" }: StatsProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  const title = config.stats_title ?? "Stats"
  const hideTitle = config.stats_hide_title ?? false

  return (
    <section id="github-repo-stats">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaStar />} />}
            <DefaultStats data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "stats", size })} />
            <div className="flex items-center gap-4 px-1 py-1 text-sm">
              <span className="text-terminal-highlight">⭐ {abbreviateNumber(data.stargazerCount)}</span>
              <span className="text-terminal-muted">🍴 {abbreviateNumber(data.forkCount)}</span>
            </div>
          </>
        }
      />
    </section>
  )
}
