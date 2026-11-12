import { describe, it, expect, vi, beforeEach } from "vitest"
import type { CloudflareEnv } from "../../_shared/auth"
import { ApiException, missingRequiredConfig, type ApiError } from "../../../../lib/api/errors"

/**
 * The route end of the generator's D1_UNREACHABLE contract. Runs the real
 * generateSvgViaService against a fake SVG_GENERATOR binding, so a code mismatch
 * between the client and this route shows up here, not only in production.
 */

const { db, updates } = vi.hoisted(() => {
  const updates: Record<string, unknown>[] = []
  const svgRow = {
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
    update: () => ({
      set: (values: Record<string, unknown>) => {
        updates.push(values)
        return query([{ ...svgRow, ...values }])
      },
    }),
  }
  return { db, updates }
})

vi.mock("../../_shared/db", () => ({ getDb: () => db }))
vi.mock("../../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../_shared/auth")>()),
  getAuthUserId: async () => "user_1",
}))

beforeEach(() => {
  updates.length = 0
})

// What svg-generator/src/worker.ts answers when it cannot read the user's secrets.
const generatorD1Unreachable = {
  error: "DATABASE_UNREACHABLE",
  code: "D1_UNREACHABLE",
  message: "Generator couldn't access D1.",
  details: "D1_ERROR: no such table: plugin_secrets: SQLITE_ERROR",
}

async function regenerate(generator: () => Response) {
  const { onRequestPost } = await import("./generate")
  const env = { SVG_GENERATOR: { fetch: async () => generator() } } as unknown as CloudflareEnv
  return (await onRequestPost({
    request: new Request("https://dash/api/svgs/svg_1/generate", { method: "POST", body: "{}" }),
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
