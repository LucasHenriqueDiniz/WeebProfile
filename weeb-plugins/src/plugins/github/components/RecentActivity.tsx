import React from 'react'
import { FaClock, FaCode, FaCodeBranch, FaComment, FaExclamationCircle } from 'react-icons/fa'
import { RiGitMergeLine, RiGitPullRequestLine } from 'react-icons/ri'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { formatRelativeTime, formatRelativeTimeShort } from '../../shared/utils/formatting'
import type { GithubConfig, GithubData } from '../types'

interface RecentActivityProps {
  data: GithubData['recentActivity']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

// Agrupar atividades por dia
function groupActivitiesByDay(activities: GithubData['recentActivity']): Map<string, GithubData['recentActivity']> {
  const grouped = new Map<string, GithubData['recentActivity']>()
  
  if (!activities) {
    return grouped
  }
  
  for (const activity of activities) {
    const date = new Date(activity.date)
    const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, [])
    }
    grouped.get(dayKey)!.push(activity)
  }
  
  return grouped
}

// Formatação de label de dia (Today, Yesterday, etc)
function formatDayLabel(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Resetar horas para comparação
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
  
  if (dateDay.getTime() === todayDay.getTime()) {
    return 'Today'
  } else if (dateDay.getTime() === yesterdayDay.getTime()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const DefaultRecentActivity = ({ data, max }: { data: GithubData['recentActivity']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No recent activity</div>
  }

  const activities = data.slice(0, max)
  const grouped = groupActivitiesByDay(activities)
  const sortedDays = Array.from(grouped.keys()).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  const getIcon = (type: string) => {
    const iconClass = "text-default-muted"
    switch (type) {
      case 'commit':
        return <FaCode className={iconClass} size={14} />
      case 'pr':
        return <RiGitPullRequestLine className={iconClass} size={14} />
      case 'issue':
        return <FaExclamationCircle className={iconClass} size={14} />
      case 'comment':
        return <FaComment className={iconClass} size={14} />
      case 'branch':
        return <FaCodeBranch className={iconClass} size={14} />
      case 'merged':
        return <RiGitMergeLine className={iconClass} size={14} />
      default:
        return <FaCode className={iconClass} size={14} />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'commit':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">PUSH</span>
      case 'pr':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">PR</span>
      case 'issue':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">ISSUE</span>
      case 'comment':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">COMMENT</span>
      case 'branch':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">BRANCH</span>
      case 'merged':
        return <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-default-muted/10 text-default-muted border border-default-border/50">MERGE</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedDays.map((dayKey) => {
        const dayActivities = grouped.get(dayKey)
        if (!dayActivities || dayActivities.length === 0) return null
        const firstActivity = dayActivities[0]
        if (!firstActivity) return null
        const dayLabel = formatDayLabel(firstActivity.date)
        
        return (
          <div key={dayKey} className="flex flex-col gap-3">
            {/* Header do dia */}
            <div className="text-xs font-semibold text-default-muted uppercase tracking-wide">
              {dayLabel}
            </div>
            
            {/* Lista de atividades simples */}
            <div className="flex flex-col gap-3">
              {dayActivities.map((activity, index) => {
                return (
                  <a
                    key={index}
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg border border-default-border"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(activity.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {getTypeBadge(activity.type)}
                        <span className="text-xs text-default-muted font-mono">
                          {formatRelativeTime(activity.date)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-default-text mb-1.5">
                        <span className="text-default-link font-medium line-clamp-2">
                          {activity.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {activity.filesChanged && (
                          <>
                            <span className="text-xs text-default-muted">
                              {activity.filesChanged.files} file{activity.filesChanged.files !== 1 ? 's' : ''}
                            </span>
                            {activity.filesChanged.additions > 0 && (
                              <span className="text-xs font-mono text-green-600 dark:text-green-400">
                                +{activity.filesChanged.additions}
                              </span>
                            )}
                            {activity.filesChanged.deletions > 0 && (
                              <span className="text-xs font-mono text-red-600 dark:text-red-400">
                                -{activity.filesChanged.deletions}
                              </span>
                            )}
                          </>
                        )}
                        <span className="text-xs text-default-muted font-mono">
                          {activity.repository}
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Terminal mode: git log style
const TerminalRecentActivity = ({ data, max }: { data: GithubData['recentActivity']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-terminal-muted text-sm">No recent activity</div>
  }

  const activities = data.slice(0, max)

  const getTypeSymbol = (type: string) => {
    switch (type) {
      case 'commit':
        return 'PUSH'
      case 'pr':
        return 'PR'
      case 'issue':
        return 'ISSUE'
      case 'comment':
        return 'CMT'
      case 'branch':
        return 'BRANCH'
      case 'merged':
        return 'MERGE'
      default:
        return 'EVT'
    }
  }

  return (
    <div className="flex flex-col gap-1 font-mono text-sm">
      {activities.map((activity, index) => {
        const relativeTime = formatRelativeTimeShort(activity.date)
        const typeSymbol = getTypeSymbol(activity.type)

        return (
          <a
            key={index}
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-terminal-text"
          >
            <span className="text-terminal-muted">*</span>
            <span className="text-terminal-muted w-12 shrink-0 truncate">{relativeTime}</span>
            <span className="text-terminal-highlight w-16 shrink-0 truncate">{typeSymbol}</span>
            <span className="text-terminal-muted w-32 shrink-0 truncate">{activity.repository}</span>
            <span className="text-terminal-text truncate">{activity.title}</span>
          </a>
        )
      })}
    </div>
  )
}

export function GithubRecentActivity({ data, config, style, size }: RecentActivityProps): React.ReactElement {
  const title = config.recent_activity_title ?? 'Recent Activity'
  const hideTitle = config.recent_activity_hide_title ?? false
  const max = config.recent_activity_max ?? 10

  if (!data || data.length === 0) {
    return <></>
  }

  const activities = data.slice(0, max)

  return (
    <section id="github-recent-activity">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}
            <DefaultRecentActivity data={activities} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'recent_activity',
                size,
              })}
            />
            <TerminalRecentActivity data={activities} max={max} />
          </>
        }
      />
    </section>
  )
}
