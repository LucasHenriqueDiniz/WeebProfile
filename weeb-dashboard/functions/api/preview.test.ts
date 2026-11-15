import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "./_shared/auth"
import { PREVIEW_LIMITS, ipBucket } from "./_shared/preview-rate-limit"
import { generatorBody } from "./preview"
import { PREVIEW_PLUGINS } from "../../lib/preview/public-preview"

/**
 * GET /api/preview against a real local D1, so the rate limit's upsert runs as SQLite
 * runs it. The generator and the Cache API are stand-ins that count their calls: a
 * cache hit must reach neither the generator nor D1.
 */

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="415" height="200"><text>g964</text></svg>'

/** In-memory caches.default: the same match/put contract, keyed by URL. */
const cacheStore = new Map<string, Response>()
vi.stubGlobal("caches", {
  default: {
    match: async (key: string) => cacheStore.get(key)?.clone(),
    put: async (key: string, response: Response) => void cacheStore.set(key, response.clone()),
  },
})

/** What the route sent: a generation body, or `{ vanity }` for Steam's resolver. */
type GeneratorCall = ReturnType<typeof generatorBody> & { vanity?: string }
type GeneratorReply = (body: GeneratorCall, url: string) => Response
const generator = {
  calls: [] as Array<{ url: string; body: GeneratorCall }>,
  reply: (() => Response.json({ success: true, svg: SVG, pluginErrors: {}, hasErrors: false })) as GeneratorReply,
}
const SVG_GENERATOR = {
  fetch: async (url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body))
    generator.calls.push({ url, body })
    return generator.reply(body, url)
  },
}

