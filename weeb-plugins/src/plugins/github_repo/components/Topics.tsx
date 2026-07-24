import React from "react"
import { FaTag } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

const TOPICS_DISPLAY_LIMIT = 6

interface TopicsProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function TopicChips({ topics, max }: { topics: string[]; max: number }): React.ReactElement | null {
  const visible = topics.slice(0, max)
  if (visible.length === 0) return null
  const remaining = topics.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((topic) => (
        <span
          key={topic}
          className="rounded-full border border-default-primary/20 bg-default-primary/10 px-2 py-0.5 text-xs text-default-primary"
        >
          {topic}
        </span>
      ))}
      {remaining > 0 && <span className="text-xs text-default-muted">+{remaining} more</span>}
    </div>
  )
}

export function Topics({ config, data, style = "default", size = "half" }: TopicsProps): React.ReactElement {
  if (!config.enabled || !data || data.topics.length === 0) return <></>

  const title = config.topics_title ?? "Topics"
  const hideTitle = config.topics_hide_title ?? false
  const maxTopics = Math.min(config.max_topics ?? TOPICS_DISPLAY_LIMIT, TOPICS_DISPLAY_LIMIT)

  return (
    <section id="github-repo-topics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaTag />} />}
            <div className="rounded-lg border border-default-border p-4">
              <TopicChips topics={data.topics} max={maxTopics} />
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "topics", size })} />
            <div className="px-1 pb-1">
              <TopicChips topics={data.topics} max={maxTopics} />
            </div>
          </>
        }
      />
    </section>
  )
}
