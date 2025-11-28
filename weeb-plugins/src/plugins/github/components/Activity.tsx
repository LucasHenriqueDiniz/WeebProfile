/**
 * Componente Activity do GitHub
 * 
 * Versão simplificada migrada do source original
 */

import React from 'react'
import { FaCode, FaComment, FaExclamationCircle, FaHistory } from 'react-icons/fa'
import { GoCodeReview } from 'react-icons/go'
import { HiUsers } from 'react-icons/hi'
import { AiOutlineEye, AiOutlineStar } from 'react-icons/ai'
import { RiGitPullRequestLine, RiGitRepositoryLine } from 'react-icons/ri'
import { abbreviateNumber } from '../../../utils/number'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { StatisticRow } from '../../../templates/Default/DefaultStatRow'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'

interface ActivityProps {
  data: GithubData['activity']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultActivity = ({ data }: { data: GithubData['activity'] }) => {
  const leftColumnRows = [
    {
      icon: <FaCode className="text-default-muted" />,
      title: 'Total Commits',
      value: abbreviateNumber(data.totalCommitContributions),
    },
    {
      icon: <RiGitPullRequestLine className="text-default-muted" />,
      title: 'PRs Created',
      value: abbreviateNumber(data.totalPullRequestContributions),
    },
    {
      icon: <GoCodeReview className="text-default-muted" />,
      title: 'PR Reviews',
      value: abbreviateNumber(data.totalPullRequestReviewContributions),
    },
    {
      icon: <FaExclamationCircle className="text-default-muted" />,
      title: 'Issues Created',
      value: abbreviateNumber(data.totalIssueContributions),
    },
    {
      icon: <FaComment className="text-default-muted" />,
      title: 'Issues Comments',
      value: abbreviateNumber(data.issueComments),
    },
  ]

  const rightColumnRows = [
    {
      icon: <RiGitRepositoryLine className="text-default-text" />,
      title: 'Organizations',
      value: abbreviateNumber(data.organizations),
    },
    {
      icon: <HiUsers className="text-default-muted" />,
      title: 'Following',
      value: abbreviateNumber(data.following),
    },
    {
      icon: <AiOutlineStar className="text-default-muted" />,
      title: 'Starred',
      value: abbreviateNumber(data.starredRepositories),
    },
    {
      icon: <AiOutlineEye className="text-default-muted" />,
      title: 'Watching',
      value: abbreviateNumber(data.watching),
    },
  ]

  return (
    <div className="w-full flex gap-2 p-0 m-0">
      <StatisticRow rows={leftColumnRows} />
      <StatisticRow rows={rightColumnRows} />
    </div>
  )
}

const TerminalActivity = ({ data }: { data: GithubData['activity'] }) => {
  const gridData = [
    {
      title: 'Commits',
      value: abbreviateNumber(data.totalCommitContributions),
    },
    {
      title: 'PRs Created',
      value: abbreviateNumber(data.totalPullRequestContributions),
    },
    {
      title: 'PR Reviews',
      value: abbreviateNumber(data.totalPullRequestReviewContributions),
    },
    {
      title: 'Issues',
      value: abbreviateNumber(data.totalIssueContributions),
    },
    {
      title: 'Comments',
      value: abbreviateNumber(data.issueComments),
    },
    {
      title: 'Organizations',
      value: abbreviateNumber(data.organizations),
    },
    {
      title: 'Following',
      value: abbreviateNumber(data.following),
    },
    {
      title: 'Starred',
      value: abbreviateNumber(data.starredRepositories),
    },
    {
      title: 'Watching',
      value: abbreviateNumber(data.watching),
    },
  ]

  return <TerminalGrid data={gridData} rightText="Activity" leftText="Count" />
}

export function GithubActivity({ data, config, style, size }: ActivityProps): React.ReactElement {
  const title = config.activity_title ?? 'Activity'
  const hideTitle = config.activity_hide_title ?? false

  return (
    <section id="github-activity">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHistory />} />}
            <DefaultActivity data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'activity',
                username: config.username,
                size,
              })}
            />
            <TerminalActivity data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

