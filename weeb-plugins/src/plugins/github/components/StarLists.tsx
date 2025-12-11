import React from 'react'
import { FaList } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import type { GridItemProps } from '../../../templates/types'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface StarListsProps {
  data: GithubData['starLists']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultStarLists = ({ data, max }: { data: GithubData['starLists']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No star lists</div>
  }

  const lists = data.slice(0, max)

  return (
    <div className="flex flex-col gap-4">
      {lists.map((list, index) => (
        <div key={index} className="p-3 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200">
          <h4 className="font-semibold text-base text-default-text mb-2">{list.name}</h4>
          {list.description && (
            <p className="text-sm text-default-muted mb-3 line-clamp-2">{list.description}</p>
          )}
          <div className="flex flex-col gap-2">
            {list.repositories.slice(0, 5).map((repo, repoIndex) => (
              <a
                key={repoIndex}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-default-link hover:text-default-highlight hover:underline transition-colors flex items-center gap-2"
              >
                <span className="truncate">{repo.nameWithOwner}</span>
                <span className="text-default-muted flex-shrink-0">⭐ {abbreviateNumber(repo.stargazerCount)}</span>
              </a>
            ))}
            {list.repositories.length > 5 && (
              <div className="text-xs text-default-muted mt-1">
                +{list.repositories.length - 5} more {list.repositories.length - 5 === 1 ? 'repository' : 'repositories'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function GithubStarLists({ data, config, style, size }: StarListsProps): React.ReactElement {
  const title = config.star_lists_title ?? 'Star Lists'
  const hideTitle = config.star_lists_hide_title ?? false
  const max = config.star_lists_max ?? 5

  if (!data || data.length === 0) {
    return <></>
  }

  const lists = data.slice(0, max)

  const gridData: GridItemProps[] = lists.map((list) => ({
    title: list.name,
    subtitle: list.description || undefined,
    value: `${list.repositories.length} repos`,
  }))

  return (
    <section id="github-star-lists">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaList />} />}
            <DefaultStarLists data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'star_lists',
                username: config.username,
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="List" centerText="Description" leftText="Repos" />
          </>
        }
      />
    </section>
  )
}

