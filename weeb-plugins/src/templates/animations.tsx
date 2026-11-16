/**
 * Opt-in card animations.
 *
 * The flag belongs to the whole SVG (`ui_config.animations` in the dashboard) and
 * reaches the shared templates through this context, so no plugin component has to
 * pass it along. With the flag off nothing here adds markup: the card is the same,
 * byte for byte, as a card from before animations existed.
 *
 * Everything that moves is CSS (styles/animations.ts). An SVG shown through <img>,
 * which is how GitHub shows a README image, runs neither script nor :hover.
 */

import React, { createContext, useContext } from "react"

const AnimationsContext = createContext(false)

export function AnimationsProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: React.ReactNode
}): React.ReactElement {
  return <AnimationsContext.Provider value={enabled}>{children}</AnimationsContext.Provider>
}

export function useAnimations(): boolean {
  return useContext(AnimationsContext)
}

/**
 * Seconds from the moment the image loads until the last thing stops moving. A reader
 * may only scroll to the card later, so nothing worth seeing may be left for after it.
 */
export const ANIMATION_BUDGET_S = 2

/**
 * Durations, in seconds, shared with the stylesheet so the timeline below and the
 * keyframes cannot drift apart.
 */
export const ANIMATION_TIMING = {
  /** Default style: a section rises into place. */
  enter: 0.45,
  /** Terminal style: the command line is typed... */
  type: 0.35,
  /** ...and the output shows up once it is. */
  output: 0.2,
  /** Bars fill and numbers count, starting with the section's content. */
  fill: 0.8,
  /** Default style: content starts this long after its section does. */
  contentDelay: 0.1,
} as const

/** Gap between consecutive sections when there is room for it. */
const MAX_STEP_S = { default: 0.15, terminal: 0.4 } as const

/**
 * How long one section keeps moving after it starts: its longest animation.
 */
export function sectionTail(style: "default" | "terminal"): number {
  const t = ANIMATION_TIMING
  return style === "terminal"
    ? Math.max(t.type + t.output, t.type + t.fill)
    : Math.max(t.enter, t.contentDelay + t.fill)
}

export interface AnimationTimeline {
  /** Seconds between the start of one section and the next. */
  step: number
  /** Index of the first section of each plugin, in render order. */
  bases: number[]
}

/**
 * Sections start one after the other across the whole card, plugin after plugin.
 * The gap shrinks with the number of sections so the last one still finishes within
 * ANIMATION_BUDGET_S.
 *
 * @param sectionCounts - sections of each rendered plugin, in render order
 */
export function animationTimeline(style: "default" | "terminal", sectionCounts: number[]): AnimationTimeline {
  const bases: number[] = []
  let total = 0
  for (const count of sectionCounts) {
    bases.push(total)
    total += Math.max(0, count)
  }

  const room = ANIMATION_BUDGET_S - sectionTail(style)
  const step = total > 1 ? Math.min(MAX_STEP_S[style], room / (total - 1)) : MAX_STEP_S[style]
  // Rounded down to the millisecond: rounding up could push the last section past the budget.
  return { step: Math.floor(step * 1000) / 1000, bases }
}

/** Custom properties the stylesheet reads to place a plugin's sections on the timeline. */
export function animationStepStyle(step: number): React.CSSProperties {
  return { ["--weeb-step" as string]: `${step}s` } as React.CSSProperties
}

export function animationBaseStyle(base: number): React.CSSProperties {
  return { ["--weeb-base" as string]: base } as React.CSSProperties
}
