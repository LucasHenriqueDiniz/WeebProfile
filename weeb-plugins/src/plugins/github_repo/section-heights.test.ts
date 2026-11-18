import { beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import type { GithubRepoData } from "./types"

/**
 * Height of the stats, star_graph, languages, topics and overview sections (the banner is in
 * banner-height.test.ts) against what the browsers draw.
 *
 * Until 11/2026 each default section added 24px to its height on top of the 24px the
 * PluginManager adds to every card, and counted fixed rows. A stats grid reserved 110px for
 * 79 drawn, a languages spectrum in full 128 for 74, an overview 252 for 226. Topics counted
 * one row of chips: the card of huggingface/transformers' ten topics in half drew three and
 * cut the last 22px, 30 as a cloud, 88 to 97 as a cloud at lg. In the terminal, languages and
 * overview counted a wrapped line in full too (20px of blank) and topics never did (22px cut).
 *
 * `MEASURED` is the height of the section in Chrome 158, Firefox 150 and WebKit 26.4
 * (Playwright 1.60), measured 17/11/2026 the way `pnpm --filter @weeb/svg-generator
 * audit:heights` measures it (renderPlugins, theme CSS, no terminal header), with the mock
 * changed as `VARIANTS` says. "transformers" and "clearcut" are huggingface/transformers and
 * LucasHenriqueDiniz/clearcut as the plugin fetched them from the GitHub API that day.
 *
 * The terminal sections hand in 24px less than they draw: the PluginManager adds them back.
 *
 * Tolerance: at content size md, never shorter than the tallest engine and at most 2px over
 * it. The other content sizes zoom the section, and each engine rounds the zoomed lines its
 * own way (Firefox drew milestones 2px taller at lg, WebKit the featured stats 2px taller at
 * sm), so there the formula is within 2px either way; the card's 24px pad covers the default
 * style, and the terminal cases lose at most 1px of their bottom padding.
 */

type Section = "stats" | "star_graph" | "languages" | "topics" | "overview"
type Style = "default" | "terminal"
type Size = "half" | "full"
// [section, style, size, variant, options, [Chrome, Firefox, WebKit] px]
type Case = [Section, Style, Size, keyof typeof VARIANTS, Record<string, unknown>, [number, number, number]]

const TRANSFORMERS: Partial<GithubRepoData> = {
  name: "transformers",
  nameWithOwner: "huggingface/transformers",
  description:
    "🤗 Transformers: the model-definition framework for state-of-the-art machine learning models in text, vision, audio, and multimodal models, for both inference and training. ",
  stargazerCount: 169313,
  forkCount: 35295,
  openIssuesCount: 397,
  watcherCount: 1360,
  primaryLanguage: { name: "Python", color: "#3572A5" },
  licenseInfo: { name: "Apache License 2.0", spdxId: "Apache-2.0" },
  topics: [
    "nlp",
    "natural-language-processing",
    "pytorch",
    "pytorch-transformers",
    "transformer",
    "model-hub",
    "pretrained-models",
    "speech-recognition",
    "hacktoberfest",
    "python",
  ],
  languages: [
    { name: "Python", color: "#3572A5", percentage: 99.9 },
    { name: "Dockerfile", color: "#384d54", percentage: 0.1 },
    { name: "Shell", color: "#89e051", percentage: 0 },
    { name: "Makefile", color: "#427819", percentage: 0 },
    { name: "HCL", color: "#844FBA", percentage: 0 },
  ],
  // GitHub answers the stargazers list of someone else's repository with 404.
  starHistory: [],
}

const CLEARCUT: Partial<GithubRepoData> = {
  name: "clearcut",
  nameWithOwner: "LucasHenriqueDiniz/clearcut",
  description:
    "Desktop app for batch background removal and image processing. Tauri + Next.js + FastAPI, runs fully offline.",
  stargazerCount: 1,
  forkCount: 0,
  openIssuesCount: 0,
  watcherCount: 0,
  primaryLanguage: { name: "TypeScript", color: "#3178c6" },
  licenseInfo: null,
  topics: [
    "background-removal",
    "desktop-app",
    "fastapi",
    "image-processing",
    "nextjs",
    "python",
    "rembg",
    "tauri",
    "batch-processing",
    "cross-platform",
  ],
  languages: [
    { name: "TypeScript", color: "#3178c6", percentage: 65 },
    { name: "Python", color: "#3572A5", percentage: 30.4 },
    { name: "Rust", color: "#dea584", percentage: 2.7 },
    { name: "CSS", color: "#663399", percentage: 0.9 },
    { name: "Makefile", color: "#427819", percentage: 0.2 },
    { name: "JavaScript", color: "#f1e05a", percentage: 0.2 },
  ],
  starHistory: [{ date: "2026-03-10T01:40:55Z", count: 1 }],
}

const VARIANTS = {
  mock: (m: GithubRepoData): GithubRepoData => m,
  "no history": (m: GithubRepoData): GithubRepoData => ({ ...m, starHistory: [] }),
  // The last two points equal: no star delta to draw
  "flat history": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    starHistory: m.starHistory.map((p, i, all) => (i === all.length - 1 ? { ...p, count: all[i - 1]!.count } : p)),
  }),
  "big numbers": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    stargazerCount: 252897,
    forkCount: 51234,
    openIssuesCount: 1234,
    watcherCount: 6789,
    starHistory: m.starHistory.map((p) => ({ ...p, count: p.count * 1975 })),
    licenseInfo: { name: "Apache License 2.0", spdxId: "Apache-2.0" },
    primaryLanguage: { name: "Jupyter Notebook", color: "#DA5B0B" },
  }),
  "6 long languages": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    languages: [
      { name: "Jupyter Notebook", color: "#DA5B0B", percentage: 45.2 },
      { name: "Objective-C++", color: "#6866fb", percentage: 21.7 },
      { name: "Visual Basic .NET", color: "#945db7", percentage: 14.4 },
      { name: "Inno Setup", color: "#264b99", percentage: 9.9 },
      { name: "Dockerfile", color: "#384d54", percentage: 5.1 },
      { name: "TypeScript", color: "#3178c6", percentage: 3.7 },
    ],
  }),
  "10 long topics": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    topics: [
      "machine-learning",
      "natural-language-processing",
      "deep-learning",
      "pytorch",
      "tensorflow",
      "transformer",
      "speech-recognition",
      "model-hub",
      "hacktoberfest",
      "large-language-models",
    ],
  }),
  // GitHub's longest topic is 50 characters
  "50-char topic": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    topics: ["a-very-long-topic-name-that-reaches-the-fifty-max", "svg", "readme"],
  }),
  "no description": (m: GithubRepoData): GithubRepoData => ({ ...m, description: null }),
  "long meta row": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    primaryLanguage: { name: "Visual Basic .NET", color: "#945db7" },
    licenseInfo: { name: "BSD 3-Clause", spdxId: "BSD-3-Clause" },
    forkCount: 51234,
    openIssuesCount: 1234,
  }),
  "long name": (m: GithubRepoData): GithubRepoData => ({
    ...m,
    name: "claude-usage-bar-macos-extended-edition",
    nameWithOwner: "LucasHenriqueDiniz/claude-usage-bar-macos-extended-edition",
  }),
  transformers: (m: GithubRepoData): GithubRepoData => ({ ...m, ...TRANSFORMERS }),
  clearcut: (m: GithubRepoData): GithubRepoData => ({ ...m, ...CLEARCUT }),
}

