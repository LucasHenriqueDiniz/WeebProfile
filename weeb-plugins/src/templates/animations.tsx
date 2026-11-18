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
  /** Default style: a calendar cell fades in... */
  cell: 0.2,
  /** ...one diagonal after the other, the last one starting this long after the first. */
  wave: 0.6,
  /** Both styles: an item of a list, grid or row of tags fades in... */
  item: 0.2,
  /** ...one after the other, the last one starting at most this long after the first. */
  cascade: 0.6,
} as const

/** Gap between consecutive sections when there is room for it. */
const MAX_STEP_S = { default: 0.15, terminal: 0.4 } as const

/**
 * How long one section keeps moving after it starts: its longest animation.
 */
export function sectionTail(style: "default" | "terminal"): number {
  const t = ANIMATION_TIMING
  return style === "terminal"
    ? Math.max(t.type + t.output, t.type + t.fill, t.type + t.cascade + t.item)
    : Math.max(t.enter, t.contentDelay + t.fill, t.contentDelay + t.wave + t.cell, t.contentDelay + t.cascade + t.item)
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

/** Cells in a column of a wave grid: one per weekday in a contribution calendar. */
export const WAVE_ROWS = 7

export interface CellWave {
  /** Custom property for an element around the whole grid: the gap between diagonals. */
  style: React.CSSProperties
  /** Custom property for column `x` (from the left) of block `block` (from the top). */
  columnStyle: (block: number, x: number) => React.CSSProperties
}

/**
 * A grid of cells drawn as columns of WAVE_ROWS (the GitHub contribution calendar) shows
 * up in a diagonal wave, from the top right cell to the bottom left one. A cell's place in
 * the wave is its distance from that corner: columns from the right edge plus rows from
 * the top, counting the rows of the blocks above when the grid wraps (two blocks in half
 * size, one per year). The stylesheet adds the row from :nth-child, so only columns carry
 * their place. The last cell starts ANIMATION_TIMING.wave after the first, however big the
 * grid is, so the wave ends with the rest of its section.
 *
 * @param columns - columns of the widest block
 * @param blocks - blocks stacked one above the other
 */
export function cellWave(columns: number, blocks: number): CellWave {
  const last = columns - 1 + blocks * WAVE_ROWS - 1
  // Rounded down so the last cell never starts after the wave is over.
  const step = last > 0 ? Math.floor((ANIMATION_TIMING.wave / last) * 1e5) / 1e5 : 0
  return {
    style: { ["--weeb-wave" as string]: `${step}s` } as React.CSSProperties,
    columnStyle: (block, x) => ({ ["--weeb-c" as string]: columns - 1 - x + block * WAVE_ROWS }) as React.CSSProperties,
  }
}

/** Items of a cascade with a slot of their own; later ones share the last slot. */
export const CASCADE_SLOTS = 60

/** Gap between two items when there is room for it: a three-row list should not crawl. */
export const MAX_ITEM_GAP_S = 0.08

export interface ItemCascade {
  /** Class for the element whose children are the items. */
  className: string
  /** Custom property for the same element: the gap between two items. */
  style: React.CSSProperties
}

/**
 * The items of a list, a grid or a row of tags fade in one after the other, in the order
 * they are drawn. The items are the children of one element, which takes the class and
 * the style returned here; the stylesheet gives each child its place from :nth-child, so
 * the items themselves carry nothing. The last item starts at most ANIMATION_TIMING.cascade
 * after the first, however many there are, so the cascade ends with the rest of its
 * section and the card's timeline does not change.
 *
 * Never put it on a <section>: its children include the terminal command line, which
 * has animations of its own.
 *
 * @param count - items drawn, children of the element
 */
export function itemCascade(count: number): ItemCascade {
  const last = Math.min(count, CASCADE_SLOTS) - 1
  // Rounded down so the last item never starts after the cascade is over.
  const gap = last > 0 ? Math.min(MAX_ITEM_GAP_S, Math.floor((ANIMATION_TIMING.cascade / last) * 1e5) / 1e5) : 0
  return { className: "weeb-seq", style: { ["--weeb-gap" as string]: `${gap}s` } as React.CSSProperties }
}

/** itemCascade() when animations are on, null when they are off (nothing to add). */
export function useItemCascade(count: number): ItemCascade | null {
  return useAnimations() ? itemCascade(count) : null
}

/** `className` plus the cascade's class, or `className` unchanged when there is none. */
export function withCascade(className: string, cascade: ItemCascade | null): string {
  return cascade ? `${className} ${cascade.className}` : className
}

/**
 * Wraps items that have no element of their own around them (they sit straight inside a
 * <section>, next to its title or terminal command) so they can cascade. With animations
 * off it adds nothing, so the card stays the same byte for byte.
 *
 * The wrapper lays its items out as the section does (a flex column, styles/*: section),
 * so wrapping them changes nothing. As a plain block it collapsed the vertical margins
 * that the flex column keeps: MAL's terminal favorites came out 40px shorter with
 * animations on. Only use it straight inside a <section>.
 */
export function CascadeGroup({ count, children }: { count: number; children: React.ReactNode }): React.ReactElement {
  const cascade = useItemCascade(count)
  if (!cascade) return <>{children}</>
  return (
    <div className={`flex flex-col ${cascade.className}`} style={cascade.style}>
      {children}
    </div>
  )
}
