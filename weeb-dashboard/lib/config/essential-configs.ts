/**
 * Essential Configs (API keys, tokens, etc.)
 *
 * DB-agnostic: accepts a drizzle instance so callers can pass either
 * a D1 (Pages Functions) or PostgreSQL (legacy) database.
 */
import { essentialConfigs } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import type { EssentialConfigs } from "@/lib/db/types"

type AnyDB = {
  select: (...args: any[]) => any
  insert: (...args: any[]) => any
}

export async function getUserEssentialConfigs(db: AnyDB, userId: string): Promise<EssentialConfigs> {
  const configs = await (db as any).select().from(essentialConfigs).where(eq(essentialConfigs.userId, userId))

  const result: EssentialConfigs = {}
  for (const config of configs) {
    const plugin = config.plugin.toLowerCase()
    const key = config.key.toLowerCase()
    if (!result[plugin]) result[plugin] = {}
    result[plugin]![key] = config.value
  }
  return result
}

export async function setEssentialConfigs(db: AnyDB, userId: string, configs: EssentialConfigs): Promise<void> {
  const records: Array<{ userId: string; plugin: string; key: string; value: string }> = []

  for (const [plugin, pluginConfigs] of Object.entries(configs)) {
    if (!pluginConfigs || typeof pluginConfigs !== "object") continue
    for (const [key, value] of Object.entries(pluginConfigs)) {
      if (value && typeof value === "string") {
        records.push({ userId, plugin: plugin.toLowerCase(), key: key.toLowerCase(), value })
      }
    }
  }

  for (const record of records) {
    await (db as any)
      .insert(essentialConfigs)
      .values({ ...record, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: [essentialConfigs.userId, essentialConfigs.plugin, essentialConfigs.key],
        set: { value: record.value, updatedAt: new Date().toISOString() },
      })
  }
}
