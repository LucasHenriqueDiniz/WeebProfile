import type { PagesFunction } from "@cloudflare/workers-types"
import { and, eq } from "drizzle-orm"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, notFound, serverError, unauthorized } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { getTilesManifestFromR2 } from "../../_shared/storage"
import { svgs } from "../../../../lib/db/schema"

/**
 * GET /api/svgs/[id]/tiles - where each of the card's tiles links, as the last
 * generation stored them, for the snippet of one image per site. Read from what was
 * stored, not from the card's config: the config may have changed since, and a link
 * must open the site its image shows.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const [svg] = await getDb(env)
      .select({ id: svgs.id })
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)
    if (!svg) return notFound("SVG")

    return Response.json({ tiles: await getTilesManifestFromR2(env, id) })
  } catch (e) {
    return serverError(e)
  }
}
