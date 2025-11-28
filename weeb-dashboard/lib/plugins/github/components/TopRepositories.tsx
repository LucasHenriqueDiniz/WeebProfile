/**
 * Componente TopRepositories do GitHub
 * Mostra os repositórios com mais stars
 */

import React from 'react'
import { FaCodeBranch, FaStar } from 'react-icons/fa'
import { RiGitRepositoryLine } from 'react-icons/ri'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'

const DefaultTopRepositories = ({ 
  data,
  maxRepos
}: { 
  data: NonNullable<GithubData['topRepositories']>
  maxRepos: number
}) => {
  const reposToShow = data.slice(0, maxRepos)

  return (
    <div className="github-top-repositories">
      <div className="flex flex-col gap-4">
        {reposToShow.map((repo, index) => (
          <a
            key={index}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200 group h-[120px]"
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
      {data.length > maxRepos && (
        <div className="mt-3 text-center text-sm text-default-muted">
          +{data.length - maxRepos} more {data.length - maxRepos === 1 ? 'repository' : 'repositories'}
        </div>
      )}
    </div>
  )
}

const TerminalTopRepositories = ({ 
  data,
  maxRepos
}: { 
  data: NonNullable<GithubData['topRepositories']>
  maxRepos: number
}) => {
  const reposToShow = data.slice(0, maxRepos)

  const gridData = reposToShow.map((repo) => ({
    title: repo.nameWithOwner || repo.name,
    subtitle: repo.description || undefined,
    value: `⭐ ${abbreviateNumber(repo.stargazerCount)} 🍴 ${abbreviateNumber(repo.forkCount)}`,
  }))

  return (
    <>
      <TerminalGrid data={gridData} rightText="Repository" leftText="Stats" />
      {data.length > maxRepos && (
        <div className="text-terminal-muted text-sm text-center mt-2">
          +{data.length - maxRepos} more
        </div>
      )}
    </>
  )
}

interface TopRepositoriesProps {
  data: GithubData['topRepositories']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubTopRepositories({ 
  data, 
  config, 
  style, 
  size 
}: TopRepositoriesProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = (config.top_repositories_title ?? 'Top Repositories').replace(
    '<qnt>',
    abbreviateNumber(data.length)
  )
  const hideTitle = config.top_repositories_hide_title ?? false
  const maxRepos = config.top_repositories_max ?? 10

  return (
    <section id="github-top-repositories">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiGitRepositoryLine />} />}
            <DefaultTopRepositories data={data} maxRepos={maxRepos} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'top_repositories',
                username: config.username,
                size,
              })}
            />
            <TerminalTopRepositories data={data} maxRepos={maxRepos} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}




