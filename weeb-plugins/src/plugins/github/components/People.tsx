/**
 * Componente People do GitHub
 * 
 * Mostra pessoas relacionadas (followers ou contributors/stargazers/watchers de um repositório)
 */

import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'
import type { GridItemProps } from '../../../templates/types'

interface PeopleProps {
  data: GithubData['people']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultPeople = ({ data, max }: { data: GithubData['people']; max: number }) => {
  if (!data || data.nodes.length === 0) {
    return <div className="text-default-muted text-sm">No people found</div>
  }

  const people = data.nodes.slice(0, max)

  return (
    <div className="flex flex-wrap gap-2">
      {people.map((person, index) => (
        <a
          key={index}
          href={`https://github.com/${person.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
          title={person.name || person.login}
        >
          <img
            src={person.avatarUrl}
            alt={person.login}
            className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
          />
        </a>
      ))}
      {data.totalCount > max && (
        <div className="flex items-center ml-2 text-sm text-default-muted">
          +{data.totalCount - max} more
        </div>
      )}
    </div>
  )
}

export function GithubPeople({ data, config, style, size }: PeopleProps): React.ReactElement {
  const defaultTitle = config.people_type === 'repository' 
    ? 'Repository People' 
    : 'Followers'
  const title = config.people_title ?? defaultTitle
  const hideTitle = config.people_hide_title ?? false
  const max = config.people_max ?? 10

  // Validação: se for tipo repository, precisa ter o repositório especificado
  if (config.people_type === 'repository' && !config.people_repository) {
    return (
      <section id="github-people">
        <div className="text-default-error text-sm p-3 rounded-lg border border-default-error/20 bg-default-error/10">
          Error: Repository is required when people_type is &quot;repository&quot;
        </div>
      </section>
    )
  }

  if (!data || data.nodes.length === 0) {
    return <></>
  }

  // Adicionar contador ao título se for tipo profile e houver dados
  const displayTitle = config.people_type === 'profile' && data.totalCount > 0
    ? `${title} (+${data.totalCount})`
    : title

  const people = data.nodes.slice(0, max)

  const gridData: GridItemProps[] = people.map((person) => ({
    title: person.name || person.login,
    subtitle: person.contributions !== undefined ? `${person.contributions} contributions` : undefined,
    value: '',
  }))

  return (
    <section id="github-people">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={displayTitle} icon={<FaUsers />} />}
            <DefaultPeople data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'people',
                username: config.username,
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Person" centerText="Contributions" leftText="" />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

