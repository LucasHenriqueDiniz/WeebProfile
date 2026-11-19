/**
 * A durable cache plugins can keep things in across generations: data that does not
 * change, like the icon of a game item, fetched once instead of on every card.
 *
 * The plugin cannot reach storage itself. The svg-generator Worker installs a store on
 * globalThis backed by R2 (svg-generator/src/cache/plugin-cache.ts), the way it installs
 * the screenshot function for the websites plugin. Anywhere else (tests, scripts, the
 * dashboard) there is none: reads miss and writes do nothing, so a plugin works the same,
 * only without the saving.
 *
 * Values are text. Neither function throws: a cache that fails is a cache that missed.
 */

export interface PluginCacheStore {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

type CacheRuntime = typeof globalThis & { __weebPluginCache?: PluginCacheStore }

const store = (): PluginCacheStore | undefined => (globalThis as CacheRuntime).__weebPluginCache

export async function pluginCacheGet(key: string): Promise<string | null> {
  try {
    return (await store()?.get(key)) ?? null
  } catch {
    return null
  }
}

export async function pluginCachePut(key: string, value: string): Promise<void> {
  try {
    await store()?.put(key, value)
  } catch {
    // Not kept: the next generation fetches it again.
  }
}
