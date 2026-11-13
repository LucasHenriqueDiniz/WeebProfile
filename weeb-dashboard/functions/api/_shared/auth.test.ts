import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import type { CloudflareEnv } from "./auth"

/**
 * These run the real @clerk/backend. The bug was in how its answers were read, so a
 * mocked Clerk would only test our reading of a mock. The one thing faked is the
 * network: the JWKS endpoint, serving a key generated here.
 */

const PUBLISHABLE_KEY = "pk_test_" + btoa("example.clerk.accounts.dev$")
const env = { CLERK_SECRET_KEY: "sk_test_fake", NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: PUBLISHABLE_KEY } as CloudflareEnv

let jwks: () => Response = () => Response.json({ keys: [] })
const fetched: string[] = []
let getAuthUserId: typeof import("./auth").getAuthUserId

beforeAll(async () => {
  // @clerk/backend binds fetch when it loads (fetch.bind(globalThis)), so the stub has
  // to be in place before the import -- which is why this is not a top-level import.
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = input instanceof Request ? input.url : String(input)
    fetched.push(url)
    if (new URL(url).pathname === "/v1/jwks") return jwks()
    throw new Error(`unexpected fetch in auth tests: ${url}`)
  })
  ;({ getAuthUserId } = await import("./auth"))
})

afterEach(() => {
  vi.restoreAllMocks()
  fetched.length = 0
})

interface SigningKey {
  kid: string
  privateKey: CryptoKey
  jwk: JsonWebKey & { kid: string }
}

async function signingKey(kid: string): Promise<SigningKey> {
  const pair = (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair
  const jwk = {
    ...((await crypto.subtle.exportKey("jwk", pair.publicKey)) as JsonWebKey),
    kid,
    alg: "RS256",
    use: "sig",
  }
  return { kid, privateKey: pair.privateKey, jwk }
}

function base64url(bytes: Uint8Array): string {
  let binary = ""
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

const encodeJson = (value: unknown) => base64url(new TextEncoder().encode(JSON.stringify(value)))

async function sessionToken(key: SigningKey, claims: Record<string, unknown> = {}): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = encodeJson({ alg: "RS256", typ: "JWT", kid: key.kid })
  const payload = encodeJson({
    sub: "user_123",
    sid: "sess_123",
    iss: "https://example.clerk.accounts.dev",
    iat: now - 10,
    nbf: now - 10,
    exp: now + 60,
    ...claims,
  })
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key.privateKey,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  return `${header}.${payload}.${base64url(new Uint8Array(signature))}`
}

const request = (headers: Record<string, string> = {}) => new Request("https://weebprofile.test/api/svgs", { headers })
const bearer = (token: string) => request({ Authorization: `Bearer ${token}` })

describe("getAuthUserId: the caller is not signed in, so null and the route answers 401", () => {
  it("returns the user id for a valid session token", async () => {
    const key = await signingKey("kid-valid")
    jwks = () => Response.json({ keys: [key.jwk] })

    expect(await getAuthUserId(bearer(await sessionToken(key)), env)).toBe("user_123")
  })

  it("returns null with no credentials at all", async () => {
    expect(await getAuthUserId(request(), env)).toBeNull()
  })

  it("returns null for an expired token", async () => {
    const key = await signingKey("kid-expired")
    jwks = () => Response.json({ keys: [key.jwk] })
    const past = Math.floor(Date.now() / 1000) - 3600

    expect(
      await getAuthUserId(bearer(await sessionToken(key, { iat: past, nbf: past, exp: past + 60 })), env)
    ).toBeNull()
  })

  it("returns null for a token signed by someone else's key under a known kid", async () => {
    const ours = await signingKey("kid-forged")
    const theirs = await signingKey("kid-forged")
    jwks = () => Response.json({ keys: [ours.jwk] })

    expect(await getAuthUserId(bearer(await sessionToken(theirs)), env)).toBeNull()
  })

  it("returns null for a token whose kid is not in our JWKS", async () => {
    const ours = await signingKey("kid-ours")
    const stranger = await signingKey("kid-from-another-instance")
    jwks = () => Response.json({ keys: [ours.jwk] })

    expect(await getAuthUserId(bearer(await sessionToken(stranger)), env)).toBeNull()
  })

  // The two below must not become 500s: anyone can send them, and each 500 is a row
  // in error_log. Clerk reports the first as "unexpected-error" -- the same reason
  // as a network failure -- and throws a SyntaxError on the second.
  it.each(["x.y.z", "not-a-jwt", "e30.e30.%%%"])(
    "returns null for a bearer token that does not decode: %s",
    async (token) => {
      expect(await getAuthUserId(bearer(token), env)).toBeNull()
    }
  )

  it("returns null for a session cookie that does not decode", async () => {
    const cookie = `__client_uat=${Math.floor(Date.now() / 1000) - 60}; __session=x.y.z`

    expect(await getAuthUserId(request({ Cookie: cookie }), env)).toBeNull()
  })
})

describe("getAuthUserId: we cannot tell, so it throws and the route answers 500", () => {
  // Clerk retries the JWKS fetch five times with backoff, 2-4 s in all. Skip the wait.
  const skipRetryWait = () =>
    vi.spyOn(globalThis, "setTimeout").mockImplementation(((callback: () => void) => {
      callback()
      return 0
    }) as unknown as typeof setTimeout)

  it("throws when the JWKS endpoint fails", async () => {
    skipRetryWait()
    const key = await signingKey("kid-jwks-500")
    jwks = () => Response.json({ errors: [] }, { status: 500 })

    await expect(getAuthUserId(bearer(await sessionToken(key)), env)).rejects.toThrow(/jwk-remote-failed-to-load/)
  })

  it("throws when Clerk cannot be reached", async () => {
    skipRetryWait()
    const key = await signingKey("kid-network-down")
    jwks = () => {
      throw new TypeError("fetch failed")
    }

    await expect(getAuthUserId(bearer(await sessionToken(key)), env)).rejects.toThrow(/unexpected-error/)
  })

  it("throws when Clerk rejects our secret key", async () => {
    skipRetryWait()
    const key = await signingKey("kid-bad-secret")
    jwks = () =>
      Response.json(
        { errors: [{ code: "clerk_key_invalid", message: "The provided Clerk Secret Key is invalid." }] },
        { status: 401 }
      )

    await expect(getAuthUserId(bearer(await sessionToken(key)), env)).rejects.toThrow(/secret-key-invalid/)
  })

  it("throws when CLERK_SECRET_KEY is not set", async () => {
    const key = await signingKey("kid-no-secret")

    await expect(getAuthUserId(bearer(await sessionToken(key)), { ...env, CLERK_SECRET_KEY: "" })).rejects.toThrow(
      /Missing Clerk Secret Key/
    )
  })

  it("throws when the publishable key is not set", async () => {
    await expect(getAuthUserId(request(), { ...env, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "" })).rejects.toThrow()
  })
})
