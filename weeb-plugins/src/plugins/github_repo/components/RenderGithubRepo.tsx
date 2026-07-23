import React from "react"
import { FaBalanceScale, FaCodeBranch, FaStar } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import type { GridItemProps } from "../../../templates/types"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

// Deterministic truncation limits — calculateHeight() in index.tsx must stay in sync with these.
const DESCRIPTION_MAX_CHARS = 120
const TOPICS_DISPLAY_LIMIT = 6

interface RenderGithubRepoProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + "…"
}

const DefaultRepositoryCard = ({
  data,
  config,
}: {
  data: GithubRepoData
  config: GithubRepoConfig
}): React.ReactElement => {
  const showDescription = config.show_description ?? true
  const showLanguage = config.show_language ?? true
  const showStats = config.show_stats ?? true
  const showLicense = config.show_license ?? true
  const showTopics = config.show_topics ?? true
  const maxTopics = Math.min(config.max_topics ?? TOPICS_DISPLAY_LIMIT, TOPICS_DISPLAY_LIMIT)

  const visibleTopics = data.topics.slice(0, maxTopics)
  const remainingTopics = data.topics.length - visibleTopics.length

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 p-4 rounded-lg border border-default-border"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-base text-default-text truncate">{data.nameWithOwner}</span>
        {showLanguage && data.primaryLanguage && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
            style={{
              backgroundColor: `${data.primaryLanguage.color}15`,
              color: data.primaryLanguage.color,
              border: `1px solid ${data.primaryLanguage.color}30`,
            }}
          >
            {data.primaryLanguage.name}
          </span>
        )}
        {showLicense && data.licenseInfo && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-default-muted/10 text-default-muted border border-default-border/50 flex-shrink-0">
            {data.licenseInfo.spdxId || data.licenseInfo.name}
          </span>
        )}
      </div>

      {showDescription && (
        <p className="text-sm text-default-muted line-clamp-2 leading-relaxed min-h-[2.5em]">
          {data.description ? truncate(data.description, DESCRIPTION_MAX_CHARS) : ""}
        </p>
      )}

      {showStats && (
        <div className="flex items-center gap-4 text-sm text-default-muted">
          <div className="flex items-center gap-1.5">
            <FaStar className="text-yellow-500 fill-yellow-500" size={14} />
            <span className="font-medium">{abbreviateNumber(data.stargazerCount)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCodeBranch size={14} />
            <span className="font-medium">{abbreviateNumber(data.forkCount)}</span>
          </div>
          {showLicense && data.licenseInfo && (
            <div className="flex items-center gap-1.5">
              <FaBalanceScale size={14} />
              <span className="font-medium">{data.licenseInfo.spdxId || data.licenseInfo.name}</span>
            </div>
          )}
        </div>
      )}

      {showTopics && visibleTopics.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {visibleTopics.map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-full bg-default-primary/10 text-default-primary border border-default-primary/20"
            >
              {topic}
            </span>
          ))}
          {remainingTopics > 0 && <span className="text-xs text-default-muted">+{remainingTopics} more</span>}
        </div>
      )}
    </a>
  )
}

export function RenderGithubRepo({
  config,
  data,
  style = "default",
  size = "half",
}: RenderGithubRepoProps): React.ReactElement {
  if (!config.enabled || !data) {
    return <></>
  }

  const title = config.repository_card_title ?? "Repository"
  const hideTitle = config.repository_card_hide_title ?? false

  const gridData: GridItemProps[] = [
    {
      title: data.nameWithOwner,
      subtitle: data.description || undefined,
      value: `⭐ ${abbreviateNumber(data.stargazerCount)} 🍴 ${abbreviateNumber(data.forkCount)}`,
    },
  ]

  return (
    <section id="github-repo-repository-card">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaStar />} />}
            <DefaultRepositoryCard data={data} config={config} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github_repo",
                section: "repository_card",
                size,
              })}
            />
            <TerminalGrid data={gridData} rightText="Repository" centerText="Description" leftText="Stats" />
          </>
        }
      />
    </section>
  )
}
