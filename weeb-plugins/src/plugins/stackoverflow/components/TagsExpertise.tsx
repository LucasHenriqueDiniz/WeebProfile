/**
 * TagsExpertise - Componente para exibir tags de expertise do Stack Overflow
 */

import React from 'react'
import { FaTag } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { DefaultList } from '../../../templates/Default/DefaultList.js'
import { TerminalList } from '../../../templates/Terminal/TerminalList.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import { getLanguageIcon, capitalizeLanguage } from '../../../utils/language-icons.js'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types.js'
import type { StackOverflowConfig, StackOverflowTag } from '../types.js'

interface TagsExpertiseProps {
  data: StackOverflowTag[]
  config: StackOverflowConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TagsExpertise({ data, config, style = 'default', size = 'half' }: TagsExpertiseProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const hideTitle = config.nonEssential?.tags_expertise_hide_title || false
  const title = config.nonEssential?.tags_expertise_title || 'Tags Expertise'
  const maxItems = config.nonEssential?.tags_expertise_max || 5

  const limitedData = data.slice(0, maxItems)

  const listItems: ListItemProps[] = limitedData.map((tag) => {
    const LanguageIcon = getLanguageIcon(tag.name)
    const capitalizedName = capitalizeLanguage(tag.name)
    
    return {
      right: (
        <span className="inline-flex items-center gap-1.5">
          <LanguageIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          {capitalizedName}
        </span>
      ) as any,
      left: (
        <span className="text-xs font-semibold text-default-highlight">
          {abbreviateNumber(tag.score)} score
        </span>
      ) as any,
    }
  })

  const terminalLines: TerminalLineProps[] = limitedData.map((tag) => {
    const capitalizedName = capitalizeLanguage(tag.name)
    return {
      right: capitalizedName,
      left: `${abbreviateNumber(tag.score)} score`,
    }
  })

  return (
    <section id="stackoverflow-tags-expertise">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTag />} />}
            <DefaultList data={listItems} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'stackoverflow',
                section: 'tags_expertise',
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

