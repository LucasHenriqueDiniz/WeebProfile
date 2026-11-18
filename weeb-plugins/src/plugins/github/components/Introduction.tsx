import React from "react"
import { FaBuilding, FaLink, FaMapMarkerAlt, FaTwitter, FaUser, FaUsers } from "react-icons/fa"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubConfig, GithubData } from "../types"
import { ExternalLink, withDefaultScheme } from "../../../utils/external-link"

interface IntroductionProps {
  data: GithubData["introduction"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
  activity?: GithubData["activity"]
}

/** Blocks drawn one under the other: the custom text, the bio and the row of details. */
const blockCount = (data: GithubData["introduction"], customText?: string): number =>
  (customText ? 1 : 0) + (data?.bio ? 1 : 0) + 1

/** Details drawn: location, company, organizations, website and Twitter. */
const detailCount = (data: GithubData["introduction"], activity?: GithubData["activity"]): number =>
  [data?.location, data?.company, (activity?.organizations ?? 0) > 0, data?.websiteUrl, data?.twitterUsername].filter(
    Boolean
  ).length

const DefaultIntroduction = ({
  data,
  activity,
  customText,
}: {
  data: GithubData["introduction"]
  activity?: GithubData["activity"]
  customText?: string
}) => {
  const blocks = useItemCascade(blockCount(data, customText))
  const details = useItemCascade(detailCount(data, activity))
  if (!data) return null

  return (
    <div className={withCascade("flex flex-col gap-3 text-sm", blocks)} style={blocks?.style}>
      {customText && <p className="text-default-text whitespace-pre-line">{customText}</p>}
      {data.bio && <p className="text-default-text">{data.bio}</p>}
      <div
        className={withCascade("flex flex-wrap gap-4 text-default-muted items-center", details)}
        style={details?.style}
      >
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
            <span>
              <AnimatedNumber value={activity.organizations} /> organization{activity.organizations !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {data.websiteUrl && (
          <ExternalLink
            href={withDefaultScheme(data.websiteUrl)}
            className="flex items-center gap-1.5 text-default-link hover:underline"
          >
            <FaLink className="text-base" />
            <span>{data.websiteUrl.replace(/^https?:\/\//, "")}</span>
          </ExternalLink>
        )}
        {data.twitterUsername && (
          <ExternalLink
            href={`https://twitter.com/${data.twitterUsername}`}
            className="flex items-center gap-1.5 text-default-link hover:underline"
          >
            <FaTwitter className="text-base" />
            <span>@{data.twitterUsername}</span>
          </ExternalLink>
        )}
      </div>
    </div>
  )
}

const TerminalIntroduction = ({
  data,
  activity,
  customText,
}: {
  data: GithubData["introduction"]
  activity?: GithubData["activity"]
  customText?: string
}) => {
  const blocks = useItemCascade(blockCount(data, customText))
  const details = useItemCascade(detailCount(data, activity))
  if (!data) return null

  return (
    <div className={withCascade("flex flex-col gap-1 text-terminal-text text-sm", blocks)} style={blocks?.style}>
      {customText && <p className="whitespace-pre-line">{customText}</p>}
      {data.bio && <p>{data.bio}</p>}
      <div className={withCascade("flex flex-col gap-1 text-terminal-muted", details)} style={details?.style}>
        {data.location && <span>📍 {data.location}</span>}
        {data.company && <span>🏢 {data.company}</span>}
        {activity?.organizations && activity.organizations > 0 && (
          <span>
            👥 <AnimatedNumber value={activity.organizations} /> organization
            {activity.organizations !== 1 ? "s" : ""}
          </span>
        )}
        {data.websiteUrl && <span>🔗 {data.websiteUrl}</span>}
        {data.twitterUsername && <span>🐦 @{data.twitterUsername}</span>}
      </div>
    </div>
  )
}

export function GithubIntroduction({ data, config, style, size, activity }: IntroductionProps): React.ReactElement {
  const title = config.introduction_title ?? "Introduction"
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
                plugin: "github",
                section: "introduction",
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
