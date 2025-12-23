/**
 * CompletedKata - Componente para exibir kata completados do Codewars
 */

import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { DefaultList } from '../../../templates/Default/DefaultList.js'
import { TerminalList } from '../../../templates/Terminal/TerminalList.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types.js'
import type { CodewarsConfig, CodewarsKata } from '../types.js'

interface CompletedKataProps {
  data: CodewarsKata[]
  config: CodewarsConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function CompletedKata({ data, config, style = 'default', size = 'half' }: CompletedKataProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const hideTitle = config.nonEssential?.completed_kata_hide_title || false
  const title = config.nonEssential?.completed_kata_title || 'Completed Kata'
  const maxItems = config.nonEssential?.completed_kata_max || 5

  const limitedData = data.slice(0, maxItems)

  // Helper para obter cor do rank do Codewars
  const getDifficultyColor = (difficulty: string): string => {
    const kyu = parseInt(difficulty.match(/\d+/)?.[0] || '0')
    if (kyu >= 7) return '#CCCCCC' // White/Gray
    if (kyu >= 6) return '#FFFFFF' // White
    if (kyu >= 5) return '#FEFF99' // Yellow
    if (kyu >= 4) return '#99FEFF' // Blue
    if (kyu >= 3) return '#85F3FF' // Cyan
    if (kyu >= 2) return '#00D9FF' // Light Blue
    if (kyu >= 1) return '#0059FF' // Blue
    return '#B900B4' // Purple (dan)
  }

  const listItems: ListItemProps[] = limitedData.map((kata) => {
    const difficulty = kata.difficulty !== 'Unknown' ? kata.difficulty : null
    const difficultyColor = difficulty ? getDifficultyColor(difficulty) : null
    
    return {
      right: kata.name,
      center: difficulty ? (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border"
          style={{
            backgroundColor: `${difficultyColor}20`,
            color: difficultyColor || 'inherit',
            borderColor: `${difficultyColor}40`,
          }}
        >
          {difficulty}
        </span>
      ) as any : undefined,
      left: kata.completedAt ? new Date(kata.completedAt).toLocaleDateString() : '',
    }
  })

  const terminalLines: TerminalLineProps[] = limitedData.map((kata) => ({
    right: kata.name,
    left: kata.difficulty !== 'Unknown' ? `${kata.difficulty}${kata.completedAt ? ` (${new Date(kata.completedAt).toLocaleDateString()})` : ''}` : (kata.completedAt ? new Date(kata.completedAt).toLocaleDateString() : ''),
  }))

  return (
    <section id="codewars-completed-kata">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaCheckCircle />} />}
            <DefaultList data={listItems} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codewars',
                section: 'completed_kata',
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

