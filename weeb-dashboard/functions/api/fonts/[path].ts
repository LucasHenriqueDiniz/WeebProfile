import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"

/**
 * GET /api/fonts/[path] - Serve font files from svg-generator service
 *
 * e.g. /api/fonts/Poppins/poppins-v24-latin_latin-ext-regular.woff2
 *
 * Note: Cloudflare Pages uses [path] (single segment catch-all) not [...path].
 * The path param will contain the full remaining URL path as a string.
 *
 * Proxies to the SVG generator service which has the font assets bundled.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ params, env }) => {
  try {
    const rawPath = params.path as string | string[]
    const fontPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath

    if (!fontPath) {
      return Response.json({ error: "Path required" }, { status: 400 })
    }

    // Security: prevent path traversal
    if (fontPath.includes("..") || fontPath.startsWith("/")) {
      return Response.json({ error: "Invalid path" }, { status: 400 })
    }

    // Only allow .woff2 files
    if (!fontPath.endsWith(".woff2")) {
      return Response.json({ error: "Only .woff2 files are allowed" }, { status: 400 })
    }

    const svgGeneratorUrl = env.SVG_GENERATOR_URL || "http://localhost:3001"
    const fontUrl = `${svgGeneratorUrl}/fonts/${fontPath}`

    const response = await fetch(fontUrl)

    if (!response.ok) {
      return Response.json({ error: "Font not found" }, { status: 404 })
    }

    const fontBuffer = await response.arrayBuffer()

    return new Response(fontBuffer, {
      headers: {
        "Content-Type": "font/woff2",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (e) {
    console.error("Error serving font:", e)
    return Response.json({ error: "Font not found" }, { status: 404 })
  }
}
