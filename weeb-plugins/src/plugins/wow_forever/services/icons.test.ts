import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { clearTokenCache } from "./battlenet"
import { clearIconMemory, iconCacheKey, iconFor } from "./icons"

const CREDENTIALS = { clientId: "app-client", clientSecret: "app-secret" }
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
const ICON_URL = "https://render.worldofwarcraft.com/forever-us/icons/56/135029.jpg"

type Runtime = typeof globalThis & { __weebPluginCache?: unknown }

/** Blizzard: the token, the media route (or a 404), the icon (or a failure). */
function stub({ media = true, image = true } = {}) {
  const calls: string[] = []
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
      calls.push(url)
      if (url.startsWith("https://oauth.battle.net/")) return Response.json({ access_token: "t", expires_in: 86399 })
      if (url.includes("/data/wow/media/")) {
        return media
          ? Response.json({ assets: [{ key: "icon", value: ICON_URL, file_data_id: 135029 }] })
          : new Response(null, { status: 404 })
      }
      if (url === ICON_URL) {
        return image
          ? new Response(JPEG, { headers: { "content-type": "image/jpeg" } })
          : new Response(null, { status: 503 })
      }
      return new Response(null, { status: 404 })
    })
  )
  return calls
}

/** A plugin cache like the generator's R2 one, in a Map. */
function installCache(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  ;(globalThis as Runtime).__weebPluginCache = {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => void store.set(key, value),
  }
  return store
}

const blizzardCalls = (calls: string[]) => calls.filter((u) => !u.startsWith("https://oauth.battle.net/"))

beforeEach(() => {
  clearTokenCache()
  clearIconMemory()
})
afterEach(() => {
  vi.unstubAllGlobals()
  delete (globalThis as Runtime).__weebPluginCache
})

describe("iconFor", () => {
  it("reads the object's media, embeds the icon and keeps it in the plugin cache", async () => {
    const calls = stub()
    const store = installCache()
    const icon = await iconFor(CREDENTIALS, "us", "item", 2575)
    expect(icon).toBe("data:image/jpeg;base64,/9j/4AAQ")
    expect(new URL(blizzardCalls(calls)[0]!).pathname).toBe("/data/wow/media/item/2575")
    expect(new URL(blizzardCalls(calls)[0]!).searchParams.get("namespace")).toBe("static-forever-us")
    expect(store.get(iconCacheKey("item", 2575))).toBe(icon)
  })

  it("answers again from memory, without a call", async () => {
    const calls = stub()
    await iconFor(CREDENTIALS, "us", "item", 2575)
    const before = calls.length
    expect(await iconFor(CREDENTIALS, "eu", "item", 2575)).toBe("data:image/jpeg;base64,/9j/4AAQ")
    expect(calls.length).toBe(before)
  })

  it("answers from the plugin cache in a new isolate, without asking Blizzard", async () => {
    const calls = stub()
    installCache({ [iconCacheKey("item", 2575)]: "data:image/jpeg;base64,CACHED" })
    expect(await iconFor(CREDENTIALS, "us", "item", 2575)).toBe("data:image/jpeg;base64,CACHED")
    expect(calls).toEqual([])
  })

  it("keeps an object with no media as having none, so it is not asked again", async () => {
    const calls = stub({ media: false })
    const store = installCache()
    expect(await iconFor(CREDENTIALS, "us", "achievement", 6)).toBeNull()
    expect(store.get(iconCacheKey("achievement", 6))).toBe("none")
    clearIconMemory()
    const before = calls.length
    expect(await iconFor(CREDENTIALS, "us", "achievement", 6)).toBeNull()
    expect(calls.length).toBe(before)
  })

  it("does not keep a passing failure: the next card tries again", async () => {
    stub({ image: false })
    const store = installCache()
    expect(await iconFor(CREDENTIALS, "us", "item", 2575)).toBeNull()
    expect(store.size).toBe(0)
    stub()
    expect(await iconFor(CREDENTIALS, "us", "item", 2575)).toBe("data:image/jpeg;base64,/9j/4AAQ")
  })
})
