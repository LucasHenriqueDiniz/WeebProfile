import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { templateLikes } from "../../../../lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * POST /api/templates/[id]/like - Like a template
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const templateId = params.id as string
    const db = getDb(env)

    const [existingLike] = await db
      .select()
      .from(templateLikes)
      .where(and(eq(templateLikes.userId, userId), eq(templateLikes.templateId, templateId)))
      .limit(1)

    if (existingLike) {
      return Response.json({ error: "Template already liked" }, { status: 400 })
    }

    const [newLike] = await db
      .insert(templateLikes)
      .values({ userId, templateId })
      .returning()

    return Response.json({ like: newLike }, { status: 201 })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * DELETE /api/templates/[id]/like - Unlike a template
 */
export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const templateId = params.id as string
    const db = getDb(env)

    await db
      .delete(templateLikes)
      .where(and(eq(templateLikes.userId, userId), eq(templateLikes.templateId, templateId)))

    return Response.json({ success: true })
  } catch (e) {
    return serverError(e)
  }
}
