import { renderToStaticMarkup } from "react-dom/server"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { PluginManager } from "../manager"
import { PLUGINS_METADATA } from "../metadata"
import type { GithubData } from "./types"

/**
 * Height of every GitHub section but the calendar (see calendar-height.test.ts and
 * calendar-single-year-height.test.ts) against what the browsers draw.
 *
 * A card for LucasHenriqueDiniz (default, half, favorite_languages with 8 languages and
 * top_repositories) came out 1096px tall for 842px of content. The languages counted 54px
 * a row for rows of 28, and 5 rows when nothing was set, where the component draws 10.
 * Other sections were short and cut their content: top_repositories and gists counted 5
 * cards where the components draw 10 (680px cut for antfu), sponsors and sponsorships 5
 * rows of 10 (394px) and nothing at all for their empty state (92px). recent_activity
 * reserved 124px a card for cards of 98 (229px of blank), and introduction a fixed 130px,
 * 178 in the terminal (102px of blank for torvalds). The terminal counted the body's 8px
 * bottom padding once per section instead of once per card.
 *
 * `MEASURED` is the height of the section in Chrome 158, Firefox 150 and WebKit 26.4
 * (Playwright 1.60), measured 17/11/2026 the way `pnpm --filter @weeb/svg-generator
 * audit:heights` measures it (renderPlugins, theme CSS, no terminal header), with the mock
 * changed as `VARIANTS` says and the process in UTC. Real cards from the GitHub API for
 * LucasHenriqueDiniz, antfu and torvalds, each section alone and all of them in one card,
 * measured within the same tolerance. activity, repositories and star_lists failed with real
 * data until the same day; measured then for those three and jlevy (32 star lists, up to 20
 * drawn), alone and together, all exact.
 *
 * Tolerance: never shorter than the tallest engine, at most 2px over it. Text that wraps
 * (introduction, recent activity titles, star list descriptions) is counted by
 * `wrappedLineCount`, which leaves kerning out, and the width loses a space for WebKit
 * (height.ts), so rows marked WRAP may be up to a line (20px) over. All of them measured
 * exact.
 *
 * Layout changed with the formulas, where a height depended on the engine or was wrong:
 * TerminalGrid fills every column (a row without a subtitle moved the cells after it up a
 * column: 7 gists and their header drew 7 rows, not 8), the People avatars are flex items
 * (on the text baseline they took the font's descent under them), and three terminal lines
 * got a fixed height (Code Habits labels, 18px in WebKit and 19 elsewhere; its language
 * rows, 21px in Firefox; the empty sponsors line, 18 to 26px).
 */

type Style = "default" | "terminal"
type Size = "half" | "full"
type Options = Record<string, unknown>
// [sections, style, size, variant, options, [Chrome, Firefox, WebKit] px]
type Case = [string[], Style, Size, keyof typeof VARIANTS, Options, [number, number, number], typeof WRAP?]

const WRAP = "wrap"

function repeat<T>(list: T[], n: number, rename: (item: T, i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => rename(list[i % list.length] as T, i))
}

