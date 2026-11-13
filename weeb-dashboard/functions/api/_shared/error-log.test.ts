import { describe, it, expect, vi, beforeEach } from "vitest"
import { onRequest } from "../_middleware"
import { serverError } from "./auth"
import { pruneErrorLog, recordServerError } from "./error-log"

// Not top-level await anywhere here: the Pages build compiles test files under
// functions/ too, for ES2020.
const db = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  insert: async (row: Record<string, unknown>) => {
    db.rows.push(row)
  },
  remove: async () => {},
}))

vi.mock("./db", () => ({
  getDb: () => ({
    insert: () => ({ values: (row: Record<string, unknown>) => db.insert(row) }),
    delete: () => ({ where: () => db.remove() }),
  }),
}))

beforeEach(() => {
  db.rows = []
  db.insert = async (row) => {
    db.rows.push(row)
  }
  db.remove = async () => {}
  vi.spyOn(console, "error").mockImplementation(() => {})
})

/**
 * Runs the middleware around a handler the way the Pages router does, and waits for its
 * waitUntil work. The router hands the middleware a re-created response
 * (cloneResponse in wrangler's pages-template-worker): a version that keyed the error
 * by the Response object passed when next() returned the handler's own object, and
 * recorded nothing in a real `wrangler pages dev`.
 */
async function call(handler: () => Response | Promise<Response>, url = "https://dash/api/templates", method = "GET") {
  const pending: Promise<unknown>[] = []
  const response = await onRequest({
    request: new Request(url, { method }),
    env: {},
    next: async () => {
      const original = await handler()
      return new Response(original.body, original)
    },
    waitUntil: (p: Promise<unknown>) => pending.push(p),
  } as never)
  await Promise.all(pending)
  return response as unknown as Response
}

describe("error_log middleware", () => {
  it("records a serverError() with the route, status, message and stack frames", async () => {
    await call(() => serverError(new Error("D1_ERROR: no such table: templates")), "https://dash/api/templates", "GET")

    expect(db.rows).toHaveLength(1)
    expect(db.rows[0]).toMatchObject({
      method: "GET",
      path: "/api/templates",
      status: 500,
      message: "D1_ERROR: no such table: templates",
    })
    expect(db.rows[0]!.stack).toMatch(/^\s+at /)
  })

  it("does not let the error's id header reach the client", async () => {
    const response = await call(() => serverError(new Error("boom")))

    expect([...response.headers.keys()]).not.toContain("x-error-log-id")
    expect(await response.json()).toEqual({ error: "Internal server error" })
  })

  it("does not record /api/health, which the uptime monitor polls", async () => {
    await call(() => Response.json({ status: "degraded" }, { status: 503 }), "https://dash/api/health")

    expect(db.rows).toHaveLength(0)
  })

  it("answers a handler that throws with the API's JSON 500, and records it", async () => {
    const response = await call(() => {
      throw new TypeError("Cannot read properties of undefined (reading 'id')")
    })

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: "Internal server error" })
    expect(db.rows[0]).toMatchObject({ status: 500, message: "Cannot read properties of undefined (reading 'id')" })
  })

  it.each([200, 401, 404])("records nothing for a %i", async (status) => {
    await call(() => Response.json({}, { status }))

    expect(db.rows).toHaveLength(0)
  })

  it("records a hand-built 503 by its body, and still delivers that body", async () => {
    const body = { error: "Generator unavailable", code: "D1_UNREACHABLE" }

    const response = await call(() => Response.json(body, { status: 503 }))

    expect(await response.json()).toEqual(body)
    expect(db.rows[0]).toMatchObject({ status: 503, message: `HTTP 503: ${JSON.stringify(body)}`, stack: null })
  })

  // Seen in a real `wrangler pages dev`: the row said which query failed, not why.
  it("keeps the cause Drizzle wraps, with the params still redacted", async () => {
    const d1 = new Error("D1_ERROR: no such table: templates: SQLITE_ERROR")
    // Object.assign, not the options argument: functions/tsconfig targets ES2020.
    const drizzle = Object.assign(
      new Error('Failed query: select "id" from "templates" where "user_id" = ?\nparams: user_2SECRET'),
      { cause: d1 }
    )

    await call(() => serverError(drizzle))

    expect(db.rows[0]!.message).toBe(
      'Failed query: select "id" from "templates" where "user_id" = ?\nparams: [redacted]' +
        "\ncaused by: D1_ERROR: no such table: templates: SQLITE_ERROR"
    )
  })

  it("stores the pathname without the query string", async () => {
    await call(() => serverError(new Error("x")), "https://dash/api/svgs?token=abc123")

    expect(db.rows[0]!.path).toBe("/api/svgs")
  })

  // Drizzle's DrizzleQueryError message ends with every bound parameter.
  it.each([
    ["Failed query: select * from svgs where user_id = ?\nparams: user_2SECRET", "user_2SECRET"],
    ["fetch https://api.example/?key=SECRET123 failed", "SECRET123"],
    ["upstream echoed Authorization: Bearer SECRET123", "SECRET123"],
    ["invalid key sk_live_SECRET123", "SECRET123"],
  ])("does not store a secret carried in the message: %s", async (message, secret) => {
    await call(() => serverError(new Error(message)))

    expect(JSON.stringify(db.rows[0])).not.toContain(secret)
    expect(db.rows[0]!.message).toContain("[redacted]")
  })

  it("still answers the 500 when the row cannot be written", async () => {
    db.insert = async () => {
      throw new Error("D1_ERROR: no such table: error_log")
    }

    const response = await call(() => serverError(new Error("boom")))

    expect(response.status).toBe(500)
  })
})

describe("recordServerError / pruneErrorLog", () => {
  // Pages deploys on merge and the migration is applied by hand, so for a while the
  // table may not exist. Neither may turn that into a failure of its own.
  it("do not throw when D1 fails", async () => {
    db.insert = db.remove = async () => {
      throw new Error("D1_ERROR: no such table: error_log")
    }

    await expect(recordServerError({} as never, { method: "GET", path: "/", status: 500 })).resolves.toBeUndefined()
    await expect(pruneErrorLog({} as never)).resolves.toBeUndefined()
  })
})
