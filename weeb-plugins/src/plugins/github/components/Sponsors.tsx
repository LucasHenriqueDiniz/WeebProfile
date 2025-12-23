import React from 'react'
import { FaFrown, FaHeart } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import type { GridItemProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface SponsorsProps {
  data: GithubData['sponsors']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultSponsors = ({ data, max }: { data: GithubData['sponsors']; max: number }) => {
  if (!data || data.nodes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-default-muted text-sm py-4">
        <FaFrown className="w-4 h-4" />
        <span>Nenhum sponsor</span>
      </div>
    )
  }

  const sponsors = data.nodes.slice(0, max)

  return (
    <div className="flex flex-col gap-2">
      {sponsors.map((sponsor, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg border border-default-border hover:bg-default-hover transition-colors"
        >
          <img
            src={sponsor.avatarUrl}
            alt={sponsor.login}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="font-semibold text-default-text">
              {sponsor.name || sponsor.login}
            </div>
            {sponsor.tier && (
              <div className="text-sm text-default-muted">
                {sponsor.tier.name} • ${sponsor.tier.monthlyPriceInDollars}/month
              </div>
            )}
          </div>
        </div>
      ))}
      {data.totalCount > max && (
        <div className="mt-2 text-center text-sm text-default-muted">
          +{data.totalCount - max} more sponsors
        </div>
      )}
    </div>
  )
}

export function GithubSponsors({ data, config, style, size }: SponsorsProps): React.ReactElement {
  const title = config.sponsors_title ?? 'Sponsors'
  const hideTitle = config.sponsors_hide_title ?? false
  const max = config.sponsors_max ?? 10

  const isEmpty = !data || data.nodes.length === 0

  const sponsors = isEmpty ? [] : data.nodes.slice(0, max)

  const gridData: GridItemProps[] = sponsors.map((sponsor) => ({
    title: sponsor.name || sponsor.login,
    subtitle: sponsor.tier?.name || 'No tier',
    value: sponsor.tier ? `$${sponsor.tier.monthlyPriceInDollars}/mo` : '',
  }))

  return (
    <section id="github-sponsors">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <DefaultSponsors data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'sponsors',
                size,
              })}
            />
            {isEmpty ? (
              <div className="text-terminal-muted">😢 Nenhum sponsor</div>
            ) : (
              <TerminalGrid data={gridData} rightText="Sponsor" centerText="Tier" leftText="Amount" />
            )}
          </>
        }
      />
    </section>
  )
}

