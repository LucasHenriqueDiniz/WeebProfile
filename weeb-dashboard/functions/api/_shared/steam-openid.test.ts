import { describe, it, expect } from "vitest"
import { buildAuthUrl, parseClaimedId, buildVerificationBody, isVerified } from "./steam-openid"

describe("buildAuthUrl", () => {
  const url = () => new URL(buildAuthUrl("https://app.test/api/auth/steam/callback?state=abc", "https://app.test"))

  it("points at Steam's OpenID endpoint", () => {
    expect(url().origin + url().pathname).toBe("https://steamcommunity.com/openid/login")
  })

  it("asks Steam to identify the user, since we do not know who they are yet", () => {
    const params = url().searchParams
    expect(params.get("openid.identity")).toBe("http://specs.openid.net/auth/2.0/identifier_select")
    expect(params.get("openid.claimed_id")).toBe("http://specs.openid.net/auth/2.0/identifier_select")
    expect(params.get("openid.mode")).toBe("checkid_setup")
  })

  it("preserves the state carried in return_to", () => {
    expect(url().searchParams.get("openid.return_to")).toContain("state=abc")
  })
})

describe("parseClaimedId", () => {
  it("extracts a SteamID64", () => {
    expect(parseClaimedId("https://steamcommunity.com/openid/id/76561198000000000")).toBe("76561198000000000")
  })

  // Each of these is a way a forged callback could try to smuggle in an id.
  it.each([
    ["null", null],
    ["empty", ""],
    ["a different host", "https://evil.example/openid/id/76561198000000000"],
    ["http rather than https", "http://steamcommunity.com/openid/id/76561198000000000"],
    ["a path prefix that only looks right", "https://steamcommunity.com/openid/id2/76561198000000000"],
    ["too few digits", "https://steamcommunity.com/openid/id/7656119800000"],
    ["too many digits", "https://steamcommunity.com/openid/id/765611980000000001"],
    ["non-numeric", "https://steamcommunity.com/openid/id/abcdefghijklmnopq"],
    ["a traversal attempt", "https://steamcommunity.com/openid/id/../76561198000000000"],
  ])("rejects %s", (_label, claimed) => {
    expect(parseClaimedId(claimed)).toBeNull()
  })
})

describe("buildVerificationBody", () => {
  const incoming = () =>
    new URLSearchParams({
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "id_res",
      "openid.sig": "signature",
      "openid.signed": "mode,claimed_id",
      "openid.claimed_id": "https://steamcommunity.com/openid/id/76561198000000000",
      state: "abc",
      unrelated: "x",
    })

  it("switches the mode to check_authentication", () => {
    expect(buildVerificationBody(incoming()).get("openid.mode")).toBe("check_authentication")
  })

  // The signature covers the openid.* parameters, so altering or dropping any of
  // them would make Steam answer is_valid:false for a request that was genuine.
  it("echoes every openid parameter unchanged", () => {
    const body = buildVerificationBody(incoming())
    expect(body.get("openid.sig")).toBe("signature")
    expect(body.get("openid.signed")).toBe("mode,claimed_id")
    expect(body.get("openid.claimed_id")).toBe("https://steamcommunity.com/openid/id/76561198000000000")
  })

  it("drops parameters that are not part of the assertion", () => {
    const keys = [...buildVerificationBody(incoming()).keys()]
    expect(keys).not.toContain("state")
    expect(keys).not.toContain("unrelated")
  })
})

describe("isVerified", () => {
  it("accepts an explicit is_valid:true", () => {
    expect(isVerified("ns:http://specs.openid.net/auth/2.0\nis_valid:true\n")).toBe(true)
  })

  it("tolerates trailing whitespace on the line", () => {
    expect(isVerified("is_valid:true  \n")).toBe(true)
  })

  // Anything other than an explicit true has to fail: a permissive check here
  // would make the whole verification step decorative.
  it.each([
    ["is_valid:false", "ns:http://specs.openid.net/auth/2.0\nis_valid:false\n"],
    ["an empty body", ""],
    ["an unrelated body", "some error page"],
    ["the substring inside another value", "note:is_valid:true_but_not_really"],
    ["a truthy-looking variant", "is_valid: true"],
  ])("rejects %s", (_label, body) => {
    expect(isVerified(body)).toBe(false)
  })
})
