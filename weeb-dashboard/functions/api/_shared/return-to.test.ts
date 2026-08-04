import { describe, it, expect } from "vitest"
import { safeReturnTo } from "./return-to"

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
