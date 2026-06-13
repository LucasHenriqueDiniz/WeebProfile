import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, notFound, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { deleteSvgFromR2 } from "../_shared/storage"
import { svgs } from "../../../lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * GET /api/svgs/[id] - Get a specific SVG
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    const [svg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!svg) return notFound("SVG")

    return Response.json({ svg })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * PUT /api/svgs/[id] - Update SVG
 */
export const onRequestPut: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    const [existingSvg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!existingSvg) return notFound("SVG")

    const body = await request.json() as Record<string, any>

    const [updatedSvg] = await db
      .update(svgs)
      .set({
        name: body.name || existingSvg.name,
        style: body.style || existingSvg.style,
        size: body.size || existingSvg.size,
        theme: body.theme !== undefined ? body.theme : existingSvg.theme,
        customCss: body.customCss !== undefined ? body.customCss : existingSvg.customCss,
        pluginsOrder:
          body.pluginsOrder !== undefined
            ? body.pluginsOrder || null
            : existingSvg.pluginsOrder,
        pluginsConfig:
          body.pluginsConfig !== undefined ? body.pluginsConfig : existingSvg.pluginsConfig,
        uiConfig:
          body.uiConfig !== undefined ? body.uiConfig : existingSvg.uiConfig,
      })
      .where(eq(svgs.id, id))
      .returning()

    return Response.json({ svg: updatedSvg })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * DELETE /api/svgs/[id] - Delete SVG
 */
export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    const [existingSvg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!existingSvg) return notFound("SVG")

    if (existingSvg.storagePath) {
      await deleteSvgFromR2(env, id)
    }

    await db.delete(svgs).where(eq(svgs.id, id))

    return Response.json({ success: true })
  } catch (e) {
    return serverError(e)
  }
}
