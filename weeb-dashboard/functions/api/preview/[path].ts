import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"

/**
 * GET /api/preview/[path] - Proxy SVG preview files from svg-generator service
 *
 * Path format: {plugin}/default/{section}.svg
 * e.g. /api/preview/github/default/stats.svg
 *
 * Note: Cloudflare Pages uses [path] (single segment catch-all) not [...path].
 * The path param will contain the full remaining URL path as a string.
 *
 * Proxies to the SVG generator service which has access to the preview files.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ params, env }) => {
  try {
    // In Cloudflare Pages, [path] catch-all gives us the path as a string
    const rawPath = params.path as string | string[]
    const previewPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath

    if (!previewPath) {
      return Response.json({ error: "Path required" }, { status: 400 })
    }

    // Security: prevent path traversal
    if (previewPath.includes("..") || previewPath.startsWith("/")) {
      return Response.json({ error: "Invalid path" }, { status: 400 })
    }

    // Path format: plugin/default/section.svg
    const pathParts = previewPath.split("/")
    if (pathParts.length !== 3 || pathParts[1] !== "default") {
      return Response.json({ error: "Invalid path format. Expected: {plugin}/default/{section}.svg" }, { status: 400 })
    }

    const [pluginName, , sectionName] = pathParts

    // Only allow .svg files
    if (!sectionName.endsWith(".svg")) {
      return Response.json({ error: "Only .svg files are allowed" }, { status: 400 })
    }

    const svgGeneratorUrl = env.SVG_GENERATOR_URL || "http://localhost:3001"
    const previewUrl = `${svgGeneratorUrl}/previews/${pluginName}/default/${sectionName}`

    const response = await fetch(previewUrl)

    if (!response.ok) {
      return Response.json({ error: "Preview not found" }, { status: 404 })
    }

    const svgContent = await response.text()

    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "CDN-Cache-Control": "public, max-age=86400",
      },
    })
  } catch (e) {
    console.error("Error serving preview:", e)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
