/**
 * Componente Stargazers do GitHub
 * Mostra o total de stars recebidos nos repositórios
 */

import React from 'react'
import { FaStar } from 'react-icons/fa'
import { RiStarFill } from 'react-icons/ri'
import { abbreviateNumber } from '../../../utils/number'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'

const DefaultStargazers = ({ 
  data 
}: { 
  data: NonNullable<GithubData['stargazers']>
}) => {
  const maxRepos = 10
  const reposToShow = data.repositories.slice(0, maxRepos)

  return (
    <div className="github-stargazers">
      <div className="mb-4 p-4 rounded-lg bg-default-muted/10 border border-default-border">
        <div className="flex items-center gap-2">
          <RiStarFill className="text-yellow-500 text-2xl" />
          <div>
            <div className="text-2xl font-bold text-default-text">
              {abbreviateNumber(data.totalCount)}
            </div>
            <div className="text-sm text-default-muted">
              Total stars received
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {reposToShow.map((repo, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border border-default-border"
          >
            <span className="font-semibold text-default-text">
              {repo.name}
            </span>
            <div className="flex items-center gap-1 text-default-muted">
              <FaStar className="text-yellow-500" />
              <span className="text-sm font-medium">
                {abbreviateNumber(repo.stargazerCount)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {data.repositories.length > maxRepos && (
        <div className="mt-4 text-center text-sm text-default-muted">
          +{data.repositories.length - maxRepos} more repositories
        </div>
      )}
    </div>
  )
}

const TerminalStargazers = ({ 
  data 
}: { 
  data: NonNullable<GithubData['stargazers']>
}) => {
  const maxRepos = 10
  const reposToShow = data.repositories.slice(0, maxRepos)

  const gridData = [
    {
      title: 'Total Stars',
      value: abbreviateNumber(data.totalCount),
    },
    ...reposToShow.map((repo) => ({
      title: repo.name,
      value: `⭐ ${abbreviateNumber(repo.stargazerCount)}`,
    })),
  ]

  return (
    <>
      <TerminalGrid data={gridData} rightText="Repository" leftText="Stars" />
      {data.repositories.length > maxRepos && (
        <div className="text-terminal-muted text-sm text-center mt-2">
          +{data.repositories.length - maxRepos} more
        </div>
      )}
    </>
  )
}

interface StargazersProps {
  data: GithubData['stargazers']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubStargazers({ 
  data, 
  config, 
  style, 
  size 
}: StargazersProps): React.ReactElement {
  if (!data || data.totalCount === 0) {
    return <></>
  }

  const title = (config.stargazers_title ?? '<qnt> Stars Received').replace(
    '<qnt>',
    abbreviateNumber(data.totalCount)
  )
  const hideTitle = config.stargazers_hide_title ?? false

  return (
    <section id="github-stargazers">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiStarFill />} />}
            <DefaultStargazers data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'stargazers',
                username: config.username,
                size,
              })}
            />
            <TerminalStargazers data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

