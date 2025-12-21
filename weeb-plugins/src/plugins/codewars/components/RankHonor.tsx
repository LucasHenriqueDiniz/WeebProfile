/**
 * RankHonor - Componente para exibir rank e honor do Codewars
 */

import React from 'react'
import { FaMedal, FaTrophy } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { CodewarsConfig } from '../types'

interface RankHonorProps {
  rank: { name: string; color: string }
  honor: number
  config: CodewarsConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RankHonor({ rank, honor, config, style = 'default', size = 'half' }: RankHonorProps): React.ReactElement {
  const hideTitle = config.nonEssential?.rank_honor_hide_title || false
  const title = config.nonEssential?.rank_honor_title || 'Rank & Honor'

  return (
    <section id="codewars-rank-honor">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-center w-full">
              <div className="flex items-center gap-2 flex-1">
                <FaMedal style={{ color: rank.color }} className="flex-shrink-0" />
                <p className="text-base font-semibold text-default-highlight">{rank.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-500 flex-shrink-0" />
                <p className="text-sm text-default-muted">Honor:</p>
                <p className="text-base font-semibold text-default-highlight">{abbreviateNumber(honor)}</p>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codewars',
                section: 'rank_honor',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Rank"
              value={rank.name}
            />
            <TerminalLineWithDots
              title="Honor"
              value={abbreviateNumber(honor)}
            />
          </>
        }
      />
    </section>
  )
}

