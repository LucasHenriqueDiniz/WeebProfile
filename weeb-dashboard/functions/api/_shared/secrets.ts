import type { getDb } from "./db"
import { essentialConfigs } from "../../../lib/db/schema"
import { encryptSecret } from "./secret-crypto"

/**
 * Writes to plugin_secrets. Extracted from the profile endpoint so the Steam
 * OpenID callback stores a SteamID64 through exactly the same path -- including
 * the encryption and the lowercasing that getUserEssentialConfigs relies on when
 * it reads the rows back.
 */

type Db = ReturnType<typeof getDb>

/**
 * Fails closed on a missing key. This used to fall through to writing the raw
 * value with only a console.warn, so a deploy that forgot the binding would
 * quietly persist credentials in plain text.
 */
function requireKey(encryptionKey: string | undefined): string {
  if (!encryptionKey) {
    throw new Error("SECRETS_ENCRYPTION_KEY is not configured; refusing to store plugin secrets")
  }
  return encryptionKey
}

export async function setPluginSecret(
  db: Db,
  userId: string,
  plugin: string,
  key: string,
  value: string,
  encryptionKey: string | undefined
): Promise<void> {
  const storedValue = await encryptSecret(value, requireKey(encryptionKey))
  const now = new Date().toISOString()

  await db
    .insert(essentialConfigs)
    .values({
      userId,
      // Lowercased on the way in because getUserEssentialConfigs lowercases on the
      // way out; the renderer's camelCase mapping keys off that shape.
      plugin: plugin.toLowerCase(),
      key: key.toLowerCase(),
      value: storedValue,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [essentialConfigs.userId, essentialConfigs.plugin, essentialConfigs.key],
      set: { value: storedValue, updatedAt: now },
    })
}

export async function setEssentialConfigs(
  db: Db,
  userId: string,
  configs: Record<string, Record<string, string> | undefined>,
  encryptionKey: string | undefined
): Promise<void> {
  const key = requireKey(encryptionKey)

  for (const [plugin, pluginConfigs] of Object.entries(configs)) {
    if (!pluginConfigs || typeof pluginConfigs !== "object") continue
    for (const [configKey, value] of Object.entries(pluginConfigs)) {
      if (value && typeof value === "string") {
        await setPluginSecret(db, userId, plugin, configKey, value, key)
      }
    }
  }
}
