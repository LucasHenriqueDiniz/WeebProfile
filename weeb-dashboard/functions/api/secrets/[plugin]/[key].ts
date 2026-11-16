import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, notFound, serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { essentialConfigs } from "../../../../lib/db/schema"
import { and, eq } from "drizzle-orm"

/**
 * DELETE /api/secrets/:plugin/:key - Remove one stored plugin key of the user.
 *
 * Until now a key could only be replaced, from inside the wizard; nothing removed one
 * short of deleting the whole account. Rows are stored lowercased (see
 * _shared/secrets.ts), so the path is matched the same way. The WHERE carries the user
 * id: a key of someone else answers 404, like one that does not exist.
 */
export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const plugin = String(params.plugin ?? "").toLowerCase()
    const key = String(params.key ?? "").toLowerCase()

    const deleted = await getDb(env)
      .delete(essentialConfigs)
      .where(
        and(eq(essentialConfigs.userId, userId), eq(essentialConfigs.plugin, plugin), eq(essentialConfigs.key, key))
      )
      .returning({ id: essentialConfigs.id })

    if (deleted.length === 0) return notFound("Secret")
    return Response.json({ success: true })
  } catch (e) {
    return serverError(e)
  }
}
