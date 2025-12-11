import React from 'react'
import { FaBuilding, FaLink, FaMapMarkerAlt, FaTwitter, FaUser, FaUsers } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface IntroductionProps {
  data: GithubData['introduction']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  activity?: GithubData['activity']
}

const DefaultIntroduction = ({ data, activity, customText }: { data: GithubData['introduction']; activity?: GithubData['activity']; customText?: string }) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-3 text-sm">
      {customText && (
        <p className="text-default-text whitespace-pre-line">{customText}</p>
      )}
      {data.bio && (
        <p className="text-default-text">{data.bio}</p>
      )}
      <div className="flex flex-wrap gap-4 text-default-muted items-center">
        {data.location && (
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-base" />
            <span>{data.location}</span>
          </div>
        )}
        {data.company && (
          <div className="flex items-center gap-1.5">
            <FaBuilding className="text-base" />
            <span>{data.company}</span>
          </div>
        )}
        {activity?.organizations && activity.organizations > 0 && (
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-base" />
            <span>{activity.organizations} organization{activity.organizations !== 1 ? 's' : ''}</span>
          </div>
        )}
        {data.websiteUrl && (
          <a 
            href={data.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 text-default-link hover:underline"
          >
            <FaLink className="text-base" />
            <span>{data.websiteUrl.replace(/^https?:\/\//, '')}</span>
          </a>
        )}
        {data.twitterUsername && (
          <a 
            href={`https://twitter.com/${data.twitterUsername}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 text-default-link hover:underline"
          >
            <FaTwitter className="text-base" />
            <span>@{data.twitterUsername}</span>
          </a>
        )}
      </div>
    </div>
  )
}

const TerminalIntroduction = ({ data, activity, customText }: { data: GithubData['introduction']; activity?: GithubData['activity']; customText?: string }) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-1 text-terminal-text text-sm">
      {customText && (
        <p className="whitespace-pre-line">{customText}</p>
      )}
      {data.bio && (
        <p>{data.bio}</p>
      )}
      <div className="flex flex-col gap-1 text-terminal-muted">
        {data.location && (
          <span>📍 {data.location}</span>
        )}
        {data.company && (
          <span>🏢 {data.company}</span>
        )}
        {activity?.organizations && activity.organizations > 0 && (
          <span>👥 {activity.organizations} organization{activity.organizations !== 1 ? 's' : ''}</span>
        )}
        {data.websiteUrl && (
          <span>🔗 {data.websiteUrl}</span>
        )}
        {data.twitterUsername && (
          <span>🐦 @{data.twitterUsername}</span>
        )}
      </div>
    </div>
  )
}

export function GithubIntroduction({ data, config, style, size, activity }: IntroductionProps): React.ReactElement {
  const title = config.introduction_title ?? 'Introduction'
  const hideTitle = config.introduction_hide_title ?? false
  const customText = config.introduction_custom_text

  if (!data) {
    return <></>
  }

  return (
    <section id="github-introduction">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaUser />} />}
            <DefaultIntroduction data={data} activity={activity} customText={customText} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'introduction',
                username: config.username,
                size,
              })}
            />
            <TerminalIntroduction data={data} activity={activity} customText={customText} />
          </>
        }
      />
    </section>
  )
}

