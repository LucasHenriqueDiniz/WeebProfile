/**
 * Plugin Config Helpers
 * 
 * Handles reading/writing reusable user-level plugin configurations
 * (e.g., username) that apply to all SVGs of a user.
 */

import { db } from "@/lib/db"
import { pluginConfig } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export interface UserPluginConfig {
  [pluginName: string]: {
    username?: string
    [key: string]: any
  }
}

/**
 * Get all plugin configs for a user
 */
export async function getUserPluginConfigs(userId: string): Promise<UserPluginConfig> {
  if (!userId) {
    return {}
  }

  try {
    const configs = await db
      .select()
      .from(pluginConfig)
      .where(eq(pluginConfig.userId, userId))

    const result: UserPluginConfig = {}
    
    for (const config of configs) {
      result[config.plugin] = config.config as any
    }

    return result
  } catch (error) {
    console.error(`Error fetching plugin configs for user ${userId}:`, error)
    return {}
  }
}

/**
 * Get plugin config for a specific plugin and user
 */
export async function getPluginConfig(userId: string, pluginName: string): Promise<Record<string, any> | null> {
  if (!userId || !pluginName) {
    return null
  }

  try {
    const [config] = await db
      .select()
      .from(pluginConfig)
      .where(and(
        eq(pluginConfig.userId, userId),
        eq(pluginConfig.plugin, pluginName.toLowerCase())
      ))
      .limit(1)

    return config ? (config.config as Record<string, any>) : null
  } catch (error) {
    console.error(`Error fetching plugin config for ${pluginName}:`, error)
    return null
  }
}

/**
 * Set plugin config for a user
 * Upserts (insert or update) the config
 */
export async function setPluginConfig(
  userId: string,
  pluginName: string,
  config: Record<string, any>
): Promise<void> {
  if (!userId || !pluginName) {
    return
  }

  try {
    await db
      .insert(pluginConfig)
      .values({
        userId,
        plugin: pluginName.toLowerCase(),
        config,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [pluginConfig.userId, pluginConfig.plugin],
        set: {
          config,
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    console.error(`Error setting plugin config for ${pluginName}:`, error)
    throw error
  }
}

/**
 * Set multiple plugin configs for a user
 */
export async function setPluginConfigs(
  userId: string,
  configs: UserPluginConfig
): Promise<void> {
  if (!userId || !configs) {
    return
  }

  for (const [pluginName, config] of Object.entries(configs)) {
    if (config && typeof config === 'object') {
      await setPluginConfig(userId, pluginName, config)
    }
  }
}

