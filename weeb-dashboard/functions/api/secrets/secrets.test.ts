import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "../_shared/auth"

// Only Clerk is replaced. The routes run as deployed, against a local D1 (workerd's
// SQLite) built from the same migrations production applies.
const auth = vi.hoisted(() => ({ userId: "user_a" as string | null }))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => auth.userId,
}))

describe("plugin keys in settings, on a real D1", () => {
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
    // The stored value is ciphertext in production; these routes never read it.
    const rows: Array<[string, string, string, string]> = [
      ["user_a", "github", "pat", "ciphertext-a-github"],
      ["user_a", "lastfm", "apikey", "ciphertext-a-lastfm"],
      ["user_b", "github", "pat", "ciphertext-b-github"],
    ]
    for (const [userId, plugin, key, value] of rows) {
      await env.DB.prepare(
        "INSERT INTO plugin_secrets (id, user_id, plugin, key, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(crypto.randomUUID(), userId, plugin, key, value, "2026-11-10T12:00:00.000Z", "2026-11-12T09:30:00.000Z")
        .run()
    }
  }, 60_000)

  afterAll(async () => {
    await proxy?.dispose()
  })

  async function list() {
    const { onRequestGet } = await import("./index")
    return onRequestGet({ request: new Request("http://local/api/secrets"), env } as never)
  }

  async function remove(plugin: string, key: string) {
    const { onRequestDelete } = await import("./[plugin]/[key]")
    const request = new Request(`http://local/api/secrets/${plugin}/${key}`, { method: "DELETE" })
    return onRequestDelete({ request, env, params: { plugin, key } } as never)
  }

  const stored = async (userId: string) =>
    (
      await env.DB.prepare("SELECT plugin, key FROM plugin_secrets WHERE user_id = ? ORDER BY plugin, key")
        .bind(userId)
        .all<{ plugin: string; key: string }>()
    ).results.map((row) => `${row.plugin}/${row.key}`)

  it("lists the caller's keys with when they were saved, and no value", async () => {
    auth.userId = "user_a"
    const response = await list()
    expect(response.status).toBe(200)
    const body = await response.text()
    expect(JSON.parse(body)).toEqual({
      secrets: [
        { plugin: "github", key: "pat", updatedAt: "2026-11-12T09:30:00.000Z" },
        { plugin: "lastfm", key: "apikey", updatedAt: "2026-11-12T09:30:00.000Z" },
      ],
    })
    expect(body).not.toContain("ciphertext")
  })

  it("removes one key of the caller and leaves the rest, theirs and other users'", async () => {
    auth.userId = "user_a"
    // The settings page sends the metadata's casing (apiKey); rows are lowercase.
    expect((await remove("lastfm", "apiKey")).status).toBe(200)
    expect(await stored("user_a")).toEqual(["github/pat"])
    expect(await stored("user_b")).toEqual(["github/pat"])
  })

  it("answers 404 for a key that is gone, or that belongs to someone else", async () => {
    auth.userId = "user_a"
    expect((await remove("lastfm", "apikey")).status).toBe(404)

    auth.userId = "user_c"
    expect((await remove("github", "pat")).status).toBe(404)
    expect(await stored("user_a")).toEqual(["github/pat"])
    expect(await stored("user_b")).toEqual(["github/pat"])
  })

  it("answers 401 without a session", async () => {
    auth.userId = null
    expect((await list()).status).toBe(401)
    expect((await remove("github", "pat")).status).toBe(401)
  })
})
