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

function InlineStats({ data }: { data: GithubRepoData }): React.ReactElement {
  return (
    <div className="flex items-center gap-6">
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

// "grid" (14 Repository Stats): quatro blocos com borda individual - Stars, Forks,
// Issues, Watchers. Sem contador de contribuidores (exigiria uma chamada REST extra
// só pra isso).
function GridStats({ data }: { data: GithubRepoData }): React.ReactElement {
  const items = [
    { label: "Stars", value: data.stargazerCount },
    { label: "Forks", value: data.forkCount },
    { label: "Issues", value: data.openIssuesCount },
    { label: "Watchers", value: data.watcherCount },
  ]
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-default-border p-3">
          <span className="block text-xl font-bold leading-none text-default-text">{abbreviateNumber(item.value)}</span>
          <span className="mt-1 block text-[10px] text-default-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Stats({ config, data, style = "default", size = "half" }: StatsProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  const title = config.stats_title ?? "Stats"
  const hideTitle = config.stats_hide_title ?? false
  const variant = config.stats_variant ?? "inline"
  const extraHeight = config.stats_height ?? 0

  return (
    <section id="github-repo-stats" style={{ paddingBottom: extraHeight || undefined }}>
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaStar />} />}
            {variant === "grid" ? <GridStats data={data} /> : <InlineStats data={data} />}
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
