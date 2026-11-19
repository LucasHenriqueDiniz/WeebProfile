import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchLeetCodeData, LEETCODE_GRAPHQL_URL, RECENT_SUBMISSIONS_LIMIT } from "./fetchData"

/**
 * The answers below are trimmed copies of what leetcode.com/graphql returned on 18/11/2026,
 * from a Worker and from a laptop alike.
 */

const USER_ANSWER = {
  data: {
    allQuestionsCount: [
      { difficulty: "All", count: 4115 },
      { difficulty: "Easy", count: 976 },
      { difficulty: "Medium", count: 2148 },
      { difficulty: "Hard", count: 991 },
    ],
    matchedUser: {
      username: "lee215",
      languageProblemCount: [
        { languageName: "C++", problemsSolved: 152 },
        { languageName: "Java", problemsSolved: 254 },
        { languageName: "Python", problemsSolved: 445 },
        { languageName: "Rust", problemsSolved: 0 },
      ],
      tagProblemCounts: {
        advanced: [
          { tagName: "Dynamic Programming", problemsSolved: 136 },
          { tagName: "Data Stream", problemsSolved: 0 },
        ],
        intermediate: [{ tagName: "Hash Table", problemsSolved: 152 }],
        fundamental: [
          { tagName: "Array", problemsSolved: 388 },
          { tagName: "String", problemsSolved: 168 },
        ],
      },
      submitStatsGlobal: {
        acSubmissionNum: [
          { difficulty: "All", count: 704 },
          { difficulty: "Easy", count: 127 },
          { difficulty: "Medium", count: 423 },
          { difficulty: "Hard", count: 154 },
        ],
      },
    },
    recentAcSubmissionList: [
      { title: "Longest Resilient Subarray I", titleSlug: "longest-resilient-subarray-i", timestamp: "1794927112" },
    ],
  },
}

/** An unknown username: HTTP 200, the error only in the body. */
const UNKNOWN_USER_ANSWER = {
  errors: [
    {
      message: "That user does not exist.",
      locations: [{ line: 1, column: 26 }],
      path: ["matchedUser"],
      extensions: { handled: true, skip_sentry: true },
    },
  ],
  data: { matchedUser: null },
}

type Sent = { url: string; method?: string; body: { query: string; variables: Record<string, unknown> } }

function leetcodeAnswers(answer: () => Response): Sent[] {
  const sent: Sent[] = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    sent.push({ url: String(input), method: init?.method, body: JSON.parse(String(init?.body)) })
    return answer()
  })
  return sent
}

const config = (sections: string[], username = "lee215") => ({ enabled: true, sections, username }) as never

beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}))
afterEach(() => vi.restoreAllMocks())

describe("fetchLeetCodeData", () => {
  it("reads every section from one GraphQL request", async () => {
    const sent = leetcodeAnswers(() => Response.json(USER_ANSWER))

    const data = await fetchLeetCodeData(config(["solved", "skills", "languages", "recent"]))

    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({ url: LEETCODE_GRAPHQL_URL, method: "POST" })
    expect(sent[0]!.body.variables).toEqual({ username: "lee215", limit: RECENT_SUBMISSIONS_LIMIT })
    expect(data.solved).toEqual({
      total: 704,
      questions: 4115,
      byDifficulty: [
        { difficulty: "Easy", solved: 127, total: 976 },
        { difficulty: "Medium", solved: 423, total: 2148 },
        { difficulty: "Hard", solved: 154, total: 991 },
      ],
    })
    // Most solved first, across the three levels, without the tags at zero.
    expect(data.skills.map((s) => [s.name, s.category, s.solved])).toEqual([
      ["Array", "fundamental", 388],
      ["String", "fundamental", 168],
      ["Hash Table", "intermediate", 152],
      ["Dynamic Programming", "advanced", 136],
    ])
    expect(data.languages).toEqual([
      { name: "Python", solved: 445 },
      { name: "Java", solved: 254 },
      { name: "C++", solved: 152 },
    ])
    expect(data.recent).toEqual([
      {
        title: "Longest Resilient Subarray I",
        slug: "longest-resilient-subarray-i",
        date: new Date(1794927112 * 1000).toISOString(),
      },
    ])
  })

  it("leaves the recent list out of the query when the card does not show it", async () => {
    const sent = leetcodeAnswers(() =>
      Response.json({ data: { ...USER_ANSWER.data, recentAcSubmissionList: undefined } })
    )

    const data = await fetchLeetCodeData(config(["solved"]))

    expect(sent[0]!.body.query).not.toContain("recentAcSubmissionList")
    expect(sent[0]!.body.variables).toEqual({ username: "lee215" })
    expect(data.recent).toEqual([])
  })

  it("reports a username that does not exist as not found, though LeetCode answers 200", async () => {
    leetcodeAnswers(() => Response.json(UNKNOWN_USER_ANSWER))

    await expect(fetchLeetCodeData(config(["solved"], "nobody-zz9q"))).rejects.toThrow(
      'LeetCode user "nobody-zz9q" not found'
    )
  })

  it("reports a 403 from LeetCode as an upstream failure with the status", async () => {
    leetcodeAnswers(() => new Response("<html>Just a moment...</html>", { status: 403 }))

    await expect(fetchLeetCodeData(config(["solved"]))).rejects.toThrow("LeetCode API request failed: HTTP 403")
  })

  it("reports a GraphQL error that is not about the user as an upstream failure", async () => {
    leetcodeAnswers(() => Response.json({ errors: [{ message: "Internal error" }], data: null }))

    await expect(fetchLeetCodeData(config(["solved"]))).rejects.toThrow("LeetCode API request failed: Internal error")
  })

  it("asks for a username before calling LeetCode", async () => {
    const sent = leetcodeAnswers(() => Response.json(USER_ANSWER))

    await expect(fetchLeetCodeData(config(["solved"], "  "))).rejects.toThrow("LeetCode username is required")
    expect(sent).toEqual([])
  })

  it("returns the mock without calling LeetCode in dev", async () => {
    const sent = leetcodeAnswers(() => Response.json(USER_ANSWER))

    const data = await fetchLeetCodeData(config(["solved"]), true)

    expect(sent).toEqual([])
    expect(data.solved.byDifficulty).toHaveLength(3)
  })
})
