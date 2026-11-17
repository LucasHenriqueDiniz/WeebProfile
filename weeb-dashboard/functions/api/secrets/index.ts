import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { essentialConfigs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/secrets - The plugin keys the user has stored: plugin, key and when it was
 * last saved, never the value.
 *
 * /api/secrets/presence answers per enabled plugin and fills in aliases (github_repo
 * reports github's token), so it cannot say which rows exist. Settings lists exactly
 * the stored rows, so each one can be removed.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const rows = await getDb(env)
      .select({ plugin: essentialConfigs.plugin, key: essentialConfigs.key, updatedAt: essentialConfigs.updatedAt })
      .from(essentialConfigs)
      .where(eq(essentialConfigs.userId, userId))

    return Response.json({
      secrets: rows
        .map((row) => ({ plugin: row.plugin, key: row.key, updatedAt: row.updatedAt }))
        .sort((a, b) => a.plugin.localeCompare(b.plugin) || a.key.localeCompare(b.key)),
    })
  } catch (e) {
    return serverError(e)
  }
}
