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
import { duolingoAssets } from '../assets'
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
            <div
              className="rounded-2xl border-2 p-4 shadow-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${DuolingoColors.featherGreen} 0%, ${DuolingoColors.maskGreen} 100%)`,
                borderColor: DuolingoColors.featherGreen,
              }}
            >
              {/* Background mascot decoration */}
              <div className="absolute top-0 right-0 opacity-15 transform rotate-12" style={{ width: '120px', height: '120px' }}>
                <img src={duolingoAssets.amazed} alt="" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Trophy Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="rounded-full p-3 shadow-lg"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
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
                  <p 
                    className="text-xs font-medium mb-1 opacity-90"
                    style={{ color: DuolingoColors.snow }}
                  >
                    Total XP
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: DuolingoColors.snow }}
                  >
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

