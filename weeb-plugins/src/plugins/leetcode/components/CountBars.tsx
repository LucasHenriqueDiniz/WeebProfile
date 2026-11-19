/**
 * One fixed-height row per item: name, a bar as long as its share of the first item, count.
 * Used by the skills and languages sections. Rows are 20px in both styles, so the height
 * is `rows * 20` plus the gaps, whatever the names are.
 */

import React from "react"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useAnimations, useItemCascade, withCascade } from "../../../templates/animations"
import { formatNumber } from "../../shared/utils/formatting"

export const BAR_ROW_HEIGHT = 20
/** Gap between rows in the default style; the terminal stacks them with none. */
export const DEFAULT_BAR_ROW_GAP = 6

const MONO = "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace"

/** Name column, in characters for the terminal and as a share of the width by default. */
const TERMINAL_NAME_MAX_CH = { half: 18, full: 28 } as const
const DEFAULT_NAME_WIDTH = { half: "42%", full: "30%" } as const

export interface CountBarItem {
  name: string
  count: number
  icon?: React.ReactNode
}

interface CountBarsProps {
  items: CountBarItem[]
  style: "default" | "terminal"
  size: "half" | "full"
}

function share(count: number, top: number): string {
  return `${Math.max(2, (count / Math.max(top, 1)) * 100)}%`
}

function DefaultBars({ items, size }: Omit<CountBarsProps, "style">): React.ReactElement {
  const animations = useAnimations()
  const cascade = useItemCascade(items.length)
  const top = items[0]?.count ?? 1
  const countCh = Math.max(...items.map((item) => formatNumber(item.count).length))

  return (
    <div
      className={withCascade("flex flex-col w-full", cascade)}
      style={{ gap: `${DEFAULT_BAR_ROW_GAP}px`, ...cascade?.style }}
    >
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-2 w-full"
          style={{ height: `${BAR_ROW_HEIGHT}px`, lineHeight: `${BAR_ROW_HEIGHT}px`, fontSize: "0.875rem" }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-default-muted whitespace-nowrap overflow-hidden flex-shrink-0"
            style={{ width: DEFAULT_NAME_WIDTH[size] }}
          >
            {item.icon}
            <span className="truncate">{item.name}</span>
          </span>
          <span className="flex-1 h-2 rounded-sm overflow-hidden bg-default-15">
            <span
              className={`block h-full rounded-sm${animations ? " weeb-bar" : ""}`}
              style={{ width: share(item.count, top), background: "var(--default-color-highlight)" }}
            />
          </span>
          <span
            className="font-semibold text-default-highlight whitespace-nowrap text-right flex-shrink-0"
            style={{ width: `${countCh + 1}ch` }}
          >
            <AnimatedNumber value={formatNumber(item.count)} />
          </span>
        </div>
      ))}
    </div>
  )
}

function TerminalBars({ items, size }: Omit<CountBarsProps, "style">): React.ReactElement {
  const animations = useAnimations()
  const top = items[0]?.count ?? 1
  const nameCh = Math.min(Math.max(...items.map((item) => item.name.length)), TERMINAL_NAME_MAX_CH[size])
  const countCh = Math.max(...items.map((item) => String(item.count).length))

  return (
    <CascadeGroup count={items.length}>
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-2 w-full px-1"
          style={{ fontFamily: MONO, fontSize: "0.875rem", lineHeight: "1.25rem", height: `${BAR_ROW_HEIGHT}px` }}
        >
          <span
            className="font-semibold whitespace-nowrap truncate flex-shrink-0 text-terminal-warning"
            style={{ minWidth: `${nameCh}ch`, maxWidth: `${TERMINAL_NAME_MAX_CH[size]}ch` }}
          >
            {item.name}
          </span>
          <span className="flex-1 h-2 rounded-sm overflow-hidden bg-terminal-stripe">
            <span
              className={`block h-full rounded-sm${animations ? " weeb-bar" : ""}`}
              style={{ width: share(item.count, top), background: "var(--terminal-color-highlight)" }}
            />
          </span>
          <span
            className="text-terminal-muted whitespace-nowrap text-right flex-shrink-0"
            style={{ width: `${countCh}ch` }}
          >
            <AnimatedNumber value={item.count} />
          </span>
        </div>
      ))}
    </CascadeGroup>
  )
}

export function CountBars({ items, style, size }: CountBarsProps): React.ReactElement {
  return style === "terminal" ? <TerminalBars items={items} size={size} /> : <DefaultBars items={items} size={size} />
}