const VARIANTS = {
  mock: (m: GithubData): GithubData => m,
  // More than the 10 the component draws by default: "+2 more"
  "12 repos": (m: GithubData): GithubData => ({
    ...m,
    topRepositories: repeat(m.topRepositories!, 12, (r, i) => ({
      ...r,
      name: `repo-${i}`,
      nameWithOwner: `weebprofile/repo-${i}`,
    })),
  }),
  // The card the report came from had 4
  "4 repos": (m: GithubData): GithubData => ({ ...m, topRepositories: m.topRepositories!.slice(0, 4) }),
  // The first two without a description: the terminal grid's third column
  "7 gists": (m: GithubData): GithubData => ({
    ...m,
    gists: {
      totalCount: 7,
      nodes: repeat(m.gists!.nodes, 7, (g, i) => ({
        ...g,
        name: `gist-${i}`,
        description: i < 2 ? null : g.description,
      })),
    },
  }),
  "no sponsors": (m: GithubData): GithubData => ({
    ...m,
    sponsors: { totalCount: 0, nodes: [] },
    sponsorships: { totalCount: 0, nodes: [] },
  }),
  "12 sponsors": (m: GithubData): GithubData => ({
    ...m,
    sponsors: { totalCount: 12, nodes: repeat(m.sponsors!.nodes, 12, (s, i) => ({ ...s, login: `sponsor-${i}` })) },
    sponsorships: {
      totalCount: 12,
      nodes: repeat(m.sponsorships!.nodes, 12, (s, i) => ({
        ...s,
        sponsorable: { ...s.sponsorable, login: `s-${i}` },
      })),
    },
  }),
  // No bio, and no activity section to count organizations
  "short intro": (m: GithubData): GithubData => ({
    ...m,
    introduction: { location: "Portland, OR", company: "Linux Foundation" },
    activity: undefined as never,
  }),
  warning: (m: GithubData): GithubData => ({ ...m, warnings: [{ type: "partial_data", message: "x" }] }),
  // A full row of a half card, then "+32 more" on a row of its own
  "8 of 40 people": (m: GithubData): GithubData => ({
    ...m,
    people: { ...m.people!, totalCount: 40, nodes: m.people!.nodes.slice(0, 8) },
  }),
  // Titles that wrap to the two-line clamp, and a footer that wraps: a repository long
  // enough to be truncated, after a file count and its additions and deletions
  "long activity": (m: GithubData): GithubData => ({
    ...m,
    recentActivity: m.recentActivity!.map((a, i) =>
      i === 0
        ? {
            ...a,
            title:
              "#1234 Refactor the whole rendering pipeline so that every section declares its height and the card never gets cut",
          }
        : i === 1
          ? {
              ...a,
              title: "#77 Fix wrapping of long pull request titles in the recent activity section of the GitHub plugin",
              repository: "some-organization-with-a-long-name/an-equally-long-repository-name",
              filesChanged: { files: 123, additions: 45678, deletions: 9012 },
            }
          : i === 2
            ? { ...a, title: "a-really-long-branch-name/that-keeps-going-and-going-until-it-has-to-wrap-somewhere" }
            : a
    ),
  }),
  // A list of 12 with its first 5 drawn: "+7 more repositories"
  "long star list": (m: GithubData): GithubData => ({
    ...m,
    starLists: [
      { ...m.starLists![0]!, totalCount: 12, repositories: m.starLists!.flatMap((list) => list.repositories) },
      m.starLists![1]!,
    ],
  }),
}

const CUSTOM_TEXT = "Hi! I build things for the web.\nCurrently learning Rust and writing small tools."
const SEVEN = ["profile", "activity", "favorite_languages", "gists", "stargazers", "people", "recent_activity"]

