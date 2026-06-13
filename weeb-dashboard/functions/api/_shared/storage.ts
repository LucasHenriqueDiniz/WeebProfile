import type { CloudflareEnv } from "./auth"

/**
 * SVG storage helpers backed by Cloudflare R2 (bucket binding: SVGS_BUCKET).
 * Public URLs are served via R2_PUBLIC_URL (r2.dev or custom domain).
 */

function svgKey(id: string): string {
  return `svgs/${id}.svg`
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

export async function getSvgFromR2(env: CloudflareEnv, id: string): Promise<string | null> {
  const object = await env.SVGS_BUCKET.get(svgKey(id))
  if (!object) return null
  return object.text()
}

export async function deleteSvgFromR2(env: CloudflareEnv, id: string): Promise<void> {
  await env.SVGS_BUCKET.delete(svgKey(id))
}
