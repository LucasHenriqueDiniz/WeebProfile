import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { db } from "@/lib/db"
import { essentialConfigs } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"

/**
 * GET /api/secrets/presence - Buscar presença de secrets (sem valores)
 *
 * Retorna apenas se os secrets existem e quando foram atualizados,
 * nunca retorna os valores reais por segurança.
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const enabledPluginsParam = searchParams.get("enabledPlugins")

    let enabledPlugins: string[] = []
    if (enabledPluginsParam === "all") {
      enabledPlugins = Object.keys(PLUGINS_METADATA)
    } else if (enabledPluginsParam) {
      enabledPlugins = enabledPluginsParam.split(",")
    }

    if (enabledPlugins.length === 0) {
      return NextResponse.json({ presence: {}, missingSecrets: [] })
    }

    const normalised = enabledPlugins.map((p) => p.toLowerCase())

    const secrets = await db
      .select({ plugin: essentialConfigs.plugin, key: essentialConfigs.key, updatedAt: essentialConfigs.updatedAt })
      .from(essentialConfigs)
      .where(and(eq(essentialConfigs.userId, userId), inArray(essentialConfigs.plugin, normalised)))

    // Build presence map: { plugin: { key: { exists, updatedAt? } } }
    const presence: Record<string, Record<string, { exists: boolean; updatedAt?: string }>> = {}

    for (const pluginName of enabledPlugins) {
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) continue
      const metaAny = metadata as any
      const secretsMeta = metaAny.essentialConfigKeysMetadata ?? metaAny.requiredSecretsMetadata ?? []
      presence[pluginName] ??= {}
      for (const keyMeta of secretsMeta) {
        presence[pluginName][keyMeta.key] = { exists: false }
      }
    }

    for (const secret of secrets) {
      const plugin = secret.plugin.toLowerCase()
      presence[plugin] ??= {}
      presence[plugin][secret.key.toLowerCase()] = {
        exists: true,
        updatedAt: secret.updatedAt instanceof Date ? secret.updatedAt.toISOString() : String(secret.updatedAt),
      }
    }

    const missingSecrets: Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }> = []
    for (const pluginName of enabledPlugins) {
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) continue
      const metaAny = metadata as any
      const secretsMeta = metaAny.essentialConfigKeysMetadata ?? metaAny.requiredSecretsMetadata ?? []
      const missingKeys: Array<{ key: string; label: string }> = []
      for (const keyMeta of secretsMeta) {
        if (!presence[pluginName]?.[keyMeta.key.toLowerCase()]?.exists) {
          missingKeys.push({ key: keyMeta.key, label: keyMeta.label ?? keyMeta.key })
        }
      }
      if (missingKeys.length > 0) missingSecrets.push({ pluginName, missingKeys })
    }

    return NextResponse.json({ presence, missingSecrets })
  } catch (error) {
    console.error("Error in /api/secrets/presence:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
