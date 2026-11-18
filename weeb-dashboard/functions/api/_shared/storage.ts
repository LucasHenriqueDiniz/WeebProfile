import type { CloudflareEnv } from "./auth"

/**
 * SVG storage helpers backed by Cloudflare R2 (bucket binding: SVGS_BUCKET).
 * Public URLs are served via R2_PUBLIC_URL (r2.dev or custom domain).
 *
 * Next to a card live its tiles, one SVG per item of the plugins that draw them
 * (Plugin.tiles in weeb-plugins), and a manifest of where each one links. A README
 * that wants one click per site pastes them side by side (generateTilesMarkdown).
 */

/**
 * The most tiles a card can have: the websites plugin's 12 sites and the About plugin's
 * 8 link badges, the plugins that draw them (tiles.test.ts checks the sum). Tiles at or
 * past this index are never written, so a delete of every index up to it clears
 * whatever a card ever had.
 */
export const MAX_TILES = 20

/**
 * How a README lays the tiles out (TileLayout in weeb-plugins): "grid" for the
 * websites, three to a row; "inline" for link badges, each at its own width.
 */
export type TileLayout = "grid" | "inline"

/** What a generation answered for one tile (svg-generator's SvgTile). */
export interface GeneratedTile {
  href: string
  title: string
  svg: string
  width: number
  height: number
  /** Absent from a generator that predates link badges: those were all websites, "grid". */
  layout?: TileLayout
}

/** A tile as the manifest lists it, for the snippet: no image, only its link, name and layout. */
export interface TileManifestEntry {
  href: string
  title: string
  layout: TileLayout
}

function tileLayout(raw: unknown): TileLayout {
  return raw === "inline" ? "inline" : "grid"
}

function svgKey(id: string): string {
  return `svgs/${id}.svg`
}

export function tileKey(id: string, index: number): string {
  return `svgs/${id}/tiles/${index}.svg`
}

function tilesManifestKey(id: string): string {
  return `svgs/${id}/tiles.json`
}

/** Every key a card can own: its SVG, its manifest and each possible tile. */
function allKeys(id: string): string[] {
  return [svgKey(id), tilesManifestKey(id), ...Array.from({ length: MAX_TILES }, (_, i) => tileKey(id, i))]
}

export async function saveSvgToR2(
  env: CloudflareEnv,
  id: string,
  svgContent: string
): Promise<{ path: string; url: string }> {
  const key = svgKey(id)

  await env.SVGS_BUCKET.put(key, svgContent, {
    httpMetadata: { contentType: "image/svg+xml" },
  })

  return {
    path: key,
    url: `${env.R2_PUBLIC_URL}/${key}`,
  }
}

/**
 * Writes a generation's tiles and their manifest, and deletes the tiles past the new
 * count, so a site the user removed stops being served instead of showing its old
 * image under the link of whatever site now has that place. Past MAX_TILES nothing
 * is written: no plugin draws more, and the deletes would not reach them.
 */
export async function saveTilesToR2(env: CloudflareEnv, id: string, tiles: GeneratedTile[]): Promise<void> {
  const kept = tiles.slice(0, MAX_TILES)
  await Promise.all(
    kept.map((tile, i) =>
      env.SVGS_BUCKET.put(tileKey(id, i), tile.svg, { httpMetadata: { contentType: "image/svg+xml" } })
    )
  )

  const stale = Array.from({ length: MAX_TILES - kept.length }, (_, i) => tileKey(id, kept.length + i))
  if (kept.length === 0) {
    // No tiles at all, which is every card without the websites plugin: no manifest
    // either, so the panel that offers the snippet does not show.
    await env.SVGS_BUCKET.delete([tilesManifestKey(id), ...stale])
    return
  }

  const manifest: { tiles: TileManifestEntry[] } = {
    tiles: kept.map(({ href, title, layout }) => ({ href, title, layout: tileLayout(layout) })),
  }
  await env.SVGS_BUCKET.put(tilesManifestKey(id), JSON.stringify(manifest), {
    httpMetadata: { contentType: "application/json" },
  })
  if (stale.length > 0) await env.SVGS_BUCKET.delete(stale)
}

export async function getSvgFromR2(env: CloudflareEnv, id: string): Promise<string | null> {
  const object = await env.SVGS_BUCKET.get(svgKey(id))
  if (!object) return null
  return object.text()
}

export async function getTileFromR2(env: CloudflareEnv, id: string, index: number): Promise<string | null> {
  const object = await env.SVGS_BUCKET.get(tileKey(id, index))
  if (!object) return null
  return object.text()
}

/** The manifest's entries. One written before link badges has no layout: it was a website's, "grid". */
export async function getTilesManifestFromR2(env: CloudflareEnv, id: string): Promise<TileManifestEntry[]> {
  const object = await env.SVGS_BUCKET.get(tilesManifestKey(id))
  if (!object) return []
  const parsed = (await object.json()) as { tiles?: Array<Partial<TileManifestEntry>> }
  if (!Array.isArray(parsed.tiles)) return []
  return parsed.tiles.map(({ href, title, layout }) => ({
    href: String(href ?? ""),
    title: String(title ?? ""),
    layout: tileLayout(layout),
  }))
}

/** The card's SVG and everything stored next to it. */
export async function deleteSvgFromR2(env: CloudflareEnv, id: string): Promise<void> {
  await env.SVGS_BUCKET.delete(allKeys(id))
}

/** R2 deletes at most this many keys per call (Workers API reference, `delete`). */
const R2_MAX_KEYS_PER_DELETE = 1000

export async function deleteSvgsFromR2(env: CloudflareEnv, ids: string[]): Promise<void> {
  const keys = ids.flatMap(allKeys)
  for (let i = 0; i < keys.length; i += R2_MAX_KEYS_PER_DELETE) {
    await env.SVGS_BUCKET.delete(keys.slice(i, i + R2_MAX_KEYS_PER_DELETE))
  }
}
