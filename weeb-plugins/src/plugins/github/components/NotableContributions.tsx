import React from "react"
import { FaCode, FaCodeBranch, FaExclamationCircle } from "react-icons/fa"
import { RiGitPullRequestLine } from "react-icons/ri"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { useItemCascade, withCascade } from "../../../templates/animations"
import type { GridItemProps } from "../../../templates/types"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubConfig, GithubData } from "../types"
import { ExternalLink } from "../../../utils/external-link"

interface NotableContributionsProps {
  data: GithubData["notableContributions"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

const DefaultNotableContributions = ({ data, max }: { data: GithubData["notableContributions"]; max: number }) => {
  const cascade = useItemCascade(Math.min(data?.length ?? 0, max))
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No notable contributions</div>
  }

  const contributions = data.slice(0, max)

  const getIcon = (type: string) => {
    switch (type) {
      case "commits":
        return <FaCode className="text-default-highlight" size={14} />
      case "prs":
        return <RiGitPullRequestLine className="text-blue-500" size={14} />
      case "issues":
        return <FaExclamationCircle className="text-yellow-500" size={14} />
      default:
        return <FaCodeBranch className="text-default-muted" size={14} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "commits":
        return "Commits"
      case "prs":
        return "Pull Requests"
      case "issues":
        return "Issues"
      default:
        return type
    }
  }

  // One list: fixed 40px rows, a hairline between them (no gap, no card around each row).
  return (
    <div className={withCascade("flex flex-col", cascade)} style={cascade?.style}>
      {contributions.map((contribution, index) => (
        <ExternalLink
          key={index}
          href={contribution.repositoryUrl}
          className={`flex items-center gap-3 h-[40px] ${index > 0 ? "border-0 border-t border-solid border-default-border" : ""}`}
        >
          <div className="flex-shrink-0 p-1.5 rounded-md bg-default-muted/10 leading-none">
            {getIcon(contribution.type)}
          </div>
          <span className="flex-1 min-w-0 font-semibold text-sm text-default-text truncate">
            {contribution.repository}
          </span>
          <span className="flex-shrink-0 text-sm font-medium text-default-muted whitespace-nowrap">
            <AnimatedNumber value={abbreviateNumber(contribution.contributions)} /> {getTypeLabel(contribution.type)}
          </span>
        </ExternalLink>
      ))}
    </div>
  )
}

export function GithubNotableContributions({
  data,
  config,
  style,
  size,
}: NotableContributionsProps): React.ReactElement {
  const title = config.notable_contributions_title ?? "Notable Contributions"
  const hideTitle = config.notable_contributions_hide_title ?? false
  const max = config.notable_contributions_max ?? 10

  if (!data || data.length === 0) {
    return <></>
  }

  const contributions = data.slice(0, max)

  const gridData: GridItemProps[] = contributions.map((contribution) => ({
    title: contribution.repository,
    subtitle: contribution.type,
    value: `${contribution.contributions} contributions`,
  }))

  return (
    <section id="github-notable-contributions">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCodeBranch />} />}
            <DefaultNotableContributions data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "notable_contributions",
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Repository" centerText="Type" leftText="Contributions" />
          </>
        }
      />
    </section>
  )
}
