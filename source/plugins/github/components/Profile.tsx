import Img64 from "core/src/base/ImageComponent"
import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import {
  FaAward,
  FaBoxOpen,
  FaDonate,
  FaGitAlt,
  FaGithub,
  FaHeart,
  FaMapMarkerAlt,
  FaStar,
  FaUserFriends,
} from "react-icons/fa"
import { abbreviateNumber } from "source/helpers/number"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalLineWithDots from "source/templates/Terminal/TerminalLineWithDots"
import { UserResponse } from "../types/UserResponse"

const DefaultProfile = ({ data }: { data: UserResponse }) => {
  const years = new Date().getFullYear() - new Date(data.createdAt).getFullYear()
  const { contributionsCollection: contributions, repositories } = data

  return (
    <div className="profile-container space-y-6">
      {/* Header Section */}
      <div className="header-section grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Img64
            url64={data.avatarUrl}
            alt={`${data.name}'s avatar`}
            width={80}
            height={80}
            className="rounded-[100%] overflow-hidden"
          />
          <div>
            <h2 className="text-xl font-bold">{data.name}</h2>
            <p className="text-gray-600">@{data.login}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <FaGithub className="text-gray-600" />
            <span>Joined GitHub {years} years ago</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-gray-600" />
            <span>
              {data.followers.totalCount} followers · {data.following.totalCount} following
            </span>
          </div>
        </div>
      </div>

      {/* Contribution Calendar */}
      <div className="contribution-calendar bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Contribution Calendar</h3>
        <div className="calendar-wrapper overflow-x-auto">
          <div className="calendar-grid min-w-full">
            {data.calendar.contributionCalendar.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week-container">
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: day.color }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid - 2x2 Layout */}
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      {/* Activity Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <span className="font-bold">{contributions.totalCommitContributions}</span>
          <span className="text-sm">Commits</span>
        </div>
        <div className="stat-card">
          <span className="font-bold">{contributions.totalPullRequestContributions}</span>
          <span className="text-sm">Pull Requests</span>
        </div>
        <div className="stat-card">
          <span className="font-bold">{contributions.totalIssueContributions}</span>
          <span className="text-sm">Issues</span>
        </div>
        <div className="stat-card">
          <span className="font-bold">{data.issueComments.totalCount}</span>
          <span className="text-sm">Comments</span>
        </div>

        {/* Community Status */}
        <div className="community-section bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Community Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <span className="font-bold">{data.organizations.totalCount}</span>
              <span className="text-sm">Organizations</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{data.watching.totalCount}</span>
              <span className="text-sm">Watching</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{data.starredRepositories.totalCount}</span>
              <span className="text-sm">Starred</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{data.packages.totalCount}</span>
              <span className="text-sm">Packages</span>
            </div>
          </div>
        </div>

        {/* Repository Stats - Full Width */}
        <div className="repository-section col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Repository Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="stat-card">
              <span className="font-bold">{repositories.totalCount}</span>
              <span className="text-sm">Total Repos</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{data.repositoriesContributedTo.totalCount}</span>
              <span className="text-sm">Contributed To</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{(repositories.totalDiskUsage / 1024).toFixed(1)}MB</span>
              <span className="text-sm">Disk Usage</span>
            </div>
            <div className="stat-card">
              <span className="font-bold">{data.gists.totalCount}</span>
              <span className="text-sm">Gists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TerminalProfile = ({ data }: { data: UserResponse }) => {
  const years = new Date().getFullYear() - new Date(data.createdAt).getFullYear()

  const allMetrics = [
    {
      icon: <FaUserFriends className="color-primary" />,
      title: "Followers",
      value: data.followers.totalCount,
    },
    {
      icon: <FaHeart className="default-completed" />,
      title: "Following",
      value: data.following.totalCount,
    },
    {
      icon: <FaBoxOpen className="default-completed" />,
      title: "Packages",
      value: data.packages.totalCount,
    },
    {
      icon: <FaDonate className="color-primary" />,
      title: "Sponsorships",
      value: data.sponsorshipsAsMaintainer.totalCount + data.sponsorshipsAsSponsor.totalCount,
    },
    {
      icon: <FaStar className="default-completed" />,
      title: "Starred Repos",
      value: data.starredRepositories?.totalCount || 0,
    },
    {
      icon: <FaAward className="color-primary" />,
      title: "Achievements",
      value: 0,
    }, // Placeholder for future achievements
    {
      icon: <FaGitAlt className="default-completed" />,
      title: "Repositories",
      value: data.repositories.totalCount,
    },
  ]

  const relevantMetrics = allMetrics
    .filter((metric) => metric.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)

  return (
    <>
      <TerminalLineWithDots title="On GitHub" value={`${years}+ years`} />
      {relevantMetrics.map((metric) => (
        <TerminalLineWithDots key={metric.title} title={metric.title} value={abbreviateNumber(metric.value)} />
      ))}
    </>
  )
}

export default function GithubProfile({ data }: { data: UserResponse }): JSX.Element {
  const { github } = getEnvVariables()
  if (!github) throw new Error("Github plugin not found in GithubProfile component")

  const title = data.name
  const hideTitle = github.profile_hide_title

  return (
    <section id="github" className="github-profile">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <DefaultProfile data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "profile",
                username: github.username,
              })}
            />
            <TerminalProfile data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
