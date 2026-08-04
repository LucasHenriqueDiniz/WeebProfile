import { describe, it, expect, vi } from "vitest"
import { onRequestGet } from "./health"

type Handler = typeof onRequestGet

const okEnv = () => ({
  DB: { prepare: () => ({ first: async () => ({ 1: 1 }) }) },
  SVGS_BUCKET: { head: async () => null },
  SVG_GENERATOR: { fetch: async () => new Response("SVG Generator is running!", { status: 200 }) },
})

const call = async (env: unknown): Promise<Response> =>
  (onRequestGet as unknown as (ctx: { env: unknown }) => Promise<Response>)({ env })

describe("GET /api/health", () => {
  it("reports ok with 200 when every dependency answers", async () => {
    const response = await call(okEnv())
    expect(response.status).toBe(200)

    const body = (await response.json()) as any
    expect(body.status).toBe("ok")
    expect(body.checks.d1.status).toBe("ok")
    expect(body.checks.r2.status).toBe("ok")
    expect(body.checks.generator.status).toBe("ok")
  })

  // 503 is the contract: an uptime monitor pages on the status code, not on a
  // field inside a 200 body.
  it.each([
    ["d1", { DB: { prepare: () => ({ first: async () => Promise.reject(new Error("D1 down")) }) } }],
    ["r2", { SVGS_BUCKET: { head: async () => Promise.reject(new Error("R2 down")) } }],
    ["generator", { SVG_GENERATOR: { fetch: async () => new Response("nope", { status: 500 }) } }],
  ])("returns 503 and names %s when it fails", async (name, override) => {
    const response = await call({ ...okEnv(), ...(override as object) })
    expect(response.status).toBe(503)

    const body = (await response.json()) as any
    expect(body.status).toBe("degraded")
    expect(body.checks[name].status).toBe("error")
  })

  it("treats a missing binding as a failure rather than a pass", async () => {
    const { DB: _omitted, ...withoutDb } = okEnv()
    const response = await call(withoutDb)
    expect(response.status).toBe(503)

    const body = (await response.json()) as any
    expect(body.checks.d1.reason).toMatch(/binding missing/i)
  })

  it("checks dependencies concurrently, not one after another", async () => {
    const slow = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const env = {
      DB: { prepare: () => ({ first: async () => slow(60) }) },
      SVGS_BUCKET: { head: async () => slow(60) },
      SVG_GENERATOR: { fetch: async () => slow(60).then(() => new Response("ok")) },
    }

    const started = Date.now()
    await call(env)
    // Sequential would be ~180ms. Generous bound so this does not flake on a
    // loaded runner while still failing if the Promise.all is ever unrolled.
    expect(Date.now() - started).toBeLessThan(150)
  })

  it("never caches, since a cached health check reports the past", async () => {
    const response = await call(okEnv())
    expect(response.headers.get("Cache-Control")).toBe("no-store")
  })

  it("does not let one slow dependency hide the others", async () => {
    const response = await call({ ...okEnv(), SVGS_BUCKET: { head: async () => Promise.reject(new Error("R2 down")) } })
    const body = (await response.json()) as any
    expect(body.checks.d1.status).toBe("ok")
    expect(body.checks.generator.status).toBe("ok")
    expect(body.checks.r2.status).toBe("error")
  })

  it("times each check", async () => {
    const body = (await (await call(okEnv())).json()) as any
    for (const check of Object.values(body.checks) as any[]) {
      expect(typeof check.ms).toBe("number")
    }
  })
})

// Keep the type import honest without exporting anything from the test file.
const _typeCheck: Handler = onRequestGet
void _typeCheck
void vi
