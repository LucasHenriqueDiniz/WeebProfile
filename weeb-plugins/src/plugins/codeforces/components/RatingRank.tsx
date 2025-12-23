/**
 * RatingRank - Componente para exibir rating e rank do Codeforces
 */

import React from 'react'
import { FaTrophy } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { CodeforcesConfig } from '../types.js'

interface RatingRankProps {
  rating: number
  rank: string
  config: CodeforcesConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RatingRank({ rating, rank, config, style = 'default', size = 'half' }: RatingRankProps): React.ReactElement {
  const hideTitle = config.nonEssential?.rating_rank_hide_title || false
  const title = config.nonEssential?.rating_rank_title || 'Rating & Rank'

  return (
    <section id="codeforces-rating-rank">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-center w-full">
              <div className="flex items-center gap-2 flex-1">
                <FaTrophy className="text-yellow-500 flex-shrink-0" />
                <p className="text-base font-semibold text-default-highlight">{rank}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-default-muted">Rating:</p>
                <p className="text-base font-semibold text-default-highlight">{abbreviateNumber(rating)}</p>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codeforces',
                section: 'rating_rank',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Rank"
              value={rank}
            />
            <TerminalLineWithDots
              title="Rating"
              value={abbreviateNumber(rating)}
            />
          </>
        }
      />
    </section>
  )
}

