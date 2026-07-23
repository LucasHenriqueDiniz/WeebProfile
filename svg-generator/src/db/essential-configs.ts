import type { D1Database } from "@cloudflare/workers-types"
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
 * Fetches a user's plugin secrets (API keys, tokens, etc.) from the
 * `plugin_secrets` table in Cloudflare D1, via the Worker's D1 binding.
 */
export async function getUserEssentialConfigs(
  db: D1Database,
  userId: string,
  encryptionKey?: string
): Promise<EssentialConfigs> {
  if (!userId) return {}

  try {
    const { results } = await db
      .prepare("SELECT plugin, key, value FROM plugin_secrets WHERE user_id = ?")
      .bind(userId)
      .all<PluginSecretRow>()

    const result: EssentialConfigs = {}
    for (const row of results) {
      const pluginName = (row.plugin || "").toLowerCase()
      const key = (row.key || "").toLowerCase()
      if (!pluginName || !key) continue
      if (!result[pluginName]) result[pluginName] = {}
      result[pluginName]![key] = encryptionKey ? await decryptSecret(row.value, encryptionKey) : row.value
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
      console.log(`✅ [DB] Essential configs loaded for plugins:`, Object.keys(result).join(", "))
    }

    return result
  } catch (error) {
    console.error(`Error fetching essential configs for user ${userId}:`, error)
    throw error
  }
}
