/**
 * The durable store behind weeb-plugins/src/utils/plugin-cache.ts: one R2 object per key,
 * under `plugin-cache/` in the bucket the screenshots already use (binding SCREENSHOTS,
 * the dashboard's weebprofile-svgs). It holds what never changes once fetched, like the
 * icon of a WoW item, so no expiry is kept.
 *
 * A failure is logged and reported as a miss or a lost write: the plugin then fetches the
 * value from its source, as it would without a cache.
 */

import type { R2Bucket } from "@cloudflare/workers-types"
import { log } from "../utils/log.js"

export interface PluginCacheEnv {
  SCREENSHOTS?: Pick<R2Bucket, "get" | "put">
}

const PREFIX = "plugin-cache/"
/** Keys come from plugin code, but a key is still a path: keep it to safe characters. */
const SAFE_KEY = /^[a-z0-9_][a-z0-9_./-]{0,200}$/

export function makePluginCache(env: PluginCacheEnv) {
  const bucket = env.SCREENSHOTS
  return {
    async get(key: string): Promise<string | null> {
      if (!bucket || !SAFE_KEY.test(key) || key.includes("..")) return null
      try {
        const object = await bucket.get(PREFIX + key)
        return object ? await object.text() : null
      } catch (error) {
        log.warn("plugin_cache.unreadable", { key, reason: error instanceof Error ? error.message : String(error) })
        return null
      }
    },
    async put(key: string, value: string): Promise<void> {
      if (!bucket || !SAFE_KEY.test(key) || key.includes("..")) return
      try {
        await bucket.put(PREFIX + key, value, { httpMetadata: { contentType: "text/plain; charset=utf-8" } })
      } catch (error) {
        log.warn("plugin_cache.unwritable", { key, reason: error instanceof Error ? error.message : String(error) })
      }
    },
  }
}
