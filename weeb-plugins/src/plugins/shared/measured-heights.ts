/**
 * Checks a plugin's `calculateHeight` against heights measured in the browsers: the shared
 * part of the `*-heights.test.ts` files. Test-only; nothing in production imports it.
 *
 * A case is the sections of one card, the style and size, a change to the mock (named in
 * the test's own `variants`), the options at the root of the plugin config (as the dashboard
 * stores them) and what Chrome, Firefox and WebKit drew, in that order. The numbers come from
 * `pnpm --filter @weeb/svg-generator audit:heights -- --engine=all` (theme CSS, no terminal
 * header).
 *
 * Tolerance: never shorter than the tallest engine, at most `slack` px over it (2 by default).
 */

import type { Plugin } from "./types/plugin"

export type MeasuredStyle = "default" | "terminal"
export type MeasuredSize = "half" | "full"

export type MeasuredCase<V extends string> = [
  sections: string[],
  style: MeasuredStyle,
  size: MeasuredSize,
  variant: V,
  options: Record<string, unknown>,
  drawn: [chrome: number, firefox: number, webkit: number],
]

/** The cases `calculateHeight` gets wrong, one line each; [] when it covers them all. */
export function wrongHeights<D, V extends string>(
  plugin: Plugin,
  mock: D,
  variants: Record<V, (mock: D) => D>,
  cases: Array<MeasuredCase<V>>,
  {
    slack = 2,
    fetched = (data: D) => data,
  }: {
    /** px over the tallest engine that still counts. */
    slack?: number
    /** What fetchData does with the case's options (a max applied when fetching). */
    fetched?: (data: D, options: Record<string, unknown>) => D
  } = {}
): string[] {
  const wrong: string[] = []
  for (const [sections, style, size, variant, options, drawn] of cases) {
    // Options at the root, as the dashboard stores them. A plugin's own default config can
    // carry a `nonEssential`, which would win over them; production configs have none.
    const { nonEssential: _defaults, ...defaults } = plugin.config as typeof plugin.config & { nonEssential?: unknown }
    const config = { ...defaults, enabled: true, sections, style, size, ...options }
    const data = variants[variant](fetched(structuredClone(mock), options))
    const height = plugin.calculateHeight(config as never, data as never, size)
    const tallest = Math.max(...drawn)
    if (height < tallest || height - tallest > slack) {
      wrong.push(
        `${sections.join("+")} ${style}/${size} ${variant} ${JSON.stringify(options)}: calc=${height} drawn=${drawn}`
      )
    }
  }
  return wrong
}
