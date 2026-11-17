import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const storedSvg = `<svg xmlns="http://www.w3.org/2000/svg"><style>a{}<script>alert(1)</script></style></svg>`

type Row = { id: string; status: string; lastGeneratedAt: string | null }

const state = vi.hoisted(() => ({
  row: null as Row | null,
  stored: null as string | null,
  readIds: [] as string[],
}))

vi.mock("../_shared/db", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (state.row ? [state.row] : []),
        }),
      }),
    }),
  }),
}))

vi.mock("../_shared/storage", () => ({
  getSvgFromR2: async (_env: unknown, id: string) => {
    state.readIds.push(id)
    return state.stored
  },
}))

beforeEach(() => {
  state.row = { id: "svg-1", status: "completed", lastGeneratedAt: "2026-11-17T03:07:06.688Z" }
  state.stored = storedSvg
  state.readIds.length = 0
})

/** Every header but Server-Timing, whose durations differ between two calls. */
const withoutTiming = (response: Response) => [...response.headers].filter(([name]) => name !== "server-timing")

// Imported inside each test, not at the top level: the Pages build compiles every file
// under functions/, tests included, for ES2020, where top-level await is a build error.
const get = async (id: string) => {
  const { onRequestGet } = await import("./[id]")
  return onRequestGet({ env: {}, params: { id } } as never)
}

describe("GET /api/svg/:id", () => {
  it("serves the stored SVG in a sandbox, so a script in it cannot run on the dashboard origin", async () => {
    const response = await get("svg-1")
    const csp = response.headers.get("Content-Security-Policy") ?? ""

    expect(response.status).toBe(200)
    expect(await response.text()).toBe(storedSvg)
    expect(csp).toMatch(/(^|;\s*)sandbox(;|$)/)
    expect(csp).toContain("default-src 'none'")
    expect(csp).not.toContain("script-src")
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
  })

  // This is the address pasted in READMEs. A regeneration passes through "generating"
  // and a failed one ends in "failed", with the last good SVG still in R2.
  it.each(["generating", "failed", "pending"])("keeps serving the last SVG while the status is %s", async (status) => {
    state.row = { ...state.row!, status }
    const response = await get("svg-1")
    expect(response.status).toBe(200)
    expect(await response.text()).toBe(storedSvg)
  })

  it("answers 404 while nothing has been generated yet", async () => {
    state.row = { id: "svg-1", status: "pending", lastGeneratedAt: null }
    state.stored = null
    expect((await get("svg-1")).status).toBe(404)
  })

  it("answers 404 for an unknown id without reading R2", async () => {
    state.row = null
    expect((await get("nope")).status).toBe(404)
    expect(state.readIds).toEqual([])
  })

  it("accepts the .svg suffix the README address carries", async () => {
    expect((await get("svg-1.svg")).status).toBe(200)
    expect(state.readIds).toEqual(["svg-1"])
  })

  // The animations play when the browser decodes the image, so a reload has to fetch a
  // fresh copy; camo's cache keeps the origin at one request per minute (s-maxage).
  it("makes the browser fetch the card again on reload, while camo keeps it a minute", async () => {
    const response = await get("svg-1.svg")
    const directives = new Map(
      (response.headers.get("Cache-Control") ?? "").split(",").map((part) => {
        const [name, value] = part.trim().toLowerCase().split("=")
        return [name, value] as const
      })
    )

    expect(directives.has("no-cache")).toBe(true)
    expect(Number(directives.get("max-age") ?? 0)).toBe(0)
    expect(Number(directives.get("s-maxage"))).toBeGreaterThanOrEqual(60)
    // A 304 keeps the image at rest in WebKit.
    expect(response.headers.get("ETag")).toBeNull()
    expect(response.headers.get("Last-Modified")).toBeNull()
  })

  it("is the handler behind /svg/:id.svg, for GET and HEAD", async () => {
    const alias = await import("../../svg/[id]")
    const route = await import("./[id]")
    expect(alias.onRequestGet).toBe(route.onRequestGet)
    expect(alias.onRequestHead).toBe(route.onRequestHead)
  })
})

