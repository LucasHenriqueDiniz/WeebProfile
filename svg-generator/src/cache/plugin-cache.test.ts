import { describe, expect, it } from "vitest"
import { makePluginCache } from "./plugin-cache"

/** An R2 bucket in a Map, with the two calls the cache makes. */
function bucket({ failing = false } = {}) {
  const objects = new Map<string, string>()
  return {
    objects,
    get: async (key: string) => {
      if (failing) throw new Error("R2 down")
      const value = objects.get(key)
      return value === undefined ? null : { text: async () => value }
    },
    put: async (key: string, value: string) => {
      if (failing) throw new Error("R2 down")
      objects.set(key, value)
    },
  }
}

describe("makePluginCache", () => {
  it("keeps each value as its own object under plugin-cache/", async () => {
    const r2 = bucket()
    const cache = makePluginCache({ SCREENSHOTS: r2 as never })
    await cache.put("wow_forever/icon/item/2575", "data:image/jpeg;base64,AA")
    expect([...r2.objects.keys()]).toEqual(["plugin-cache/wow_forever/icon/item/2575"])
    expect(await cache.get("wow_forever/icon/item/2575")).toBe("data:image/jpeg;base64,AA")
    expect(await cache.get("wow_forever/icon/item/1")).toBeNull()
  })

  it("refuses keys that would leave its prefix", async () => {
    const r2 = bucket()
    const cache = makePluginCache({ SCREENSHOTS: r2 as never })
    for (const key of ["../screenshots/x.jpg", "a/../../b", "/abs", "Upper/Case", ""]) {
      await cache.put(key, "x")
      expect(await cache.get(key)).toBeNull()
    }
    expect(r2.objects.size).toBe(0)
  })

  it("reports a failing bucket as a miss and a lost write, without throwing", async () => {
    const cache = makePluginCache({ SCREENSHOTS: bucket({ failing: true }) as never })
    await expect(cache.put("wow_forever/class/5", "{}")).resolves.toBeUndefined()
    await expect(cache.get("wow_forever/class/5")).resolves.toBeNull()
  })

  it("is a cache that always misses without the bucket", async () => {
    const cache = makePluginCache({})
    await cache.put("wow_forever/class/5", "{}")
    expect(await cache.get("wow_forever/class/5")).toBeNull()
  })
})