const MEASURED: Case[] = [
  ["stats", "default", "half", "mock", { stats_variant: "grid" }, [79, 79, 79]],
  ["stats", "default", "full", "mock", { stats_variant: "grid" }, [79, 79, 79]],
  ["stats", "default", "half", "mock", { stats_variant: "inline" }, [48, 48, 48]],
  ["stats", "default", "full", "mock", { stats_variant: "inline" }, [48, 48, 48]],
  ["stats", "default", "half", "mock", { stats_variant: "sparkstats" }, [108, 108, 108]],
  ["stats", "default", "full", "mock", { stats_variant: "sparkstats" }, [108, 108, 108]],
  ["stats", "default", "half", "mock", { stats_variant: "featured" }, [84, 84, 85]],
  ["stats", "default", "full", "mock", { stats_variant: "featured" }, [84, 84, 85]],
  ["stats", "default", "half", "no history", { stats_variant: "sparkstats" }, [79, 79, 79]],
  ["stats", "default", "half", "mock", { stats_variant: "inline", content_size: "lg" }, [73, 73, 73]], // the delta wraps
  ["stats", "default", "full", "mock", { stats_variant: "inline", content_size: "lg" }, [63, 63, 63]],
  ["stats", "default", "half", "flat history", { stats_variant: "inline", content_size: "xl" }, [77, 77, 77]], // no delta to wrap
  ["stats", "default", "half", "mock", { stats_variant: "grid", content_size: "sm" }, [64, 64, 64]],
  ["stats", "default", "half", "mock", { stats_variant: "grid", content_size: "xl" }, [125, 125, 125]],
  ["stats", "terminal", "half", "mock", {}, [52, 52, 52]],
  ["stats", "terminal", "full", "big numbers", {}, [52, 52, 52]],
  ["stats", "terminal", "half", "mock", { content_size: "xl" }, [84, 84, 84]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "area" }, [185, 186, 186]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "bars" }, [163, 164, 164]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "milestones" }, [114, 115, 114]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "sparkline" }, [76, 76, 76]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "steps" }, [163, 164, 164]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "dots" }, [163, 164, 164]],
  ["star_graph", "default", "full", "mock", { star_graph_variant: "area" }, [185, 186, 186]],
  ["star_graph", "default", "half", "no history", { star_graph_variant: "area" }, [0, 0, 0]], // nothing to draw
  ["star_graph", "terminal", "half", "mock", {}, [153, 153, 153]],
  ["star_graph", "terminal", "full", "mock", {}, [153, 153, 153]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "area", content_size: "sm" }, [152, 152, 152]],
  ["star_graph", "default", "half", "mock", { star_graph_variant: "milestones", content_size: "lg" }, [146, 151, 146]],
  ["star_graph", "terminal", "half", "mock", { content_size: "lg" }, [199, 200, 199]],
  ["languages", "default", "half", "mock", { languages_variant: "spectrum" }, [96, 96, 96]],
  ["languages", "default", "full", "mock", { languages_variant: "spectrum" }, [74, 74, 74]],
  ["languages", "default", "half", "mock", { languages_variant: "bars" }, [126, 126, 126]],
  ["languages", "default", "full", "mock", { languages_variant: "bars" }, [126, 126, 126]],
  ["languages", "default", "half", "mock", { languages_variant: "donut" }, [135, 135, 135]],
  ["languages", "default", "full", "mock", { languages_variant: "donut" }, [135, 135, 135]],
  ["languages", "default", "half", "mock", { languages_variant: "blocks" }, [116, 116, 116]],
  ["languages", "default", "full", "mock", { languages_variant: "blocks" }, [116, 116, 116]],
  ["languages", "default", "half", "6 long languages", { languages_variant: "spectrum" }, [118, 118, 118]], // three rows of legend
  ["languages", "default", "full", "6 long languages", { languages_variant: "spectrum" }, [74, 74, 74]],
  ["languages", "default", "half", "mock", { languages_variant: "spectrum", max_languages: 0 }, [58, 58, 58]],
  ["languages", "default", "half", "mock", { languages_variant: "spectrum", max_languages: 1 }, [74, 74, 74]],
  ["languages", "default", "half", "6 long languages", { languages_variant: "bars" }, [152, 152, 152]],
  ["languages", "default", "half", "mock", { languages_variant: "bars", max_languages: 0 }, [32, 32, 32]],
  [
    "languages",
    "default",
    "half",
    "6 long languages",
    { languages_variant: "bars", max_languages: 8 },
    [152, 152, 152],
  ], // the component draws 5
  ["languages", "default", "half", "mock", { languages_variant: "blocks", max_languages: 0 }, [0, 0, 0]],
  ["languages", "default", "half", "transformers", { languages_variant: "spectrum" }, [96, 96, 96]],
  ["languages", "default", "half", "clearcut", { languages_variant: "spectrum" }, [96, 96, 96]],
  ["languages", "terminal", "half", "mock", {}, [78, 78, 78]],
  ["languages", "terminal", "full", "mock", {}, [58, 58, 58]],
  ["languages", "terminal", "half", "6 long languages", {}, [98, 98, 98]],
  ["languages", "terminal", "half", "mock", { max_languages: 0 }, [42, 42, 42]],
  [
    "languages",
    "default",
    "half",
    "6 long languages",
    { languages_variant: "spectrum", content_size: "xl" },
    [260, 260, 214],
  ],
  ["languages", "default", "half", "mock", { languages_variant: "bars", content_size: "sm" }, [104, 104, 109]], // WebKit's unzoomed gap
  [
    "languages",
    "default",
    "half",
    "6 long languages",
    { languages_variant: "donut", content_size: "xl" },
    [250, 250, 250],
  ], // the legend wraps
  ["languages", "terminal", "half", "6 long languages", { content_size: "sm" }, [64, 64, 67]],
  ["topics", "default", "half", "mock", { topics_variant: "chips" }, [96, 96, 96]],
  ["topics", "default", "full", "mock", { topics_variant: "chips" }, [60, 60, 60]],
  ["topics", "default", "half", "10 long topics", { topics_variant: "chips" }, [132, 132, 132]],
  ["topics", "default", "half", "mock", { topics_variant: "cloud" }, [102, 102, 102]],
  ["topics", "default", "full", "mock", { topics_variant: "cloud" }, [64, 64, 64]],
  ["topics", "default", "half", "10 long topics", { topics_variant: "cloud" }, [142, 142, 142]],
  ["topics", "default", "half", "mock", { topics_variant: "hash" }, [82, 82, 82]],
  ["topics", "default", "full", "mock", { topics_variant: "hash" }, [55, 55, 55]],
  ["topics", "default", "half", "10 long topics", { topics_variant: "hash" }, [108, 108, 108]],
  ["topics", "default", "full", "10 long topics", { topics_variant: "chips" }, [96, 96, 96]],
  ["topics", "default", "half", "mock", { topics_variant: "chips", max_topics: 0 }, [0, 0, 0]], // nothing to draw
  ["topics", "default", "half", "mock", { topics_variant: "chips", max_topics: 1 }, [60, 60, 60]], // and a +4 chip
  ["topics", "default", "half", "transformers", { topics_variant: "chips" }, [132, 132, 132]],
  ["topics", "default", "half", "transformers", { topics_variant: "hash" }, [108, 82, 82]], // Chrome breaks without the tracking
  ["topics", "default", "half", "clearcut", { topics_variant: "cloud" }, [102, 102, 102]],
  ["topics", "terminal", "half", "mock", {}, [44, 44, 44]],
  ["topics", "terminal", "full", "mock", {}, [44, 44, 44]],
  ["topics", "terminal", "half", "10 long topics", {}, [66, 66, 66]],
  ["topics", "terminal", "half", "mock", { max_topics: 0 }, [28, 28, 28]], // the command alone
  ["topics", "terminal", "half", "mock", { max_topics: 0, content_size: "sm" }, [23, 23, 23]], // under the manager's 24px
  ["topics", "default", "half", "mock", { topics_variant: "chips", max_topics: 4, content_size: "sm" }, [50, 50, 81]], // WebKit's unzoomed gap
  ["topics", "default", "half", "10 long topics", { topics_variant: "chips", content_size: "sm" }, [110, 110, 113]], // the border's device pixel
  ["topics", "default", "half", "10 long topics", { topics_variant: "cloud", content_size: "lg" }, [232, 232, 225]],
  ["topics", "default", "half", "50-char topic", { topics_variant: "chips", content_size: "xl" }, [177, 177, 172]], // a chip wraps its own text
  ["overview", "default", "half", "mock", {}, [225, 226, 226]],
  ["overview", "default", "full", "mock", {}, [225, 226, 226]],
  ["overview", "default", "half", "no description", {}, [203, 204, 204]],
  ["overview", "default", "half", "no history", {}, [127, 128, 128]],
  ["overview", "default", "half", "big numbers", {}, [241, 242, 242]], // the meta row wraps
  ["overview", "default", "full", "big numbers", {}, [225, 226, 226]],
  ["overview", "default", "half", "long meta row", {}, [241, 242, 242]],
  ["overview", "default", "half", "transformers", {}, [127, 128, 128]],
  ["overview", "terminal", "half", "mock", {}, [52, 52, 52]],
  ["overview", "terminal", "full", "mock", {}, [52, 52, 52]],
  ["overview", "terminal", "half", "big numbers", {}, [72, 72, 72]], // the line wraps
  ["overview", "terminal", "half", "long name", { content_size: "xl" }, [148, 180, 148]],
  ["overview", "default", "half", "mock", { content_size: "sm" }, [184, 186, 184]],
  ["overview", "default", "half", "mock", { content_size: "lg" }, [314, 314, 292]],
]

