import { describe, it, expect, vi } from "vitest"

const storedSvg = `<svg xmlns="http://www.w3.org/2000/svg"><style>a{}<script>alert(1)</script></style></svg>`

vi.mock("../_shared/db", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [{ id: "svg-1", status: "completed", storageUrl: "https://r2.example/svgs/svg-1.svg" }],
        }),
      }),
    }),
  }),
}))

vi.mock("../_shared/storage", () => ({ getSvgFromR2: async () => storedSvg }))

describe("GET /api/svg/:id", () => {
  it("serves the stored SVG in a sandbox, so a script in it cannot run on the dashboard origin", async () => {
    // Imported here, not at the top level: the Pages build compiles every file under
    // functions/, tests included, for ES2020, where top-level await is a build error.
    const { onRequestGet } = await import("./[id]")
    const response = await onRequestGet({ env: {}, params: { id: "svg-1" } } as never)
    const csp = response.headers.get("Content-Security-Policy") ?? ""

    expect(response.status).toBe(200)
    expect(await response.text()).toBe(storedSvg)
    expect(csp).toMatch(/(^|;\s*)sandbox(;|$)/)
    expect(csp).toContain("default-src 'none'")
    expect(csp).not.toContain("script-src")
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
  })
})
