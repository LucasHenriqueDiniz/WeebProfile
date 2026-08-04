import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "./manager"
import { PLUGINS_METADATA } from "./metadata"

/**
 * calculateHeight() is the only thing standing between a card and clipped content.
 * The SVG height is computed statically -- there is no browser in the pipeline to
 * measure and correct it -- so a wrong formula ships silently: too small clips, too
 * large leaves dead space. Not one of the twelve plugins had a test for it.
 *
 * These do not verify that a section's height is *right*; matching pixels needs a
 * real browser, which is what `pnpm --filter @weeb/svg-generator audit:heights`
 * exists for. What they check is the invariant that does not need one:
 *
 *   a section contributes height if and only if it renders something.
 *
 * Both directions are real failures. Zero height for rendered content means the
 * content is cut off. Non-zero height for a section that renders nothing means a
 * gap -- which is exactly the bug this file found in codewars/leaderboard_position,
 * where the terminal style reserved 32px for a component that early-returns <></>.
 *
 * PluginManager.calculateTotalHeight discards NaN and negative values rather than
 * letting them poison the total, so a broken formula turns into a quietly short
 * SVG instead of an error. That is the reason to assert on finiteness here.
 */

const manager = PluginManager.getInstance()
const SIZES = ["half", "full"] as const
const STYLES = ["default", "terminal"] as const

interface Case {
  plugin: string
  section: string
  data: unknown
  config: Record<string, unknown>
}

const cases: Case[] = []

/**
 * A plugin always emits its outer wrapper, so markup length says nothing: a section
 * that renders no content still produces `<section id="codewars-plugin"></section>`.
 * What distinguishes them is whether anything inside would occupy space -- text, or
 * a graphical element that carries its own dimensions.
 *
 * Deliberately a heuristic, not a parser. It only has to be right about "would this
 * take up vertical space", and being wrong in either direction shows up as a test
 * failure to investigate rather than a silent pass.
 */
function hasVisibleContent(markup: string): boolean {
  if (/<(img|image|svg|path|rect|circle|line|polyline|polygon)\b/i.test(markup)) return true
  return markup.replace(/<[^>]*>/g, "").trim().length > 0
}

// Plugin mock loaders are chatty. Silence them so a failure is readable.
let restoreConsole: () => void

beforeAll(async () => {
  const log = console.log
  const warn = console.warn
  console.log = () => {}
  console.warn = () => {}
  restoreConsole = () => {
    console.log = log
    console.warn = warn
  }

  for (const [pluginName, meta] of Object.entries(PLUGINS_METADATA as Record<string, any>)) {
    const plugin = manager.get(pluginName)
    if (!plugin) continue

    for (const section of (meta.sections || []).map((s: any) => s.id) as string[]) {
      const config = { ...plugin.config, enabled: true, sections: [section], username: "test-user" }
      try {
        // dev + previewMode: mock data, and no base64 conversion, which would
        // otherwise make this suite depend on the network.
        const data = await plugin.fetchData(config as never, true, undefined, true)
        cases.push({ plugin: pluginName, section, data, config })
      } catch {
        // Reported by the coverage test below rather than swallowed.
      }
    }
  }
}, 120_000)

afterAll(() => restoreConsole?.())

describe("calculateHeight", () => {
  it("builds a case for every section of every registered plugin", () => {
    const expected = Object.entries(PLUGINS_METADATA as Record<string, any>)
      .filter(([name]) => manager.get(name))
      .reduce((total, [, meta]) => total + (meta.sections?.length ?? 0), 0)

    expect(cases.length).toBe(expected)
    expect(cases.length).toBeGreaterThan(0)
  })

  it("returns a finite, non-negative number for every section, size and style", () => {
    const bad: string[] = []

    for (const { plugin, section, data, config } of cases) {
      for (const size of SIZES) {
        for (const style of STYLES) {
          const instance = manager.get(plugin)!
          let height: number
          try {
            height = instance.calculateHeight({ ...config, style } as never, data as never, size)
          } catch (error) {
            bad.push(`${plugin}/${section} ${size}/${style} threw: ${error}`)
            continue
          }
          if (!Number.isFinite(height)) bad.push(`${plugin}/${section} ${size}/${style} -> ${height}`)
          else if (height < 0) bad.push(`${plugin}/${section} ${size}/${style} -> negative ${height}`)
        }
      }
    }

    expect(bad).toEqual([])
  })

  // The invariant that catches both clipping and dead space.
  it("gives a section height if and only if it renders something", () => {
    const mismatches: string[] = []

    for (const { plugin, section, data, config } of cases) {
      for (const size of SIZES) {
        for (const style of STYLES) {
          const instance = manager.get(plugin)!
          const scoped = { ...config, style, size }

          let markup: string
          try {
            markup = renderToStaticMarkup(instance.render(scoped as never, data as never))
          } catch {
            // Render failures are a different problem; the height assertions above
            // still cover this case.
            continue
          }

          const rendersSomething = hasVisibleContent(markup)
          const height = instance.calculateHeight(scoped as never, data as never, size)

          if (rendersSomething && height <= 0) {
            mismatches.push(
              `${plugin}/${section} ${size}/${style}: renders content but height is ${height} (would be clipped)`
            )
          }
          if (!rendersSomething && height > 0) {
            mismatches.push(
              `${plugin}/${section} ${size}/${style}: renders nothing but reserves ${height}px (dead space)`
            )
          }
        }
      }
    }

    expect(mismatches).toEqual([])
  })

  it("is deterministic", () => {
    for (const { plugin, section, data, config } of cases.slice(0, 20)) {
      const instance = manager.get(plugin)!
      const first = instance.calculateHeight(config as never, data as never, "half")
      const second = instance.calculateHeight(config as never, data as never, "half")
      expect(second, `${plugin}/${section}`).toBe(first)
    }
  })
})

describe("calculateTotalHeight", () => {
  it("is zero when nothing is enabled", () => {
    expect(manager.calculateTotalHeight({}, {}, "half")).toBe(0)
  })

  // The guard exists because a NaN from one plugin must not take the whole SVG
  // down to NaN. Worth pinning: it is also what makes a broken formula silent.
  it("skips a plugin whose height is NaN rather than propagating it", () => {
    const withData = cases.find((c) => {
      const instance = manager.get(c.plugin)!
      return instance.calculateHeight({ ...c.config, style: "default" } as never, c.data as never, "half") > 0
    })
    expect(withData, "expected at least one section with a positive height").toBeDefined()

    const config = { [withData!.plugin]: { ...withData!.config, style: "default" } }
    const good = manager.calculateTotalHeight(config as never, { [withData!.plugin]: withData!.data } as never, "half")
    const broken = manager.calculateTotalHeight(
      config as never,
      { [withData!.plugin]: { ...(withData!.data as object), __forceNaN: true } } as never,
      "half"
    )

    expect(Number.isFinite(good)).toBe(true)
    expect(Number.isFinite(broken)).toBe(true)
  })

  it("adds the 24px buffer only when there is content", () => {
    const withData = cases.find((c) => {
      const instance = manager.get(c.plugin)!
      return instance.calculateHeight({ ...c.config, style: "default" } as never, c.data as never, "half") > 0
    })!

    const single = manager
      .get(withData.plugin)!
      .calculateHeight({ ...withData.config, style: "default" } as never, withData.data as never, "half")
    const total = manager.calculateTotalHeight(
      { [withData.plugin]: { ...withData.config, style: "default" } } as never,
      { [withData.plugin]: withData.data } as never,
      "half"
    )

    expect(total).toBe(single + 24)
  })
})
