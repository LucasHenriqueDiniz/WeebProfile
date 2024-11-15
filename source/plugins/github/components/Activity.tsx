import React from "react"
import { AiOutlineEye, AiOutlineStar } from "react-icons/ai"
import { FaCode, FaComment, FaExclamationCircle, FaHistory } from "react-icons/fa"
import { GoCodeReview } from "react-icons/go"
import { HiUsers } from "react-icons/hi"
import { RiGitPullRequestLine, RiGitRepositoryLine } from "react-icons/ri"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalGrid from "templates/Terminal/TerminalGrid"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { ActivityData } from "../types/ActivityData"
import ENV_VARIABLES from "../ENV_VARIABLES"

const DefaultActivity = ({ data }: { data: ActivityData }) => {
  const leftColumnMetrics = [
    {
      icon: <FaCode className="text-default-muted" />,
      title: "Total Commits",
      value: data.totalCommitContributions,
    },
    {
      icon: <RiGitPullRequestLine className="text-default-muted" />,
      title: "PRs Created",
      value: data.totalPullRequestContributions,
    },
    {
      icon: <GoCodeReview className="text-default-muted" />,
      title: "PR Reviews",
      value: data.totalPullRequestReviewContributions,
    },
    {
      icon: <FaExclamationCircle className="text-default-muted" />,
      title: "Issues Created",
      value: data.totalIssueContributions,
    },
    {
      icon: <FaComment className="text-default-muted" />,
      title: "Issues Comments",
      value: data.issueComments,
    },
  ]

  const rightColumnMetrics = [
    {
      icon: <RiGitRepositoryLine className="text-default-muted" />,
      title: "Organizations",
      value: data.organizations,
    },
    {
      icon: <HiUsers className="text-default-muted" />,
      title: "Following",
      value: data.following,
    },
    {
      icon: <AiOutlineStar className="text-default-muted" />,
      title: "Starred",
      value: data.starredRepositories,
    },
    {
      icon: <AiOutlineEye className="text-default-muted" />,
      title: "Watching",
      value: data.watching,
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

const TerminalActivity = ({ data }: { data: ActivityData }) => {
  const gridData = [
    {
      title: "Commits",
      value: abbreviateNumber(data.totalCommitContributions),
    },
    {
      title: "PRs Created",
      value: abbreviateNumber(data.totalPullRequestContributions),
    },
    {
      title: "PR Reviews",
      value: abbreviateNumber(data.totalPullRequestReviewContributions),
    },
    {
      title: "Issues",
      value: abbreviateNumber(data.totalIssueContributions),
    },
    {
      title: "Comments",
      value: abbreviateNumber(data.issueComments),
    },
    {
      title: "Organizations",
      value: abbreviateNumber(data.organizations),
    },
    {
      title: "Following",
      value: abbreviateNumber(data.following),
    },
    {
      title: "Starred",
      value: abbreviateNumber(data.starredRepositories),
    },
    {
      title: "Watching",
      value: abbreviateNumber(data.watching),
    },
  ]

  return <TerminalGrid data={gridData} rightText="Activity" leftText="Count" />
}

export default function GithubActivity({ data }: { data: ActivityData }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const config = envManager.getEnv()
  const github = config.github

  if (!github) throw new Error("Github plugin not found")

  const title = github.activity_title ?? (ENV_VARIABLES.activity_title.defaultValue as string)
  const hideTitle = github.activity_hide_title ?? false

  return (
    <section id="github-activity">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHistory />} />}
            <DefaultActivity data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={`gh activity view ${github.username}`} />
            <TerminalActivity data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
