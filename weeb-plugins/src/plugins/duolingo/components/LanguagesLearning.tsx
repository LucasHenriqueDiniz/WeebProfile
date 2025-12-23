/**
 * LanguagesLearning - Componente para exibir idiomas estudados no Duolingo
 */

import React from 'react'
import { FaLanguage } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { getLanguageCode, CountryFlag } from '../../../utils/language-flags'
import { DuolingoColors } from '../constants'
import type { TerminalLineProps } from '../../../templates/types'
import type { DuolingoConfig, DuolingoLanguage } from '../types'

/**
 * Calculate progress percentage based on XP
 * Uses a logarithmic scale for better visualization
 */
function calculateProgress(xp: number, maxXp: number): number {
  if (maxXp === 0) return 0
  // Use logarithmic scale for better distribution
  const logXp = Math.log10(xp + 1)
  const logMax = Math.log10(maxXp + 1)
  return Math.min(100, (logXp / logMax) * 100)
}

interface LanguagesLearningProps {
  data: DuolingoLanguage[]
  config: DuolingoConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function LanguagesLearning({ data, config, style = 'default', size = 'half' }: LanguagesLearningProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const hideTitle = config.nonEssential?.languages_learning_hide_title ?? false
  const title = config.nonEssential?.languages_learning_title || 'Languages Learning'
  const maxItems = config.nonEssential?.languages_learning_max || 5
  const hideLanguages = config.nonEssential?.languages_learning_hide_languages || []

  // Filter out hidden languages (case-insensitive)
  const filteredData = data.filter(lang => {
    const langLower = lang.language.toLowerCase()
    return !hideLanguages.some((hidden: string) => hidden.toLowerCase() === langLower)
  })

  const limitedData = filteredData.slice(0, maxItems)
  
  // Sort by XP descending for better visual hierarchy
  const sortedData = [...limitedData].sort((a, b) => b.xp - a.xp)
  const maxXp = Math.max(...sortedData.map(lang => lang.xp), 1)

  const terminalLines: TerminalLineProps[] = sortedData.map((lang) => {
    const capitalizedName = lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
    return {
      right: capitalizedName,
      left: `${abbreviateNumber(lang.xp)} XP${lang.level ? ` (Level ${lang.level})` : ''}`,
    }
  })

  return (
    <section id="duolingo-languages-learning">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaLanguage />} />}
            
            {/* Languages Cards */}
            <div className="flex flex-col gap-3 half:gap-2.5">
              {sortedData.map((lang, index) => {
                const countryCode = getLanguageCode(lang.language)
                const capitalizedName = lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
                const progress = calculateProgress(lang.xp, maxXp)
                
                return (
                  <div
                    key={`${lang.language}-${index}`}
                    className="rounded-xl border-2 p-4 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${DuolingoColors.featherGreen}15 0%, ${DuolingoColors.maskGreen}15 100%)`,
                      borderColor: `${DuolingoColors.featherGreen}40`,
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Header: Language name and flag */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CountryFlag code={countryCode} className="flex-shrink-0 w-6 h-6" />
                          <h3 
                            className="text-base font-bold"
                            style={{ color: DuolingoColors.eel }}
                          >
                            {capitalizedName}
                          </h3>
                        </div>
                        
                        {/* XP and Level */}
                        <div className="flex items-center gap-3">
                          {lang.level && (
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
                              style={{
                                backgroundColor: `${DuolingoColors.featherGreen}20`,
                                color: DuolingoColors.featherGreen,
                                border: `1px solid ${DuolingoColors.featherGreen}40`,
                              }}
                            >
                              Level {lang.level}
                            </span>
                          )}
                          <span 
                            className="text-sm font-bold"
                            style={{ color: DuolingoColors.featherGreen }}
                          >
                            {abbreviateNumber(lang.xp)} XP
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full">
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: `${DuolingoColors.featherGreen}20`,
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${DuolingoColors.featherGreen} 0%, ${DuolingoColors.maskGreen} 100%)`,
                              boxShadow: `0 0 8px ${DuolingoColors.featherGreen}40`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'duolingo',
                section: 'languages_learning',
                size,
              })}
            />
            <TerminalList data={terminalLines} />
          </>
        }
      />
    </section>
  )
}

