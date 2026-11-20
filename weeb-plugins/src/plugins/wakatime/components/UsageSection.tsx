import React from "react"
import { GoDotFill } from "react-icons/go"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { HorizontalMultipleItemsBar } from "../../../templates/Default/HorizontalMultipleItemsBar"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalHorizontalMultipleItemsBar } from "../../../templates/Terminal/TerminalHorizontalMultipleItemsBar"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatDuration, rangeLabel } from "../format"
import type { WakaTimeStats, WakaTimeUsage, WakaTimeUsageSection } from "../types"

interface UsageSectionProps {
  section: WakaTimeUsageSection
  stats: WakaTimeStats
  /** The items drawn as lines. */
  shown: WakaTimeUsage[]
  total: number
  title: string
  hideTitle: boolean
  icon: React.ReactElement
  style: "default" | "terminal"
  size: "half" | "full"
}

/**
 * For items WakaTime has no color for (projects, operating systems, a language missing from its
 * catalog), by position. Mid-tone, so a line reads on the terminal's dark background and on a
 * light page: a color hashed from the name came out near black for "Mac" (#0A2A2A or so).
 */
const FALLBACK_COLORS = [
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#f87171",
  "#22d3ee",
  "#a3e635",
  "#fb923c",
  "#e879f9",
  "#2dd4bf",
  "#facc15",
  "#818cf8",
  "#4ade80",
  "#fb7185",
]

function colorOf(item: WakaTimeUsage, index: number): string {
  return item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]!
}

/**
 * The range beside the title, in WakaTime's words. Stale numbers (still 202 after the retry) get
 * no marker: "Operating Systems" beside "since Aug 4 2025 (cached)" wrapped in half and cut 15px.
 */
export function rangeSubtitle(stats: WakaTimeStats): string {
  return stats.humanReadableRange
}

/**
 * A bar of every item and one line per shown item: name, share of the time and the time. The
 * layout of the GitHub plugin's favorite_languages section, so the two read the same side by side.
 */
export function UsageSection({
  section,
  stats,
  shown,
  total,
  title,
  hideTitle,
  icon,
  style,
  size,
}: UsageSectionProps): React.ReactElement {
  if (shown.length === 0 || total <= 0) return <></>
  const percent = (item: WakaTimeUsage, digits: number) => `${((item.seconds / total) * 100).toFixed(digits)}%`
  // The bar is the shown items and one muted segment for the rest. Every item drew its own
  // segment before: 142 projects on a real account rounded to a terminal bar 8 characters short
  // and off-center, and a default bar of slivers in colors no line explains.
  const rest = total - shown.reduce((sum, item) => sum + item.seconds, 0)
  const bar = (key: "backgroundColor" | "color", muted: string) => [
    ...shown.map((item, i) => ({ value: item.seconds, style: { [key]: colorOf(item, i) } })),
    ...(rest > 0 ? [{ value: rest, style: { [key]: muted } }] : []),
  ]

  return (
    <section id={`wakatime-${section.replace(/_/g, "-")}`}>
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} subtitle={rangeSubtitle(stats)} icon={icon} />}
            <div className="flex flex-col gap-1">
              <HorizontalMultipleItemsBar
                items={bar("backgroundColor", "var(--default-color-muted, #9ca3af)")}
                total={total}
              />
              {shown.map((item, i) => (
                <div key={item.name} className="grid grid-cols-3 items-center">
                  {/* One line: a long project name is cut, never wrapped (the height counts 24px). */}
                  <span className="text-base text-default flex items-center min-w-0">
                    <GoDotFill color={colorOf(item, i)} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="text-base text-default flex items-center justify-end">{percent(item, 2)}</span>
                  <span className="text-base text-default flex items-center justify-end">
                    {formatDuration(item.seconds)}
                  </span>
                </div>
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({ plugin: "wakatime", section, period: rangeLabel(stats.range), size })}
            />
            <div className="flex flex-col gap-1">
              {/* A fixed line: left to the font it drew 19px in Chrome and Firefox, 18 in WebKit. */}
              <div style={{ height: 20, lineHeight: "20px", overflow: "hidden" }}>
                <TerminalHorizontalMultipleItemsBar
                  items={bar("color", "var(--terminal-color-muted, #6b7280)")}
                  total={total}
                  size={size}
                />
              </div>
              {shown.map((item, i) => (
                <TerminalLineWithDots
                  key={item.name}
                  title={`██ ${item.name}`}
                  value={`${percent(item, 1)} • ${formatDuration(item.seconds)}`}
                  titleClassName="font-semibold"
                  titleStyle={{ color: colorOf(item, i) }}
                />
              ))}
            </div>
          </>
        }
      />
    </section>
  )
}
