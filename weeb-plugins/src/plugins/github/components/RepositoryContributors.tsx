import React from 'react'
import { FaCodeBranch } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid.js'
import type { GridItemProps } from '../../../templates/types.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { GithubConfig, GithubData } from '../types.js'

interface RepositoryContributorsProps {
  data: GithubData['repositoryContributors']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultRepositoryContributors = ({ data, max }: { data: GithubData['repositoryContributors']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No contributors found</div>
  }

  const contributors = data.slice(0, max)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {contributors.map((contributor, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 rounded-lg border border-default-border hover:bg-default-hover transition-colors"
        >
          <img
            src={contributor.avatarUrl}
            alt={contributor.login}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-default-text truncate">
              {contributor.name || contributor.login}
            </div>
            <div className="text-xs text-default-muted">
              {contributor.contributions} contributions
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function GithubRepositoryContributors({ data, config, style, size }: RepositoryContributorsProps): React.ReactElement {
  const title = config.repository_contributors_title ?? 'Contributors'
  const hideTitle = config.repository_contributors_hide_title ?? false
  const max = config.repository_contributors_max ?? 10

  if (!data || data.length === 0) {
    return <></>
  }

  const contributors = data.slice(0, max)

  const gridData: GridItemProps[] = contributors.map((contributor) => ({
    title: contributor.name || contributor.login,
    subtitle: `${contributor.contributions} contributions`,
    value: '',
  }))

  return (
    <section id="github-repository-contributors">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCodeBranch />} />}
            <DefaultRepositoryContributors data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'repository_contributors',
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Contributor" centerText="Contributions" leftText="" />
          </>
        }
      />
    </section>
  )
}

