import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { getSvgFromR2 } from "../_shared/storage"
import { svgs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/svg/[id] - Serve generated SVG file from R2
 *
 * Public route — no auth required.
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

    const svgContent = await getSvgFromR2(env, id)

    if (svgContent === null) {
      return Response.json({ error: "SVG file not found in storage" }, { status: 404 })
    }

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
