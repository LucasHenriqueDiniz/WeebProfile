/**
 * Badges - Componente para exibir badges do Stack Overflow
 */

import React from 'react'
import { FaMedal } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { StackOverflowConfig } from '../types.js'

interface BadgesProps {
  badges: { gold: number; silver: number; bronze: number }
  config: StackOverflowConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Badges({ badges, config, style = 'default', size = 'half' }: BadgesProps): React.ReactElement {
  const hideTitle = config.nonEssential?.badges_hide_title || false
  const title = config.nonEssential?.badges_title || 'Badges'

  const totalBadges = badges.gold + badges.silver + badges.bronze

  return (
    <section id="stackoverflow-badges">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <p className="text-sm text-default-muted">Total:</p>
                <p className="text-lg font-semibold text-default-highlight">{abbreviateNumber(totalBadges)}</p>
              </div>
              <div className="flex gap-4 half:gap-3 items-center w-full">
                <div className="flex items-center gap-1.5 flex-1">
                  <FaMedal className="text-yellow-500 flex-shrink-0" />
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-default-muted">Gold:</p>
                    <p className="text-sm font-semibold text-default-highlight">{abbreviateNumber(badges.gold)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <FaMedal className="text-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-default-muted">Silver:</p>
                    <p className="text-sm font-semibold text-default-highlight">{abbreviateNumber(badges.silver)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <FaMedal className="text-orange-500 flex-shrink-0" />
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-default-muted">Bronze:</p>
                    <p className="text-sm font-semibold text-default-highlight">{abbreviateNumber(badges.bronze)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'stackoverflow',
                section: 'badges',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Total Badges"
              value={abbreviateNumber(totalBadges)}
            />
            <TerminalLineWithDots
              title="Gold"
              value={abbreviateNumber(badges.gold)}
            />
            <TerminalLineWithDots
              title="Silver"
              value={abbreviateNumber(badges.silver)}
            />
            <TerminalLineWithDots
              title="Bronze"
              value={abbreviateNumber(badges.bronze)}
            />
          </>
        }
      />
    </section>
  )
}


