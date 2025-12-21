/**
 * LanguagesProficiency - Componente para exibir proficiência em linguagens do Codewars
 */

import React from 'react'
import { FaCode } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { getLanguageIcon, capitalizeLanguage } from '../../../utils/language-icons'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types'
import type { CodewarsConfig, CodewarsLanguage } from '../types'

interface LanguagesProficiencyProps {
  languages: Record<string, CodewarsLanguage>
  config: CodewarsConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function LanguagesProficiency({ languages, config, style = 'default', size = 'half' }: LanguagesProficiencyProps): React.ReactElement {
  if (!languages || Object.keys(languages).length === 0) {
    return <></>
  }

  const hideTitle = config.nonEssential?.languages_proficiency_hide_title || false
  const title = config.nonEssential?.languages_proficiency_title || 'Languages Proficiency'
  const maxItems = config.nonEssential?.languages_proficiency_max || 5

  // Converter para array e ordenar por score
  const languagesArray = Object.values(languages)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)

  const listItems: ListItemProps[] = languagesArray.map((lang) => {
    const LanguageIcon = getLanguageIcon(lang.language)
    const capitalizedName = capitalizeLanguage(lang.language)
    
    return {
      right: (
        <span className="inline-flex items-center gap-1.5">
          <LanguageIcon className="w-3.5 h-3.5 text-green-500" />
          {capitalizedName}
        </span>
      ) as any,
      left: (
        <span className="text-xs font-semibold text-default-highlight">
          {abbreviateNumber(lang.score)} points
        </span>
      ) as any,
    }
  })

  const terminalLines: TerminalLineProps[] = languagesArray.map((lang) => ({
    right: lang.language,
    left: `${abbreviateNumber(lang.score)} points`,
  }))

  return (
    <section id="codewars-languages-proficiency">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultList data={listItems} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codewars',
                section: 'languages_proficiency',
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

