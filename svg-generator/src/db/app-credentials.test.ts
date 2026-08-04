import { describe, it, expect } from "vitest"
import { withAppCredentials } from "./app-credentials"

describe("withAppCredentials", () => {
  it("supplies the Steam key when the deployment has one", () => {
    const merged = withAppCredentials({}, { STEAM_API_KEY: "app-key" })
    expect(merged.steam?.apikey).toBe("app-key")
  })

  // Lowercase, because that is the shape getUserEssentialConfigs produces and what
  // the renderer's camelCase mapping expects to receive. A camelCase key here would
  // be dropped silently -- the plugin reads essentialConfig.apiKey after mapping.
  it("uses the lowercase key the renderer maps from", () => {
    const merged = withAppCredentials({}, { STEAM_API_KEY: "app-key" })
    expect(Object.keys(merged.steam!)).toEqual(["apikey"])
  })

  it("adds nothing when the deployment has no key", () => {
    expect(withAppCredentials({}, {})).toEqual({})
  })

  it("fills without overriding a key the user already stored", () => {
    const merged = withAppCredentials({ steam: { apikey: "user-key" } }, { STEAM_API_KEY: "app-key" })
    expect(merged.steam?.apikey).toBe("user-key")
  })

  it("keeps the plugin's other secrets intact", () => {
    const merged = withAppCredentials({ steam: { steamid: "76561198000000000" } }, { STEAM_API_KEY: "app-key" })
    expect(merged.steam).toEqual({ steamid: "76561198000000000", apikey: "app-key" })
  })

  it("leaves other plugins untouched", () => {
    const merged = withAppCredentials({ lastfm: { apikey: "lastfm-key" } }, { STEAM_API_KEY: "app-key" })
    expect(merged.lastfm).toEqual({ apikey: "lastfm-key" })
  })

  it("does not mutate the map it was given", () => {
    const original = { steam: { steamid: "123" } }
    withAppCredentials(original, { STEAM_API_KEY: "app-key" })
    expect(original.steam).toEqual({ steamid: "123" })
  })

  it("ignores an empty key rather than storing a blank credential", () => {
    expect(withAppCredentials({}, { STEAM_API_KEY: "" }).steam).toBeUndefined()
  })
})
