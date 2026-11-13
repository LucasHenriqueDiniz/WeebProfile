import { createClerkClient } from "@clerk/backend"
import { TokenVerificationErrorReason } from "@clerk/backend/errors"
import { decodeJwt } from "@clerk/backend/jwt"
import { attachError } from "./error-log"

export interface CloudflareEnv {
  DB: D1Database
  SVGS_BUCKET: R2Bucket
  CLERK_SECRET_KEY: string
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
  R2_PUBLIC_URL: string
  // Service binding to the svg-generator Worker. Preferred over SVG_GENERATOR_URL:
  // it keeps the call off the public internet so the generator can drop its
  // workers.dev route entirely. The URL stays for local dev and as a fallback.
  SVG_GENERATOR?: Fetcher
  SVG_GENERATOR_URL?: string
  CRON_SECRET?: string
  INTERNAL_SECRET?: string
  // Required in every deployed environment: both the write path (profile) and the
  // generator's read path now refuse to run without it, rather than falling back
  // to plain text. Kept as a plain string so a missing binding is a type error at
  // the call site instead of an optional nobody checks.
  SECRETS_ENCRYPTION_KEY: string
}

// Cache the Clerk client at module scope so its JWKS cache survives across
// requests on the same warm Worker isolate, instead of every request paying
// a network round-trip to Clerk to re-fetch signing keys.
let cachedClerk: ReturnType<typeof createClerkClient> | null = null
let cachedSecretKey: string | null = null

export function getClerkClient(secretKey: string) {
  if (!cachedClerk || cachedSecretKey !== secretKey) {
    cachedClerk = createClerkClient({ secretKey })
    cachedSecretKey = secretKey
  }
  return cachedClerk
}

/**
 * Reasons Clerk gives for a signed-out request that are our failure, not the
 * caller's: it could not load the keys to check the token with, or it rejected our
 * secret key. Clerk returns these as an ordinary signed-out state, so reading only
 * the user id turned a Clerk outage or a wrong CLERK_SECRET_KEY into a 401 for every
 * signed-in user, with nothing in error_log.
 *
 * "unexpected-error" is Clerk's AuthErrorReason.UnexpectedError, which it does not
 * export. A network failure while fetching the JWKS comes back as that.
 */
const SERVER_SIDE_REASONS = new Set<string>([
  TokenVerificationErrorReason.InvalidSecretKey,
  TokenVerificationErrorReason.LocalJWKMissing,
  TokenVerificationErrorReason.RemoteJWKFailedToLoad,
  TokenVerificationErrorReason.RemoteJWKInvalid,
  TokenVerificationErrorReason.RemoteJWKMissing,
  TokenVerificationErrorReason.JWKFailedToResolve,
  "unexpected-error",
])

export class AuthUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthUnavailableError"
  }
}

/**
 * The Clerk user id behind the request, or null when the caller is not signed in.
 *
 * Throws when it cannot tell (Clerk unreachable, keys missing or wrong), so the
 * route's catch answers 500 and error_log records it. Returning null there tells a
 * signed-in user they are logged out and leaves no trace of why.
 */
export async function getAuthUserId(request: Request, env: CloudflareEnv): Promise<string | null> {
  // Nothing for Clerk to verify, so it could only answer "signed out". Asking anyway
  // made public routes (the template gallery reads the user only for "liked") depend on
  // Clerk's configuration: with no CLERK_SECRET_KEY, as in the Pages preview
  // environment, every anonymous request answered 500.
  if (!carriesClerkSession(request)) return null

  // A token that does not even decode is the caller's problem, but Clerk reports it
  // as "unexpected-error", the same reason as a network failure. Settle it here,
  // before that reason becomes ambiguous.
  const headerToken = tokenInAuthorizationHeader(request)
  if (headerToken !== undefined && !decodes(headerToken)) return null

  let state: Awaited<ReturnType<ReturnType<typeof getClerkClient>["authenticateRequest"]>>
  try {
    state = await getClerkClient(env.CLERK_SECRET_KEY).authenticateRequest(request, {
      publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    })
  } catch (error) {
    // Clerk decodes the session cookie outside its own error handling, so a cookie
    // that is not a JWT throws a SyntaxError from here. Anything else, like a missing
    // secret or publishable key, is a broken deploy and must not read as a 401.
    if (error instanceof SyntaxError) return null
    throw error
  }

  if (state.reason && SERVER_SIDE_REASONS.has(state.reason)) {
    const detail = state.message ? ` (${state.message})` : ""
    throw new AuthUnavailableError(`Clerk could not verify the session: ${state.reason}${detail}`)
  }
  return state.toAuth()?.userId ?? null
}

/**
 * Whether the request carries anything Clerk can resolve to a user: an Authorization
 * header, its session cookie (`__session`, or `__session_<suffix>` when cookies are
 * suffixed), or a handshake (`__clerk_handshake` / `__clerk_handshake_nonce`, as a
 * cookie or a query parameter). The dev-browser cookie `__clerk_db_jwt` is not one: a
 * development instance sets it for every visitor, signed in or not.
 */
function carriesClerkSession(request: Request): boolean {
  if (request.headers.has("Authorization")) return true

  const { searchParams } = new URL(request.url)
  if (searchParams.has("__clerk_handshake") || searchParams.has("__clerk_handshake_nonce")) return true

  const cookieNames = (request.headers.get("Cookie") ?? "").split(";").map((cookie) => cookie.split("=")[0]!.trim())
  return cookieNames.some((name) => /^__session(_|$)/.test(name) || /^__clerk_handshake(_nonce)?$/.test(name))
}

/** The token Clerk picks out of the Authorization header (its parseAuthorizationHeader). */
function tokenInAuthorizationHeader(request: Request): string | undefined {
  const header = request.headers.get("Authorization")
  if (!header) return undefined
  const [scheme, token] = header.split(" ", 2)
  if (!token) return scheme
  return scheme === "Bearer" ? token : undefined
}

// The public decodeJwt throws on anything that is not a JWT: wrong number of parts, bad
// base64, or JSON that does not parse.
function decodes(token: string): boolean {
  try {
    decodeJwt(token)
    return true
  } catch {
    return false
  }
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

export function notFound(resource = "Resource") {
  return Response.json({ error: `${resource} not found` }, { status: 404 })
}

export function serverError(error?: unknown) {
  console.error("Server error:", error)
  // The middleware reads the error back off the response and records it in
  // error_log; see _shared/error-log.ts.
  return attachError(Response.json({ error: "Internal server error" }, { status: 500 }), error)
}
