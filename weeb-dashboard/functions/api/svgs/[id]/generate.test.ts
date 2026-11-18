import { describe, it, expect, vi, beforeEach } from "vitest"
import type { CloudflareEnv } from "../../_shared/auth"
import { ApiException, missingRequiredConfig, type ApiError } from "../../../../lib/api/errors"

/**
 * The route end of the generator's D1_UNREACHABLE contract. Runs the real
 * generateSvgViaService against a fake SVG_GENERATOR binding, so a code mismatch
 * between the client and this route shows up here, not only in production.
 */

const { db, updates, slot, svgRow } = vi.hoisted(() => {
  const updates: Record<string, unknown>[] = []
  // What claimGenerationSlot's upsert returns: a row when the slot was taken, none
  // when the user's last start is inside the floor. Its SQL is checked against a real
  // D1 separately; here it only drives the route.
  const slot = { claimed: true }
  const svgRow: Record<string, unknown> = {
    id: "svg_1",
    userId: "user_1",
    status: "completed",
    style: "default",
    size: "half",
    pluginsConfig: { github: { enabled: true, sections: ["profile"] } },
    pluginsOrder: "github",
    lastGeneratedAt: null,
    updatedAt: null,
  }
  // Drizzle's builder: every call returns the builder, and awaiting it gives rows.
  type Query = PromiseLike<unknown[]> & { [method: string]: (...args: unknown[]) => Query }
  const query = (rows: unknown[]): Query =>
    new Proxy(() => {}, {
      get: (_target, prop) => (prop === "then" ? (resolve: (v: unknown) => void) => resolve(rows) : () => query(rows)),
      apply: () => query(rows),
    }) as unknown as Query
  const db = {
    select: () => query([svgRow]),
    insert: () => query(slot.claimed ? [{ userId: "user_1" }] : []),
    update: () => ({
      set: (values: Record<string, unknown>) => {
        updates.push(values)
        return query([{ ...svgRow, ...values }])
      },
    }),
  }
  return { db, updates, slot, svgRow }
})

vi.mock("../../_shared/db", () => ({ getDb: () => db }))
vi.mock("../../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../_shared/auth")>()),
  getAuthUserId: async () => "user_1",
}))

beforeEach(() => {
  updates.length = 0
  slot.claimed = true
  delete svgRow.uiConfig
  delete svgRow.lastError
  delete svgRow.failCount
})

// What svg-generator/src/worker.ts answers when it cannot read the user's secrets.
const generatorD1Unreachable = {
  error: "DATABASE_UNREACHABLE",
  code: "D1_UNREACHABLE",
  message: "Generator couldn't access D1.",
  details: "D1_ERROR: no such table: plugin_secrets: SQLITE_ERROR",
}

async function regenerate(generator: () => Response, body: Record<string, unknown> = {}) {
  const { onRequestPost } = await import("./generate")
  const env = { SVG_GENERATOR: { fetch: async () => generator() } } as unknown as CloudflareEnv
  return (await onRequestPost({
    request: new Request("https://dash/api/svgs/svg_1/generate", { method: "POST", body: JSON.stringify(body) }),
    env,
    params: { id: "svg_1" },
  } as unknown as Parameters<typeof onRequestPost>[0])) as unknown as Response
}

describe("POST /api/svgs/:id/generate when the generator cannot reach D1", () => {
  it("answers 503 with the generator's code and the D1 error", async () => {
    const response = await regenerate(() => Response.json(generatorD1Unreachable, { status: 503 }))

    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({
      code: "D1_UNREACHABLE",
      message: "Generator couldn't access D1.",
      details: generatorD1Unreachable.details,
    })
  })

  it("marks the SVG failed with the generator's message, not a bare status", async () => {
    await regenerate(() => Response.json(generatorD1Unreachable, { status: 503 }))

    expect(updates.at(-1)).toEqual({ status: "failed", lastError: "Generator couldn't access D1." })
  })
})

describe("POST /api/svgs/:id/generate when a plugin is missing a secret", () => {
  // What the generator answers (validateRequiredConfig in svg-generator).
  const generatorMissing = {
    error: "MISSING_REQUIRED_CONFIG",
    code: "MISSING_REQUIRED_SECRETS",
    message: "Missing required secrets or fields for enabled plugins",
    missing: [{ pluginName: "steam", missingSecrets: [{ key: "steamId", label: "Steam ID" }], missingFields: [] }],
  }

  // As apiRequest (lib/api/client.ts) turns a non-2xx JSON response into what the
  // browser code catches.
  const caughtInBrowser = async (response: Response) =>
    new ApiException(response.status, (await response.json()) as ApiError)

  // Generator -> this route -> the ApiException the wizard catches. The wizard read
  // `error.code` off the exception, where it never is, so this toast never showed and
  // the user was sent to the detail page with "houve um problema na geração" instead
  // of the key to add.
  it("reaches the wizard as the list of what is missing", async () => {
    const response = await regenerate(() => Response.json(generatorMissing, { status: 400 }))
    expect(response.status).toBe(400)

    expect(missingRequiredConfig(await caughtInBrowser(response))).toEqual(generatorMissing.missing)
  })

  it("is null for any other failure, so the wizard does not report a missing key", async () => {
    const response = await regenerate(() => Response.json({ error: "boom" }, { status: 500 }))

    expect(missingRequiredConfig(await caughtInBrowser(response))).toBeNull()
  })
})

