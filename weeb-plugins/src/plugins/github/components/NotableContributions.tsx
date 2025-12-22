import React from 'react'
import { FaCode, FaCodeBranch, FaExclamationCircle } from 'react-icons/fa'
import { RiGitPullRequestLine } from 'react-icons/ri'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import type { GridItemProps } from '../../../templates/types'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface NotableContributionsProps {
  data: GithubData['notableContributions']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultNotableContributions = ({ data, max }: { data: GithubData['notableContributions']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No notable contributions</div>
  }

  const contributions = data.slice(0, max)

  const getIcon = (type: string) => {
    switch (type) {
      case 'commits':
        return <FaCode className="text-default-highlight" size={18} />
      case 'prs':
        return <RiGitPullRequestLine className="text-blue-500" size={18} />
      case 'issues':
        return <FaExclamationCircle className="text-yellow-500" size={18} />
      default:
        return <FaCodeBranch className="text-default-muted" size={18} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commits':
        return 'Commits'
      case 'prs':
        return 'Pull Requests'
      case 'issues':
        return 'Issues'
      default:
        return type
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {contributions.map((contribution, index) => (
        <a
          key={index}
          href={contribution.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 p-4 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200 group h-[100px]"
        >
          <div className="flex-shrink-0 mt-0.5">
            <div className="p-2 rounded-md bg-default-muted/10 group-hover:bg-default-muted/20 transition-colors">
              {getIcon(contribution.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-semibold text-base text-default-text truncate group-hover:text-default-highlight transition-colors">
                {contribution.repository}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-default-muted">
                <span className="text-sm font-medium">
                  {abbreviateNumber(contribution.contributions)} {getTypeLabel(contribution.type)}
                </span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export function GithubNotableContributions({ data, config, style, size }: NotableContributionsProps): React.ReactElement {
  const title = config.notable_contributions_title ?? 'Notable Contributions'
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
                plugin: 'github',
                section: 'notable_contributions',
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

