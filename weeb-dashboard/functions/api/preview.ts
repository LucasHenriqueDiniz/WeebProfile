import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "./_shared/auth"
import { serverError } from "./_shared/auth"
import { getDb } from "./_shared/db"
import { attachError } from "./_shared/error-log"
import { claimPreviewSlot } from "./_shared/preview-rate-limit"
import { parseSteamInput } from "./_shared/steam-id"
import { resolverViaGenerator } from "./_shared/steam-vanity"
import { generateSvgViaService } from "./_shared/svg-generation"
import { isSuspended } from "../../lib/plugins/suspended"
import { PREVIEW_PLUGINS, parsePreviewRequest, type PreviewRequest } from "../../lib/preview/public-preview"

/**
 * GET /api/preview?plugin&username&style&theme&size -- a visitor's real card, no account.
 *
 * Design and the decisions behind it: docs/public-preview.md. In order:
 *
 * 1. The query is parsed against a whitelist (lib/preview/public-preview.ts).
 * 2. A cached render is returned as-is: no D1, no generator, no upstream request.
 * 3. A miss takes a rate-limit slot (per IP, then global) -- the only D1 write.
 * 4. The generator is called through the service binding with a body built here from
 *    scratch. Nothing from the request is forwarded: the route this replaces passed an
 *    attacker-supplied userId through, and the generator would read that user's secrets.
 * 5. A clean render is cached for an hour. Failures are not.
 *
 * Nothing is saved: no SVG row, nothing in R2.
 */

/** Bump to drop every cached preview, e.g. after changing the curated sections' look. */
export const PREVIEW_CACHE_VERSION = "v1"
export const PREVIEW_CACHE_SECONDS = 60 * 60

/**
 * Sent with the SVG and kept with the cached copy. The CSP matters when someone opens
 * the URL directly: the SVG then renders as a document, and it carries text from
 * upstream profiles.
 */
const SVG_HEADERS = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": `public, max-age=${PREVIEW_CACHE_SECONDS}`,
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:",
  "X-Content-Type-Options": "nosniff",
}

function failure(status: number, code: string, message: string, headers: Record<string, string> = {}) {
  return Response.json({ error: code, code, message }, { status, headers })
}

/**
 * Under this request's own origin, so the key belongs to the zone serving the page. The
 * username is lowercased: every site in PREVIEW_PLUGINS treats names case-insensitively.
 */
export function previewCacheKey(origin: string, preview: PreviewRequest): string {
  const url = new URL(`${origin}/__preview-cache/${PREVIEW_CACHE_VERSION}/${preview.plugin}`)
  url.searchParams.set("username", preview.username.toLowerCase())
  url.searchParams.set("sections", PREVIEW_PLUGINS[preview.plugin].sections.join(","))
  url.searchParams.set("style", preview.style)
  url.searchParams.set("theme", preview.theme)
  url.searchParams.set("size", preview.size)
  return url.toString()
}

/** The generator's request, from validated fields only. */
export function generatorBody(preview: PreviewRequest, identifier: string) {
  const plugin = PREVIEW_PLUGINS[preview.plugin]
  return {
    preview: true,
    style: preview.style,
    size: preview.size,
    theme: preview.theme,
    pluginsOrder: [preview.plugin],
    plugins: {
      [preview.plugin]: { enabled: true, sections: [...plugin.sections], [plugin.field]: identifier },
    },
    hideTerminalEmojis: false,
    hideTerminalHeader: false,
    hideTerminalCommand: false,
    fontFamily: "poppins",
  }
}

/**
 * What the plugins throw for an account that does not exist: `Codewars user "x" not
 * found` and the like, GitHub's "Could not resolve to a User", or an upstream 404.
 */
const NOT_FOUND = /not found|could not resolve to a user|\b404\b/i