const MEASURED: Case[] = [
  [["favorite_languages"], "default", "half", "mock", {}, [330, 330, 330]],
  [["favorite_languages"], "default", "full", "mock", {}, [330, 330, 330]],
  [["favorite_languages"], "terminal", "half", "mock", {}, [292, 292, 292]],
  [["favorite_languages"], "terminal", "full", "mock", {}, [292, 292, 292]],
  [["favorite_languages"], "default", "half", "mock", { favorite_languages_max_languages: 8 }, [274, 274, 274]],
  [["favorite_languages"], "default", "full", "mock", { favorite_languages_max_languages: 8 }, [274, 274, 274]],
  [["favorite_languages"], "terminal", "half", "mock", { favorite_languages_max_languages: 8 }, [244, 244, 244]],
  [["favorite_languages"], "terminal", "full", "mock", { favorite_languages_max_languages: 8 }, [244, 244, 244]],
  [
    ["favorite_languages"],
    "default",
    "half",
    "mock",
    { favorite_languages_max_languages: 3, favorite_languages_ignore_languages: "TypeScript, javascript" },
    [134, 134, 134],
  ],
  [["favorite_languages"], "default", "half", "mock", { favorite_languages_hide_title: true }, [290, 290, 290]],
  // Twenty of the mock's 22: "Objective-C++" wrapped to two lines in half's 133px column
  // (634px drawn for 610) until its name was truncated, measured 18/11/2026.
  [["favorite_languages"], "default", "half", "mock", { favorite_languages_max_languages: 20 }, [610, 610, 610]],
  [["favorite_languages"], "default", "full", "mock", { favorite_languages_max_languages: 20 }, [610, 610, 610]],
  [["favorite_languages"], "terminal", "half", "mock", { favorite_languages_max_languages: 20 }, [532, 532, 532]],
  [["favorite_license"], "default", "half", "mock", {}, [88, 88, 88]],
  [["favorite_license"], "default", "full", "mock", {}, [88, 88, 88]],
  [["favorite_license"], "terminal", "half", "mock", {}, [111, 111, 110]],
  [["favorite_license"], "terminal", "full", "mock", {}, [111, 111, 110]],
  [["code_habits"], "default", "half", "mock", {}, [604, 604, 604]],
  [["code_habits"], "default", "full", "mock", {}, [552, 552, 552]],
  [["code_habits"], "terminal", "half", "mock", {}, [1112, 1112, 1112]],
  [["code_habits"], "terminal", "full", "mock", {}, [1112, 1112, 1112]],
  [["code_habits"], "default", "half", "mock", { code_habits_hide_hours: true }, [448, 448, 448]],
  [["code_habits"], "default", "half", "mock", { code_habits_hide_weekdays: true }, [460, 460, 460]],
  [
    ["code_habits"],
    "default",
    "full",
    "mock",
    { code_habits_hide_weekdays: true, code_habits_hide_stats: true },
    [344, 344, 344],
  ],
  [
    ["code_habits"],
    "default",
    "half",
    "mock",
    { code_habits_hide_languages: true, code_habits_hide_title: true },
    [544, 544, 544],
  ],
  [
    ["code_habits"],
    "default",
    "half",
    "mock",
    {
      code_habits_hide_hours: true,
      code_habits_hide_weekdays: true,
      code_habits_hide_languages: true,
      code_habits_hide_stats: true,
    },
    [64, 64, 64],
  ],
  [
    ["code_habits"],
    "terminal",
    "half",
    "mock",
    { code_habits_hide_hours: true, code_habits_hide_footer: true },
    [481, 481, 481],
  ],
  [
    ["code_habits"],
    "terminal",
    "half",
    "mock",
    { code_habits_hide_stats: true, code_habits_hide_languages: true },
    [858, 858, 858],
  ],
  [["starred_repositories"], "default", "half", "mock", {}, [1416, 1416, 1416]],
  [["starred_repositories"], "default", "full", "mock", {}, [1416, 1416, 1416]],
  [["starred_repositories"], "terminal", "half", "mock", {}, [280, 280, 280]],
  [["starred_repositories"], "terminal", "full", "mock", {}, [280, 280, 280]],
  [["starred_repositories"], "default", "half", "mock", { starred_repositories_max: 3 }, [464, 464, 464]],
  [["gists"], "default", "half", "mock", {}, [432, 432, 432]],
  [["gists"], "default", "full", "mock", {}, [432, 432, 432]],
  [["gists"], "terminal", "half", "mock", {}, [112, 112, 112]],
  [["gists"], "terminal", "full", "mock", {}, [112, 112, 112]],
  [["gists"], "default", "half", "7 gists", {}, [976, 976, 976]],
  [["gists"], "default", "full", "7 gists", {}, [976, 976, 976]],
  [["gists"], "terminal", "half", "7 gists", {}, [192, 192, 192]],
  [["gists"], "terminal", "full", "7 gists", {}, [192, 192, 192]],
  [["gists"], "default", "half", "7 gists", { gists_max: 2 }, [328, 328, 328]],
  [["gists"], "terminal", "half", "7 gists", { gists_max: 2 }, [120, 120, 120]],
  [["top_repositories"], "default", "half", "mock", {}, [704, 704, 704]],
  [["top_repositories"], "default", "full", "mock", {}, [704, 704, 704]],
  [["top_repositories"], "terminal", "half", "mock", {}, [152, 152, 152]],
  [["top_repositories"], "terminal", "full", "mock", {}, [152, 152, 152]],
  [["top_repositories"], "default", "half", "12 repos", {}, [1416, 1416, 1416]],
  [["top_repositories"], "default", "full", "12 repos", {}, [1416, 1416, 1416]],
  [["top_repositories"], "terminal", "half", "12 repos", {}, [280, 280, 280]],
  [["top_repositories"], "terminal", "full", "12 repos", {}, [280, 280, 280]],
  [
    ["top_repositories"],
    "default",
    "half",
    "12 repos",
    { top_repositories_max: 3, top_repositories_hide_title: true },
    [424, 424, 424],
  ],
  [["stargazers"], "default", "half", "mock", {}, [569, 568, 569]],
  [["stargazers"], "default", "full", "mock", {}, [569, 568, 569]],
  [["stargazers"], "terminal", "half", "mock", {}, [172, 172, 172]],
  [["stargazers"], "terminal", "full", "mock", {}, [172, 172, 172]],
  [["star_lists"], "default", "half", "mock", {}, [356, 356, 356], WRAP],
  [["star_lists"], "default", "full", "mock", {}, [356, 356, 356], WRAP],
  [["star_lists"], "terminal", "half", "mock", {}, [92, 92, 92]],
  [["star_lists"], "terminal", "full", "mock", {}, [92, 92, 92]],
  [["star_lists"], "default", "half", "long star list", {}, [440, 440, 440], WRAP],
  [["star_lists"], "default", "full", "long star list", {}, [440, 440, 440], WRAP],
  [["star_lists"], "terminal", "half", "long star list", {}, [92, 92, 92]],
  [["star_lists"], "terminal", "full", "long star list", {}, [92, 92, 92]],
  [["star_lists"], "default", "half", "long star list", { star_lists_max: 1 }, [288, 288, 288], WRAP],
  [["activity"], "default", "half", "mock", {}, [156, 156, 156]],
  [["activity"], "default", "full", "mock", {}, [156, 156, 156]],
  [["activity"], "terminal", "half", "mock", {}, [232, 232, 232]],
  [["activity"], "terminal", "full", "mock", {}, [232, 232, 232]],
  [["activity"], "default", "half", "mock", { activity_hide_title: true }, [116, 116, 116]],
  [["repositories"], "default", "half", "mock", {}, [132, 132, 132]],
  [["repositories"], "default", "full", "mock", {}, [132, 132, 132]],
  [["repositories"], "terminal", "half", "mock", {}, [212, 212, 212]],
  [["repositories"], "terminal", "full", "mock", {}, [212, 212, 212]],
  [["repositories"], "default", "half", "mock", { repositories_hide_title: true }, [92, 92, 92]],
  [["notable_contributions"], "default", "half", "mock", {}, [440, 440, 440]],
  [["notable_contributions"], "default", "full", "mock", {}, [440, 440, 440]],
  [["notable_contributions"], "terminal", "half", "mock", {}, [252, 252, 252]],
  [["notable_contributions"], "terminal", "full", "mock", {}, [252, 252, 252]],
  [["notable_contributions"], "default", "half", "mock", { notable_contributions_max: 3 }, [160, 160, 160]],
  [["recent_activity"], "default", "half", "mock", {}, [1057, 1057, 1057], WRAP],
  [["recent_activity"], "default", "full", "mock", {}, [1057, 1057, 1057], WRAP],
  [["recent_activity"], "default", "half", "long activity", {}, [1133, 1133, 1133], WRAP],
  [["recent_activity"], "default", "full", "long activity", {}, [1077, 1077, 1077], WRAP],
  [["recent_activity"], "terminal", "half", "mock", {}, [232, 232, 232]],
  [["recent_activity"], "terminal", "full", "mock", {}, [232, 232, 232]],
  [["recent_activity"], "default", "half", "mock", { recent_activity_max: 3 }, [346, 346, 346], WRAP],
  [["recent_activity"], "terminal", "half", "mock", { recent_activity_max: 3 }, [92, 92, 92]],
  [["introduction"], "default", "half", "mock", {}, [128, 128, 128], WRAP],
  [["introduction"], "default", "full", "mock", {}, [92, 92, 92], WRAP],
  [["introduction"], "terminal", "half", "mock", {}, [176, 176, 176], WRAP],
  [["introduction"], "terminal", "full", "mock", {}, [176, 176, 176], WRAP],
  [["introduction"], "default", "half", "short intro", {}, [60, 60, 60], WRAP],
  [["introduction"], "default", "full", "short intro", {}, [60, 60, 60], WRAP],
  [["introduction"], "terminal", "half", "short intro", {}, [76, 76, 76], WRAP],
  [["introduction"], "terminal", "full", "short intro", {}, [76, 76, 76], WRAP],
  [["introduction"], "default", "half", "mock", { introduction_custom_text: CUSTOM_TEXT }, [180, 180, 180], WRAP],
  [["introduction"], "terminal", "half", "mock", { introduction_custom_text: CUSTOM_TEXT }, [268, 268, 268], WRAP],
  [["featured_repositories"], "default", "half", "mock", {}, [432, 432, 432]],
  [["featured_repositories"], "default", "full", "mock", {}, [432, 432, 432]],
  [["featured_repositories"], "terminal", "half", "mock", {}, [112, 112, 112]],
  [["featured_repositories"], "terminal", "full", "mock", {}, [112, 112, 112]],
  [["sponsors"], "default", "half", "mock", {}, [248, 248, 248]],
  [["sponsors"], "default", "full", "mock", {}, [248, 248, 248]],
  [["sponsors"], "terminal", "half", "mock", {}, [112, 112, 112]],
  [["sponsors"], "terminal", "full", "mock", {}, [112, 112, 112]],
  [["sponsors"], "default", "half", "no sponsors", {}, [92, 92, 92]],
  [["sponsors"], "default", "full", "no sponsors", {}, [92, 92, 92]],
  [["sponsors"], "terminal", "half", "no sponsors", {}, [56, 56, 56]],
  [["sponsors"], "terminal", "full", "no sponsors", {}, [56, 56, 56]],
  [["sponsors"], "default", "half", "12 sponsors", {}, [788, 788, 788]],
  [["sponsors"], "default", "full", "12 sponsors", {}, [788, 788, 788]],
  [["sponsors"], "terminal", "half", "12 sponsors", {}, [252, 252, 252]],
  [["sponsors"], "terminal", "full", "12 sponsors", {}, [252, 252, 252]],
  [["sponsorships"], "default", "half", "no sponsors", {}, [92, 92, 92]],
  [["sponsorships"], "default", "full", "no sponsors", {}, [92, 92, 92]],
  [["sponsorships"], "terminal", "half", "no sponsors", {}, [56, 56, 56]],
  [["sponsorships"], "terminal", "full", "no sponsors", {}, [56, 56, 56]],
  [["sponsorships"], "default", "half", "12 sponsors", { sponsorships_max: 5 }, [428, 428, 428]],
  [["people"], "default", "half", "mock", {}, [128, 128, 128]],
  [["people"], "default", "full", "mock", {}, [80, 80, 80]],
  [["people"], "terminal", "half", "mock", {}, [252, 252, 252]],
  [["people"], "terminal", "full", "mock", {}, [252, 252, 252]],
  [["people"], "default", "half", "8 of 40 people", {}, [108, 108, 108]],
  [["people"], "default", "full", "8 of 40 people", {}, [80, 80, 80]],
  [["people"], "terminal", "half", "8 of 40 people", {}, [212, 212, 212]],
  [["people"], "terminal", "full", "8 of 40 people", {}, [212, 212, 212]],
  [["people"], "default", "half", "mock", { people_type: "repository" }, [64, 64, 64]],
  [["people"], "default", "full", "mock", { people_type: "repository" }, [44, 44, 44]],
  [["repository_contributors"], "default", "half", "mock", {}, [348, 348, 348]],
  [["repository_contributors"], "default", "full", "mock", {}, [284, 284, 284]],
  [["repository_contributors"], "terminal", "half", "mock", {}, [252, 252, 252]],
  [["repository_contributors"], "terminal", "full", "mock", {}, [252, 252, 252]],
  [["repository_contributors"], "default", "full", "mock", { repository_contributors_max: 5 }, [156, 156, 156]],
  [["favorite_languages"], "default", "half", "warning", {}, [370, 370, 370]],
  [["favorite_languages"], "default", "full", "warning", {}, [370, 370, 370]],
  [["favorite_languages"], "terminal", "half", "warning", {}, [344, 344, 344]],
  [["favorite_languages"], "terminal", "full", "warning", {}, [344, 344, 344]],
  // The reported card, and seven sections in one: the terminal body's padding is drawn once
  [
    ["favorite_languages", "top_repositories"],
    "default",
    "half",
    "4 repos",
    { favorite_languages_max_languages: 8 },
    [842, 842, 842],
  ],
  [
    ["favorite_languages", "top_repositories"],
    "default",
    "full",
    "4 repos",
    { favorite_languages_max_languages: 8 },
    [842, 842, 842],
  ],
  [
    ["favorite_languages", "top_repositories"],
    "terminal",
    "half",
    "4 repos",
    { favorite_languages_max_languages: 8 },
    [368, 368, 368],
  ],
  [
    ["favorite_languages", "top_repositories"],
    "terminal",
    "full",
    "4 repos",
    { favorite_languages_max_languages: 8 },
    [368, 368, 368],
  ],
  [SEVEN, "default", "half", "7 gists", {}, [3335, 3332, 3335], WRAP],
  [SEVEN, "default", "full", "7 gists", {}, [3295, 3292, 3295], WRAP],
  [SEVEN, "terminal", "half", "7 gists", {}, [1456, 1456, 1456]],
  [SEVEN, "terminal", "full", "7 gists", {}, [1456, 1456, 1456]],
  [["activity", "repositories", "star_lists"], "terminal", "half", "long star list", {}, [520, 520, 520]],
  [["activity", "repositories", "star_lists"], "default", "full", "long star list", {}, [728, 727, 728], WRAP],
  // The isometric calendar: the 40px title and a drawing of a fixed height per size and
  // duration; the statistics sit over the drawing's empty corner. Measured 18/11/2026.
  [["isocalendar"], "default", "half", "mock", {}, [274, 274, 274]],
  [["isocalendar"], "terminal", "half", "mock", {}, [266, 266, 266]],
  [["isocalendar"], "default", "full", "mock", {}, [274, 274, 274]],
  [["isocalendar"], "terminal", "full", "mock", {}, [266, 266, 266]],
  [["isocalendar"], "default", "half", "mock", { isocalendar_hide_title: true }, [234, 234, 234]],
  [["isocalendar"], "terminal", "half", "mock", { isocalendar_hide_title: true }, [266, 266, 266]],
  [["isocalendar"], "default", "full", "mock", { isocalendar_hide_title: true }, [234, 234, 234]],
  [["isocalendar"], "terminal", "full", "mock", { isocalendar_hide_title: true }, [266, 266, 266]],
  [["isocalendar"], "default", "half", "mock", { isocalendar_duration: "full_year" }, [297, 297, 297]],
  [["isocalendar"], "terminal", "half", "mock", { isocalendar_duration: "full_year" }, [289, 289, 289]],
  [["isocalendar"], "default", "full", "mock", { isocalendar_duration: "full_year" }, [337, 337, 337]],
  [["isocalendar"], "terminal", "full", "mock", { isocalendar_duration: "full_year" }, [329, 329, 329]],
  [["isocalendar"], "default", "half", "mock", { isocalendar_hide_stats: true }, [274, 274, 274]],
  [["isocalendar"], "terminal", "half", "mock", { isocalendar_hide_stats: true }, [266, 266, 266]],
  [["isocalendar"], "default", "full", "mock", { isocalendar_hide_stats: true }, [274, 274, 274]],
  [["isocalendar"], "terminal", "full", "mock", { isocalendar_hide_stats: true }, [266, 266, 266]],
]

