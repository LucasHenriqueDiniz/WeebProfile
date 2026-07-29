import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, HL, HL_SOFT, HL_SOFTER } from "./redesign"

const TOPICS_DISPLAY_LIMIT = 6

interface TopicsProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const chipBase = "rounded-full text-xs font-medium"
const chipStyle: React.CSSProperties = {
  background: HL_SOFTER,
  color: `color-mix(in srgb, ${HL} 75%, var(--default-color-default))`,
  border: `0.5px solid color-mix(in srgb, ${HL} 30%, transparent)`,
  padding: "5px 12px",
}

// "chips" (default): pills soft-highlight + contador fantasma do excedente.
function TopicChips({ topics, max }: { topics: string[]; max: number }): React.ReactElement | null {
  const visible = topics.slice(0, max)
  if (visible.length === 0) return null
  const remaining = topics.length - visible.length

  return (
    <Card className="flex flex-wrap items-center gap-2 px-[18px] py-4">
      {visible.map((topic) => (
        <span key={topic} className={chipBase} style={chipStyle}>
          {topic}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className={chipBase}
          style={{
            background: "transparent",
            color: "var(--default-color-muted)",
            border: "0.5px solid color-mix(in srgb, var(--default-color-muted) 30%, transparent)",
            padding: "5px 12px",
          }}
        >
          +{remaining}
        </span>
      )}
    </Card>
  )
}

// "cloud": mistura de pesos - os dois primeiros topics maiores/mais fortes, alguns
// fantasma - centralizado.
function TopicCloud({ topics, max }: { topics: string[]; max: number }): React.ReactElement | null {
  const visible = topics.slice(0, max)
  if (visible.length === 0) return null

  return (
    <Card className="flex flex-wrap items-center justify-center gap-2 px-[18px] py-4">
      {visible.map((topic, i) => {
        const big = i < 2
        const ghost = !big && i % 2 === 1
        return (
          <span
            key={topic}
            className="rounded-full font-medium"
            style={{
              fontSize: big ? 13 : 12,
              padding: "5px 12px",
              background: big ? HL_SOFT : ghost ? "transparent" : HL_SOFTER,
              color: ghost ? "var(--default-color-muted)" : `color-mix(in srgb, ${HL} 75%, var(--default-color-default))`,
              border: ghost
                ? "0.5px solid color-mix(in srgb, var(--default-color-muted) 30%, transparent)"
                : `0.5px solid color-mix(in srgb, ${HL} 30%, transparent)`,
            }}
          >
            {topic}
          </span>
        )
      })}
    </Card>
  )
}

// "hash": #hashtags coloridas em texto corrido - o mais leve dos três.
const HASH_COLORS = [HL, "#3178c6", "var(--default-color-success)", "#8250df", "#d4537e", "var(--default-color-muted)"]

function TopicHash({ topics, max }: { topics: string[]; max: number }): React.ReactElement | null {
  const visible = topics.slice(0, max)
  if (visible.length === 0) return null

  return (
    <Card className="px-[18px] py-3.5">
      <div className="text-sm font-medium leading-[1.9] tracking-[-0.01em]">
        {visible.map((topic, i) => (
          <span key={topic} style={{ color: HASH_COLORS[i % HASH_COLORS.length] }}>
            #{topic}
            {i < visible.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </Card>
  )
}

// Terminal (pré-redesign, alturas calibradas).
function TerminalTopics({ topics, max }: { topics: string[]; max: number }): React.ReactElement | null {
  const visible = topics.slice(0, max)
  if (visible.length === 0) return null
  const remaining = topics.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((topic) => (
        <span key={topic} className="text-xs text-terminal-muted">
          #{topic}
        </span>
      ))}
      {remaining > 0 && <span className="text-xs text-terminal-muted">+{remaining} more</span>}
    </div>
  )
}

export function Topics({ config, data, style = "default", size = "half" }: TopicsProps): React.ReactElement {
  if (!config.enabled || !data || data.topics.length === 0) return <></>

  const maxTopics = Math.min(config.max_topics ?? TOPICS_DISPLAY_LIMIT, TOPICS_DISPLAY_LIMIT)
  const variant = config.topics_variant ?? "chips"

  return (
    <section id="github-repo-topics">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {variant === "cloud" && <TopicCloud topics={data.topics} max={maxTopics} />}
              {variant === "hash" && <TopicHash topics={data.topics} max={maxTopics} />}
              {variant === "chips" && <TopicChips topics={data.topics} max={maxTopics} />}
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "topics", size })} />
              <div className="px-1 pb-1">
                <TerminalTopics topics={data.topics} max={maxTopics} />
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
