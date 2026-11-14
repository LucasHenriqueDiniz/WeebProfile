import { describe, it, expect, vi, beforeEach } from "vitest"

const storedSvg = `<svg xmlns="http://www.w3.org/2000/svg"><style>a{}<script>alert(1)</script></style></svg>`

const state = vi.hoisted(() => ({
  row: { id: "svg-1", status: "completed" } as { id: string; status: string } | null,
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
  state.row = { id: "svg-1", status: "completed" }
  state.stored = storedSvg
  state.readIds.length = 0
})

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
    state.row = { id: "svg-1", status }
    const response = await get("svg-1")
    expect(response.status).toBe(200)
    expect(await response.text()).toBe(storedSvg)
  })

  it("answers 404 while nothing has been generated yet", async () => {
    state.row = { id: "svg-1", status: "pending" }
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

  it("is the handler behind /svg/:id.svg", async () => {
    const alias = await import("../../svg/[id]")
    const route = await import("./[id]")
    expect(alias.onRequestGet).toBe(route.onRequestGet)
  })
})
