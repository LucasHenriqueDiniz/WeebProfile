import type { EssentialConfigs } from "./essential-configs.js"

/**
 * Credentials the application owns, as opposed to secrets a user hands us.
 *
 * Some provider APIs take an application key that identifies the caller rather
 * than authorising access to one account: any valid key can read any public
 * profile. Steam's Web API works that way, so asking each user for their own key
 * was requesting a credential that was both more powerful than needed and not
 * needed per-user at all -- it also lets the holder administer that account's
 * game server tokens.
 *
 * These are merged into the same map as the user's secrets, in the lowercase
 * shape getUserEssentialConfigs returns, so the renderer's existing camelCase
 * normalisation applies and no plugin has to know where its credential came from.
 */

interface AppCredentialEnv {
  STEAM_API_KEY?: string
}

/**
 * Keys here are lowercase to match the D1 rows -- see getUserEssentialConfigs,
 * which lowercases both plugin and key before building the map.
 */
const APP_CREDENTIALS: Array<{
  plugin: string
  key: string
  read: (env: AppCredentialEnv) => string | undefined
}> = [{ plugin: "steam", key: "apikey", read: (env) => env.STEAM_API_KEY }]

export function withAppCredentials(configs: EssentialConfigs, env: AppCredentialEnv): EssentialConfigs {
  const merged: EssentialConfigs = { ...configs }

  for (const { plugin, key, read } of APP_CREDENTIALS) {
    const value = read(env)
    if (!value) continue

    // Fill, never override. A user who still has their own key stored keeps using
    // it, so this can roll out without invalidating anything already configured.
    const existing = merged[plugin]
    if (existing?.[key]) continue

    merged[plugin] = { ...existing, [key]: value }
  }

  return merged
}
