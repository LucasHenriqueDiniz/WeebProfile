import React from 'react'
import { FaClock, FaCode, FaCodeBranch, FaComment, FaExclamationCircle } from 'react-icons/fa'
import { RiGitMergeLine, RiGitPullRequestLine } from 'react-icons/ri'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import type { GridItemProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface RecentActivityProps {
  data: GithubData['recentActivity']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultRecentActivity = ({ data, max }: { data: GithubData['recentActivity']; max: number }) => {
  if (!data || data.length === 0) {
    return <div className="text-default-muted text-sm">No recent activity</div>
  }

  const activities = data.slice(0, max)

  const getIcon = (type: string) => {
    const iconClass = "text-default-muted"
    switch (type) {
      case 'commit':
        return <FaCode className={iconClass} size={16} />
      case 'pr':
        return <RiGitPullRequestLine className={iconClass} size={16} />
      case 'issue':
        return <FaExclamationCircle className={iconClass} size={16} />
      case 'comment':
        return <FaComment className={iconClass} size={16} />
      case 'branch':
        return <FaCodeBranch className={iconClass} size={16} />
      case 'merged':
        return <RiGitMergeLine className={iconClass} size={16} />
      default:
        return <FaCode className={iconClass} size={16} />
    }
  }

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'commit':
        return 'Committed'
      case 'pr':
        return 'Opened'
      case 'issue':
        return 'Opened'
      case 'comment':
        return 'Commented'
      case 'branch':
        return 'Created new branch'
      case 'merged':
        return 'Merged'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {activities.map((activity, index) => (
        <a
          key={index}
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 p-3 rounded-lg border border-default-border hover:border-default-highlight hover:bg-default-hover transition-all duration-200 group"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-default-text mb-1">
              <span className="text-default-muted">{getActionLabel(activity.type)} </span>
              <span className="text-default-link hover:underline font-medium group-hover:text-default-highlight transition-colors">
                {activity.title}
              </span>
            </div>
            {activity.filesChanged && (
              <div className="text-xs text-default-muted mb-1">
                {activity.filesChanged.files} file{activity.filesChanged.files !== 1 ? 's' : ''} changed
                {activity.filesChanged.additions > 0 && (
                  <span className="text-green-500 dark:text-green-400 ml-1.5 font-mono">
                    ++{activity.filesChanged.additions}
                  </span>
                )}
                {activity.filesChanged.deletions > 0 && (
                  <span className="text-red-500 dark:text-red-400 ml-1.5 font-mono">
                    --{activity.filesChanged.deletions}
                  </span>
                )}
              </div>
            )}
            <div className="text-xs text-default-muted">
              in{' '}
              <span className="text-default-link hover:underline group-hover:text-default-highlight transition-colors">
                {activity.repository}
              </span>
            </div>
          </div>
        </a>
      ))}
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

  const gridData: GridItemProps[] = activities.map((activity) => ({
    title: activity.title,
    subtitle: activity.repository,
    value: new Date(activity.date).toLocaleDateString(),
  }))

  return (
    <section id="github-recent-activity">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}
            <DefaultRecentActivity data={data} max={max} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'recent_activity',
                username: config.username,
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Activity" centerText="Repository" leftText="Date" />
          </>
        }
      />
    </section>
  )
}

