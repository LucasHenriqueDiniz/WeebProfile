import React from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PluginManager } from "../plugins/manager"
import { ANIMATIONS_CSS } from "../styles/animations"
import { AnimatedNumber, parseCountTarget } from "./AnimatedNumber"
import { ANIMATION_BUDGET_S, ANIMATION_TIMING, AnimationsProvider, animationTimeline, sectionTail } from "./animations"
import { HorizontalMultipleItemsBar } from "./Default/HorizontalMultipleItemsBar"
import { PercentageBar } from "./Default/PercentageBar"
import { StatisticRow } from "./Default/DefaultStatRow"
import { TerminalCommand } from "./Terminal/TerminalCommand"
import { TerminalHorizontalMultipleItemsBar } from "./Terminal/TerminalHorizontalMultipleItems"
import { TerminalLineWithDots } from "./Terminal/TerminalLineWithDots"
import { TerminalStatisticRow } from "./Terminal/TerminalStatisticRow"

const render = (node: React.ReactNode, animations?: boolean) =>
  renderToString(
    animations === undefined ? <>{node}</> : <AnimationsProvider enabled={animations}>{node}</AnimationsProvider>
  )

describe("animationTimeline", () => {
  // The last section has to be still within the budget however many there are: the
  // reader may scroll to the card after it finished, and must not miss anything.
  it.each(["default", "terminal"] as const)("ends every %s card within the budget", (style) => {
    for (let total = 1; total <= 80; total++) {
      const { step } = animationTimeline(style, [total])
      const lastEnds = (total - 1) * step + sectionTail(style)
      expect(lastEnds).toBeLessThanOrEqual(ANIMATION_BUDGET_S)
      expect(step).toBeGreaterThan(0)
    }
  })

  it("starts each plugin where the previous one's sections left off", () => {
    expect(animationTimeline("default", [4, 0, 3, 2]).bases).toEqual([0, 4, 4, 7])
  })

  it("spreads a short card out instead of squeezing it", () => {
    expect(animationTimeline("terminal", [3]).step).toBe(0.4)
    expect(animationTimeline("default", [3]).step).toBe(0.15)
  })
})

describe("ANIMATIONS_CSS", () => {
  const motion = /@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/.exec(ANIMATIONS_CSS)

  it("keeps every animation inside prefers-reduced-motion: no-preference", () => {
    expect(motion).not.toBeNull()
    const outside = ANIMATIONS_CSS.replace(motion![0], "")
    expect(outside).not.toMatch(/animation\s*:/)
  })

  // `forwards` would leave the last keyframe applied; backwards (or none) lets the card
  // at rest be the static card itself.
  it("never holds a last keyframe", () => {
    expect(ANIMATIONS_CSS).not.toMatch(/forwards|both|infinite/)
  })

  it("only animates properties that leave the layout alone", () => {
    const keyframes = [...ANIMATIONS_CSS.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)].map((m) => m[1])
    const properties = new Set(keyframes.flatMap((body) => [...body!.matchAll(/([\w-]+):/g)].map((m) => m[1])))
    expect([...properties].sort()).toEqual(
      ["--weeb-n", "-webkit-text-fill-color", "clip-path", "left", "opacity", "transform", "visibility"].sort()
    )
  })

  it("takes its durations from ANIMATION_TIMING", () => {
    expect(ANIMATIONS_CSS).toContain(`weeb-type ${ANIMATION_TIMING.type * 1000}ms`)
    expect(ANIMATIONS_CSS).toContain(`weeb-fill ${ANIMATION_TIMING.fill * 1000}ms`)
    expect(ANIMATIONS_CSS).toContain(`weeb-rise ${ANIMATION_TIMING.enter * 1000}ms`)
  })
})

describe("with animations off", () => {
  const templates: Array<[string, React.ReactNode]> = [
    ["TerminalCommand", <TerminalCommand key="c" command="run github profile" />],
    ["HorizontalMultipleItemsBar", <HorizontalMultipleItemsBar key="b" items={[{ value: 3 }, { value: 1 }]} />],
    ["TerminalHorizontalMultipleItemsBar", <TerminalHorizontalMultipleItemsBar key="t" items={[{ value: 3 }]} />],
    ["PercentageBar", <PercentageBar key="p" current={4} total={12} status="Watching" />],
    ["StatisticRow", <StatisticRow key="s" rows={[{ icon: <i />, title: "Stars", value: "48" }]} />],
    ["TerminalStatisticRow", <TerminalStatisticRow key="ts" rows={[{ title: "Stars", value: "48" }]} />],
    ["TerminalLineWithDots", <TerminalLineWithDots key="d" title="Scrobbles" value="155.3K" />],
  ]

  // The flag defaults to off, and off must add nothing: cards generated before this
  // feature stay the same, byte for byte.
  it.each(templates)("%s renders the same markup as without the provider", (_, node) => {
    expect(render(node, false)).toBe(render(node))
    expect(render(node)).not.toContain("weeb-")
  })

  it.each([
    ["github", "default"],
    ["github", "terminal"],
    ["lastfm", "default"],
    ["lastfm", "terminal"],
  ] as const)("a whole %s card (%s) carries no animation markup", async (name, style) => {
    const plugin = PluginManager.getInstance().get(name)!
    const sections =
      name === "github"
        ? ["profile", "activity", "favorite_languages", "repositories"]
        : ["statistics", "recent_tracks"]
    const config = { ...plugin.config, enabled: true, sections, style, size: "half" } as any
    const data = await plugin.fetchData(config, true)
    const html = render(plugin.render(config, data), false)
    expect(html).not.toContain("weeb-")
    expect(html).toBe(render(plugin.render(config, data)))
  })
})

describe("with animations on", () => {
  it("types the command out, one step per character", () => {
    const html = render(<TerminalCommand command="run lastfm stats" />, true)
    expect(html).toContain("weeb-cmd")
    expect(html).toContain("--weeb-chars:16")
    expect(html).toContain('<span class="weeb-cmd-chars">run lastfm stats</span>')
  })

  it("marks the bars", () => {
    expect(render(<HorizontalMultipleItemsBar items={[{ value: 1 }]} />, true)).toContain("weeb-bar")
    expect(render(<TerminalHorizontalMultipleItemsBar items={[{ value: 1 }]} />, true)).toContain("weeb-bar")
  })

  it("keeps the real number in the markup, under the counter", () => {
    const html = render(<AnimatedNumber value="155.3K" />, true)
    expect(html).toContain(">155.3K</span>")
    expect(html).toContain("--weeb-to:155")
    expect(html).toContain("--weeb-unit:&quot;K&quot;")
  })
})

describe("parseCountTarget", () => {
  it.each([
    ["523", { to: 523, unit: "" }],
    ["1,234", { to: 1234, unit: "" }],
    ["12.3K", { to: 12, unit: "K" }],
    ["45.2%", { to: 45, unit: "%" }],
  ])("counts %s", (text, target) => {
    expect(parseCountTarget(text)).toEqual(target)
  })

  // Text that is not a plain number is left alone rather than counted wrong.
  it.each(["0", "6 years", "70.4% • 4.4M lines", "MIT License (14)", "", "-3"])("leaves %j alone", (text) => {
    expect(parseCountTarget(text)).toBeNull()
  })
})
