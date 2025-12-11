import React from 'react'
import { FaBox, FaCodeBranch, FaDatabase, FaEye, FaHeart, FaStar } from 'react-icons/fa'
import { RiGitRepositoryLine } from 'react-icons/ri'
import { TbLicense } from 'react-icons/tb'
import { StatisticRow } from '../../../templates/Default/DefaultStatRow'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { abbreviateNumber, formatDiskUsage } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'


const DefaultRepositories = ({ data, totalDiskUsage, sponsoringCount, favoriteLicense }: { 
  data: GithubData['repositories']
  totalDiskUsage: number
  sponsoringCount: number
  favoriteLicense: GithubData['favoriteLicense']
}) => {
  const leftColumnRows = [
    {
      icon: <FaStar className="text-default-muted" />,
      title: 'Total Stars',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0)),
    },
    {
      icon: <FaCodeBranch className="text-default-muted" />,
      title: 'Total Forks',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.forkCount || 0), 0)),
    },
    {
      icon: <FaEye className="text-default-muted" />,
      title: 'Total Watchers',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.watchers?.totalCount || 0), 0)),
    },
    {
      icon: <FaBox className="text-default-muted" />,
      title: 'Total Packages',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.packages?.totalCount || 0), 0)),
    },
    
  ]

  const rightColumnRows = [
    {
      icon: <FaHeart className="text-default-muted" />,
      title: 'Sponsoring',
      value: abbreviateNumber(sponsoringCount),
    },
    {
      icon: <FaDatabase className="text-default-muted" />,
      title: 'Disk Usage',
      value: formatDiskUsage(totalDiskUsage),
    },
    {
      icon: <TbLicense className="text-default-muted" />,
      title: '',
      value: `${favoriteLicense.name} (${favoriteLicense.count})`,
    },
  ]

  return (
    <div className="w-full flex gap-2 p-0 m-0">
      <StatisticRow rows={leftColumnRows} />
      <StatisticRow rows={rightColumnRows} />
    </div>
  )
}

const TerminalRepositories = ({ data, totalDiskUsage, sponsoringCount, favoriteLicense }: { 
  data: GithubData['repositories']
  totalDiskUsage: number
  sponsoringCount: number
  favoriteLicense: GithubData['favoriteLicense']
}) => {
  const gridData = [
    {
      title: 'Repositories',
      value: `${data.nodes.length} repos`,
    },
    {
      title: 'Stars',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0)),
    },
    {
      title: 'Forks',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + repo.forkCount, 0)),
    },
    {
      title: 'Watchers',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.watchers?.totalCount || 0), 0)),
    },
    {
      title: 'Packages',
      value: abbreviateNumber(data.nodes.reduce((acc, repo) => acc + (repo.packages?.totalCount || 0), 0)),
    },
    {
      title: 'Sponsoring',
      value: abbreviateNumber(sponsoringCount || 0),
    },
    {
      title: 'Disk Usage',
      value: formatDiskUsage(totalDiskUsage),
    },
    {
      title: 'License',
      value: `${favoriteLicense.name} (${favoriteLicense.count})`,
    },
  ]

  return <TerminalGrid data={gridData} rightText="Metric" leftText="Value" />
}

interface RepositoriesProps {
  data: GithubData['repositories']
  totalDiskUsage: number
  sponsoringCount: number
  favoriteLicense: GithubData['favoriteLicense']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubRepositories({ 
  data, 
  totalDiskUsage, 
  sponsoringCount, 
  favoriteLicense,
  config, 
  style, 
  size 
}: RepositoriesProps): React.ReactElement {
  const title = (config.repositories_title ?? '<qnt> Repositories').replace(
    '<qnt>',
    abbreviateNumber(data.nodes.length)
  )
  const hideTitle = config.repositories_hide_title ?? false

  return (
    <section id="github-repositories">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiGitRepositoryLine />} />}
            <DefaultRepositories 
              data={data} 
              totalDiskUsage={totalDiskUsage}
              sponsoringCount={sponsoringCount}
              favoriteLicense={favoriteLicense}
            />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'repositories',
                username: config.username,
                size,
              })}
            />
            <TerminalRepositories 
              data={data} 
              totalDiskUsage={totalDiskUsage}
              sponsoringCount={sponsoringCount}
              favoriteLicense={favoriteLicense}
            />
          </>
        }
      />
    </section>
  )
}

