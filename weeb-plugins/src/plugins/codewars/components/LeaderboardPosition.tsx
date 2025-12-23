/**
 * LeaderboardPosition - Componente para exibir posição no leaderboard do Codewars
 */

import React from 'react'
import { FaTrophy } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { CodewarsConfig } from '../types'

interface LeaderboardPositionProps {
  position?: number
  config: CodewarsConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function LeaderboardPosition({ position, config, style = 'default', size = 'half' }: LeaderboardPositionProps): React.ReactElement {
  if (!position) {
    return <></>
  }

  const hideTitle = config.nonEssential?.leaderboard_position_hide_title || false
  const title = config.nonEssential?.leaderboard_position_title || 'Leaderboard Position'

  return (
    <section id="codewars-leaderboard-position">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-start w-full">
              <div className="flex flex-col items-start w-full">
                <p className="text-sm text-default-muted font-medium">Position</p>
                <p className="relative text-xl half:text-lg font-black text-default-foreground tabular-nums tracking-tight whitespace-nowrap flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  #{abbreviateNumber(position)}
                </p>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codewars',
                section: 'leaderboard_position',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Leaderboard Position"
              value={`#${abbreviateNumber(position)}`}
            />
          </>
        }
      />
    </section>
  )
}









