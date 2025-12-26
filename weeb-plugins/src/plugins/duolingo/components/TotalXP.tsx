/**
 * TotalXP - Componente para exibir XP total do Duolingo
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
import { DuolingoColors } from '../constants'
import { duolingoAssets } from '../assets/index'
import type { DuolingoConfig } from '../types'

interface TotalXPProps {
  totalXP: number
  config: DuolingoConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TotalXP({ totalXP, config, style = 'default', size = 'half' }: TotalXPProps): React.ReactElement {
  const hideTitle = config.nonEssential?.total_xp_hide_title ?? false
  const title = config.nonEssential?.total_xp_title || 'Total XP'

  return (
    <section id="duolingo-total-xp">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            
            {/* XP Card */}
            <div className="duolingo-xp-card">
              {/* Background mascot decoration */}
              <div className="duolingo-mascot-decoration">
                <img src={duolingoAssets.amazed} alt="" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Trophy Icon */}
                <div className="flex-shrink-0">
                  <div className="duolingo-icon-container" style={{ padding: '0.75rem' }}>
                    <FaTrophy 
                      className="text-2xl"
                      style={{ 
                        color: DuolingoColors.bee,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      }} 
                    />
                  </div>
                </div>

                {/* XP Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-1 opacity-90 duolingo-text-snow">
                    Total XP
                  </p>
                  <p className="text-2xl font-bold duolingo-text-snow">
                    {abbreviateNumber(totalXP)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'duolingo',
                section: 'total_xp',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Total XP"
              value={abbreviateNumber(totalXP)}
            />
          </>
        }
      />
    </section>
  )
}

