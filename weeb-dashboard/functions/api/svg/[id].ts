import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { getSvgFromR2 } from "../_shared/storage"
import { svgs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * The SVG is user-authored content served from the dashboard's own origin, and
 * opening this URL directly makes the browser render it as a document, scripts
 * included. The generator escapes customCss now, but objects already in R2 were
 * written before that, so this route must not trust what it serves.
 *
 * `sandbox` puts the document in an opaque origin with scripts disabled, so even a
 * script that slipped in cannot reach the dashboard's cookies or API. The rest
 * matches what a generated SVG actually needs: inline styles, and fonts and images
 * embedded as data: URIs (https: images kept for the ones that failed to embed).
 */
export const SVG_CONTENT_SECURITY_POLICY =
  "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; font-src data:; sandbox"

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
      return Response.json({ error: "SVG not generated yet", status: svg.status }, { status: 404 })
    }

    const svgContent = await getSvgFromR2(env, id)

    if (svgContent === null) {
      return Response.json({ error: "SVG file not found in storage" }, { status: 404 })
    }

    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Security-Policy": SVG_CONTENT_SECURITY_POLICY,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=60, s-maxage=60",
        "CDN-Cache-Control": "public, max-age=300",
      },
    })
  } catch (e) {
    return serverError(e)
  }
}
