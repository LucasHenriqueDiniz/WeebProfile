import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { StarSparkline } from "./StarSparkline"

interface OverviewProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// "overview" (17 Compact Full Showcase): um único card combinando identidade, três
// métricas e mini-painéis de star growth + tecnologias - pensado como alternativa
// mais compacta a empilhar banner+stats+star_graph+languages como seções separadas.
function DefaultOverview({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const accent = data.primaryLanguage?.color || "#8957e5"
  const metrics = [
    { label: "Stars", value: data.stargazerCount },
    { label: "Forks", value: data.forkCount },
    { label: "Issues", value: data.openIssuesCount },
  ]
  const languages = data.languages.slice(0, config.overview_max_languages ?? 4)

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-default-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-xs text-default-muted">{data.owner.login} /</div>
          <div className="truncate text-lg font-bold text-default-text">{data.name}</div>
        </div>
        <div className="flex flex-shrink-0 gap-3 text-xs text-default-muted">
          <span>★ {abbreviateNumber(data.stargazerCount)}</span>
          <span>⑂ {abbreviateNumber(data.forkCount)}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[130px_1fr] gap-3">
        <div className="flex flex-col gap-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-default-border p-2.5">
              <span className="block text-base font-bold leading-none text-default-text">{abbreviateNumber(metric.value)}</span>
              <span className="mt-1 block text-[9px] text-default-muted">{metric.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-default-border p-2.5">
            <div className="mb-1.5 text-[9px] text-default-muted">STAR GROWTH</div>
            <StarSparkline points={data.starHistory} color={accent} variant="area" height={40} />
          </div>
          <div className="rounded-lg border border-default-border p-2.5">
            <div className="mb-1.5 text-[9px] text-default-muted">TECHNOLOGIES</div>
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              {languages.map((lang) => (
                <div key={lang.name} style={{ width: `${lang.percentage}%`, background: lang.color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export function Overview({ config, data, style = "default", size = "half" }: OverviewProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  return (
    <section id="github-repo-overview">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={<DefaultOverview data={data} config={config} />}
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "overview", size })} />
              <div className="flex items-center gap-4 px-1 py-1 text-sm">
                <span className="text-terminal-highlight font-bold">{data.nameWithOwner}</span>
                <span className="text-terminal-muted">★ {data.stargazerCount}</span>
                <span className="text-terminal-muted">⑂ {data.forkCount}</span>
                <span className="text-terminal-muted">issues {data.openIssuesCount}</span>
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
