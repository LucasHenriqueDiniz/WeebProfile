import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { ClerkAPIResponseError } from "@clerk/backend/errors"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "../_shared/auth"

// Only Clerk is replaced. The route runs as deployed, against a local D1 (workerd's
// SQLite) built from the same migrations production applies, and a local R2 bucket.
const clerk = vi.hoisted(() => ({
  userId: null as string | null,
  deleteUser: async (_userId: string): Promise<unknown> => ({}),
}))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => clerk.userId,
  getClerkClient: () => ({ users: { deleteUser: (userId: string) => clerk.deleteUser(userId) } }),
}))

const USER_TABLES = ["profiles", "plugin_secrets", "svgs", "templates", "template_likes", "generation_starts"] as const

// Every D1 and R2 call crosses into workerd; a seeded run takes a few seconds.
describe("DELETE /api/account on a real D1 and R2", { timeout: 30_000 }, () => {
  let proxy: Awaited<ReturnType<typeof getPlatformProxy<CloudflareEnv>>>
  let env: CloudflareEnv

  beforeAll(async () => {
    proxy = await getPlatformProxy<CloudflareEnv>({ configPath: "wrangler.toml", persist: false })
    env = proxy.env
    const dir = path.join(__dirname, "../../../drizzle")
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      for (const statement of readFileSync(path.join(dir, file), "utf-8").split("--> statement-breakpoint")) {
        if (statement.trim()) await env.DB.prepare(statement).run()
      }
    }
  }, 60_000)

  afterAll(async () => {
    await proxy?.dispose()
  })

  beforeEach(() => {
    clerk.deleteUser = async () => ({})
  })

  const run = (statement: string, ...values: unknown[]) =>
    env.DB.prepare(statement)
      .bind(...values)
      .run()
  const stmt = (statement: string, ...values: unknown[]) => env.DB.prepare(statement).bind(...values)

  /**
   * Everything a user can leave behind: a profile, two secrets, two SVGs with their R2
   * objects, a template and a generation timestamp. `likes` are the templates this user
   * likes, by id.
   */
  async function seed(userId: string, likes: string[] = []) {
    const now = new Date().toISOString()
    const svgIds = [1, 2].map((n) => `svg-${userId}-${n}`)
    await env.DB.batch([
      stmt(
        "INSERT INTO profiles (id, user_id, username, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        `profile-${userId}`,
        userId,
        userId,
        now,
        now
      ),
      ...["apiKey", "username"].map((key) =>
        stmt(
          "INSERT INTO plugin_secrets (id, user_id, plugin, key, value, created_at, updated_at) VALUES (?, ?, 'steam', ?, 'v', ?, ?)",
          `secret-${userId}-${key}`,
          userId,
          key,
          now,
          now
        )
      ),
      ...svgIds.map((svgId) =>
        stmt(
          "INSERT INTO svgs (id, user_id, slug, name, plugins_config, ui_config, storage_path, updated_at, created_at) VALUES (?, ?, ?, ?, '{}', '{}', ?, ?, ?)",
          svgId,
          userId,
          svgId,
          svgId,
          `svgs/${svgId}.svg`,
          now,
          now
        )
      ),
      stmt(
        "INSERT INTO templates (id, user_id, name, plugins_config, ui_config, is_public, created_at) VALUES (?, ?, ?, '{}', '{}', 1, ?)",
        `template-${userId}`,
        userId,
        `template-${userId}`,
        now
      ),
      ...likes.map((templateId) =>
        stmt(
          "INSERT INTO template_likes (id, user_id, template_id, created_at) VALUES (?, ?, ?, ?)",
          `like-${userId}-${templateId}`,
          userId,
          templateId,
          now
        )
      ),
      stmt("INSERT INTO generation_starts (user_id, started_at) VALUES (?, ?)", userId, now),
    ])
    for (const svgId of svgIds) await env.SVGS_BUCKET.put(`svgs/${svgId}.svg`, "<svg/>")
  }

  /**
   * Rows per table for `userId`, plus likes anyone left on that user's templates. One
   * query: every D1 call crosses into workerd, and the other D1 suites share the machine.
   */
  async function rowsOf(userId: string, tables: readonly string[] = USER_TABLES) {
    const counts = tables.map((table) => `(SELECT COUNT(*) FROM ${table} WHERE user_id = ?1) AS ${table}`)
    counts.push(
      "(SELECT COUNT(*) FROM template_likes WHERE template_id IN (SELECT id FROM templates WHERE user_id = ?1)) AS likesOnTheirTemplates"
    )
    return (await env.DB.prepare(`SELECT ${counts.join(", ")}`)
      .bind(userId)
      .first<Record<string, number>>())!
  }

  async function objectsOf(userId: string) {
    const listed = await env.SVGS_BUCKET.list({ prefix: `svgs/svg-${userId}-` })
    return listed.objects.length
  }

  const SEEDED = {
    profiles: 1,
    plugin_secrets: 2,
    svgs: 2,
    templates: 1,
    template_likes: 1,
    generation_starts: 1,
    likesOnTheirTemplates: 1,
  }
  const EMPTY = Object.fromEntries(Object.keys(SEEDED).map((k) => [k, 0]))

  async function deleteAccount(userId: string | null, envOverride: Partial<CloudflareEnv> = {}) {
    clerk.userId = userId
    const { onRequestDelete } = await import("./index")
    const request = new Request("http://local/api/account", { method: "DELETE" })
    return onRequestDelete({ request, env: { ...env, ...envOverride } } as never)
  }

  it("deletes every row and object of the user, then the Clerk user, and leaves the other user alone", async () => {
    // a and b like each other's templates, so each has one like given and one received.
    await seed("user_a", ["template-user_b"])
    await seed("user_b", ["template-user_a"])
    expect(await rowsOf("user_a")).toEqual(SEEDED)
    expect(await rowsOf("user_b")).toEqual(SEEDED)

    const clerkCalls: { userId: string; rowsLeft: Record<string, number>; objectsLeft: number }[] = []
    clerk.deleteUser = async (userId) => {
      clerkCalls.push({ userId, rowsLeft: await rowsOf(userId), objectsLeft: await objectsOf(userId) })
      return {}
    }

    const response = await deleteAccount("user_a")

    expect(response.status).toBe(200)
    expect(await rowsOf("user_a")).toEqual(EMPTY)
    expect(await objectsOf("user_a")).toBe(0)
    // Clerk goes last: by the time it is called, nothing of the user is left to orphan.
    expect(clerkCalls).toEqual([{ userId: "user_a", rowsLeft: EMPTY, objectsLeft: 0 }])

    // b keeps everything except the like it gave a template that no longer exists.
    expect(await rowsOf("user_b")).toEqual({ ...SEEDED, template_likes: 0, likesOnTheirTemplates: 0 })
    expect(await objectsOf("user_b")).toBe(2)
  })

  it("answers 401 without a session and deletes nothing", async () => {
    await seed("user_c")
    let clerkCalled = false
    clerk.deleteUser = async () => ((clerkCalled = true), {})

    expect((await deleteAccount(null)).status).toBe(401)
    expect(await rowsOf("user_c")).toEqual({ ...SEEDED, template_likes: 0, likesOnTheirTemplates: 0 })
    expect(await objectsOf("user_c")).toBe(2)
    expect(clerkCalled).toBe(false)
  })

  it("keeps the rows when R2 fails, so a retry still knows which objects are the user's", async () => {
    await seed("user_d")
    let clerkCalled = false
    clerk.deleteUser = async () => ((clerkCalled = true), {})
    const brokenBucket = {
      delete: async () => {
        throw new Error("R2 unavailable")
      },
    } as unknown as R2Bucket

    expect((await deleteAccount("user_d", { SVGS_BUCKET: brokenBucket })).status).toBe(500)
    expect((await rowsOf("user_d")).svgs).toBe(2)
    expect(clerkCalled).toBe(false)

    expect((await deleteAccount("user_d")).status).toBe(200)
    expect(await rowsOf("user_d")).toEqual(EMPTY)
    expect(await objectsOf("user_d")).toBe(0)
    expect(clerkCalled).toBe(true)
  })

  it("finishes on a retry when Clerk fails, and takes Clerk's 404 for already deleted", async () => {
    await seed("user_e")
    clerk.deleteUser = async () => {
      throw new Error("Clerk unavailable")
    }
    expect((await deleteAccount("user_e")).status).toBe(500)
    expect(await rowsOf("user_e")).toEqual(EMPTY)

    // The first try reached Clerk, which deleted the user but the answer never came back.
    clerk.deleteUser = async () => {
      throw new ClerkAPIResponseError("Not Found", { data: [], status: 404 })
    }
    expect((await deleteAccount("user_e")).status).toBe(200)

    // Any other Clerk error is still an error.
    clerk.deleteUser = async () => {
      throw new ClerkAPIResponseError("Forbidden", { data: [], status: 403 })
    }
    expect((await deleteAccount("user_e")).status).toBe(500)
  })

  // Last: it drops a table the other tests seed.
  it("still deletes everything on a database without the generation_starts migration", async () => {
    await seed("user_f")
    await run("DROP TABLE generation_starts")

    expect((await deleteAccount("user_f")).status).toBe(200)
    const { generation_starts: _gone, ...rest } = EMPTY
    expect(
      await rowsOf(
        "user_f",
        USER_TABLES.filter((table) => table !== "generation_starts")
      )
    ).toEqual(rest)
    expect(await objectsOf("user_f")).toBe(0)
  })
})
