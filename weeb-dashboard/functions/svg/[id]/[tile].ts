import type { PagesFunction } from "@cloudflare/workers-types"
import { eq } from "drizzle-orm"
import type { CloudflareEnv } from "../../api/_shared/auth"
import { serverError } from "../../api/_shared/auth"
import { getDb } from "../../api/_shared/db"
import { MAX_TILES, getTileFromR2, getTilesManifestFromR2 } from "../../api/_shared/storage"
import { SVG_EDGE_CACHE_SECONDS, edgeCache, svgEdgeCacheKey, svgHeaders } from "../../api/svg/[id]"
import { svgs } from "../../../lib/db/schema"

/**
 * What a tile index with nothing stored answers: a transparent strip one pixel tall.
 *
 * The hrefs of a tile snippet live in the README, so it keeps asking for tile 5 after
 * the user goes down to 4 sites. A 404 is a broken-image icon in the middle of their
 * profile, and a blank tile of full height leaves a hole; at one pixel the place
 * collapses, and a row of nothing but removed sites takes no height at all.
 */
export const EMPTY_TILE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="1"></svg>'

/**
 * The same for a link badge. A badge snippet sets no size, so the strip above would
 * be 270px of blank in the middle of the row; one pixel square is all but nothing.
 */
export const EMPTY_INLINE_TILE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

/**
 * Which empty answer a missing place gets. A place past the stored tiles held one of
 * the last plugin's: a card lists its websites and its badges plugin by plugin, so a
 * badge removed from the end leaves a place after the last badge.
 */
async function emptyTileFor(env: CloudflareEnv, id: string): Promise<string> {
  const manifest = await getTilesManifestFromR2(env, id)
  return manifest[manifest.length - 1]?.layout === "inline" ? EMPTY_INLINE_TILE_SVG : EMPTY_TILE_SVG
}

/** "0.svg" .. "11.svg", as the snippet writes them. */
function tileIndex(raw: unknown): number | null {
  const match = /^(\d{1,2})\.svg$/.exec(String(raw))
  if (!match) return null
  const index = Number(match[1])
  return index < MAX_TILES ? index : null
}

/**
 * GET /svg/<id>/<n>.svg - one site of a card as its own image, for a README that links
 * every site separately (generateTilesMarkdown). Public, like /svg/<id>.svg, with the
 * same headers, sandbox included: a tile is the same user-authored SVG.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params, request, waitUntil }) => {
  try {
    const id = String(params.id)
    const index = tileIndex(params.tile)
    if (index === null) return Response.json({ error: "Tile not found" }, { status: 404 })

    const startedAt = Date.now()
    const [svg] = await getDb(env)
      .select({ id: svgs.id, lastGeneratedAt: svgs.lastGeneratedAt })
      .from(svgs)
      .where(eq(svgs.id, id))
      .limit(1)
    const dbMs = Date.now() - startedAt

    // A deleted card takes its tiles down with it, as its own route does.
    if (!svg) return Response.json({ error: "SVG not found" }, { status: 404 })

    const cache = edgeCache()
    const cacheKey =
      cache && svg.lastGeneratedAt
        ? svgEdgeCacheKey(new URL(request.url).origin, `${id}/tiles/${index}`, svg.lastGeneratedAt)
        : null
    if (cache && cacheKey) {
      const cached = await cache.match(cacheKey)
      if (cached) return new Response(cached.body ?? "", { headers: svgHeaders(`db;dur=${dbMs}, edge;desc=hit`) })
    }

    const r2StartedAt = Date.now()
    const tile = await getTileFromR2(env, id, index)
    const timing = `db;dur=${dbMs}, r2;dur=${Date.now() - r2StartedAt}`

    // Not cached at the edge: the place may get a site again at the next generation,
    // which changes the key anyway, but an empty answer is cheap to recompute.
    if (tile === null) {
      return new Response(await emptyTileFor(env, id), { headers: svgHeaders(`${timing}, tile;desc=empty`) })
    }

    if (cache && cacheKey) {
      const copy = new Response(tile, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": `public, max-age=${SVG_EDGE_CACHE_SECONDS}` },
      })
      waitUntil(cache.put(cacheKey, copy))
    }
    return new Response(tile, { headers: svgHeaders(`${timing}, edge;desc=miss`) })
  } catch (e) {
    return serverError(e)
  }
}

/** HEAD answers what GET does, without the body (see /svg/<id>.svg). */
export const onRequestHead: PagesFunction<CloudflareEnv> = async (context) => {
  const response = await onRequestGet(context)
  return new Response(null, { status: response.status, headers: response.headers })
}
