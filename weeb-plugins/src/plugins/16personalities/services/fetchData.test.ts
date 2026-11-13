import { describe, it, expect } from "vitest"
import { fetchPersonality16Data } from "./fetchData"
import { getMockPersonality16Data } from "./mock-data"
import type { Personality16Config } from "../types"

const config = (personality_url?: string): Personality16Config => ({
  enabled: true,
  sections: ["personality"],
  personality_url,
})

describe("fetchPersonality16Data", () => {
  // Every format the type is read from. The renderer used to run a stricter regex of
  // its own and drew an error box for the last three, over a card that was otherwise fine.
  it.each([
    ["https://www.16personalities.com/br/resultados/enfj-t/m/4lyvq4j0t", "ENFJ"],
    ["https://www.16personalities.com/intj-personality", "INTJ"],
    ["https://www.16personalities.com/br/personalidade-isfp", "ISFP"],
    ["https://www.16personalities.com/br/resultados/entp", "ENTP"],
  ])("reads the type from %s", async (url, type) => {
    expect((await fetchPersonality16Data(config(url))).type).toBe(type)
  })

  // These fell back to ENFJ, a personality the user never had, and the generator
  // reported the card as a success.
  it.each([["https://example.com/not-a-result"], ["https://www.16personalities.com/profiles/abc123"]])(
    "fails on %s instead of showing ENFJ",
    async (url) => {
      await expect(fetchPersonality16Data(config(url))).rejects.toThrow(/could not read a personality type/i)
    }
  )

  it("fails without a URL", async () => {
    await expect(fetchPersonality16Data(config("   "))).rejects.toThrow(/url is required/i)
  })

  it("returns the mock in dev mode whatever the URL, for the dashboard preview", async () => {
    expect(await fetchPersonality16Data(config("not a url"), true)).toEqual(getMockPersonality16Data())
  })
})
