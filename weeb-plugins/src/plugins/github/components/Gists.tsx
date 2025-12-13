import React from 'react'
import { FaCode, FaFileCode } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

const DefaultGists = ({ 
  data,
  maxGists
}: { 
  data: NonNullable<GithubData['gists']>
  maxGists: number
}) => {
  const gistsToShow = data.nodes.slice(0, maxGists)

  return (
    <div className="github-gists">
      <div className="flex flex-col gap-4">
        {gistsToShow.map((gist, index) => (
          <a
            key={index}
            href={gist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200 group h-[120px]"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="p-2 rounded-md bg-default-muted/10 group-hover:bg-default-muted/20 transition-colors">
                <FaFileCode className="text-default-muted group-hover:text-default-highlight transition-colors" size={18} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-semibold text-base text-default-text truncate group-hover:text-default-highlight transition-colors">
                  {gist.name}
                </span>
                {gist.stargazerCount > 0 && (
                  <div className="flex items-center gap-1 text-default-muted flex-shrink-0">
                    <span className="text-xs font-medium">⭐ {abbreviateNumber(gist.stargazerCount)}</span>
                  </div>
                )}
              </div>
              {gist.description && (
                <p className="text-sm text-default-muted line-clamp-2 mb-2.5 leading-relaxed">
                  {gist.description}
                </p>
              )}
              {gist.files.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {gist.files.slice(0, 3).map((file, fileIndex) => (
                    <span
                      key={fileIndex}
                      className="text-xs px-2 py-0.5 rounded-full font-medium bg-default-muted/10 text-default-muted border border-default-border/50"
                    >
                      {file.name}
                      {file.language && (
                        <span className="ml-1 text-default-muted/60">• {file.language}</span>
                      )}
                    </span>
                  ))}
                  {gist.files.length > 3 && (
                    <span className="text-xs text-default-muted px-2 py-0.5">
                      +{gist.files.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
      {data.totalCount > maxGists && (
        <div className="mt-3 text-center text-sm text-default-muted">
          +{data.totalCount - maxGists} more {data.totalCount - maxGists === 1 ? 'gist' : 'gists'}
        </div>
      )}
    </div>
  )
}

const TerminalGists = ({ 
  data,
  maxGists
}: { 
  data: NonNullable<GithubData['gists']>
  maxGists: number
}) => {
  const gistsToShow = data.nodes.slice(0, maxGists)

  const gridData = gistsToShow.map((gist) => ({
    title: gist.name,
    subtitle: gist.description || undefined,
    value: `${gist.files.length} file${gist.files.length > 1 ? 's' : ''}${gist.stargazerCount > 0 ? ` ⭐ ${gist.stargazerCount}` : ''}`,
  }))

  return (
    <>
      <TerminalGrid data={gridData} rightText="Gist" leftText="Info" />
      {data.totalCount > maxGists && (
        <div className="text-terminal-muted text-sm text-center mt-2">
          +{data.totalCount - maxGists} more
        </div>
      )}
    </>
  )
}

interface GistsProps {
  data: GithubData['gists']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubGists({ 
  data, 
  config, 
  style, 
  size 
}: GistsProps): React.ReactElement {
  if (!data || data.totalCount === 0) {
    return <></>
  }

  const title = (config.gists_title ?? '<qnt> Gists').replace(
    '<qnt>',
    abbreviateNumber(data.totalCount)
  )
  const hideTitle = config.gists_hide_title ?? false
  const maxGists = config.gists_max ?? 10

  return (
    <section id="github-gists">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultGists data={data} maxGists={maxGists} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'gists',
                size,
              })}
            />
            <TerminalGists data={data} maxGists={maxGists} />
          </>
        }
      />
    </section>
  )
}

