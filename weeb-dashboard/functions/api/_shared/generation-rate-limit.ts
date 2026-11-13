import { eq, lte } from "drizzle-orm"
import type { getDb } from "./db"
import { generationStarts } from "../../../lib/db/schema"

/**
 * A floor between manual generations that `force` cannot skip.
 *
 * The 20-minute cooldown in POST /api/svgs/:id/generate only applied without
 * `force`, and the dashboard's regenerate buttons always send `force: true`, so the
 * server had no limit at all: any signed-in session could loop the endpoint and
 * spend the plugins' upstream quota, including the application's own Steam key.
 * Nothing stopped concurrent generations of the same SVG either.
 *
 * Per user, not per SVG: a user can delete and recreate SVGs, which would hand a
 * per-SVG floor fresh ids.
 */
export const GENERATION_FLOOR_SECONDS = 20

export type GenerationSlot = { claimed: true } | { claimed: false; retryAfterSeconds: number }

/**
 * Takes the user's generation slot if their last start is at least the floor ago.
 *
 * One statement, so two requests racing for the slot cannot both get it: the insert
 * creates the row, or the conflict branch moves `started_at` only when the old value
 * is old enough, and RETURNING yields a row only when one of the two happened.
 */
export async function claimGenerationSlot(
  db: ReturnType<typeof getDb>,
  userId: string,
  now: Date
): Promise<GenerationSlot> {
  const startedAt = now.toISOString()
  const floor = new Date(now.getTime() - GENERATION_FLOOR_SECONDS * 1000).toISOString()

  const claimed = await db
    .insert(generationStarts)
    .values({ userId, startedAt })
    .onConflictDoUpdate({
      target: generationStarts.userId,
      set: { startedAt },
      setWhere: lte(generationStarts.startedAt, floor),
    })
    .returning({ userId: generationStarts.userId })

  if (claimed.length > 0) return { claimed: true }

  // Only to tell the caller when to come back. A refused claim means the row exists,
  // but if it cannot be read the answer is the whole floor, never NaN in Retry-After.
  const [last] = await db.select().from(generationStarts).where(eq(generationStarts.userId, userId)).limit(1)
  const lastStart = Date.parse(last?.startedAt ?? "")
  const freeAt = (Number.isFinite(lastStart) ? lastStart : now.getTime()) + GENERATION_FLOOR_SECONDS * 1000
  return { claimed: false, retryAfterSeconds: Math.max(1, Math.ceil((freeAt - now.getTime()) / 1000)) }
}
