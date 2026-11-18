import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { CloudflareEnv } from "../_shared/auth"
import { MAX_TILES, type GeneratedTile } from "../_shared/storage"

// A card's tiles, one SVG per site, go through the same routes as the card: written by
// both generations, served next to it, deleted with it. These run the real routes
// against a local D1 and R2; only Clerk and the generator are replaced.
const auth = vi.hoisted(() => ({ userId: null as string | null }))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => auth.userId,
  getClerkClient: () => ({ users: { deleteUser: async () => ({}) } }),
}))

const CRON_SECRET = "test-cron-secret"

const tile = (n: number): GeneratedTile => ({
  href: `https://site${n}.example/`,
  title: `Site ${n}`,
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="270" height="210"><text>site ${n}</text></svg>`,
  width: 270,
  height: 210,
})
const tiles = (count: number) => Array.from({ length: count }, (_, n) => tile(n))

/** A link badge of the About plugin: its own width, laid inline in the README. */
const badge = (n: number, href = `https://badge${n}.example/`): GeneratedTile => ({
  href,
  title: `Badge ${n}`,
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${100 + n}" height="36"><text>badge ${n}</text></svg>`,
  width: 100 + n,
  height: 36,
  layout: "inline",
})

describe("a card's tiles, on a real D1 and R2", { timeout: 30_000 }, () => {
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

  async function seedSvg(userId: string) {
    const id = `svg-${userId}`
    const now = new Date().toISOString()
    await env.DB.prepare(
      "INSERT INTO svgs (id, user_id, slug, name, plugins_config, plugins_order, ui_config, status, updated_at, created_at) VALUES (?, ?, ?, ?, ?, 'websites', '{}', 'pending', ?, ?)"
    )
      .bind(
        id,
        userId,
        id,
        id,
        JSON.stringify({ websites: { enabled: true, sections: ["websites"], websites_items: [] } }),
        now,
        now
      )
      .run()
    return id
  }

  /** The generator binding, answering a card and, unless `answer` is "absent", these tiles. */
  const generator = (answer: GeneratedTile[] | "absent", requests: Array<Record<string, unknown>> = []) =>
    ({
      fetch: async (_url: string, init: RequestInit) => {
        requests.push(JSON.parse(String(init.body)))
        return Response.json({
          success: true,
          svg: "<svg>card</svg>",
          pluginErrors: {},
          hasErrors: false,
          ...(answer === "absent" ? {} : { tiles: answer }),
        })
      },
    }) as unknown as Fetcher

  async function generate(userId: string, id: string, answer: GeneratedTile[] | "absent") {
    auth.userId = userId
    const requests: Array<Record<string, unknown>> = []
    const { onRequestPost } = await import("./[id]/generate")
    const request = new Request(`http://local/api/svgs/${id}/generate`, {
      method: "POST",
      body: JSON.stringify({ force: true }),
    })
    // The per-user floor between generations is not what these test.
    await env.DB.prepare("DELETE FROM generation_starts").run()
    const response = await onRequestPost({
      request,
      env: { ...env, SVG_GENERATOR: generator(answer, requests) },
      params: { id },
    } as never)
    expect(response.status).toBe(200)
    return requests[0]!
  }

  /** The keys stored under the card's tiles prefix, as tile indexes and "manifest". */
  async function stored(id: string): Promise<string[]> {
    const listed = await env.SVGS_BUCKET.list({ prefix: `svgs/${id}/` })
    return listed.objects
      .map((object) => object.key.replace(`svgs/${id}/`, ""))
      .map((key) => (key === "tiles.json" ? "manifest" : key.replace(/^tiles\/(\d+)\.svg$/, "$1")))
      .sort()
  }

  async function getTile(id: string, file: string) {
    const { onRequestGet } = await import("../../svg/[id]/[tile]")
    const request = new Request(`http://local/svg/${id}/${file}`)
    return onRequestGet({ request, env, params: { id, tile: file }, waitUntil: () => {} } as never)
  }

  async function getManifest(userId: string, id: string) {
    auth.userId = userId
    const { onRequestGet } = await import("./[id]/tiles")
    const request = new Request(`http://local/api/svgs/${id}/tiles`)
    return onRequestGet({ request, env, params: { id } } as never)
  }

  it("asks the generator for tiles, stores each one with a manifest, and serves them", async () => {
    const id = await seedSvg("user_store")

    const request = await generate("user_store", id, tiles(3))

    expect(request.tiles).toBe(true)
    expect(await stored(id)).toEqual(["0", "1", "2", "manifest"])

    const manifest = await getManifest("user_store", id)
    // A generator answer without a layout is a website's, from before link badges.
    expect(await manifest.json()).toEqual({
      tiles: tiles(3).map(({ href, title }) => ({ href, title, layout: "grid" })),
    })

    const second = await getTile(id, "1.svg")
    expect(second.status).toBe(200)
    expect(await second.text()).toBe(tile(1).svg)
    expect(second.headers.get("Content-Type")).toBe("image/svg+xml")
    expect(second.headers.get("Content-Security-Policy")).toMatch(/(^|;\s*)sandbox(;|$)/)
  })

  // The README keeps asking for every tile its snippet had.
  it("answers a one-pixel transparent tile, not a 404, for a place with no site", async () => {
    const id = await seedSvg("user_empty_place")
    await generate("user_empty_place", id, tiles(2))

    const response = await getTile(id, "5.svg")

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml")
    expect(await response.text()).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="270" height="1"></svg>')
  })

  // A card with link badges: the manifest says which tiles are badges, for the snippet.
  it("stores a link badge's layout in the manifest, next to the websites' grid", async () => {
    const id = await seedSvg("user_badges")
    await generate("user_badges", id, [tile(0), badge(1), badge(2, "mailto:someone@example.com")])

    expect(await (await getManifest("user_badges", id)).json()).toEqual({
      tiles: [
        { href: "https://site0.example/", title: "Site 0", layout: "grid" },
        { href: "https://badge1.example/", title: "Badge 1", layout: "inline" },
        { href: "mailto:someone@example.com", title: "Badge 2", layout: "inline" },
      ],
    })
    expect(await (await getTile(id, "2.svg")).text()).toBe(badge(2).svg)
  })

  // A badge snippet sets no size: the 270px strip of a site would be a blank 270px in
  // the middle of the badge row.
  it("answers a one-pixel square for a place after the last link badge", async () => {
    const id = await seedSvg("user_badge_removed")
    await generate("user_badge_removed", id, [badge(0), badge(1), badge(2)])

    await generate("user_badge_removed", id, [badge(0), badge(1)])

    expect(await stored(id)).toEqual(["0", "1", "manifest"])
    expect(await (await getTile(id, "2.svg")).text()).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
    )
  })

  // Manifests written before link badges carry no layout; they were all websites.
  it("reads a manifest without layouts as the websites' grid", async () => {
    const id = await seedSvg("user_old_manifest")
    await generate("user_old_manifest", id, tiles(1))
    await env.SVGS_BUCKET.put(
      `svgs/${id}/tiles.json`,
      JSON.stringify({ tiles: [{ href: "https://site0.example/", title: "Site 0" }] })
    )

    expect(await (await getManifest("user_old_manifest", id)).json()).toEqual({
      tiles: [{ href: "https://site0.example/", title: "Site 0", layout: "grid" }],
    })
    expect(await (await getTile(id, "3.svg")).text()).toContain('width="270" height="1"')
  })

  it.each(["20.svg", "100.svg", "-1.svg", "a.svg", "1.png", "1"])("answers 404 for the tile %j", async (file) => {
    const id = await seedSvg(`user_bad_${file.replace(/\W/g, "_")}`)
    expect((await getTile(id, file)).status).toBe(404)
  })

  it("answers 404 for the tiles of a card that does not exist", async () => {
    expect((await getTile("svg-nobody", "0.svg")).status).toBe(404)
  })

  // Otherwise a removed site's old image keeps showing, under the link of whatever
  // site the README's snippet put in that place.
  it("deletes the tiles past the new count when sites are removed", async () => {
    const id = await seedSvg("user_shrink")
    await generate("user_shrink", id, tiles(3))

    await generate("user_shrink", id, tiles(1))

    expect(await stored(id)).toEqual(["0", "manifest"])
    expect(await (await getTile(id, "2.svg")).text()).toContain('height="1"')
  })

  it("keeps the stored tiles when the generator answers none, which is how it reports failing to draw them", async () => {
    const id = await seedSvg("user_keep")
    await generate("user_keep", id, tiles(2))

    await generate("user_keep", id, "absent")

    expect(await stored(id)).toEqual(["0", "1", "manifest"])
  })

  it("removes the tiles and the manifest when the card has none any more", async () => {
    const id = await seedSvg("user_none")
    await generate("user_none", id, tiles(2))

    await generate("user_none", id, [])

    expect(await stored(id)).toEqual([])
    expect(await (await getManifest("user_none", id)).json()).toEqual({ tiles: [] })
  })

  it("stores them from the nightly cron too", async () => {
    const id = await seedSvg("user_cron")
    const { onRequestPost } = await import("../cron/generate-svgs")
    const request = new Request("http://local/api/cron/generate-svgs", {
      method: "POST",
      headers: { authorization: `Bearer ${CRON_SECRET}` },
    })

    const response = await onRequestPost({
      request,
      env: { ...env, CRON_SECRET, SVG_GENERATOR: generator(tiles(2)) },
      waitUntil: () => {},
    } as never)

    expect(response.status).toBe(200)
    expect(await stored(id)).toEqual(["0", "1", "manifest"])
  })

  it("takes the tiles down with the card", async () => {
    const id = await seedSvg("user_delete")
    await generate("user_delete", id, tiles(2))

    auth.userId = "user_delete"
    const { onRequestDelete } = await import("./[id]")
    const request = new Request(`http://local/api/svgs/${id}`, { method: "DELETE" })
    expect((await onRequestDelete({ request, env, params: { id } } as never)).status).toBe(200)

    expect(await stored(id)).toEqual([])
    expect((await getTile(id, "0.svg")).status).toBe(404)
  })

  it("takes the tiles down with the account", async () => {
    const id = await seedSvg("user_account")
    await generate("user_account", id, tiles(2))

    auth.userId = "user_account"
    const { onRequestDelete } = await import("../account/index")
    expect((await onRequestDelete({ request: new Request("http://local/api/account"), env } as never)).status).toBe(200)

    expect(await stored(id)).toEqual([])
  })

  it("shows the manifest only to the card's owner", async () => {
    const id = await seedSvg("user_owner")
    await generate("user_owner", id, tiles(1))

    expect((await getManifest("user_someone_else", id)).status).toBe(404)
  })

  // Every tile a card can draw has a place: the websites' sites and the About plugin's
  // link badges, the two plugins with tiles.
  it("has a place for every site and every link badge a card can have", () => {
    const maxItems = (plugin: "websites" | "about", key: string) => {
      const sections = PLUGINS_METADATA[plugin].sections as ReadonlyArray<{
        configOptions: ReadonlyArray<{ key: string; maxItems?: number }>
      }>
      return sections.flatMap((section) => section.configOptions).find((option) => option.key === key)!.maxItems!
    }
    expect(maxItems("websites", "websites_items") + maxItems("about", "links_items")).toBe(MAX_TILES)
  })
})
