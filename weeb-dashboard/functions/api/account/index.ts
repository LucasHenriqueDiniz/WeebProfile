import type { PagesFunction } from "@cloudflare/workers-types"
import { isClerkAPIResponseError } from "@clerk/backend/errors"
import { eq, inArray } from "drizzle-orm"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, getClerkClient, unauthorized, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { deleteSvgsFromR2 } from "../_shared/storage"
import { essentialConfigs, generationStarts, profiles, svgs, templateLikes, templates } from "../../../lib/db/schema"

/**
 * DELETE /api/account - Deletes the signed-in user and everything stored for them.
 *
 * R2 first, then D1, then R2 again, then Clerk. Every step is idempotent, so a request
 * that fails partway is finished by sending it again:
 * - R2 before D1: an object's key is `svgs/<svg id>.svg`, with nothing of the user in
 *   it, so the SVG rows are the only record of which objects are theirs. Dropping the
 *   rows first and then failing on R2 would leave public SVGs nobody can find again.
 * - R2 again after D1: a generation running meanwhile can write its image back before
 *   the rows go (see publishGeneratedSvg for the other order).
 * - Clerk last: once the Clerk user is gone the session goes with it, and the user can
 *   no longer call this route to finish what is left.
 */
export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const db = getDb(env)

    const userSvgs = await db.select({ id: svgs.id }).from(svgs).where(eq(svgs.userId, userId))
    const svgIds = userSvgs.map((svg) => svg.id)
    await deleteSvgsFromR2(env, svgIds)

    // One batch, which D1 runs as a single transaction: the rows go together or not at all.
    const userTemplateIds = db.select({ id: templates.id }).from(templates).where(eq(templates.userId, userId))
    await db.batch([
      db.delete(templateLikes).where(eq(templateLikes.userId, userId)),
      // Other users' likes on this user's templates would point at nothing.
      db.delete(templateLikes).where(inArray(templateLikes.templateId, userTemplateIds)),
      db.delete(templates).where(eq(templates.userId, userId)),
      db.delete(svgs).where(eq(svgs.userId, userId)),
      db.delete(essentialConfigs).where(eq(essentialConfigs.userId, userId)),
      db.delete(profiles).where(eq(profiles.userId, userId)),
    ])
    // Again: a generation that finished between the first pass and the batch wrote its
    // image back and still found its row. Past the batch, any later one finds no row
    // and takes its own image down (publishGeneratedSvg).
    await deleteSvgsFromR2(env, svgIds)
    await deleteGenerationStart(db, userId)

    await deleteClerkUser(env, userId)

    return Response.json({ success: true })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * Outside the batch because generation_starts comes from a migration that is applied
 * by hand (0004). Without it only the manual-generation route is meant to break, and
 * in the batch its absence would roll back the whole deletion.
 */
async function deleteGenerationStart(db: ReturnType<typeof getDb>, userId: string): Promise<void> {
  try {
    await db.delete(generationStarts).where(eq(generationStarts.userId, userId))
  } catch (error) {
    if (!isMissingTable(error, "generation_starts")) throw error
  }
}

// Drizzle wraps the D1 error, so the message can be down the `cause` chain. The cast is
// because the Functions build targets ES2020, whose Error has no `cause`.
function isMissingTable(error: unknown, table: string): boolean {
  for (let e: unknown = error; e instanceof Error; e = (e as { cause?: unknown }).cause) {
    if (e.message.includes(`no such table: ${table}`)) return true
  }
  return false
}

async function deleteClerkUser(env: CloudflareEnv, userId: string): Promise<void> {
  try {
    await getClerkClient(env.CLERK_SECRET_KEY).users.deleteUser(userId)
  } catch (error) {
    // Already deleted: an earlier request got this far and failed after Clerk answered.
    if (isClerkAPIResponseError(error) && error.status === 404) return
    throw error
  }
}
