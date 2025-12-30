/**
 * Database functions for SVG regeneration
 * 
 * Uses postgres to access svgs table directly
 */

import postgres from "postgres"
import { config } from "dotenv"
import { resolve } from "path"

// Load .env if it exists
config({ path: resolve(process.cwd(), ".env") })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.DATABASE_URL.includes("supabase") ? "require" : false,
})

export interface SvgRow {
  id: string
  user_id: string
  slug: string
  name: string
  style: string
  size: string
  theme: string | null
  custom_css: string | null
  plugins_order: string | null
  plugins_config: any
  storage_path: string | null
  storage_url: string | null
  status: string
  force_regenerate: boolean
  data_hash: string | null
  last_generated_at: Date | null
  updated_at: Date
  next_regeneration_at: Date | null
  last_payload_hash: string | null
  fail_count: number
  last_error: string | null
  is_paused: boolean
  created_at: Date
}

/**
 * Claims due SVGs for regeneration using FOR UPDATE SKIP LOCKED
 * Returns up to limit SVGs that need regeneration
 */
export async function claimDueSvgs(limit: number = 50): Promise<SvgRow[]> {
  const result = await sql<SvgRow[]>`
    SELECT *
    FROM svgs
    WHERE next_regeneration_at IS NOT NULL
      AND next_regeneration_at <= now()
      AND status IN ('completed', 'error', 'pending')
      AND is_paused = false
    ORDER BY next_regeneration_at ASC
    LIMIT ${limit}
    FOR UPDATE SKIP LOCKED
  `

  // Update status to 'generating' for claimed SVGs (if not already generating)
  if (result.length > 0) {
    const ids = result.map((r) => r.id)
    await sql`
      UPDATE svgs
      SET status = 'generating', updated_at = now()
      WHERE id = ANY(${ids}) AND status != 'generating'
    `
  }

  return result
}

/**
 * Checks if there are more SVGs eligible for regeneration
 */
export async function checkHasMoreSvgs(): Promise<boolean> {
  const result = await sql<[{ count: number }]>`
    SELECT COUNT(*) as count
    FROM svgs
    WHERE next_regeneration_at IS NOT NULL
      AND next_regeneration_at <= now()
      AND status IN ('completed', 'error', 'pending')
      AND is_paused = false
  `

  return (result[0]?.count || 0) > 0
}

/**
 * Updates SVG after successful generation
 */
export async function updateSvgAfterGeneration(
  svgId: string,
  storagePath: string,
  storageUrl: string,
  payloadHash: string
): Promise<void> {
  await sql`
    UPDATE svgs
    SET 
      last_generated_at = now(),
      next_regeneration_at = now() + INTERVAL '24 hours',
      status = 'completed',
      storage_path = ${storagePath},
      storage_url = ${storageUrl},
      last_payload_hash = ${payloadHash},
      fail_count = 0,
      last_error = NULL,
      updated_at = now()
    WHERE id = ${svgId}
  `
}

/**
 * Updates SVG after skip (hash unchanged, no rendering needed)
 */
export async function updateSvgAfterSkip(svgId: string, payloadHash: string): Promise<void> {
  await sql`
    UPDATE svgs
    SET 
      last_generated_at = now(),
      next_regeneration_at = now() + INTERVAL '24 hours',
      last_payload_hash = ${payloadHash},
      updated_at = now()
    WHERE id = ${svgId}
  `
}

/**
 * Updates SVG after error
 */
export async function updateSvgAfterError(svgId: string, error: string): Promise<void> {
  // Truncate error message to avoid DB issues
  const errorMessage = error.length > 500 ? error.substring(0, 500) : error

  await sql`
    UPDATE svgs
    SET 
      status = 'error',
      fail_count = fail_count + 1,
      last_error = ${errorMessage},
      next_regeneration_at = now() + INTERVAL '1 hour',
      updated_at = now()
    WHERE id = ${svgId}
  `
}

