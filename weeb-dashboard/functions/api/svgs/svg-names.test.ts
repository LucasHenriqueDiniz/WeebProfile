import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "../_shared/auth"
import { uniqueSvgName } from "../_shared/svg-name"

// Only Clerk is replaced. The routes run as deployed, against a local D1 (workerd's
// SQLite) built from the same migrations production applies.
const auth = vi.hoisted(() => ({ userId: "user_a" }))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => auth.userId,
}))

describe("uniqueSvgName", () => {
  it("keeps a free name", () => {
    expect(uniqueSvgName("GitHub Stats", ["MyAnimeList Stats"])).toBe("GitHub Stats")
  })

  it("numbers a taken name from 2, skipping numbers in use", () => {
    expect(uniqueSvgName("MyAnimeList Stats", ["MyAnimeList Stats"])).toBe("MyAnimeList Stats 2")
    expect(uniqueSvgName("MyAnimeList Stats", ["MyAnimeList Stats", "MyAnimeList Stats 2"])).toBe("MyAnimeList Stats 3")
  })

  it("treats names that differ only in case as the same", () => {
    expect(uniqueSvgName("MyAnimeList Stats", ["Myanimelist Stats"])).toBe("MyAnimeList Stats 2")
  })
})

describe("SVG names on a real D1", () => {
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
    // Load the routes here, under beforeAll's 60 s, not in the first test's 5 s: with
    // another D1 suite starting workerd alongside, the import alone ran past 5 s.
    await import("./index")
    await import("./[id]")
  }, 60_000)

  afterAll(async () => {
    await proxy?.dispose()
  })

  const body = (name: string, sections: string[]) => ({
    name,
    pluginsConfig: { myanimelist: { enabled: true, sections, username: "someone" } },
    pluginsOrder: "myanimelist",
    style: "default",
    size: "half",
  })

  async function create(name: string, sections: string[]) {
    const { onRequestPost } = await import("./index")
    const request = new Request("http://local/api/svgs", { method: "POST", body: JSON.stringify(body(name, sections)) })
    const response = await onRequestPost({ request, env } as never)
    expect(response.status).toBe(201)
    return ((await response.json()) as { svg: { id: string; name: string; slug: string } }).svg
  }

  async function update(id: string, name: string, sections: string[]) {
    const { onRequestPut } = await import("./[id]")
    const request = new Request(`http://local/api/svgs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body(name, sections)),
    })
    const response = await onRequestPut({ request, env, params: { id } } as never)
    expect(response.status).toBe(200)
    return ((await response.json()) as { svg: { name: string } }).svg
  }

  const storedName = async (id: string) =>
    (await env.DB.prepare("SELECT name FROM svgs WHERE id = ?").bind(id).first<{ name: string }>())?.name

  it("numbers a second card of the same plugin, and an edit does not undo it", async () => {
    auth.userId = "user_a"
    const first = await create("MyAnimeList Stats", ["statistics", "last_activity"])
    const second = await create("MyAnimeList Stats", ["statistics"])

    expect(first.name).toBe("MyAnimeList Stats")
    expect(second.name).toBe("MyAnimeList Stats 2")
    expect(second.slug).toMatch(/^myanimelist-stats-2-/)

    // The wizard sends the regenerated name on every save.
    expect((await update(second.id, "MyAnimeList Stats", ["statistics"])).name).toBe("MyAnimeList Stats 2")
    expect((await update(first.id, "MyAnimeList Stats", ["statistics"])).name).toBe("MyAnimeList Stats")
    expect(await storedName(first.id)).toBe("MyAnimeList Stats")
    expect(await storedName(second.id)).toBe("MyAnimeList Stats 2")
  })

  it("only compares against the same user's SVGs", async () => {
    auth.userId = "user_b"
    expect((await create("MyAnimeList Stats", ["statistics"])).name).toBe("MyAnimeList Stats")
  })

  it("separates a pair saved under the old casing once the wizard edits it", async () => {
    // Production has two cards named "Myanimelist Stats", from before the display name.
    auth.userId = "user_c"
    const first = await create("placeholder one", ["statistics", "last_activity"])
    const second = await create("placeholder two", ["statistics"])
    await env.DB.prepare("UPDATE svgs SET name = 'Myanimelist Stats' WHERE user_id = 'user_c'").run()

    expect((await update(second.id, "MyAnimeList Stats", ["statistics"])).name).toBe("MyAnimeList Stats 2")
    expect((await update(first.id, "MyAnimeList Stats", ["statistics", "last_activity"])).name).toBe(
      "MyAnimeList Stats"
    )
  })
})
