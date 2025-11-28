/**
 * Utility to fetch essential configs from Supabase
 * 
 * svg-generator uses DATABASE_URL to access essential_configs directly,
 * without going through the frontend (maximum security).
 * 
 * Configure DATABASE_URL in .env file or environment variables.
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
})

/**
 * Fully dynamic essential configurations
 * Supports any plugin without hardcoding
 */
export interface EssentialConfigs {
  [pluginName: string]: {
    [key: string]: string | undefined
  } | undefined
}

/**
 * Fetches essential configs for a user directly from Supabase
 * 
 * @param userId - User ID
 * @returns Essential configs organized by plugin
 */
export async function getUserEssentialConfigs(userId: string): Promise<EssentialConfigs> {
  if (!userId) {
    return {}
  }

  try {
    // Fetch configs from essential_configs table
    const configs = await sql`
      SELECT plugin, key, value
      FROM essential_configs
      WHERE user_id = ${userId}
    `

    // Convert configs array to EssentialConfigs format
    const result: EssentialConfigs = {}
    
    for (const config of configs) {
      if (!result[config.plugin]) {
        result[config.plugin] = {}
      }
      result[config.plugin]![config.key] = config.value
    }

    return result
  } catch (error) {
    console.error(`Error fetching essential configs for user ${userId}:`, error)
    // Return empty object on error (don't break generation)
    return {}
  }
}

