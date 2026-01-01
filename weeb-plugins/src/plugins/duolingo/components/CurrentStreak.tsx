/**
 * CurrentStreak - Componente para exibir streak atual do Duolingo
 */

import React from 'react'
import { FaFire } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { DuolingoColors, getStreakGradient } from '../constants'
import { duolingoAssets } from '../assets/index'
import type { DuolingoConfig } from '../types'

interface CurrentStreakProps {
  streak: number
  config: DuolingoConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

/**
 * Get motivational message based on streak level
 */
function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak!"
  if (streak < 7) return "Building momentum!"
  if (streak < 14) return "You're on fire!"
  if (streak < 30) return "Amazing dedication!"
  if (streak < 50) return "Legendary streak!"
  if (streak < 100) return "Unstoppable!"
  if (streak < 365) return "Duolingo Champion!"
  if (streak < 1000) return "One Year Master!"
  return "Duolingo God!"
}

/**
 * Get streak intensity based on number of days
 * Expanded to support very high streaks (1k+ days)
 */
function getStreakIntensity(streak: number): 'low' | 'medium' | 'high' | 'legendary' | 'godlike' {
  if (streak < 10) return 'low'
  if (streak < 50) return 'medium'
  if (streak < 100) return 'high'
  if (streak < 500) return 'legendary'
  return 'godlike'
}

export function CurrentStreak({ streak, config, style = 'default', size = 'half' }: CurrentStreakProps): React.ReactElement {
  const hideTitle = config.nonEssential?.current_streak_hide_title ?? true
  const title = config.nonEssential?.current_streak_title || 'Learning Streak'
  const intensity = getStreakIntensity(streak)
  const message = getStreakMessage(streak)
  const gradient = getStreakGradient(intensity)

  // Choose mascot based on streak intensity - using more assets for variety
  const getMascotAsset = () => {
    if (intensity === 'godlike') return duolingoAssets.veryHappyWavingWings
    if (intensity === 'legendary') {
      // Alternate between different happy expressions for legendary streaks
      if (streak >= 1000) return duolingoAssets.veryHappyWavingWings
      if (streak >= 500) return duolingoAssets.inLove
      return duolingoAssets.amazed
    }
    if (intensity === 'high') {
      // Use different assets for high streaks
      if (streak >= 100) return (duolingoAssets as any).happyJumping2
      return duolingoAssets.amazed
    }
    if (intensity === 'medium') return duolingoAssets.happyJumping
    // Low intensity - use default happy
    return duolingoAssets.defaultHi
  }

  const mascotAsset = getMascotAsset()

  return (
    <section id="duolingo-current-streak">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5 my-1.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}

            {/* Streak Card */}
            <div 
              className="duolingo-streak-card"
              data-intensity={intensity}
            >
              {/* Background mascot decoration */}
              <div className="duolingo-mascot-decoration">
                <img src={mascotAsset} alt="" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Duolingo Mascot */}
                <div className="flex-shrink-0">
                  <div className="duolingo-icon-container" style={{ padding: '0.5rem' }}>
                    <img 
                      src={mascotAsset} 
                      alt="Duolingo mascot" 
                      className="w-12 h-12 object-contain"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                    />
                  </div>
                </div>

                {/* Streak Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold drop-shadow-sm duolingo-text-snow">
                      {abbreviateNumber(streak)}
                    </span>
                    <span className="text-sm font-semibold opacity-90 duolingo-text-snow">
                      days
                    </span>
                  </div>
                  <p className="text-sm font-semibold opacity-95 duolingo-text-snow">
                    {message}
                  </p>
                </div>

                {/* Fire icon for extra emphasis - more dramatic for higher streaks */}
                <div className="flex-shrink-0">
                  <FaFire 
                    className="text-2xl opacity-80 duolingo-text-snow"
                    style={{ 
                      filter: intensity === 'godlike' || intensity === 'legendary' 
                        ? 'drop-shadow(0 0 12px rgba(255,255,255,0.8))' 
                        : intensity === 'high'
                        ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))'
                        : 'none',
                      animation: intensity === 'godlike' || intensity === 'legendary' 
                        ? 'pulse 1.5s infinite' 
                        : intensity === 'high'
                        ? 'pulse 2s infinite'
                        : 'none',
                    }} 
                  />
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
                section: 'current_streak',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Current Streak"
              value={`${abbreviateNumber(streak)} days`}
            />
          </>
        }
      />
    </section>
  )
}

