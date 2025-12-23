/**
 * ContestsParticipated - Componente para exibir número de contests do Codeforces
 */

import React from 'react'
import { FaTrophy } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { CodeforcesConfig } from '../types.js'

interface ContestsParticipatedProps {
  count: number
  config: CodeforcesConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function ContestsParticipated({ count, config, style = 'default', size = 'half' }: ContestsParticipatedProps): React.ReactElement {
  const hideTitle = config.nonEssential?.contests_participated_hide_title || false
  const title = config.nonEssential?.contests_participated_title || 'Contests Participated'

  return (
    <section id="codeforces-contests-participated">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-3 items-center w-full">
              <FaTrophy className="text-yellow-500 flex-shrink-0" />
              <div className="flex items-center gap-2 flex-1">
                <p className="text-sm text-default-muted">Contests:</p>
                <p className="text-lg font-semibold text-default-highlight">{abbreviateNumber(count)}</p>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'codeforces',
                section: 'contests_participated',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Contests Participated"
              value={abbreviateNumber(count)}
            />
          </>
        }
      />
    </section>
  )
}

