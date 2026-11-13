import type { D1Database } from "@cloudflare/workers-types"
import { log } from "../utils/log.js"
import { decryptSecret } from "./secret-crypto"
import { ESSENTIAL_CONFIG_ALIASES } from "../config/essential-config-aliases"

export interface EssentialConfigs {
  [pluginName: string]:
    | {
        [key: string]: string | undefined
      }
    | undefined
}

interface PluginSecretRow {
  plugin: string
  key: string
  value: string
}

/**
 * The user's secrets exist but cannot be read: the encryption key is missing, or it
 * does not decrypt any of them. A configuration fault of the generator, told apart
 * from D1 being unreachable so the 503 names the right thing.
 */
export class SecretsUnreadableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SecretsUnreadableError"
  }
}

/**
 * Fetches a user's plugin secrets (API keys, tokens, etc.) from the
 * `plugin_secrets` table in Cloudflare D1, via the Worker's D1 binding.
 */
export async function getUserEssentialConfigs(
  db: D1Database,
  userId: string,
  encryptionKey?: string
): Promise<EssentialConfigs> {
  if (!userId) return {}

  // Fail closed, mirroring the write side. Without the key this used to hand the
  // raw column value straight to the plugins, so a missing binding would surface
  // as a plugin failing on a nonsense credential rather than as the config error
  // it actually is.
  if (!encryptionKey) {
    throw new SecretsUnreadableError("SECRETS_ENCRYPTION_KEY is not configured; cannot read plugin secrets")
  }

  // No catch here: a failure propagates to handleGenerate, which logs it as
  // secrets.unavailable with the hashed user. This used to log the raw Clerk user id
  // first, which Workers Logs would now keep.
  const { results } = await db
    .prepare("SELECT plugin, key, value FROM plugin_secrets WHERE user_id = ?")
    .bind(userId)
    .all<PluginSecretRow>()

  const result: EssentialConfigs = {}
  const unreadable: Array<{ plugin: string; name: string; reason: string }> = []
  let stored = 0
  for (const row of results) {
    const pluginName = (row.plugin || "").toLowerCase()
    const key = (row.key || "").toLowerCase()
    if (!pluginName || !key) continue
    stored++
    try {
      const value = await decryptSecret(row.value, encryptionKey)
      if (!result[pluginName]) result[pluginName] = {}
      result[pluginName]![key] = value
    } catch (error) {
      // One row that does not decrypt used to fail this whole read, so every card of
      // the user stopped -- whichever plugin the row belonged to, a disabled one
      // included -- under a 503 that blamed D1. It now counts as not configured: a
      // plugin that needs it reports the secret as missing, which the user can fix by
      // entering it again, and the other plugins are not affected.
      unreadable.push({ plugin: pluginName, name: key, reason: error instanceof Error ? error.message : String(error) })
    }
  }

  for (const row of unreadable) {
    log.warn("secrets.undecryptable", row)
  }
  // Not one of them decrypts: that is the key, not a row (the dashboard and the
  // generator holding different SECRETS_ENCRYPTION_KEY values, say).
  if (stored > 0 && unreadable.length === stored) {
    throw new SecretsUnreadableError(
      `None of the user's ${stored} stored secret(s) decrypts with SECRETS_ENCRYPTION_KEY (first: ${unreadable[0]!.reason})`
    )
  }

  // Alias resolution: if a plugin (e.g. "github_repo") has no secret of its own,
  // fall back to another plugin's already-configured secret (e.g. "github"'s PAT)
  // so the user never has to re-enter the same token twice.
  for (const [alias, target] of Object.entries(ESSENTIAL_CONFIG_ALIASES)) {
    if (!result[alias] && result[target]) {
      result[alias] = result[target]
    }
  }

  if (Object.keys(result).length > 0) {
    log.debug("essential_configs_loaded", { plugins: Object.keys(result) })
  }

  return result
}
