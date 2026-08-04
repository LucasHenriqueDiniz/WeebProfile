import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "./_shared/auth"

/**
 * GET /api/health - liveness of the dashboard and everything it needs to generate.
 *
 * There was no health check in production. The only thing resembling one was the
 * generator's GET /test, which returns a fixed string without touching D1, and a
 * /health in weeb-debug-tool, which is a local tool. So the first sign of a broken
 * binding was a user's SVG failing to regenerate.
 *
 * Returns 503 when any dependency is down, so an uptime monitor can page on it.
 * The body names which one and carries a short reason -- enough to tell "D1 is
 * unreachable" from "R2 is unreachable" without opening a dashboard.
 *
 * Unauthenticated on purpose (a check nobody can reach is not a check), so every
 * probe is deliberately cheap: one indexed count, one miss lookup, one fixed-string
 * fetch. Nothing here generates an SVG or reads a secret.
 */

type CheckState = "ok" | "error"

interface Check {
  status: CheckState
  ms: number
  reason?: string
}

async function timed(fn: () => Promise<unknown>): Promise<Check> {
  const started = Date.now()
  try {
    await fn()
    return { status: "ok", ms: Date.now() - started }
  } catch (error) {
    return {
      status: "error",
      ms: Date.now() - started,
      // Message only. These strings reach an unauthenticated caller, so nothing
      // from the error object beyond it is included.
      reason: error instanceof Error ? error.message : String(error),
    }
  }
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const [d1, r2, generator] = await Promise.all([
    timed(async () => {
      if (!env.DB) throw new Error("DB binding missing")
      // Reads the sqlite catalogue rather than a table, so this keeps working if
      // the schema changes and never depends on a row existing.
      await env.DB.prepare("SELECT 1 FROM sqlite_master LIMIT 1").first()
    }),

    timed(async () => {
      if (!env.SVGS_BUCKET) throw new Error("SVGS_BUCKET binding missing")
      // A deliberate miss: proves the bucket answers without needing a known key,
      // and costs a head request rather than a read.
      await env.SVGS_BUCKET.head("__healthcheck__")
    }),

    timed(async () => {
      if (!env.SVG_GENERATOR) throw new Error("SVG_GENERATOR service binding missing")
      // GET /test on the generator: a fixed string, no D1, no rendering. Reached
      // through the service binding, which is also what the real generation path
      // uses -- so this fails if the binding breaks, which is the point.
      const response = await env.SVG_GENERATOR.fetch("https://svg-generator/test")
      if (!response.ok) throw new Error(`generator responded ${response.status}`)
    }),
  ])

  const checks = { d1, r2, generator }
  const healthy = Object.values(checks).every((check) => check.status === "ok")

  return Response.json(
    { status: healthy ? "ok" : "degraded", checks },
    {
      status: healthy ? 200 : 503,
      // A cached health check reports the past. Never cache it.
      headers: { "Cache-Control": "no-store" },
    }
  )
}
