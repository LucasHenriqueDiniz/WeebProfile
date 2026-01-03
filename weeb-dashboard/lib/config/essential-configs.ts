/**
 * Essential Configs (API keys, tokens, etc)
 * 
 * Compatibility layer for legacy code that still uses essentialConfigs.
 * Internally uses the essentialConfigs table from schema.
 */

import { db } from "@/lib/db"
import { essentialConfigs } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import type { EssentialConfigs } from "@/lib/db/types"

/**
 * Get all essential configs for a user
 * Returns a nested object: { plugin: { key: value } }
 */
export async function getUserEssentialConfigs(userId: string): Promise<EssentialConfigs> {
  const configs = await db
    .select()
    .from(essentialConfigs)
    .where(eq(essentialConfigs.userId, userId))

  // Transform flat structure to nested: { plugin: { key: value } }
  const result: EssentialConfigs = {}
  
  for (const config of configs) {
    const plugin = config.plugin.toLowerCase()
    const key = config.key.toLowerCase()
    
    if (!result[plugin]) {
      result[plugin] = {}
    }
    
    result[plugin]![key] = config.value
  }
  
  return result
}

/**
 * Set essential configs for a user
 * Upserts (insert or update) each config key
 */
export async function setEssentialConfigs(
  userId: string,
  configs: EssentialConfigs
): Promise<void> {
  // Convert nested structure to flat records for upsert
  const records: Array<{
    userId: string
    plugin: string
    key: string
    value: string
  }> = []

  for (const [plugin, pluginConfigs] of Object.entries(configs)) {
    if (!pluginConfigs || typeof pluginConfigs !== 'object') continue
    
    for (const [key, value] of Object.entries(pluginConfigs)) {
      if (value && typeof value === 'string') {
        records.push({
          userId,
          plugin: plugin.toLowerCase(),
          key: key.toLowerCase(),
          value,
        })
      }
    }
  }

  // Upsert each record
  for (const record of records) {
    await db
      .insert(essentialConfigs)
      .values({
        userId: record.userId,
        plugin: record.plugin,
        key: record.key,
        value: record.value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          essentialConfigs.userId,
          essentialConfigs.plugin,
          essentialConfigs.key,
        ],
        set: {
          value: record.value,
          updatedAt: new Date(),
        },
      })
  }
}
