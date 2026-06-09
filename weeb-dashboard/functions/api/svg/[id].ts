import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { svgs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/svg/[id] - Serve generated SVG file from Supabase Storage
 *
 * Public route — no auth required.
 * Fetches the SVG from Supabase Storage using the service role key.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params }) => {
  try {
    const id = params.id as string
    const db = getDb(env)

    const [svg] = await db.select().from(svgs).where(eq(svgs.id, id)).limit(1)

    if (!svg) {
      return Response.json({ error: "SVG not found" }, { status: 404 })
    }

    if (svg.status !== "completed" || !svg.storageUrl) {
      return Response.json(
        { error: "SVG not generated yet", status: svg.status },
        { status: 404 }
      )
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ error: "Storage not configured" }, { status: 500 })
    }

    const fileName = `${id}.svg`
    const downloadUrl = `${supabaseUrl}/storage/v1/object/svgs/${fileName}`

    const storageResponse = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    })

    if (!storageResponse.ok) {
      return Response.json({ error: "SVG file not found in storage" }, { status: 404 })
    }

    const svgContent = await storageResponse.text()

    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
        "CDN-Cache-Control": "public, max-age=300",
      },
    })
  } catch (e) {
    return serverError(e)
  }
}
