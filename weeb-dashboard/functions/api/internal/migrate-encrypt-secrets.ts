import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { essentialConfigs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { encryptSecret, isEncrypted } from "../_shared/secret-crypto"

/**
 * POST /api/internal/migrate-encrypt-secrets - one-time migration.
 *
 * Encrypts any plugin_secrets.value rows still stored as plain text (written
 * before encryption-at-rest existed). Idempotent: rows already prefixed "v1."
 * are skipped, so this is safe to call more than once.
 *
 * Authenticated via Bearer token in Authorization header (INTERNAL_SECRET env var).
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  const authHeader = request.headers.get("authorization")
  if (!env.INTERNAL_SECRET || authHeader !== `Bearer ${env.INTERNAL_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!env.SECRETS_ENCRYPTION_KEY) {
    return Response.json({ error: "SECRETS_ENCRYPTION_KEY not configured" }, { status: 500 })
  }

  try {
    const db = getDb(env)
    const rows = await db.select().from(essentialConfigs)

    let migrated = 0
    let alreadyEncrypted = 0

    for (const row of rows) {
      if (isEncrypted(row.value)) {
        alreadyEncrypted++
        continue
      }
      const encryptedValue = await encryptSecret(row.value, env.SECRETS_ENCRYPTION_KEY)
      await db.update(essentialConfigs).set({ value: encryptedValue }).where(eq(essentialConfigs.id, row.id))
      migrated++
    }

    return Response.json({ success: true, total: rows.length, migrated, alreadyEncrypted })
  } catch (e) {
    return serverError(e)
  }
}
