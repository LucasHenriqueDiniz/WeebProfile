/**
 * Utility to fetch essential configs from Supabase
 *
 * svg-generator uses DATABASE_URL to access essential_configs directly,
 * without going through the frontend (maximum security).
 *
 * Configure DATABASE_URL in .env file or environment variables.
 *
 * IMPORTANT: Use Supavisor (pooler) connection for better reliability:
 * - Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres
 * - Port 6543 = Transaction mode (recommended for serverless/edge)
 * - Port 5432 = Direct connection (only works with IPv6 or IPv4 Add-On)
 *
 * Get pooler connection string from:
 * Supabase Dashboard > Settings > Database > Connection string > Connection pooling (Transaction mode)
 */

import postgres from "postgres"
import { config } from "dotenv"
import { resolve } from "path"

// Load .env if it exists (does not override already defined variables)
config({ path: resolve(process.cwd(), ".env") })

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Configure it in .env file or environment variables. " +
      "Get it from: Supabase Dashboard > Settings > Database > Connection string > URI"
  )
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.DATABASE_URL.includes("supabase") ? "require" : false,
  connect_timeout: 10, // 10 seconds timeout
  idle_timeout: 20,
})

/**
 * Fully dynamic essential configurations
 * Supports any plugin without hardcoding
 */
export interface EssentialConfigs {
  [pluginName: string]:
    | {
        [key: string]: string | undefined
      }
    | undefined
}

interface CacheEntry {
  value: EssentialConfigs
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Fetches essential configs for a user directly from Supabase.
 * Results are cached in memory for 5 minutes to avoid repeated DB hits
 * during batch regeneration of multiple SVGs from the same user.
 *
 * @param userId - User ID
 * @returns Essential configs organized by plugin
 */
export async function getUserEssentialConfigs(userId: string): Promise<EssentialConfigs> {
  if (!userId) {
    return {}
  }

  // Return cached value if still fresh
  const cached = cache.get(userId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  try {
    // Fetch configs from plugin_secrets table (renamed from essential_configs)
    const configs = await sql`
      SELECT plugin, key, value
      FROM plugin_secrets
      WHERE user_id = ${userId}
    `

    // Convert configs array to EssentialConfigs format
    // CRÍTICO: Normalizar plugin e key para lowercase para consistência com validação
    const result: EssentialConfigs = {}

    for (const config of configs) {
      const pluginName = (config.plugin || "").toLowerCase()
      const key = (config.key || "").toLowerCase()

      if (!pluginName || !key) continue

      if (!result[pluginName]) {
        result[pluginName] = {}
      }
      result[pluginName]![key] = config.value
    }

    // Debug: log what was found
    if (Object.keys(result).length > 0) {
      console.log(
        `✅ [DB] Essential configs loaded:`,
        Object.keys(result)
          .map((plugin) => `${plugin}: [${Object.keys(result[plugin] || {}).join(", ")}]`)
          .join(", ")
      )
    }

    // Store in cache
    cache.set(userId, { value: result, expiresAt: Date.now() + CACHE_TTL_MS })

    return result
  } catch (error) {
    console.error(`Error fetching essential configs for user ${userId}:`, error)
    // Re-throw error so caller can handle it appropriately (503 vs missing secrets)
    throw error
  }
}

/**
 * LEGACY: getUserPluginConfigs REMOVED
 * 
 * Plugin configs (username, etc) are now stored directly in svgs.plugins_config.
 * The generator receives complete config in the request - no need to fetch from database.
 * 
 * This function has been removed as part of the refactoring to eliminate plugin_config table.
 */
