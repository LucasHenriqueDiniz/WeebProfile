import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { forgetReturnTo, readReturnTo, safeReturnTo, withReturnTo } from "./return-to"

const ORIGIN = "https://app.test"
const FALLBACK = "/dashboard/settings"

describe("safeReturnTo", () => {
  it("keeps a same-origin path", () => {
    expect(safeReturnTo("/dashboard/new/profile", ORIGIN, FALLBACK)).toBe("/dashboard/new/profile")
  })

  it("keeps query and hash", () => {
    expect(safeReturnTo("/wizard?step=2#steam", ORIGIN, FALLBACK)).toBe("/wizard?step=2#steam")
  })

  it("accepts an absolute URL on our own origin, returning just the path", () => {
    expect(safeReturnTo(`${ORIGIN}/dashboard`, ORIGIN, FALLBACK)).toBe("/dashboard")
  })

  it("falls back when absent", () => {
    expect(safeReturnTo(null, ORIGIN, FALLBACK)).toBe(FALLBACK)
    expect(safeReturnTo("", ORIGIN, FALLBACK)).toBe(FALLBACK)
  })

  // Each of these is a way an open redirect gets through a prefix check. The
  // callback runs after a successful login, so a redirect off-origin would hand
  // an attacker a landing page arriving straight from our domain.
  it.each([
    ["another origin", "https://evil.example/steal"],
    ["protocol-relative", "//evil.example/steal"],
    ["backslash-relative", "/\\evil.example/steal"],
    ["a different scheme", "javascript:alert(1)"],
    ["data URI", "data:text/html,<script>alert(1)</script>"],
    ["our host as a prefix of theirs", "https://app.test.evil.example/steal"],
    ["userinfo trick", "https://app.test@evil.example/steal"],
  ])("rejects %s", (_label, candidate) => {
    expect(safeReturnTo(candidate, ORIGIN, FALLBACK)).toBe(FALLBACK)
  })
})

describe("readReturnTo", () => {
  const store = new Map<string, string>()
  const sessionStorageStub = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  }
  const at = (pathname: string, search = "") => ({ pathname, search, origin: ORIGIN })

  beforeEach(() => {
    store.clear()
    vi.stubGlobal("sessionStorage", sessionStorageStub)
  })
  afterEach(() => vi.unstubAllGlobals())

  it("reads return_to from the query", () => {
    expect(readReturnTo(at("/signup", "?return_to=%2Fdashboard%2Fnew%2Fprofile%3Fsource%3Dpreview"))).toBe(
      "/dashboard/new/profile?source=preview"
    )
  })

  it("refuses another origin", () => {
    expect(readReturnTo(at("/login", "?return_to=https%3A%2F%2Fevil.example%2F"))).toBeNull()
  })

  // Clerk's /signup/verify-email-address mounts the page again without our query.
  it("remembers it for Clerk's sub-routes, which drop the query", () => {
    readReturnTo(at("/signup", "?return_to=%2Fdashboard%2Fnew%2Fprofile"))
    expect(readReturnTo(at("/signup/verify-email-address"))).toBe("/dashboard/new/profile")
  })

  it("drops a remembered one on a fresh /login without return_to", () => {
    readReturnTo(at("/signup", "?return_to=%2Fdashboard%2Fnew%2Fprofile"))
    expect(readReturnTo(at("/login"))).toBeNull()
    expect(readReturnTo(at("/login/factor-one"))).toBeNull()
  })

  it("forgets it once used", () => {
    readReturnTo(at("/signup", "?return_to=%2Fdashboard"))
    forgetReturnTo()
    expect(readReturnTo(at("/signup/continue"))).toBeNull()
  })

  it("builds the links between /login and /signup", () => {
    expect(withReturnTo("/signup", "/dashboard/new/profile?a=1&b=2")).toBe(
      "/signup?return_to=%2Fdashboard%2Fnew%2Fprofile%3Fa%3D1%26b%3D2"
    )
    expect(withReturnTo("/signup", null)).toBe("/signup")
  })
})
