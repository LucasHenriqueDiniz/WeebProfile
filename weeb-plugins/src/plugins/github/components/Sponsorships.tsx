import React from 'react'
import { FaFrown, FaHeart } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid.js'
import type { GridItemProps } from '../../../templates/types.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { GithubConfig, GithubData } from '../types.js'

interface SponsorshipsProps {
  data: GithubData['sponsorships']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultSponsorships = ({ data, max }: { data: GithubData['sponsorships']; max: number }) => {
  if (!data || data.nodes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-default-muted text-sm py-4">
        <FaFrown className="w-4 h-4" />
        <span>Nenhum sponsorship</span>
      </div>
    )
  }

  const sponsorships = data.nodes.slice(0, max)

  return (
    <div className="flex flex-col gap-2">
      {sponsorships.map((sponsorship, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg border border-default-border hover:bg-default-hover transition-colors"
        >
          <img
            src={sponsorship.sponsorable.avatarUrl}
            alt={sponsorship.sponsorable.login}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="font-semibold text-default-text">
              {sponsorship.sponsorable.name || sponsorship.sponsorable.login}
            </div>
            {sponsorship.tier && (
              <div className="text-sm text-default-muted">
                {sponsorship.tier.name} • ${sponsorship.tier.monthlyPriceInDollars}/month
              </div>
            )}
          </div>
        </div>
      ))}
      {data.totalCount > max && (
        <div className="mt-2 text-center text-sm text-default-muted">
          +{data.totalCount - max} more sponsorships
        </div>
      )}
    </div>
  )
}

export function GithubSponsorships({ data, config, style, size }: SponsorshipsProps): React.ReactElement {
  const title = config.sponsorships_title ?? 'Sponsorships'
  const hideTitle = config.sponsorships_hide_title ?? false
  const max = config.sponsorships_max ?? 10

  const isEmpty = !data || data.nodes.length === 0

  const sponsorships = isEmpty ? [] : data.nodes.slice(0, max)

  const gridData: GridItemProps[] = sponsorships.map((sponsorship) => ({
    title: sponsorship.sponsorable.name || sponsorship.sponsorable.login,
    subtitle: sponsorship.tier?.name || 'No tier',
    value: sponsorship.tier ? `$${sponsorship.tier.monthlyPriceInDollars}/mo` : '',
  }))

  return (
    <section id="github-sponsorships">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <DefaultSponsorships data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'sponsorships',
                size,
              })}
            />
            {isEmpty ? (
              <div className="text-terminal-muted">😢 Nenhum sponsorship</div>
            ) : (
              <TerminalGrid data={gridData} rightText="Sponsor" centerText="Tier" leftText="Amount" />
            )}
          </>
        }
      />
    </section>
  )
}

