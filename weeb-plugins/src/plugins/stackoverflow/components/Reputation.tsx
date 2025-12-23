/**
 * Reputation - Componente para exibir reputação do Stack Overflow
 */

import React from 'react'
import { FaStar } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { StackOverflowConfig } from '../types'

interface ReputationProps {
  reputation: number
  reputationChange: number
  config: StackOverflowConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Reputation({ reputation, reputationChange, config, style = 'default', size = 'half' }: ReputationProps): React.ReactElement {
  const hideTitle = config.nonEssential?.reputation_hide_title || false
  const title = config.nonEssential?.reputation_title || 'Reputation'

  const changeText = reputationChange >= 0 
    ? `+${abbreviateNumber(reputationChange)}`
    : abbreviateNumber(reputationChange)

  return (
    <section id="stackoverflow-reputation">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-center w-full">
              <div className="flex items-center gap-2 flex-1">
                <FaStar className="text-yellow-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <p className="text-sm text-default-muted">Reputation:</p>
                  <p className="text-xl half:text-lg font-semibold text-default-highlight tabular-nums">{abbreviateNumber(reputation)}</p>
                </div>
              </div>
              {reputationChange !== 0 && (
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${reputationChange >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-950' : 'text-red-600 bg-red-50 dark:bg-red-950'}`}>
                  {changeText}
                </div>
              )}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'stackoverflow',
                section: 'reputation',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Reputation"
              value={abbreviateNumber(reputation)}
            />
            {reputationChange !== 0 && (
              <TerminalLineWithDots
                title="Change (month)"
                value={changeText}
              />
            )}
          </>
        }
      />
    </section>
  )
}