describe("GET /api/preview, on a real D1", { timeout: 60_000 }, () => {
  let proxy: Awaited<ReturnType<typeof getPlatformProxy<CloudflareEnv>>>
  let env: CloudflareEnv

  beforeAll(async () => {
    proxy = await getPlatformProxy<CloudflareEnv>({ configPath: "wrangler.toml", persist: false })
    env = { ...proxy.env, SVG_GENERATOR } as unknown as CloudflareEnv
    const dir = path.join(__dirname, "../../drizzle")
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      for (const statement of readFileSync(path.join(dir, file), "utf-8").split("--> statement-breakpoint")) {
        if (statement.trim()) await env.DB.prepare(statement).run()
      }
    }
  }, 120_000)

  afterAll(async () => {
    await proxy?.dispose()
  })

  beforeEach(async () => {
    cacheStore.clear()
    generator.calls.length = 0
    generator.reply = () => Response.json({ success: true, svg: SVG, pluginErrors: {}, hasErrors: false })
    await env.DB.prepare("DELETE FROM preview_hits").run()
  })

  async function preview(query: string, ip = "203.0.113.7") {
    const { onRequestGet } = await import("./preview")
    const pending: Promise<unknown>[] = []
    const request = new Request(`https://weebprofile.test/api/preview?${query}`, {
      headers: { "CF-Connecting-IP": ip },
    })
    const response = (await onRequestGet({
      request,
      env,
      waitUntil: (promise: Promise<unknown>) => void pending.push(promise),
    } as never)) as unknown as Response
    // The cache write happens in waitUntil; settle it before the next request.
    await Promise.all(pending)
    return response
  }

  async function hits(): Promise<Array<{ bucket: string; count: number }>> {
    const { results } = await env.DB.prepare("SELECT bucket, count FROM preview_hits ORDER BY bucket").all()
    return results as Array<{ bucket: string; count: number }>
  }

  const codewars = "plugin=codewars&username=g964&style=default&theme=default&size=half"

  describe("input", () => {
    it.each([
      ["an unknown plugin", "plugin=lyfta&username=someone"],
      ["a plugin that needs a user secret", "plugin=lastfm&username=someone"],
      ["no username", "plugin=codewars"],
      ["a username with markup", "plugin=codewars&username=%3Cscript%3E"],
      ["a theme from the other style", "plugin=codewars&username=g964&style=default&theme=dracula"],
      ["a size that does not exist", "plugin=codewars&username=g964&size=huge"],
      ["Steam input that is not a profile", "plugin=steam&username=https://example.com/someone"],
    ])("answers 400 to %s, before the cache, the limit or the generator", async (_case, query) => {
      const response = await preview(query)

      expect(response.status).toBe(400)
      expect(((await response.json()) as { code: string }).code).toBe("INVALID_PREVIEW_REQUEST")
      expect(generator.calls).toHaveLength(0)
      expect(await hits()).toHaveLength(0)
    })

    it("sends the generator only the whitelisted fields, whatever else the query carries", async () => {
      const response = await preview(
        `${codewars}&userId=user_1&essentialConfigs=%7B%7D&debug=true&mock=true&customCss=x&sections=code_habits`
      )

      expect(response.status).toBe(200)
      expect(generator.calls).toHaveLength(1)
      expect(generator.calls[0]!.body).toEqual({
        preview: true,
        style: "default",
        size: "half",
        theme: "default",
        pluginsOrder: ["codewars"],
        plugins: {
          codewars: { enabled: true, sections: [...PREVIEW_PLUGINS.codewars.sections], username: "g964" },
        },
        hideTerminalEmojis: false,
        hideTerminalHeader: false,
        hideTerminalCommand: false,
        fontFamily: "poppins",
      })
    })
  })

  describe("the card", () => {
    it("is the generator's SVG, served as an image that cannot run script", async () => {
      const response = await preview(codewars)

      expect(response.status).toBe(200)
      expect(await response.text()).toBe(SVG)
      expect(response.headers.get("Content-Type")).toBe("image/svg+xml; charset=utf-8")
      expect(response.headers.get("Content-Security-Policy")).toContain("default-src 'none'")
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(response.headers.get("X-Preview-Cache")).toBe("MISS")
    })

    it("carries nothing from the generator's JSON but the SVG", async () => {
      generator.reply = () =>
        Response.json({ success: true, svg: SVG, pluginErrors: {}, debug: { essentialConfigs: "ghp_secret" } })

      const text = await (await preview(codewars)).text()

      expect(text).toBe(SVG)
      expect(text).not.toContain("ghp_secret")
    })
  })

  describe("cache", () => {
    it("serves the second request from the cache: no generator call and no D1 write", async () => {
      await preview(codewars)
      const before = await hits()

      // Same account, different case: the same card.
      const second = await preview(codewars.replace("g964", "G964"))

      expect(second.status).toBe(200)
      expect(second.headers.get("X-Preview-Cache")).toBe("HIT")
      expect(await second.text()).toBe(SVG)
      expect(generator.calls).toHaveLength(1)
      expect(await hits()).toEqual(before)
    })

    it("keys on style and theme, which change the card", async () => {
      await preview(codewars)
      await preview(codewars.replace("theme=default", "theme=purple"))
      await preview(codewars.replace("style=default", "style=terminal"))

      expect(generator.calls).toHaveLength(3)
    })

    it("does not cache an account that was not found", async () => {
      generator.reply = () =>
        Response.json({
          success: true,
          svg: SVG,
          hasErrors: true,
          pluginErrors: { codewars: 'Codewars user "nobody" not found' },
        })

      const first = await preview(codewars)
      const second = await preview(codewars)

      expect(first.status).toBe(404)
      expect(((await first.json()) as { code: string }).code).toBe("PREVIEW_USER_NOT_FOUND")
      expect(second.status).toBe(404)
      expect(generator.calls).toHaveLength(2)
    })

    it("tells a private profile apart from a missing one", async () => {
      generator.reply = () =>
        Response.json({
          success: true,
          svg: SVG,
          hasErrors: true,
          pluginErrors: { anilist: 'AniList profile "someone" is private. Make it public to show it here.' },
        })

      const response = await preview("plugin=anilist&username=someone")

      expect(response.status).toBe(404)
      expect(((await response.json()) as { code: string }).code).toBe("PREVIEW_PROFILE_PRIVATE")
    })

    it("does not cache a degraded card, and answers 502 without the plugin's message", async () => {
      generator.reply = () =>
        Response.json({
          success: true,
          svg: SVG,
          hasErrors: true,
          pluginErrors: { codewars: "Codewars API failed: HTTP 503" },
        })

      const response = await preview(codewars)
      await preview(codewars)

      expect(response.status).toBe(502)
      const body = (await response.json()) as { code: string; message: string }
      expect(body.code).toBe("PREVIEW_UPSTREAM_FAILED")
      expect(body.message).not.toContain("HTTP 503")
      expect(generator.calls).toHaveLength(2)
    })
  })

  describe("rate limit", () => {
    const nthCodewars = (n: number) => codewars.replace("g964", `user${n}`)

    it(`allows ${PREVIEW_LIMITS.ip.max} misses per IP, then answers 429 with Retry-After`, async () => {
      for (let n = 1; n <= PREVIEW_LIMITS.ip.max; n++) {
        expect((await preview(nthCodewars(n))).status).toBe(200)
      }

      const refused = await preview(nthCodewars(PREVIEW_LIMITS.ip.max + 1))

      expect(refused.status).toBe(429)
      expect(((await refused.json()) as { code: string }).code).toBe("PREVIEW_RATE_LIMITED")
      const retryAfter = Number(refused.headers.get("Retry-After"))
      expect(retryAfter).toBeGreaterThan(PREVIEW_LIMITS.ip.windowSeconds - 30)
      expect(retryAfter).toBeLessThanOrEqual(PREVIEW_LIMITS.ip.windowSeconds)
      expect(generator.calls).toHaveLength(PREVIEW_LIMITS.ip.max)
    })

    it("still serves a cached card to an IP over its limit", async () => {
      await preview(codewars, "198.51.100.1")
      for (let n = 1; n <= PREVIEW_LIMITS.ip.max; n++) await preview(nthCodewars(n))

      expect((await preview(nthCodewars(99))).status).toBe(429)
      expect((await preview(codewars)).status).toBe(200)
    })

    it("counts each IP separately", async () => {
      for (let n = 1; n <= PREVIEW_LIMITS.ip.max; n++) await preview(nthCodewars(n), "203.0.113.7")

      expect((await preview(nthCodewars(50), "203.0.113.8")).status).toBe(200)
    })

    it("refuses everyone once the global budget is spent", async () => {
      const now = new Date().toISOString()
      await env.DB.prepare("INSERT INTO preview_hits (bucket, window_start, count) VALUES ('global', ?, ?)")
        .bind(now, PREVIEW_LIMITS.global.max)
        .run()

      const refused = await preview(codewars, "192.0.2.44")

      expect(refused.status).toBe(429)
      expect(Number(refused.headers.get("Retry-After"))).toBeGreaterThan(PREVIEW_LIMITS.global.windowSeconds - 30)
      expect(generator.calls).toHaveLength(0)
    })

    it("starts a new window once the old one has ended", async () => {
      const ended = new Date(Date.now() - (PREVIEW_LIMITS.ip.windowSeconds + 60) * 1000).toISOString()
      const bucket = await ipBucket("203.0.113.7")
      await env.DB.prepare("INSERT INTO preview_hits (bucket, window_start, count) VALUES (?, ?, ?)")
        .bind(bucket, ended, PREVIEW_LIMITS.ip.max)
        .run()

      const response = await preview(codewars)

      expect(response.status).toBe(200)
      expect((await hits()).find((row) => row.bucket === bucket)?.count).toBe(1)
    })

    it("does not store the address itself", async () => {
      await preview(codewars, "203.0.113.7")

      expect(JSON.stringify(await hits())).not.toContain("203.0.113.7")
    })
  })

  describe("platforms", () => {
    it("answers 503 when the generator has no GitHub preview token", async () => {
      generator.reply = () =>
        Response.json(
          { error: "MISSING_REQUIRED_CONFIG", code: "MISSING_REQUIRED_SECRETS", message: "Missing", missing: [] },
          { status: 400 }
        )

      const response = await preview("plugin=github&username=torvalds")

      expect(response.status).toBe(503)
      expect(((await response.json()) as { code: string }).code).toBe("PREVIEW_UNAVAILABLE")
    })

    it("resolves a Steam vanity name through the generator, then renders by SteamID64", async () => {
      generator.reply = (_body, url) =>
        url.endsWith("/steam/resolve-vanity")
          ? Response.json({ steamId: "76561197960287930" })
          : Response.json({ success: true, svg: SVG, pluginErrors: {} })

      const response = await preview("plugin=steam&username=https://steamcommunity.com/id/gabelogannewell")

      expect(response.status).toBe(200)
      expect(generator.calls.map((call) => call.url)).toEqual([
        "https://svg-generator/steam/resolve-vanity",
        "https://svg-generator/",
      ])
      expect(generator.calls[1]!.body.plugins.steam.steamId).toBe("76561197960287930")
    })

    it("answers 404 when Steam does not know the vanity name", async () => {
      generator.reply = () => Response.json({ steamId: null })

      const response = await preview("plugin=steam&username=nobody_here_at_all")

      expect(response.status).toBe(404)
      expect(generator.calls).toHaveLength(1)
    })
  })

  it("builds the same body generatorBody does", () => {
    const body = generatorBody(
      { plugin: "steam", username: "x", style: "terminal", theme: "dracula", size: "full" },
      "76561197960287930"
    )
    expect(body.plugins.steam).toEqual({
      enabled: true,
      sections: ["statistics", "top_games"],
      steamId: "76561197960287930",
    })
  })
})
