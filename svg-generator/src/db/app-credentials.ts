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
  BATTLENET_CLIENT_ID?: string
  BATTLENET_CLIENT_SECRET?: string
  GITHUB_PREVIEW_TOKEN?: string
}

/**
 * Keys here are lowercase to match the D1 rows -- see getUserEssentialConfigs,
 * which lowercases both plugin and key before building the map.
 */
const APP_CREDENTIALS: Array<{
  plugin: string
  key: string
  read: (env: AppCredentialEnv) => string | undefined
}> = [
  { plugin: "steam", key: "apikey", read: (env) => env.STEAM_API_KEY },
  // WoW Forever reads public characters with the application's Battle.net client
  // (client credentials grant). The pair is the application's; no user has one to give.
  { plugin: "wow_forever", key: "clientid", read: (env) => env.BATTLENET_CLIENT_ID },
  { plugin: "wow_forever", key: "clientsecret", read: (env) => env.BATTLENET_CLIENT_SECRET },
]

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

/** Same shape the plugin's own D1 row would have: SteamID64, 17 digits starting 7656. */
const STEAM_ID64 = /^7656\d{13}$/

/**
 * Credentials for a public preview: a card rendered for a visitor who has no account,
 * so there is no user and no plugin_secrets row to read.
 *
 * Two things go in that a signed-in render gets elsewhere:
 *
 * - `GITHUB_PREVIEW_TOKEN`, a classic token with no scopes, so it reads only what
 *   anyone can see. GitHub's GraphQL API has no anonymous access, so without it there
 *   is no GitHub preview. It is never merged into a signed-in render: a user who has
 *   not stored a PAT of their own would silently spend the preview's shared quota.
 * - the SteamID64 the visitor typed, which the Steam plugin reads from its essential
 *   config. It is an identifier anyone can look up, not a secret, so it travels in the
 *   plugin's public config and is moved here.
 *
 * The application's own credentials (Steam's key, the Battle.net client) are applied on top, as for any render.
 */
export function previewCredentials(
  plugins: Record<string, Record<string, unknown> | undefined>,
  env: AppCredentialEnv
): EssentialConfigs {
  const configs: EssentialConfigs = {}

  if (env.GITHUB_PREVIEW_TOKEN) configs.github = { pat: env.GITHUB_PREVIEW_TOKEN }

  const steamId = plugins.steam?.steamId
  if (typeof steamId === "string" && STEAM_ID64.test(steamId)) configs.steam = { steamid: steamId }

  return withAppCredentials(configs, env)
}
