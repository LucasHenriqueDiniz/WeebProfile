import React from "react"
import { FaGithub, FaUserFriends } from "react-icons/fa"
import { RiGitRepositoryLine } from "react-icons/ri"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ImageComponent from "source/templates/ImageComponent"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import TerminalLineWithDots from "templates/Terminal/TerminalLineWithDots"
import { UserResponse } from "../types/UserResponse"

const DefaultProfile = ({ data }: { data: UserResponse }) => {
  const years = new Date().getFullYear() - new Date(data.createdAt).getFullYear()
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalfMode = env.size === "half"
  // Define number of weeks to show based on size
  const weeksToShow = isHalfMode ? 12 : 24

  return (
    <div className="flex flex-col">
      {/* Avatar Header */}
      <div className="w-full overflow-hidden flex items-center gap-1.5 border-0 border-b border-default-highlight border-solid pb-0.5 my-1.5">
        <ImageComponent
          url64={data.avatarUrl}
          alt={`${data.name}'s avatar`}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <p className="text-default-muted text-sm">@{data.login}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-base half-mode:text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 truncate">
            <FaGithub className="text-default-muted" />
            <span>Joined {years} years ago</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <FaUserFriends className="text-default-muted" />
            <span>{abbreviateNumber(data.followers)} followers</span>
          </div>
        </div>

        {/* Modified Contribution Calendar */}
        <div className="flex flex-col justify-between">
          <div className="flex gap-1">
            {data.contributionCalendar.weeks.slice(-weeksToShow).map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.contributionDays.slice(-1).map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: day.color }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-default-muted truncate">
            <RiGitRepositoryLine />
            Contributed to {data.repositoriesContributedTo} {isHalfMode ? "repos" : "repositories"}
          </div>
        </div>
      </div>
    </div>
  )
}

const TerminalProfile = ({ data }: { data: UserResponse }) => {
  const years = new Date().getFullYear() - new Date(data.createdAt).getFullYear()

  return (
    <>
      <TerminalLineWithDots title="GitHub Profile" value={`@${data.login}`} />
      <TerminalLineWithDots title="Member for" value={`${years} years`} />
      <TerminalLineWithDots title="Followers" value={abbreviateNumber(data.followers)} />
      <TerminalLineWithDots title="Following" value={abbreviateNumber(data.following)} />
      <TerminalLineWithDots title="Contributed to" value={`${data.repositoriesContributedTo} repositories`} />
    </>
  )
}

export default function GithubProfile({ data }: { data: UserResponse }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("Github plugin not found")

  return (
    <section id="github-profile">
      <RenderBasedOnStyle
        defaultComponent={<DefaultProfile data={data} />}
        terminalComponent={
          <>
            <TerminalCommand command={`gh profile view ${github.username}`} />
            <TerminalProfile data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
