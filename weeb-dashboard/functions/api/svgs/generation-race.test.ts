import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "../_shared/auth"

// A generation publishes in two steps, the image to R2 and then its row, and a deletion
// can land in between. These run the real routes against a local D1 and R2 and stage
// that interleaving on purpose: the generator stand-in deletes while it "renders", or
// the bucket runs a whole generation inside the deleting route. Only Clerk and the
// generator are replaced.
const auth = vi.hoisted(() => ({ userId: null as string | null }))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => auth.userId,
  getClerkClient: () => ({ users: { deleteUser: async () => ({}) } }),
}))

const CRON_SECRET = "test-cron-secret"

// Every D1 and R2 call crosses into workerd; a run takes a few seconds.
describe("a generation racing a deletion, on a real D1 and R2", { timeout: 30_000 }, () => {
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

  /** A due SVG for `userId`, optionally with an image already published. */
  async function seedSvg(userId: string, published = false) {
    const id = `svg-${userId}`
    const now = new Date().toISOString()
    await env.DB.prepare(
      "INSERT INTO svgs (id, user_id, slug, name, plugins_config, plugins_order, ui_config, status, storage_path, updated_at, created_at) VALUES (?, ?, ?, ?, ?, 'github', '{}', 'pending', ?, ?, ?)"
    )
      .bind(
        id,
        userId,
        id,
        id,
        JSON.stringify({ github: { enabled: true, sections: ["profile"], username: "someone" } }),
        published ? `svgs/${id}.svg` : null,
        now,
        now
      )
      .run()
    if (published) await env.SVGS_BUCKET.put(`svgs/${id}.svg`, "<svg>old</svg>")
    return id
  }

  const published = async (id: string) => (await env.SVGS_BUCKET.head(`svgs/${id}.svg`)) !== null
  const rowExists = async (id: string) =>
    (await env.DB.prepare("SELECT 1 AS one FROM svgs WHERE id = ?").bind(id).first()) !== null

  /** The generator binding: answers an SVG, after running `whileRendering` with the request it got. */
  const generator = (whileRendering: (request: { userId?: string }) => Promise<void> = async () => {}) =>
    ({
      fetch: async (_url: string, init: RequestInit) => {
        await whileRendering(JSON.parse(String(init.body)))
        return Response.json({ success: true, svg: "<svg>new</svg>", pluginErrors: {}, hasErrors: false })
      },
    }) as unknown as Fetcher

  /** The bucket, except that its first delete also runs `afterFirstDelete` before returning. */
  function bucketThatRunsAfterFirstDelete(afterFirstDelete: () => Promise<void>): R2Bucket {
    let fired = false
    const real = env.SVGS_BUCKET
    return {
      head: (key: string) => real.head(key),
      get: (key: string) => real.get(key),
      put: (key: string, value: string, options?: R2PutOptions) => real.put(key, value, options),
      list: (options?: R2ListOptions) => real.list(options),
      delete: async (keys: string | string[]) => {
        await real.delete(keys)
        if (fired) return
        fired = true
        await afterFirstDelete()
      },
    } as unknown as R2Bucket
  }

  async function generate(userId: string, id: string, overrides: Partial<CloudflareEnv>) {
    auth.userId = userId
    const { onRequestPost } = await import("./[id]/generate")
    const request = new Request(`http://local/api/svgs/${id}/generate`, {
      method: "POST",
      body: JSON.stringify({ force: true }),
    })
    return onRequestPost({ request, env: { ...env, ...overrides }, params: { id } } as never)
  }

  async function runCron(overrides: Partial<CloudflareEnv>) {
    const { onRequestPost } = await import("../cron/generate-svgs")
    const request = new Request("http://local/api/cron/generate-svgs", {
      method: "POST",
      headers: { authorization: `Bearer ${CRON_SECRET}` },
    })
    return onRequestPost({ request, env: { ...env, CRON_SECRET, ...overrides }, waitUntil: () => {} } as never)
  }

  async function deleteAccount(userId: string, overrides: Partial<CloudflareEnv> = {}) {
    auth.userId = userId
    const { onRequestDelete } = await import("../account/index")
    const request = new Request("http://local/api/account", { method: "DELETE" })
    return onRequestDelete({ request, env: { ...env, ...overrides } } as never)
  }

  async function deleteSvg(userId: string, id: string, overrides: Partial<CloudflareEnv>) {
    auth.userId = userId
    const { onRequestDelete } = await import("./[id]")
    const request = new Request(`http://local/api/svgs/${id}`, { method: "DELETE" })
    return onRequestDelete({ request, env: { ...env, ...overrides }, params: { id } } as never)
  }

  it("publishes as before when nothing is deleted", async () => {
    const id = await seedSvg("user_plain")

    const response = await generate("user_plain", id, { SVG_GENERATOR: generator() })

    expect(response.status).toBe(200)
    expect(await published(id)).toBe(true)
    const row = await env.DB.prepare("SELECT status, storage_path FROM svgs WHERE id = ?")
      .bind(id)
      .first<{ status: string; storage_path: string }>()
    expect(row).toEqual({ status: "completed", storage_path: `svgs/${id}.svg` })
  })

  it("manual generation: the account is deleted while the generator renders", async () => {
    const id = await seedSvg("user_manual", true)

    const response = await generate("user_manual", id, {
      SVG_GENERATOR: generator(async () => {
        expect((await deleteAccount("user_manual")).status).toBe(200)
      }),
    })

    expect(response.status).toBe(404)
    expect(await rowExists(id)).toBe(false)
    expect(await published(id)).toBe(false)
  })

  it("cron: the account is deleted while the generator renders", async () => {
    const id = await seedSvg("user_cron", true)

    const response = await runCron({
      SVG_GENERATOR: generator(async (request) => {
        if (request.userId === "user_cron") expect((await deleteAccount("user_cron")).status).toBe(200)
      }),
    })

    expect(response.status).toBe(200)
    expect(await rowExists(id)).toBe(false)
    expect(await published(id)).toBe(false)
  })

  it("account deletion: a generation finishes between its R2 pass and its rows going", async () => {
    const id = await seedSvg("user_window", true)

    const response = await deleteAccount("user_window", {
      SVGS_BUCKET: bucketThatRunsAfterFirstDelete(async () => {
        // The whole generation, image and row, lands after the objects went and
        // before the rows do.
        expect((await generate("user_window", id, { SVG_GENERATOR: generator() })).status).toBe(200)
        expect(await published(id)).toBe(true)
        auth.userId = "user_window"
      }),
    })

    expect(response.status).toBe(200)
    expect(await rowExists(id)).toBe(false)
    expect(await published(id)).toBe(false)
  })

  it("single SVG deletion: a generation finishes between its R2 delete and its row going", async () => {
    const id = await seedSvg("user_single", true)

    const response = await deleteSvg("user_single", id, {
      SVGS_BUCKET: bucketThatRunsAfterFirstDelete(async () => {
        expect((await generate("user_single", id, { SVG_GENERATOR: generator() })).status).toBe(200)
        expect(await published(id)).toBe(true)
      }),
    })

    expect(response.status).toBe(200)
    expect(await rowExists(id)).toBe(false)
    expect(await published(id)).toBe(false)
  })
})
