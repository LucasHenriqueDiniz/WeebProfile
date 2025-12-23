import React from 'react'
import { FaCodeBranch, FaStar } from 'react-icons/fa'
import { RiStarLine } from 'react-icons/ri'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { GithubConfig, GithubData } from '../types.js'

const DefaultStarredRepositories = ({ 
  data,
  maxRepos
}: { 
  data: NonNullable<GithubData['starredRepositories']>
  maxRepos: number
}) => {
  const reposToShow = data.nodes.slice(0, maxRepos)

  return (
    <div className="github-starred-repositories">
      <div className="flex flex-col gap-4">
        {reposToShow.map((repo, index) => (
          <a
            key={index}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200 group h-[120px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-semibold text-base text-default-text truncate group-hover:text-default-highlight transition-colors">
                  {repo.nameWithOwner || repo.name}
                </span>
                {repo.primaryLanguage && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      backgroundColor: `${repo.primaryLanguage.color}15`,
                      color: repo.primaryLanguage.color,
                      border: `1px solid ${repo.primaryLanguage.color}30`,
                    }}
                  >
                    {repo.primaryLanguage.name}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="text-sm text-default-muted line-clamp-2 mb-2 leading-relaxed">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-default-muted">
                  <FaStar className="text-yellow-500 fill-yellow-500" size={14} />
                  <span className="text-sm font-medium">{abbreviateNumber(repo.stargazerCount)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-default-muted">
                  <FaCodeBranch size={14} />
                  <span className="text-sm font-medium">{abbreviateNumber(repo.forkCount)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      {data.totalCount > maxRepos && (
        <div className="mt-3 text-center text-sm text-default-muted">
          +{data.totalCount - maxRepos} more starred {data.totalCount - maxRepos === 1 ? 'repository' : 'repositories'}
        </div>
      )}
    </div>
  )
}

const TerminalStarredRepositories = ({ 
  data,
  maxRepos
}: { 
  data: NonNullable<GithubData['starredRepositories']>
  maxRepos: number
}) => {
  const reposToShow = data.nodes.slice(0, maxRepos)

  const gridData = reposToShow.map((repo) => ({
    title: repo.nameWithOwner || repo.name,
    subtitle: repo.description || undefined,
    value: `⭐ ${abbreviateNumber(repo.stargazerCount)} 🍴 ${abbreviateNumber(repo.forkCount)}`,
  }))

  return (
    <>
      <TerminalGrid data={gridData} rightText="Repository" leftText="Stats" />
      {data.totalCount > maxRepos && (
        <div className="text-terminal-muted text-sm text-center mt-2">
          +{data.totalCount - maxRepos} more
        </div>
      )}
    </>
  )
}

interface StarredRepositoriesProps {
  data: GithubData['starredRepositories']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubStarredRepositories({ 
  data, 
  config, 
  style, 
  size 
}: StarredRepositoriesProps): React.ReactElement {
  if (!data || data.totalCount === 0) {
    return <></>
  }

  const title = (config.starred_repositories_title ?? '<qnt> Starred Repositories').replace(
    '<qnt>',
    abbreviateNumber(data.totalCount)
  )
  const hideTitle = config.starred_repositories_hide_title ?? false
  const maxRepos = config.starred_repositories_max ?? 10

  return (
    <section id="github-starred-repositories">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiStarLine />} />}
            <DefaultStarredRepositories data={data} maxRepos={maxRepos} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'starred_repositories',
                size,
              })}
            />
            <TerminalStarredRepositories data={data} maxRepos={maxRepos} />
          </>
        }
      />
    </section>
  )
}

