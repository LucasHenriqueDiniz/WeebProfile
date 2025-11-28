/**
 * Componente Featured Repositories do GitHub
 * 
 * Mostra repositórios em destaque (requer URLs dos repositórios)
 */

import React from 'react'
import { FaStar, FaCodeBranch, FaExclamationCircle, FaGitAlt } from 'react-icons/fa'
import { RiGitPullRequestLine } from 'react-icons/ri'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'
import type { GridItemProps } from '../../../weeb-plugins/templates/types'

interface FeaturedRepositoriesProps {
  data: GithubData['featuredRepositories']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultFeaturedRepositories = ({ data }: { data: GithubData['featuredRepositories'] }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No featured repositories</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((repo, index) => (
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
                {repo.nameWithOwner}
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
              {repo.license && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-default-muted/10 text-default-muted border border-default-border/50 flex-shrink-0">
                  {repo.license.spdxId || repo.license.name}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-sm text-default-muted mb-2 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap text-sm text-default-muted">
              <div className="flex items-center gap-1.5">
                <FaStar className="text-yellow-500 fill-yellow-500" size={14} />
                <span className="font-medium">{abbreviateNumber(repo.stargazerCount)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCodeBranch size={14} />
                <span className="font-medium">{abbreviateNumber(repo.forkCount)}</span>
              </div>
              {repo.issuesCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <FaExclamationCircle size={14} />
                  <span className="font-medium">{abbreviateNumber(repo.issuesCount)}</span>
                </div>
              )}
              {repo.pullRequestsCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <RiGitPullRequestLine size={14} />
                  <span className="font-medium">{abbreviateNumber(repo.pullRequestsCount)}</span>
                </div>
              )}
              {repo.createdAt && (
                <div className="text-xs text-default-muted/70">
                  Created {new Date(repo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </div>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export function GithubFeaturedRepositories({ data, config, style, size }: FeaturedRepositoriesProps): React.ReactElement {
  const title = config.featured_repositories_title ?? 'Featured Repositories'
  const hideTitle = config.featured_repositories_hide_title ?? false

  if (!data || data.length === 0) {
    return <></>
  }

  // Mostrar todos os repositórios fornecidos (até 20, limitado no fetchGithub)
  const gridData: GridItemProps[] = data.map((repo) => ({
    title: repo.nameWithOwner,
    subtitle: repo.description || undefined,
    value: `⭐ ${abbreviateNumber(repo.stargazerCount)} 🍴 ${abbreviateNumber(repo.forkCount)}`,
  }))

  return (
    <section id="github-featured-repositories">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaStar />} />}
            <DefaultFeaturedRepositories data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'featured_repositories',
                username: config.username,
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Repository" centerText="Description" leftText="Stats" />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

