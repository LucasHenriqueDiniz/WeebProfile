import { queryD1 } from "./d1-client.js"

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
 * `plugin_secrets` table in Cloudflare D1.
 */
export async function getUserEssentialConfigs(userId: string): Promise<EssentialConfigs> {
  if (!userId) return {}

  try {
    const rows = await queryD1<PluginSecretRow>("SELECT plugin, key, value FROM plugin_secrets WHERE user_id = ?", [
      userId,
    ])

    const result: EssentialConfigs = {}
    for (const row of rows) {
      const pluginName = (row.plugin || "").toLowerCase()
      const key = (row.key || "").toLowerCase()
      if (!pluginName || !key) continue
      if (!result[pluginName]) result[pluginName] = {}
      result[pluginName]![key] = row.value
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
