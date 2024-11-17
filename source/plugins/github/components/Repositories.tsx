import React from "react"
import { FaBox, FaCodeBranch, FaEye, FaHeart, FaStar } from "react-icons/fa"
import { RiGitRepositoryLine } from "react-icons/ri"
import { TbLicense } from "react-icons/tb"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import DefaultTitle from "source/templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalGrid from "templates/Terminal/TerminalGrid"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { RepositoriesData } from "../types/RepositoryData"
import getPseudoCommands from "core/utils/getPseudoCommands"

const DefaultRepositories = ({ data }: { data: RepositoriesData }) => {
  const leftColumnMetrics = [
    {
      icon: <FaStar className="text-default-muted" />,
      title: "Total Stars",
      value: data.repositories.reduce((acc: number, repo) => acc + (repo.stargazerCount || 0), 0),
    },
    {
      icon: <FaCodeBranch className="text-default-muted" />,
      title: "Total Forks",
      value: data.repositories.reduce((acc: number, repo) => acc + (repo.forkCount || 0), 0),
    },
    {
      icon: <FaEye className="text-default-muted" />,
      title: "Total Watchers",
      value: data.repositories.reduce((acc: number, repo) => acc + (repo.watchers ? repo.watchers.totalCount : 0), 0),
    },
    {
      icon: <FaBox className="text-default-muted" />,
      title: "Total Packages",
      value: data.repositories.reduce((acc: number, repo) => acc + (repo.packages ? repo.packages.totalCount : 0), 0),
    },
  ]

  const rightColumnMetrics = [
    {
      icon: <FaHeart className="text-default-muted" />,
      title: "Sponsoring",
      value: data.sponsoringCount,
    },
    {
      icon: <TbLicense className="text-default-muted" />,
      title: "",
      value: `${data.favoriteLicense.name} (${data.favoriteLicense.count})`,
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-2 mb-3 text-base half-mode:text-sm">
        {/* Left Column */}
        <div className="flex flex-col gap-1">
          {leftColumnMetrics.map((metric) => (
            <div key={metric.title} className="flex items-center gap-2 truncate">
              {metric.icon}
              <span>
                {typeof metric.value === "number" ? abbreviateNumber(metric.value) : metric.value} {metric.title}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-1">
          {rightColumnMetrics.map((metric) => (
            <div key={metric.title} className="flex items-center gap-2 truncate">
              {metric.icon}
              <span>
                {typeof metric.value === "number" ? abbreviateNumber(metric.value) : metric.value} {metric.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TerminalRepositories = ({ data }: { data: RepositoriesData }) => {
  const gridData = [
    {
      title: "Repositories",
      value: `${data.repositories.length} repos`,
    },
    {
      title: "Stars",
      value: abbreviateNumber(data.repositories.reduce((acc: number, repo) => acc + repo.stargazerCount, 0)),
    },
    {
      title: "Forks",
      value: abbreviateNumber(data.repositories.reduce((acc: number, repo) => acc + repo.forkCount, 0)),
    },
    {
      title: "Watchers",
      value: abbreviateNumber(data.repositories.reduce((acc: number, repo) => acc + repo.watchers.totalCount, 0)),
    },
    {
      title: "Packages",
      value: abbreviateNumber(data.repositories.reduce((acc: number, repo) => acc + repo.packages.totalCount, 0)),
    },
    {
      title: "Sponsoring",
      value: abbreviateNumber(data.sponsoringCount || 0),
    },
    {
      title: "Disk Usage",
      value: `${Math.round(data.totalDiskUsage / 1024)} MB`,
    },
    {
      title: "License",
      value: `${data.favoriteLicense.name} (${data.favoriteLicense.count})`,
    },
  ]

  return <TerminalGrid data={gridData} rightText="Metric" leftText="Value" />
}

export default function GithubRepositories({ data }: { data: RepositoriesData }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("Github plugin not found")
  const title = (github.repositories_title ?? "<qnt> Repositories").replace(
    "<qnt>",
    abbreviateNumber(data.repositories.length)
  )
  const hideTitle = github.repositories_hide_title ?? false

  return (
    <section id="github-repositories">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiGitRepositoryLine />} />}
            <DefaultRepositories data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: "gh",
                plugin: "github",
                section: "repositories",
                username: github.username,
              })}
            />
            <TerminalRepositories data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
