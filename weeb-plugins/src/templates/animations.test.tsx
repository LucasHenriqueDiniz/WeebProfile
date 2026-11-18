import React from "react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PluginManager } from "../plugins/manager"
import { ANIMATIONS_CSS } from "../styles/animations"
import { AnimatedNumber, MAX_COUNT_DECIMALS, parseCountTarget } from "./AnimatedNumber"
import {
  ANIMATION_BUDGET_S,
  ANIMATION_TIMING,
  AnimationsProvider,
  CASCADE_SLOTS,
  MAX_ITEM_GAP_S,
  WAVE_ROWS,
  animationTimeline,
  itemCascade,
  sectionTail,
  useItemCascade,
} from "./animations"
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
      ["--weeb-p", "-webkit-text-fill-color", "clip-path", "left", "opacity", "transform", "visibility"].sort()
    )
  })

  // Firefox turns a keyframe that reads var() into a discrete step: the counter showed 0,
  // then the end value at half time, and never counted.
  it("keeps var() out of the keyframes", () => {
    const keyframes = [...ANIMATIONS_CSS.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)].map((m) => m[1])
    expect(keyframes.length).toBeGreaterThan(0)
    for (const body of keyframes) expect(body).not.toContain("var(")
  })

  it("has a counter layout for every number of decimals it counts", () => {
    for (let decimals = 1; decimals <= MAX_COUNT_DECIMALS; decimals++) {
      expect(ANIMATIONS_CSS).toMatch(
        new RegExp(
          `\\.weeb-num-${decimals}::after \\{\\s*content: var\\(--weeb-prefix, ""\\) counter\\(weeb-i\\) "\\."`
        )
      )
    }
  })

  it("takes its durations from ANIMATION_TIMING", () => {
    expect(ANIMATIONS_CSS).toContain(`weeb-type ${ANIMATION_TIMING.type * 1000}ms`)
    expect(ANIMATIONS_CSS).toContain(`weeb-fill ${ANIMATION_TIMING.fill * 1000}ms`)
    expect(ANIMATIONS_CSS).toContain(`weeb-rise ${ANIMATION_TIMING.enter * 1000}ms`)
    expect(ANIMATIONS_CSS).toContain(`weeb-fade ${ANIMATION_TIMING.cell * 1000}ms`)
  })

  // A wave cell's place is its column's plus its row; the first row is the fallback, 0.
  it("gives every cell of a wave column its row", () => {
    for (let row = 1; row < WAVE_ROWS; row++) {
      expect(ANIMATIONS_CSS).toContain(`.weeb-wave > :nth-child(${row + 1}){--weeb-r:${row}}`)
    }
    expect(ANIMATIONS_CSS).not.toContain(`:nth-child(${WAVE_ROWS + 1}){--weeb-r`)
  })

  // Measured in <img>, 1 ms before the end: with a scale the cell edges landed up to a
  // pixel off the static card in Chromium (9,424 px) and Firefox (20,253 px), so the card
  // jumped when the wave ended. Opacity alone ends on the static card in all three.
  it("only fades the wave cells in", () => {
    const rule = /\.weeb-wave > \* \{\s*animation: ([\w-]+) /.exec(ANIMATIONS_CSS)
    expect(rule).not.toBeNull()
    const keyframes = new RegExp(`@keyframes ${rule![1]} \\{([\\s\\S]*?)\\n\\}`).exec(ANIMATIONS_CSS)
    expect([...keyframes![1]!.matchAll(/([\w-]+):/g)].map((m) => m[1])).toEqual(["opacity"])
  })
})

describe("with animations off", () => {
  // No network in these tests: a request means a test depends on a CDN being up and fast.
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network in animation tests"))
  })
  afterEach(() => vi.restoreAllMocks())

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
        ? ["profile", "activity", "favorite_languages", "repositories", "calendar"]
        : ["statistics", "recent_tracks"]
    const config = { ...plugin.config, enabled: true, sections, style, size: "half" } as any
    // previewMode: the mock as is, without downloading its images. With dev alone LastFM
    // fetched every cover from the CDN and timed out in CI.
    const data = await plugin.fetchData(config, true, undefined, true)
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
    expect(html).toContain('class="weeb-num weeb-num-1"')
    expect(html).toContain("--weeb-to:1553;--weeb-scale:10")
    expect(html).toContain("--weeb-unit:&quot;K&quot;")
  })

  it("counts an integer without a scale", () => {
    const html = render(<AnimatedNumber value="273" />, true)
    expect(html).toBe('<span class="weeb-num" style="--weeb-to:273">273</span>')
  })
})

