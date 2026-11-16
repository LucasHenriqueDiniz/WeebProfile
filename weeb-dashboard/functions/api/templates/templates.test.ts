import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getPlatformProxy } from "wrangler"
import type { CloudflareEnv } from "../_shared/auth"

// Only Clerk is replaced. The routes run against a local D1 (workerd's SQLite) built
// from the same migrations production applies.
const clerk = vi.hoisted(() => ({ userId: null as string | null }))
vi.mock("../_shared/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../_shared/auth")>()),
  getAuthUserId: async () => clerk.userId,
}))

const AUTHOR = "user_author"
const TEMPLATE_ID = "template-with-identity"

// What an author's saved config looks like: their own usernames and typed content
// next to the layout. Everything but the layout has to stay behind.
const AUTHOR_PLUGINS_CONFIG = {
  github: {
    enabled: true,
    username: "author-gh",
    sections: ["profile", "introduction", "not_a_section"],
    sectionConfigs: {
      introduction: { introduction_custom_text: "Hi, I am the author", introduction_hide_title: true },
    },
    apiKey: "pasted-by-mistake",
  },
  github_repo: { enabled: true, owner: "author-gh", repo: "secret-project", sections: ["banner"] },
  stackoverflow: { enabled: true, userId: "123456", sections: ["reputation"] },
}
const AUTHOR_UI_CONFIG = { hideTerminalHeader: false, terminalHeaderText: "author@home:~", fontFamily: "inter" }

const LAYOUT = {
  github: {
    enabled: true,
    sections: ["profile", "introduction"],
    sectionConfigs: { introduction: { introduction_hide_title: true } },
  },
  github_repo: { enabled: true, sections: ["banner"], sectionConfigs: {} },
  stackoverflow: { enabled: true, sections: ["reputation"], sectionConfigs: {} },
}

describe("template routes on a real D1", { timeout: 60_000 }, () => {
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
    await env.DB.prepare(
      "INSERT INTO templates (id, user_id, name, svg_id, plugins_config, ui_config, plugins_order, is_public, created_at) VALUES (?, ?, 'Mine', 'svg-of-author', ?, ?, 'github,github_repo,stackoverflow', 1, ?)"
    )
      .bind(
        TEMPLATE_ID,
        AUTHOR,
        JSON.stringify(AUTHOR_PLUGINS_CONFIG),
        JSON.stringify(AUTHOR_UI_CONFIG),
        new Date().toISOString()
      )
      .run()
  }, 60_000)

  afterAll(async () => {
    await proxy?.dispose()
  })

  beforeEach(() => {
    clerk.userId = null
  })

  async function getOne(): Promise<Record<string, any>> {
    const { onRequestGet } = await import("./[id]")
    const request = new Request(`http://local/api/templates/${TEMPLATE_ID}`)
    const response = await onRequestGet({ request, env, params: { id: TEMPLATE_ID } } as never)
    expect(response.status).toBe(200)
    return ((await response.json()) as { template: Record<string, any> }).template
  }

  async function list(query = ""): Promise<Record<string, any>> {
    const { onRequestGet } = await import("./index")
    const request = new Request(`http://local/api/templates${query}`)
    const response = await onRequestGet({ request, env } as never)
    expect(response.status).toBe(200)
    const { templates } = (await response.json()) as { templates: Record<string, any>[] }
    return templates.find((t) => t.id === TEMPLATE_ID)!
  }

  function expectLayoutOnly(template: Record<string, any>) {
    expect(template.pluginsConfig).toEqual(LAYOUT)
    expect(template.uiConfig).toEqual({ hideTerminalHeader: false, fontFamily: "inter" })
    expect(template).not.toHaveProperty("userId")
    expect(template).not.toHaveProperty("svgId")
    expect(JSON.stringify(template)).not.toMatch(/author|secret-project|123456|pasted-by-mistake/)
  }

  it("GET /api/templates/:id gives a visitor the layout and nothing of the author", async () => {
    expectLayoutOnly(await getOne())
  })

  it("GET /api/templates/:id gives another signed-in user the same", async () => {
    clerk.userId = "user_someone_else"
    expectLayoutOnly(await getOne())
  })

  it("GET /api/templates?public=true lists it the same way", async () => {
    expectLayoutOnly(await list("?public=true"))
  })

  it("GET /api/templates lists another user's public template the same way", async () => {
    clerk.userId = "user_someone_else"
    expectLayoutOnly(await list())
  })

  it("the author still gets their own template whole", async () => {
    clerk.userId = AUTHOR
    for (const template of [await getOne(), await list()]) {
      expect(template.pluginsConfig).toEqual(AUTHOR_PLUGINS_CONFIG)
      expect(template.uiConfig).toEqual(AUTHOR_UI_CONFIG)
      expect(template.userId).toBe(AUTHOR)
      expect(template.svgId).toBe("svg-of-author")
    }
  })
})
