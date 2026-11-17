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
 * A card's CSS animations play once, when the browser decodes the image. With
 * `max-age=60` a reload inside that minute reused the decoded image, already at rest:
 * WebKit never replayed, Firefox did not on a new navigation, and Chromium did not
 * when the README repeats the same URL. `no-cache` makes the browser fetch it again,
 * and a fresh copy plays again in all three (docs/animations.md, "Replay").
 *
 * The browser's copy comes from GitHub's camo, which forwards this header as is and
 * keeps the image `s-maxage` seconds, so this route still sees at most one request per
 * card per camo cache per minute. No ETag or Last-Modified: on a 304 WebKit keeps the
 * image at rest, and camo drops the ETag anyway.
 */
export const SVG_CACHE_CONTROL = "no-cache, s-maxage=60"

/**
 * The SVG itself is kept in this colo's edge cache, keyed by the card and the time it
 * was last generated. Measured on a preview deploy (2026-11-17): D1 150-186 ms and R2
 * 216 ms per request, 0.4 s to the first byte; with the copy at the edge, 0.19-0.22 s.
 * camo comes back for the card every minute, so a README with few visitors paid R2 on
 * almost every view, and the image sat at zero height until it arrived.
 *
 * The key changes with every generation, so a cached copy is never stale: both writers
 * (the generate route and the cron, through publishGeneratedSvg) put the object in R2
 * before the row gets its new last_generated_at. The row is still read on every request,
 * so a deleted card stops being served at once.
 */
export const SVG_EDGE_CACHE_SECONDS = 24 * 60 * 60

/** Under the request's own origin, so the key belongs to the zone serving it. */
export function svgEdgeCacheKey(origin: string, id: string, generatedAt: string): string {
  const url = new URL(`${origin}/__svg-cache/${encodeURIComponent(id)}`)
  url.searchParams.set("v", generatedAt)
  return url.toString()
}

export function edgeCache(): Cache | undefined {
  return (globalThis as { caches?: { default?: Cache } }).caches?.default
}

/** The headers of a served card, and of its tiles (functions/svg/[id]/[tile].ts). */
export function svgHeaders(timing: string): Record<string, string> {
  return {
    "Content-Type": "image/svg+xml",
    "Content-Security-Policy": SVG_CONTENT_SECURITY_POLICY,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": SVG_CACHE_CONTROL,
    "CDN-Cache-Control": "public, max-age=300",
    "Server-Timing": timing,
  }
}

/**
 * GET /api/svg/[id] - Serve generated SVG file from R2. Also at /svg/[id].svg
 * (functions/svg/[id].ts), the address the dashboard gives for READMEs.
 *
 * Public route — no auth required.
 *
 * This is the URL people paste, so it has to keep answering for as long as there is
 * something to show. It used to require status "completed", but every regeneration
 * passes through "generating", and a failed one ends in "failed" while R2 still holds
 * the last good SVG: a README pointing here would have gone blank each time.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params, request, waitUntil }) => {
  try {
    const id = String(params.id).replace(/\.svg$/, "")
    const db = getDb(env)

    // Date.now() only moves across I/O in a Worker, which is what these time.
    const startedAt = Date.now()
    const [svg] = await db
      .select({ id: svgs.id, status: svgs.status, lastGeneratedAt: svgs.lastGeneratedAt })
      .from(svgs)
      .where(eq(svgs.id, id))
      .limit(1)
    const dbMs = Date.now() - startedAt

    if (!svg) {
      return Response.json({ error: "SVG not found" }, { status: 404 })
    }

    const respond = (body: BodyInit, timing: string) => new Response(body, { headers: svgHeaders(timing) })

    const cache = edgeCache()
    const cacheKey =
      cache && svg.lastGeneratedAt ? svgEdgeCacheKey(new URL(request.url).origin, id, svg.lastGeneratedAt) : null
    if (cache && cacheKey) {
      const cached = await cache.match(cacheKey)
      if (cached) return respond(cached.body ?? "", `db;dur=${dbMs}, edge;desc=hit`)
    }

    const r2StartedAt = Date.now()
    const svgContent = await getSvgFromR2(env, id)
    const r2Ms = Date.now() - r2StartedAt

    if (svgContent === null) {
      return Response.json({ error: "SVG not generated yet", status: svg.status }, { status: 404 })
    }

    if (cache && cacheKey) {
      const copy = new Response(svgContent, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": `public, max-age=${SVG_EDGE_CACHE_SECONDS}` },
      })
      waitUntil(cache.put(cacheKey, copy))
    }
    return respond(svgContent, `db;dur=${dbMs}, r2;dur=${r2Ms}, edge;desc=miss`)
  } catch (e) {
    return serverError(e)
  }
}

/**
 * HEAD /api/svg/[id] and /svg/[id].svg - what GET answers, without the body. With only
 * onRequestGet exported, Pages passed HEAD on to the static assets, and the SPA fallback
 * answered 200 text/html for every id, existing or not.
 */
export const onRequestHead: PagesFunction<CloudflareEnv> = async (context) => {
  const response = await onRequestGet(context)
  return new Response(null, { status: response.status, headers: response.headers })
}
