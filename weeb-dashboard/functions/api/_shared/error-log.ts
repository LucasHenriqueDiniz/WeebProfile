import { lt } from "drizzle-orm"
import { errorLog } from "../../../lib/db/schema"
import type { CloudflareEnv } from "./auth"
import { getDb } from "./db"

/**
 * Persistent record of the API's server errors, in the error_log table.
 *
 * Pages keeps no Functions logs once a request ends -- the dashboard offers only a
 * live tail -- so console.error alone meant a 500 left no trace. The middleware
 * (functions/api/_middleware.ts) writes one row per 5xx response.
 */

export const ERROR_LOG_RETENTION_DAYS = 30

const MAX_MESSAGE = 2_000
const MAX_STACK = 4_000

/**
 * serverError() builds the 500 where the error is caught, but only the middleware
 * holds the request and waitUntil. The error has to travel with the response, so the
 * twenty-odd `return serverError(e)` call sites stay as they are.
 *
 * It travels as an opaque id in a header, not keyed by the Response object: the Pages
 * router re-creates every response between handler and middleware
 * (`new Response(body, response)`, cloneResponse in wrangler's pages-template-worker),
 * which copies headers and nothing else. The error itself stays in this isolate, and
 * takeAttachedError removes the header before the response leaves.
 */
const ERROR_ID_HEADER = "x-error-log-id"
const pendingErrors = new Map<string, unknown>()

export function attachError<R extends Response>(response: R, error: unknown): R {
  const id = crypto.randomUUID()
  pendingErrors.set(id, error)
  response.headers.set(ERROR_ID_HEADER, id)
  return response
}

export function takeAttachedError(response: Response): { error: unknown; response: Response } {
  const id = response.headers.get(ERROR_ID_HEADER)
  if (!id) return { error: undefined, response }

  const error = pendingErrors.get(id)
  pendingErrors.delete(id)
  const headers = new Headers(response.headers)
  headers.delete(ERROR_ID_HEADER)
  return {
    error,
    response: new Response(response.body, { status: response.status, statusText: response.statusText, headers }),
  }
}

/**
 * Secrets that can ride inside an error message. Drizzle's "Failed query" message
 * ends with every bound parameter (user ids, request bodies); the rest are tokens a
 * failing upstream call may quote back.
 */
const SECRETS_IN_TEXT: Array<[RegExp, string]> = [
  [/\nparams: [\s\S]*$/, "\nparams: [redacted]"],
  [/([?&](?:key|api_key|apikey|token|access_token)=)[^&\s"']+/gi, "$1[redacted]"],
  [/\bBearer\s+[^\s"']+/gi, "Bearer [redacted]"],
  [/\b(sk|pk)_(live|test)_[A-Za-z0-9]+/g, "$1_$2_[redacted]"],
]

export function scrubText(text: string): string {
  return SECRETS_IN_TEXT.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text)
}

export interface ServerErrorEntry {
  method: string
  path: string
  status: number
  /** The thrown value, when serverError() or the middleware caught one. */
  error?: unknown
  /** The response body, used as the message when no error was attached (a 503 built by hand). */
  body?: string
}

export function describeServerError(entry: ServerErrorEntry): { message: string; stack: string | null } {
  const { error, body, status } = entry
  let message: string
  if (error instanceof Error) message = withCauses(error)
  else if (error !== undefined) message = scrubText(String(error))
  else message = scrubText(body ? `HTTP ${status}: ${body}` : `HTTP ${status} with no error attached`)

  // Frames only: the stack's first line repeats the message, which is stored on its own.
  const frames =
    error instanceof Error && error.stack
      ? error.stack
          .split("\n")
          .filter((line) => /^\s+at /.test(line))
          .join("\n")
      : ""

  return {
    message: message.slice(0, MAX_MESSAGE),
    stack: frames ? scrubText(frames).slice(0, MAX_STACK) : null,
  }
}

/**
 * The message plus its cause chain. Drizzle wraps every D1 failure in "Failed query:
 * <sql> params: <values>" and keeps the reason -- "no such table", "D1_ERROR: ..." --
 * only in `cause`, so the message alone said which query failed and not why. Each
 * link is scrubbed on its own, since the params rule cuts to the end of its text.
 */
function withCauses(error: Error): string {
  const links: string[] = []
  let current: unknown = error
  while (current !== undefined && current !== null && links.length < 4) {
    links.push(scrubText(current instanceof Error ? current.message || current.name : String(current)))
    // functions/tsconfig targets ES2020, whose Error type predates `cause`.
    current = current instanceof Error ? (current as { cause?: unknown }).cause : undefined
  }
  return links.join("\ncaused by: ")
}

/**
 * Never throws. Losing the log row must not become a second failure, and the table
 * may not exist yet: Pages deploys on merge, while the migration is applied by hand.
 */
export async function recordServerError(env: CloudflareEnv, entry: ServerErrorEntry): Promise<void> {
  try {
    const { message, stack } = describeServerError(entry)
    await getDb(env).insert(errorLog).values({
      method: entry.method,
      path: entry.path,
      status: entry.status,
      message,
      stack,
    })
  } catch (failure) {
    console.error("error_log: could not record a server error:", failure)
  }
}

/** Never throws, for the same reason: a missing table must not stop the cron. */
export async function pruneErrorLog(env: CloudflareEnv, now = new Date()): Promise<void> {
  const cutoff = new Date(now.getTime() - ERROR_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000)
  try {
    await getDb(env).delete(errorLog).where(lt(errorLog.createdAt, cutoff.toISOString()))
  } catch (failure) {
    console.error("error_log: could not prune:", failure)
  }
}