describe("parseCountTarget", () => {
  it.each([
    ["523", { to: 523, decimals: 0, prefix: "", unit: "" }],
    ["1,234", { to: 1234, decimals: 0, prefix: "", unit: "" }],
    ["12.3K", { to: 123, decimals: 1, prefix: "", unit: "K" }],
    // github_repo's formatCount writes a lowercase k.
    ["1.2k", { to: 12, decimals: 1, prefix: "", unit: "k" }],
    ["34k", { to: 34, decimals: 0, prefix: "", unit: "k" }],
    // A rank (codewars) and a number with a word after it (duolingo's streak).
    ["#287.4K", { to: 2874, decimals: 1, prefix: "#", unit: "K" }],
    ["123 days", { to: 123, decimals: 0, prefix: "", unit: " days" }],
    ["45.2%", { to: 452, decimals: 1, prefix: "", unit: "%" }],
    ["68.2", { to: 682, decimals: 1, prefix: "", unit: "" }],
    ["6.05", { to: 605, decimals: 2, prefix: "", unit: "" }],
    ["0.5", { to: 5, decimals: 1, prefix: "", unit: "" }],
  ])("counts %s", (text, target) => {
    expect(parseCountTarget(text)).toEqual(target)
  })

  // What the overlay prints once the count is over (styles/animations.ts: the integer
  // part, then the remainder padded to the decimals) has to be the text itself, or the
  // number jumps when the real text takes over.
  it.each(["523", "68.2", "159.5", "6.05", "6.47", "0.5", "13.1K", "1.2k", "45.2%", "10.00", "#287.4K", "123 days"])(
    "ends the count of %s on the text itself",
    (text) => {
      const { to, decimals, prefix, unit } = parseCountTarget(text)!
      const scale = 10 ** decimals
      const fraction = decimals ? "." + String(to % scale).padStart(decimals, "0") : ""
      expect(`${prefix}${Math.floor(to / scale)}${fraction}${unit}`).toBe(text)
    }
  )

  // Text that is not a plain number, or one the counter cannot print as is, is left
  // alone rather than counted wrong.
  it.each([
    "0",
    "0.0",
    "3 days ago",
    "#",
    "70.4% • 4.4M lines",
    "MIT License (14)",
    "",
    "-3",
    "1.234",
    "8388609",
    "838860.9",
  ])("leaves %j alone", (text) => {
    expect(parseCountTarget(text)).toBeNull()
  })
})

describe("section slots", () => {
  it("puts every section past the last slot in the last slot, not back at the start", () => {
    expect(ANIMATIONS_CSS).toContain("section:nth-of-type(n+24){--weeb-k:23}")
    expect(ANIMATIONS_CSS).not.toContain("section:nth-of-type(24){")
  })
})

describe("itemCascade", () => {
  const gapOf = (count: number) => parseFloat(String(Object.values(itemCascade(count).style)[0]))

  // The cascade has to end with the rest of its section, or a list would stretch the
  // card past the budget: the last item starts at most ANIMATION_TIMING.cascade in.
  it("starts the last item within the cascade, however many items there are", () => {
    for (let count = 1; count <= 80; count++) {
      const lastSlot = Math.min(count, CASCADE_SLOTS) - 1
      expect(lastSlot * gapOf(count)).toBeLessThanOrEqual(ANIMATION_TIMING.cascade + 1e-9)
      expect(gapOf(count)).toBeLessThanOrEqual(MAX_ITEM_GAP_S)
    }
  })

  it("does not crawl through a short list", () => {
    expect(gapOf(3)).toBe(MAX_ITEM_GAP_S)
    expect(gapOf(1)).toBe(0)
  })

  // Adding the cascade must not move any section on the card's timeline.
  it("fits in the section's tail, so the timeline stays as it was", () => {
    expect(sectionTail("default")).toBeCloseTo(0.9)
    expect(sectionTail("terminal")).toBeCloseTo(1.15)
    const t = ANIMATION_TIMING
    expect(t.contentDelay + t.cascade + t.item).toBeLessThanOrEqual(sectionTail("default") + 1e-9)
    expect(t.type + t.cascade + t.item).toBeLessThanOrEqual(sectionTail("terminal") + 1e-9)
  })

  it("adds nothing with animations off", () => {
    let seen: unknown = "unset"
    const Probe = () => {
      seen = useItemCascade(5)
      return null
    }
    render(<Probe />, false)
    expect(seen).toBeNull()
    render(<Probe />, true)
    expect(seen).toMatchObject({ className: "weeb-seq" })
  })
})

describe("cascade rules", () => {
  it("gives every child its place, and every child past the last slot the last one", () => {
    for (let i = 1; i < CASCADE_SLOTS; i++) {
      expect(ANIMATIONS_CSS).toContain(`.weeb-seq > :nth-child(${i}){--weeb-idx:${i - 1}}`)
    }
    expect(ANIMATIONS_CSS).toContain(`.weeb-seq > :nth-child(n+${CASCADE_SLOTS}){--weeb-idx:${CASCADE_SLOTS - 1}}`)
  })

  // Same reason as the calendar cells: anything but opacity can end off the static card.
  it("only fades the items in", () => {
    const rule = /\.weeb-seq > \* \{\s*animation: ([\w-]+) /.exec(ANIMATIONS_CSS)
    expect(rule).not.toBeNull()
    const keyframes = new RegExp(`@keyframes ${rule![1]} \\{([\\s\\S]*?)\\n\\}`).exec(ANIMATIONS_CSS)
    expect([...keyframes![1]!.matchAll(/([\w-]+):/g)].map((m) => m[1])).toEqual(["opacity"])
  })
})
