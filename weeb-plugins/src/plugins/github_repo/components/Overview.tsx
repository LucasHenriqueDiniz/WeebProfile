import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { HlFillGradient } from "./StarGraph"
import { Card, Delta, DotSep, HL, LangDot, computeStarDelta, formatCount, starCoords } from "./redesign"

interface OverviewProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// "overview": card único - identidade + meta row + número gigante de stars + área de
// crescimento full-bleed no rodapé. Alternativa compacta a empilhar várias seções.
function DefaultOverview({ data }: { data: GithubRepoData }): React.ReactElement {
  const gradientId = React.useId()
  const delta = computeStarDelta(data.starHistory)
  const hasChart = data.starHistory.length >= 2
  const W = 415
  const H = 92
  const coords = hasChart ? starCoords(data.starHistory, W, H, 0.12) : []
  const line = hasChart ? `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}` : ""

  return (
    <Card className="flex flex-col">
      <div className="px-[18px] pb-2.5 pt-4">
        <div className="truncate text-[19px] font-semibold tracking-[-0.02em] text-default-text">
          <span className="font-normal text-default-muted">{data.owner.login} /</span> {data.name}
        </div>
        {data.description && (
          <div className="mt-1 truncate text-xs leading-normal text-default-muted">{data.description}</div>
        )}
        <div className="mt-2.5 flex items-center gap-3.5 text-xs text-default-muted">
          {data.primaryLanguage && (
            <>
              <span className="flex items-center gap-1.5">
                <LangDot color={data.primaryLanguage.color} />
                {data.primaryLanguage.name}
              </span>
              <DotSep />
            </>
          )}
          <span>
            <b className="font-semibold text-default-text">{formatCount(data.forkCount)}</b> forks
          </span>
          <DotSep />
          <span>
            <b className="font-semibold text-default-text">{formatCount(data.openIssuesCount)}</b> issues
          </span>
          {data.licenseInfo?.spdxId && (
            <>
              <DotSep />
              <span>{data.licenseInfo.spdxId}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-baseline justify-between px-[18px]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold leading-none tracking-[-0.02em] text-default-text">
            {formatCount(data.stargazerCount)}
          </span>
          <span className="text-xs text-default-muted">stars</span>
        </div>
        <Delta delta={delta} />
      </div>
      {hasChart && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-1.5 w-full"
          style={{ height: H }}
          aria-hidden="true"
        >
          <HlFillGradient id={gradientId} strength={0.2} />
          <path d={`${line} L ${W},${H} L 0,${H} Z`} fill={`url(#${gradientId})`} />
          <path d={line} fill="none" stroke={HL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Card>
  )
}

export function Overview({ config, data, style = "default", size = "half" }: OverviewProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  return (
    <section id="github-repo-overview">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={<DefaultOverview data={data} />}
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
