import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { essentialConfigs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { getMissingEssentialConfigs } from "../../../lib/config/plugin-essential-configs"

/**
 * GET /api/profile/essential-configs - Get essential configs (values redacted for security)
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const db = getDb(env)

    // Fetch all essential config rows for the user
    const configs = await db.select().from(essentialConfigs).where(eq(essentialConfigs.userId, userId))

    // Build nested structure: { plugin: { key: value } }
    const rawConfigs: Record<string, Record<string, string>> = {}
    for (const config of configs) {
      const plugin = config.plugin.toLowerCase()
      const key = config.key.toLowerCase()
      if (!rawConfigs[plugin]) rawConfigs[plugin] = {}
      rawConfigs[plugin]![key] = config.value
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const enabledPluginsParam = searchParams.get("enabledPlugins")
    const enabledPlugins = enabledPluginsParam ? enabledPluginsParam.split(",") : []

    // Check for missing configs if enabledPlugins provided
    let missingConfigs: Array<{ pluginName: string; missingKeys: any[] }> = []
    if (enabledPlugins.length > 0) {
      missingConfigs = getMissingEssentialConfigs(enabledPlugins, rawConfigs)
    }

    // Return only configured status (boolean), never the actual values
    const configStatus: Record<string, Record<string, boolean>> = {}
    for (const [plugin, pluginConfigs] of Object.entries(rawConfigs)) {
      configStatus[plugin] = {}
      for (const [key, value] of Object.entries(pluginConfigs)) {
        configStatus[plugin]![key] = !!(value && typeof value === "string" && value.trim().length > 0)
      }
    }

    return Response.json({
      essentialConfigs: configStatus,
      missingConfigs: missingConfigs.map(({ pluginName, missingKeys }) => ({
        pluginName,
        missingKeys: missingKeys.map((key) => ({
          key: key.key,
          label: key.label,
          type: key.type,
          placeholder: key.placeholder,
          description: key.description,
          helpUrl: key.helpUrl,
          docKey: key.docKey,
        })),
      })),
    })
  } catch (e) {
    return serverError(e)
  }
}