/** AniList answers a private profile the way it answers a missing one; the plugin tells them apart. */
const PRIVATE = /\bprivate\b/i

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env, waitUntil }) => {
  try {
    const parsed = parsePreviewRequest(new URL(request.url).searchParams)
    if (!parsed.ok) return failure(400, "INVALID_PREVIEW_REQUEST", parsed.message)
    const preview = parsed.value
    // A suspended platform cannot generate: answer before the cache, the rate limit and
    // the generator, so a doomed request costs the visitor none of their budget.
    if (isSuspended(preview.plugin)) {
      return failure(503, "PREVIEW_UNAVAILABLE", "Previews for this platform are suspended for now.")
    }
    // Steam takes a profile URL, a vanity name or the ID itself; only an ID or a vanity
    // name can be looked up, and checking now keeps a bad one out of the rate limit.
    const steamInput = preview.plugin === "steam" ? parseSteamInput(preview.username) : null
    if (preview.plugin === "steam" && !steamInput) {
      return failure(400, "INVALID_PREVIEW_REQUEST", "Paste your Steam profile URL or your 17-digit SteamID64.")
    }

    const cache = (caches as unknown as { default: Cache }).default
    const cacheKey = previewCacheKey(new URL(request.url).origin, preview)
    const cached = await cache.match(cacheKey)
    if (cached) {
      const hit = new Response(cached.body, cached)
      hit.headers.set("X-Preview-Cache", "HIT")
      return hit
    }

    // Behind Cloudflare the header is always set. Without it every caller shares one
    // bucket, which fails towards refusing rather than towards no limit.
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown"
    const slot = await claimPreviewSlot(getDb(env), ip, new Date())
    if (!slot.claimed) {
      return failure(
        429,
        "PREVIEW_RATE_LIMITED",
        slot.scope === "ip"
          ? `Too many previews from this address. Try again in ${slot.retryAfterSeconds} second(s).`
          : `Previews are busy right now. Try again in ${slot.retryAfterSeconds} second(s).`,
        { "Retry-After": String(slot.retryAfterSeconds) }
      )
    }

    let identifier = preview.username
    if (steamInput?.kind === "id") identifier = steamInput.steamId
    if (steamInput?.kind === "vanity") {
      let steamId: string | null
      try {
        steamId = await resolverViaGenerator(env)(steamInput.vanity)
      } catch (error) {
        return attachError(failure(502, "PREVIEW_UPSTREAM_FAILED", "Steam did not answer. Try again shortly."), error)
      }
      if (!steamId) return failure(404, "PREVIEW_USER_NOT_FOUND", "Steam could not find that profile.")
      identifier = steamId
    }

    let result: { svg?: string; hasErrors?: boolean; pluginErrors?: Record<string, string> }
    try {
      result = (await generateSvgViaService(generatorBody(preview, identifier), env)) as typeof result
    } catch (error) {
      // The GitHub preview without GITHUB_PREVIEW_TOKEN on the generator: an operator
      // matter, so 503 (recorded in error_log) rather than the visitor's fault.
      if ((error as { code?: string })?.code === "MISSING_REQUIRED_SECRETS") {
        return attachError(
          failure(503, "PREVIEW_UNAVAILABLE", "Previews for this platform are not available right now."),
          error
        )
      }
      return attachError(failure(502, "PREVIEW_FAILED", "The card could not be generated. Try again shortly."), error)
    }

    const pluginErrors = Object.values(result.pluginErrors ?? {})
    if (result.hasErrors || pluginErrors.length > 0 || typeof result.svg !== "string") {
      const reason = pluginErrors.join(" | ") || "generator answered without an SVG"
      if (PRIVATE.test(reason)) {
        return failure(
          404,
          "PREVIEW_PROFILE_PRIVATE",
          `The ${preview.plugin} profile "${preview.username}" is private.`
        )
      }
      if (NOT_FOUND.test(reason)) {
        return failure(404, "PREVIEW_USER_NOT_FOUND", `No ${preview.plugin} account named "${preview.username}".`)
      }
      // The plugin's message stays in error_log; the visitor gets a generic one.
      return attachError(
        failure(502, "PREVIEW_UPSTREAM_FAILED", "The platform did not answer. Try again shortly."),
        new Error(`preview ${preview.plugin}: ${reason}`)
      )
    }

    const response = new Response(result.svg, { headers: SVG_HEADERS })
    waitUntil(cache.put(cacheKey, response.clone()))
    response.headers.set("X-Preview-Cache", "MISS")
    return response
  } catch (e) {
    return serverError(e)
  }
}