const plugin = PluginManager.getInstance().get("github")!
const ALL_SECTIONS = (PLUGINS_METADATA.github as { sections: Array<{ id: string }> }).sections.map((s) => s.id)
let mock: GithubData
const realTz = process.env.TZ

beforeAll(async () => {
  // recent_activity groups by the day in the process's time zone; the heights were measured in UTC.
  process.env.TZ = "UTC"
  mock = (await plugin.fetchData({ ...plugin.config, sections: ALL_SECTIONS }, true, undefined, true)) as never
})

afterAll(() => {
  process.env.TZ = realTz
})

describe("github section heights", () => {
  it("uses the mock the heights were measured with", () => {
    expect(mock.languages).toHaveLength(22)
    expect(mock.topRepositories).toHaveLength(5)
    expect(mock.gists?.nodes).toHaveLength(3)
    expect(mock.recentActivity?.length).toBeGreaterThanOrEqual(10)
    expect(mock.people?.nodes).toHaveLength(10)
  })

  it("keeps each favorite language name on one line, as its 24px row counts", () => {
    const config = { ...plugin.config, enabled: true, sections: ["favorite_languages"], style: "default", size: "half" }
    const html = renderToStaticMarkup(
      plugin.render({ ...config, favorite_languages_max_languages: 20 } as never, mock as never) as never
    )
    expect(html).toContain('<span class="truncate">Objective-C++</span>')
  })

  it("covers what Chrome, Firefox and WebKit draw, at most 2px over (20px where text wraps)", () => {
    const wrong: string[] = []
    for (const [sections, style, size, variant, options, measured, wrap] of MEASURED) {
      const config = { ...plugin.config, enabled: true, sections, style, size, ...options }
      const height = plugin.calculateHeight(config as never, VARIANTS[variant](mock) as never, size)
      const tallest = Math.max(...measured)
      if (height < tallest || height - tallest > (wrap ? 20 : 2)) {
        wrong.push(
          `${sections.join("+")} ${style}/${size} ${variant} ${JSON.stringify(options)}: calc=${height} drawn=${measured}`
        )
      }
    }
    expect(wrong).toEqual([])
  })
})
