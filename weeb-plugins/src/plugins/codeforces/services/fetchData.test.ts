import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchCodeforcesData, SUBMISSION_HISTORY_CAP } from "./fetchData"

/**
 * The solved count came from `user.status?count=100`, the last 100 submissions only:
 * tourist's card read 72 against 3060 on his profile. The fake API below honours
 * `from` and `count` the way Codeforces does, so a client that asks for a slice gets
 * a slice.
 */

type Submission = {
  id: number
  creationTimeSeconds: number
  problem: { contestId?: number; problemsetName?: string; index?: string; name: string }
  verdict: string
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/** One accepted submission per problem, newest first, as `user.status` returns them. */
function solvedProblems(count: number, letters = "ABCDEF"): Submission[] {
  return Array.from({ length: count }, (_, i) => ({
    id: count - i,
    creationTimeSeconds: 1_700_000_000 - i,
    problem: { contestId: 1000 + Math.floor(i / letters.length), index: letters[i % letters.length], name: `P${i}` },
    verdict: "OK",
  }))
}

function codeforcesApi(submissions: Submission[]) {
  const statusUrls: URL[] = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    switch (url.pathname) {
      case "/api/user.info":
        return Response.json({
          status: "OK",
          result: [{ handle: "tourist", rating: 3408, rank: "legendary grandmaster" }],
        })
      case "/api/user.rating":
        return Response.json({ status: "OK", result: [] })
      case "/api/user.status": {
        statusUrls.push(url)
        const start = Number(url.searchParams.get("from") ?? 1) - 1
        const count = url.searchParams.get("count")
        const end = count === null ? undefined : start + Number(count)
        return Response.json({ status: "OK", result: submissions.slice(start, end) })
      }
    }
    throw new Error(`request the test did not expect: ${url}`)
  })
  return statusUrls
}

const config = (sections: string[], username = "tourist") => ({ enabled: true, sections, username }) as never

const sum = (byDifficulty: Record<string, number>) => Object.values(byDifficulty).reduce((a, b) => a + b, 0)

beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}))
afterEach(() => vi.restoreAllMocks())

describe("Codeforces problems solved", () => {
  it("counts every solved problem in the history, not the last 100 submissions", async () => {
    const accepted = solvedProblems(250)
    // A resubmission of a solved problem and a wrong answer must not count.
    const history = [{ ...accepted[0]!, id: 9001 }, { ...accepted[1]!, id: 9002, verdict: "WRONG_ANSWER" }, ...accepted]
    codeforcesApi(history)

    const data = await fetchCodeforcesData(config(["problems_solved"]))

    expect(data.problemsSolved.total).toBe(250)
    expect(sum(data.problemsSolved.byDifficulty)).toBe(250)
    expect(data.problemsSolved.capped).toBe(false)
  })

  it("groups letters after H under I+ and numbered problems under Other, summing to the total", async () => {
    // acmsguru problems have no contest and a numeric index; two of them must count
    // as two.
    const acmsguru = ["100", "101"].map((index, i) => ({
      id: 5000 + i,
      creationTimeSeconds: 1,
      problem: { problemsetName: "acmsguru", index, name: `SGU ${index}` },
      verdict: "OK",
    }))
    codeforcesApi([...solvedProblems(26 * 4, LETTERS), ...acmsguru])

    const { problemsSolved } = await fetchCodeforcesData(config(["problems_solved"]))

    expect(problemsSolved.total).toBe(106)
    expect(problemsSolved.byDifficulty).toEqual({
      A: 4,
      B: 4,
      C: 4,
      D: 4,
      E: 4,
      F: 4,
      G: 4,
      H: 4,
      "I+": 72,
      Other: 2,
    })
  })

  it("marks the total as a lower bound when the history reaches the cap", async () => {
    codeforcesApi(solvedProblems(SUBMISSION_HISTORY_CAP + 10))

    const { problemsSolved } = await fetchCodeforcesData(config(["problems_solved"]))

    expect(problemsSolved.total).toBe(SUBMISSION_HISTORY_CAP)
    expect(problemsSolved.capped).toBe(true)
  })

  it("asks only for the recent submissions when the solved count is not on the card", async () => {
    const statusUrls = codeforcesApi(solvedProblems(250))

    const data = await fetchCodeforcesData(config(["rating_rank", "recent_submissions"]))

    expect(statusUrls.map((u) => u.searchParams.get("count"))).toEqual(["50"])
    expect(data.recentSubmissions).toHaveLength(50)
    expect(data.recentSubmissions[0]).toMatchObject({ problem: "1000A - P0", verdict: "Accepted" })
  })

  // The landing page's preview shows only these two: each call is one more against the
  // API's rate limit, and this one would be thrown away.
  it("makes no submissions call when neither the solved count nor the recent list is on the card", async () => {
    const statusUrls = codeforcesApi(solvedProblems(250))

    const data = await fetchCodeforcesData(config(["rating_rank", "contests_participated"]))

    expect(statusUrls).toEqual([])
    expect(data.rank).toBe("legendary grandmaster")
    expect(data.recentSubmissions).toEqual([])
  })

  // Codeforces' real answer for a handle that does not exist (2026-11-18): HTTP 400, and
  // "not found" only in the body. It used to come out as "API request failed: HTTP 400".
  it("reports a handle that does not exist as not found, though Codeforces answers 400", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      Response.json({ status: "FAILED", comment: "handles: User with handle nobody not found" }, { status: 400 })
    )

    await expect(fetchCodeforcesData(config(["rating_rank"], "nobody"))).rejects.toThrow(
      'Codeforces user "nobody" not found'
    )
  })

  it("keeps any other 400 an upstream failure", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      Response.json({ status: "FAILED", comment: "Call limit exceeded" }, { status: 400 })
    )

    await expect(fetchCodeforcesData(config(["rating_rank"]))).rejects.toThrow(
      "Codeforces API request failed: HTTP 400"
    )
  })
})