describe("GET /api/svg/:id with the edge cache", () => {
  // caches.default as a Worker sees it: one store per colo, keyed by URL.
  const store = new Map<string, Response>()
  const fakeCache = {
    match: async (key: string) => store.get(key)?.clone(),
    put: async (key: string, response: Response) => void store.set(key, response),
  }

  beforeEach(() => {
    store.clear()
    vi.stubGlobal("caches", { default: fakeCache })
  })
  afterEach(() => vi.unstubAllGlobals())

  const getAtEdge = async (id: string) => {
    const { onRequestGet } = await import("./[id]")
    const pending: Promise<unknown>[] = []
    const response = await onRequestGet({
      env: {},
      params: { id },
      request: new Request(`https://dash.example/svg/${id}`),
      waitUntil: (promise: Promise<unknown>) => void pending.push(promise),
    } as never)
    await Promise.all(pending)
    return response
  }

  // camo comes back for the card every minute; R2 was about half of this route's time.
  it("reads R2 once per generation, then serves the copy at the edge", async () => {
    const first = await getAtEdge("svg-1.svg")
    const second = await getAtEdge("svg-1.svg")

    expect(await first.text()).toBe(storedSvg)
    expect(await second.text()).toBe(storedSvg)
    expect(state.readIds).toEqual(["svg-1"])
    expect(first.headers.get("Server-Timing")).toContain("edge;desc=miss")
    expect(second.headers.get("Server-Timing")).toContain("edge;desc=hit")
  })

  it("answers from the edge with the same headers as from R2: sandbox, no-cache, no ETag", async () => {
    const fromR2 = await getAtEdge("svg-1.svg")
    const fromEdge = await getAtEdge("svg-1.svg")

    expect(withoutTiming(fromEdge)).toEqual(withoutTiming(fromR2))
    expect(fromEdge.headers.get("ETag")).toBeNull()
  })

  it("serves the new SVG as soon as the card is generated again", async () => {
    await getAtEdge("svg-1.svg")
    state.stored = `<svg xmlns="http://www.w3.org/2000/svg"><text>regenerated</text></svg>`
    state.row = { ...state.row!, lastGeneratedAt: "2026-11-17T12:06:19.675Z" }

    expect(await (await getAtEdge("svg-1.svg")).text()).toBe(state.stored)
    expect(state.readIds).toEqual(["svg-1", "svg-1"])
  })

  it("stops serving a deleted card, copy at the edge or not", async () => {
    await getAtEdge("svg-1.svg")
    state.row = null

    expect((await getAtEdge("svg-1.svg")).status).toBe(404)
  })

  it("keeps nothing for a card with no generation recorded", async () => {
    state.row = { ...state.row!, lastGeneratedAt: null }
    await getAtEdge("svg-1.svg")
    await getAtEdge("svg-1.svg")

    expect(state.readIds).toEqual(["svg-1", "svg-1"])
    expect(store.size).toBe(0)
  })
})

describe("HEAD /api/svg/:id", () => {
  const head = async (id: string) => {
    const { onRequestHead } = await import("./[id]")
    return onRequestHead({ env: {}, params: { id } } as never)
  }

  // Without a HEAD handler, Pages answered HEAD from the SPA fallback: 200 text/html.
  it("answers with GET's status and headers, and no body", async () => {
    const [headResponse, getResponse] = [await head("svg-1.svg"), await get("svg-1.svg")]
    expect(headResponse.status).toBe(200)
    expect(headResponse.headers.get("Content-Type")).toBe("image/svg+xml")
    expect(withoutTiming(headResponse)).toEqual(withoutTiming(getResponse))
    expect(headResponse.body).toBeNull()
  })

  it("answers 404 for an unknown id", async () => {
    state.row = null
    const response = await head("nope.svg")
    expect(response.status).toBe(404)
    expect(response.body).toBeNull()
  })
})
