/**
 * LanguagesLearning - Componente para exibir idiomas estudados no Duolingo
 */

import React from 'react'
import { FaLanguage } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLine } from '../../../templates/Terminal/TerminalLine'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { getLanguageIcon, capitalizeLanguage } from '../../../utils/language-icons'
import { getLanguageCode, CountryFlag } from '../../../utils/language-flags'
import { DuolingoColors } from '../constants'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types'
import type { DuolingoConfig, DuolingoLanguage } from '../types'

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

  const limitedData = data.slice(0, maxItems)

  const listItems: ListItemProps[] = limitedData.map((lang) => {
    const capitalizedName = capitalizeLanguage(lang.language)
    const countryCode = getLanguageCode(lang.language)
    
    return {
      right: (
        <span className="inline-flex items-center gap-1.5">
          <CountryFlag code={countryCode} className="flex-shrink-0" />
          {capitalizedName}
        </span>
      ) as any,
      center: lang.level ? (
        <span className="duolingo-level-badge">
          Level {lang.level}
        </span>
      ) as any : undefined,
      left: (
        <span className="duolingo-xp-text">
          {abbreviateNumber(lang.xp)} XP
        </span>
      ) as any,
    }
  })

  const terminalLines: TerminalLineProps[] = limitedData.map((lang) => {
    const capitalizedName = capitalizeLanguage(lang.language)
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
            <div className="flex flex-col gap-1">
              {listItems.map((item, index) => (
                <div key={`duolingo-list-item-${index}`} className="duolingo-list-item">
                  <div className="flex gap-2 items-center min-h-[50px] max-h-[50px]">
                    <div className="flex flex-col w-full h-full justify-evenly overflow-hidden">
                      <div className="font-semibold text-lg text-default-highlight truncate flex items-center">
                        {item.right}
                      </div>
                      <div className="flex justify-between items-baseline gap-2">
                        {item.center && (
                          <div className="text-sm text-default-muted truncate flex items-center">
                            {item.center}
                          </div>
                        )}
                        {item.left && (
                          <div className="text-sm text-default-muted truncate w-fit ml-auto flex items-center">
                            {item.left}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

