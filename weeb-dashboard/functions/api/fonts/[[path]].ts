import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { fontRegistry, loadFontDataUri } from "@weeb/weeb-plugins/fonts/server"

/**
 * GET /api/fonts/[path] - Serve a bundled WOFF2 font
 *
 * e.g. /api/fonts/Poppins/poppins-v24-latin_latin-ext-regular.woff2
 *
 * This used to proxy to the svg-generator, which has served only `GET /test` and
 * `POST /` since it became a Worker -- every request 404d, so the wizard preview
 * had no Poppins at all and the generated SVGs carried a set of @font-face rules
 * that could never resolve. The bytes are bundled with the plugin package, so
 * serve them from here instead of hopping to a route that does not exist.
 *
 * The filename is [[path]], not [path]: in Pages Functions [param] matches a
 * single segment, and these URLs have two (subfolder + file). The old [path].ts
 * never matched at all, so requests fell through to the SPA and came back as
 * HTML -- a second, independent reason this route was dead.
 */

// Built once per isolate: the registry is the allowlist, so an arbitrary path
// cannot reach the font table even though the table is keyed by plain strings.
const ALLOWED_PATHS = new Set(fontRegistry.map((font) => `${font.subfolder}/${font.file}`))

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ params }) => {
  try {
    const rawPath = params.path as string | string[]
    const fontPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath

    if (!fontPath || !ALLOWED_PATHS.has(fontPath)) {
      return Response.json({ error: "Font not found" }, { status: 404 })
    }

    const [subfolder, ...rest] = fontPath.split("/")
    const dataUri = await loadFontDataUri(rest.join("/"), subfolder!)

    const base64 = dataUri.slice(dataUri.indexOf(",") + 1)

    return new Response(base64ToBytes(base64) as unknown as BodyInit, {
      headers: {
        "Content-Type": "font/woff2",
        // Content-addressed by filename (poppins-v24-...), so it never changes
        // under the same URL.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (e) {
    console.error("Error serving font:", e)
    return Response.json({ error: "Font not found" }, { status: 404 })
  }
}