describe("POST /api/svgs/:id/generate inside the user's generation floor", () => {
  // The dashboard's regenerate buttons always send force: true, which skips the
  // 20-minute cooldown. The floor is the limit force cannot skip.
  it("answers 429 with when to retry, even forced, and never reaches the generator", async () => {
    slot.claimed = false
    const generator = vi.fn(() => Response.json({ success: true, svg: "<svg/>", pluginErrors: {}, hasErrors: false }))

    const response = await regenerate(generator, { force: true })

    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toMatch(/^\d+$/)
    expect(await response.json()).toMatchObject({ code: "GENERATION_RATE_LIMITED" })
    expect(generator).not.toHaveBeenCalled()
    // Not marked as generating either: the SVG keeps its status and last good image.
    expect(updates).toEqual([])
  })

  it("generates when the slot is free", async () => {
    const generator = vi.fn(() => Response.json({ success: true, svg: "<svg/>", pluginErrors: {}, hasErrors: false }))
    const env = { SVG_GENERATOR: { fetch: async () => generator() } }

    await regenerate(() => env.SVG_GENERATOR.fetch() as unknown as Response, { force: true }).catch(() => undefined)

    expect(generator).toHaveBeenCalledTimes(1)
  })
})

describe("POST /api/svgs/:id/generate with the card's ui_config", () => {
  /** Runs the route and returns the JSON body it sent to the generator binding. */
  async function sentToGenerator(uiConfig?: Record<string, unknown>): Promise<Record<string, unknown>> {
    if (uiConfig) svgRow.uiConfig = uiConfig
    let sent: Record<string, unknown> = {}
    const { onRequestPost } = await import("./generate")
    const env = {
      SVG_GENERATOR: {
        fetch: async (_url: string, init: RequestInit) => {
          sent = JSON.parse(String(init.body))
          return Response.json({ success: true, svg: "<svg/>", pluginErrors: {}, hasErrors: false })
        },
      },
    } as unknown as CloudflareEnv
    await (
      onRequestPost({
        request: new Request("https://dash/api/svgs/svg_1/generate", { method: "POST", body: "{}" }),
        env,
        params: { id: "svg_1" },
      } as unknown as Parameters<typeof onRequestPost>[0]) as Promise<Response>
    ).catch(() => undefined)
    return sent
  }

  it("passes the auto color mode and the custom colors stored in ui_config", async () => {
    svgRow.uiConfig = { colorMode: "auto", customThemeColors: { "--default-color-highlight": "#e11d48" } }

    expect(await sentToGenerator()).toMatchObject({
      colorMode: "auto",
      customThemeColors: { "--default-color-highlight": "#e11d48" },
    })
  })

  it("sends no color mode for a card that never turned it on", async () => {
    expect((await sentToGenerator()).colorMode).toBeUndefined()
  })

  it("asks the generator for animations when the SVG has them on", async () => {
    expect((await sentToGenerator({ animations: true })).animations).toBe(true)
  })

  it("leaves them off for an SVG saved before the option existed", async () => {
    expect((await sentToGenerator()).animations).toBe(false)
  })
})

describe("POST /api/svgs/:id/generate after an earlier failure", () => {
  /** Runs the route to a published SVG, with an R2 bucket that takes every write. */
  async function regenerateAndPublish(): Promise<Response> {
    const { onRequestPost } = await import("./generate")
    const env = {
      SVG_GENERATOR: {
        fetch: async () => Response.json({ success: true, svg: "<svg/>", pluginErrors: {}, hasErrors: false }),
      },
      SVGS_BUCKET: { put: async () => undefined, delete: async () => undefined },
      R2_PUBLIC_URL: "https://r2.test",
    } as unknown as CloudflareEnv
    return (await onRequestPost({
      request: new Request("https://dash/api/svgs/svg_1/generate", { method: "POST", body: "{}" }),
      env,
      params: { id: "svg_1" },
    } as unknown as Parameters<typeof onRequestPost>[0])) as unknown as Response
  }

  // The card page shows last_error under the image. A manual generation used to write it
  // on failure and never clear it, so a card that worked again kept showing the old error
  // until the next nightly run (the cron clears it).
  it("clears the old error and the cron's fail count once the SVG is published", async () => {
    svgRow.lastError = "put: We encountered an internal error. Please try again. (10001)"
    svgRow.failCount = 3

    const response = await regenerateAndPublish()

    expect(response.status).toBe(200)
    expect(updates.at(-1)).toMatchObject({ status: "completed", lastError: null, failCount: 0 })
    expect(((await response.json()) as { svg: Record<string, unknown> }).svg).toMatchObject({ lastError: null })
  })
})
