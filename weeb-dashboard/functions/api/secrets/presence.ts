import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { essentialConfigs } from "../../../lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ESSENTIAL_CONFIG_ALIASES } from "../_shared/essential-config-aliases"

/**
 * GET /api/secrets/presence - Check which secrets exist (without values)
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const { searchParams } = new URL(request.url)
    const enabledPluginsParam = searchParams.get("enabledPlugins")

    let enabledPlugins: string[] = []
    if (enabledPluginsParam === "all") {
      enabledPlugins = Object.keys(PLUGINS_METADATA)
    } else if (enabledPluginsParam) {
      enabledPlugins = enabledPluginsParam.split(",")
    }

    if (enabledPlugins.length === 0) {
      return Response.json({ presence: {}, missingSecrets: [] })
    }

    const normalised = enabledPlugins.map((p) => p.toLowerCase())
    // Also fetch alias targets (e.g. "github" when "github_repo" is requested) so aliased
    // plugins can report presence from the shared secret instead of asking the user again.
    const aliasTargets = normalised.map((p) => ESSENTIAL_CONFIG_ALIASES[p]).filter((t): t is string => !!t)
    const queryPlugins = Array.from(new Set([...normalised, ...aliasTargets]))
    const db = getDb(env)

    const secrets = await db
      .select({
        plugin: essentialConfigs.plugin,
        key: essentialConfigs.key,
        updatedAt: essentialConfigs.updatedAt,
      })
      .from(essentialConfigs)
      .where(and(eq(essentialConfigs.userId, userId), inArray(essentialConfigs.plugin, queryPlugins)))

    // Build presence map: { plugin: { key: { exists, updatedAt? } } }
    const presence: Record<string, Record<string, { exists: boolean; updatedAt?: string }>> = {}

    for (const pluginName of enabledPlugins) {
      const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
      if (!metadata) continue
      const secretsMeta = metadata.essentialConfigKeysMetadata ?? metadata.requiredSecretsMetadata ?? []
      presence[pluginName] ??= {}
      for (const keyMeta of secretsMeta) {
        presence[pluginName]![keyMeta.key] = { exists: false }
      }
    }

    for (const secret of secrets) {
      const plugin = secret.plugin.toLowerCase()
      presence[plugin] ??= {}
      presence[plugin]![secret.key.toLowerCase()] = {
        exists: true,
        updatedAt: secret.updatedAt ? String(secret.updatedAt) : undefined,
      }
    }

    // Alias fallback: if an aliased plugin (e.g. "github_repo") has no secret of its own,
    // inherit presence from its alias target's stored secrets (e.g. "github"'s PAT) so the
    // wizard doesn't ask again — computed directly from `secrets` since the target plugin
    // may not itself be in `enabledPlugins` (and thus has no presence[] entry of its own).
    for (const pluginName of enabledPlugins) {
      const alias = ESSENTIAL_CONFIG_ALIASES[pluginName.toLowerCase()]
      if (!alias) continue
      for (const secret of secrets) {
        if (secret.plugin.toLowerCase() !== alias) continue
        const key = secret.key.toLowerCase()
        if (!presence[pluginName]?.[key]?.exists) {
          presence[pluginName] ??= {}
          presence[pluginName]![key] = {
            exists: true,
            updatedAt: secret.updatedAt ? String(secret.updatedAt) : undefined,
          }
        }
      }
    }

    const missingSecrets: Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }> = []
    for (const pluginName of enabledPlugins) {
      const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
      if (!metadata) continue
      const secretsMeta = metadata.essentialConfigKeysMetadata ?? metadata.requiredSecretsMetadata ?? []
      const missingKeys: Array<{ key: string; label: string }> = []
      for (const keyMeta of secretsMeta) {
        if (!presence[pluginName]?.[keyMeta.key.toLowerCase()]?.exists) {
          missingKeys.push({ key: keyMeta.key, label: keyMeta.label ?? keyMeta.key })
        }
      }
      if (missingKeys.length > 0) missingSecrets.push({ pluginName, missingKeys })
    }

    return Response.json({ presence, missingSecrets })
  } catch (e) {
    return serverError(e)
  }
}
