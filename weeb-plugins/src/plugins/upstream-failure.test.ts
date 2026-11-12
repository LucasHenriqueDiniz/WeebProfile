import { describe, it, expect, vi, afterEach } from "vitest"
import { fetchSteamData } from "./steam/services/fetchData"
import { fetchLyftaData } from "./lyfta/services/fetchData"
import { fetchCodewarsData } from "./codewars/services/fetchData"
import { fetchCodeforcesData } from "./codeforces/services/fetchData"
import { fetchStackOverflowData } from "./stackoverflow/services/fetchData"
import { fetchDuolingoData } from "./duolingo/services/fetchData"

/**
 * A provider failure must reach the generator as a throw. These six used to catch
 * it and return their mock data, which the generator reported as a success
 * (hasErrors=false) and the dashboard published over the user's last good card.
 *
 * Only 4xx statuses here: fetchJson retries 5xx with real delays, and the throw
 * path after the retries is the same one.
 */
const cases = [
  {
    provider: "Steam",
    run: () => fetchSteamData({ sections: ["statistics"] } as never, false, "app-key", "76561197960287930"),
  },
  { provider: "Lyfta", run: () => fetchLyftaData({ sections: ["statistics"] } as never, false, "user-key") },
  { provider: "Codewars", run: () => fetchCodewarsData({ username: "someone", sections: ["rank_honor"] } as never) },
  {
    provider: "Codeforces",
    run: () => fetchCodeforcesData({ username: "someone", sections: ["rating_rank"] } as never),
  },
  {
    provider: "StackOverflow",
    run: () => fetchStackOverflowData({ userId: "12345", sections: ["reputation"] } as never),
  },
  {
    provider: "Duolingo",
    run: () => fetchDuolingoData({ username: "someone", sections: ["current_streak"] } as never),
  },
]

afterEach(() => vi.restoreAllMocks())

describe.each(cases)("$provider fetchData when the provider fails", ({ provider, run }) => {
  it.each([401, 403, 429])(
    "rejects on HTTP %i, naming the provider and status, instead of returning mock data",
    async (status) => {
      vi.spyOn(console, "error").mockImplementation(() => {})
      vi.spyOn(globalThis, "fetch").mockImplementation(
        async () => new Response(JSON.stringify({ error: "nope" }), { status }) as never
      )

      await expect(run()).rejects.toThrow(new RegExp(`${provider}.*${status}`))
    }
  )
})
