/**
 * RecentSubmissions - Componente para exibir submissões recentes do Codeforces
 */

import React from 'react'
import { FaCode } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types'
import type { CodeforcesConfig, CodeforcesSubmission } from '../types'

interface RecentSubmissionsProps {
  data: CodeforcesSubmission[]
  config: CodeforcesConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RecentSubmissions({ data, config, style = 'default', size = 'half' }: RecentSubmissionsProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const hideTitle = config.nonEssential?.recent_submissions_hide_title || false
  const title = config.nonEssential?.recent_submissions_title || 'Recent Code Submissions'
  const maxItems = config.nonEssential?.recent_submissions_max || 5

  const limitedData = data.slice(0, maxItems)

  // Helper para obter cor do veredicto
  const getVerdictColor = (verdict: string): { bg: string; text: string; border: string } => {
    const lower = verdict.toLowerCase()
    if (lower.includes('accepted') || lower === 'ok') {
      return { bg: '#10B98120', text: '#10B981', border: '#10B98140' } // Green
    }
    if (lower.includes('wrong') || lower.includes('wa')) {
      return { bg: '#EF444420', text: '#EF4444', border: '#EF444440' } // Red
    }
    if (lower.includes('time') || lower.includes('tle')) {
      return { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' } // Orange
    }
    if (lower.includes('runtime') || lower.includes('rte')) {
      return { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640' } // Purple
    }
    return { bg: '#6B728020', text: '#6B7280', border: '#6B728040' } // Gray
  }

  const listItems: ListItemProps[] = limitedData.map((sub) => {
    const verdictColors = getVerdictColor(sub.verdict)
    
    return {
      right: sub.problem,
      center: (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
          style={{
            backgroundColor: verdictColors.bg,
            color: verdictColors.text,
            borderColor: verdictColors.border,
          }}
        >
          {sub.verdict}
        </span>
      ) as any,
      left: sub.date ? new Date(sub.date).toLocaleDateString() : '',
    }
  })

  const terminalLines: TerminalLineProps[] = limitedData.map((sub) => ({
    right: sub.problem,
    left: `${sub.verdict}${sub.date ? ` (${new Date(sub.date).toLocaleDateString()})` : ''}`,
  }))

  return (
    <section id="codeforces-recent-submissions">
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
                plugin: 'codeforces',
                section: 'recent_submissions',
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

