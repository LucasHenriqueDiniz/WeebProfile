import React from 'react'
import { FaGithub, FaUserFriends } from 'react-icons/fa'
import { RiGitRepositoryLine } from 'react-icons/ri'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { ImageComponent } from '../../../utils/image.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { GithubConfig, GithubData } from '../types.js'
import { getCalendarColor } from '../utils.js'

interface ProfileProps {
  data: GithubData['user']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}


const DefaultProfile = ({ data, size }: { data: GithubData['user']; size: 'half' | 'full' }) => {
  const years = new Date().getFullYear() - new Date(data.createdAt).getFullYear()
  const isHalfMode = size === 'half'
  const weeksToShow = isHalfMode ? 12 : 24

  return (
    <div className="flex flex-col">
      {/* Avatar Header */}
      <div className="w-full overflow-hidden flex items-center gap-1.5 border-0 border-b border-default-highlight border-solid pb-0.5 my-1.5">
        <ImageComponent
          url64={data.avatarUrl}
          alt={`${data.name}'s avatar`}
          width={45}
          height={45}
          className="rounded-full pb-0.5"
          dontUseUrl64
        />
        <div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <p className="text-default-text text-sm">@{data.login}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-base half:text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 truncate">
            <FaGithub className="text-default-text" />
            <span>Joined {years} years ago</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <FaUserFriends className="text-default-text" />
            <span>{abbreviateNumber(data.followers)} followers</span>
          </div>
        </div>

        {/* Contribution Calendar */}
        <div className="flex flex-col justify-between">
          <div className="flex gap-1">
            {data.contributionCalendar.weeks.slice(-weeksToShow).map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.contributionDays.slice(-1).map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: getCalendarColor(day.color || '') }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-default-text truncate">
            <RiGitRepositoryLine />
            Contributed to {data.repositoriesContributedTo} {isHalfMode ? 'repos' : 'repositories'}
          </div>
        </div>
      </div>
    </div>
  )
}

const TerminalProfile = ({ data }: { data: GithubData['user'] }) => {
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

export function GithubProfile({ data, config, style, size }: ProfileProps): React.ReactElement {
  return (
    <section id="github-profile">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<DefaultProfile data={data} size={size} />}
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'profile',
                size,
              })}
            />
            <TerminalProfile data={data} />
          </>
        }
      />
    </section>
  )
}