const plugin = PluginManager.getInstance().get("github_repo")!
let mock: GithubRepoData

beforeAll(async () => {
  mock = (await plugin.fetchData({ ...plugin.config, sections: ["stats"] }, true, undefined, true)) as never
})

function height(section: Section, style: Style, size: Size, data: GithubRepoData, options: Record<string, unknown>) {
  const config = { ...plugin.config, enabled: true, sections: [section], style, size, ...options }
  return plugin.calculateHeight(config as never, data as never, size)
}

describe("github_repo section heights", () => {
  it("uses the mock the heights were measured with", () => {
    expect(mock.languages.map((l) => l.name)).toEqual(["TypeScript", "React", "CSS", "JavaScript"])
    expect(mock.topics).toHaveLength(5)
    expect(mock.starHistory).toHaveLength(9)
    expect(mock.description).toBeTruthy()
  })

  it("covers what Chrome, Firefox and WebKit draw", () => {
    const wrong: string[] = []
    for (const [section, style, size, variant, options, measured] of MEASURED) {
      const calc = height(section, style, size, VARIANTS[variant](mock), options)
      const drawn = calc + (style === "terminal" ? 24 : 0)
      const tallest = Math.max(...measured)
      const zoomed = options.content_size !== undefined && options.content_size !== "md"
      // A section that draws nothing hands in 0, in any style.
      const ok = tallest === 0 ? calc === 0 : drawn <= tallest + 2 && drawn >= tallest - (zoomed ? 2 : 0)
      if (!ok)
        wrong.push(`${section} ${style}/${size} ${variant} ${JSON.stringify(options)}: calc=${drawn} drawn=${measured}`)
    }
    expect(wrong).toEqual([])
  })
})
