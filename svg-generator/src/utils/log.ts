/**
 * Structured logging for the Workers runtime.
 *
 * Replaces free-form `console.log("📥 [WORKER] Request:", {...})`. Emoji-prefixed
 * prose is fine to read one line at a time and useless the moment you want to ask
 * "how many generations failed for the github plugin this week" -- Workers Logs
 * can filter on JSON fields, not on a sentence.
 *
 * No Winston or Pino: those are Node libraries, and this runtime already gives a
 * console that serialises objects into the log pipeline.
 */

type Level = "debug" | "info" | "warn" | "error"

export type LogContext = Record<string, unknown>

/**
 * Identifiers we must never write to a log line. userId was being logged verbatim
 * on every authenticated generation, which put a Clerk user id -- stable, and a
 * join key into plugin_secrets -- into log storage that outlives the request and
 * is read by anyone with dashboard access.
 *
 * hashUserId is what to use instead when a line genuinely needs to correlate
 * requests from the same user.
 */
const REDACTED_KEYS = /^(userid|user_id|apikey|api_key|token|secret|password|authorization|auth)$/i

function redact(context: LogContext): LogContext {
  const safe: LogContext = {}
  for (const [key, value] of Object.entries(context)) {
    safe[key] = REDACTED_KEYS.test(key) ? "[redacted]" : value
  }
  return safe
}

/**
 * Short, non-reversible tag for a user id. Enough to see that two log lines belong
 * to the same person; not enough to recover who they are or to look them up in D1.
 */
export async function hashUserId(userId: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(userId))
  return Array.from(new Uint8Array(digest).slice(0, 6))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function emit(level: Level, event: string, context: LogContext = {}): void {
  const line = JSON.stringify({ level, event, ...redact(context) })
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.log(line)
}

export const log = {
  debug: (event: string, context?: LogContext) => emit("debug", event, context),
  info: (event: string, context?: LogContext) => emit("info", event, context),
  warn: (event: string, context?: LogContext) => emit("warn", event, context),
  error: (event: string, context?: LogContext) => emit("error", event, context),
}
