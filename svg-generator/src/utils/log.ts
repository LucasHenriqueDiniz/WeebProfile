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

/**
 * Secrets that ride inside a string rather than under a key REDACTED_KEYS catches: a
 * provider URL with the key in its query string (Steam's ?key=), or an Authorization
 * header quoted in an error message. Workers Logs keeps every line for days (see
 * [observability] in wrangler.toml), so the text is scrubbed before it is written.
 */
const SECRETS_IN_TEXT: Array<[RegExp, string]> = [
  [/([?&](?:key|api_key|apikey|token|access_token)=)[^&\s"']+/gi, "$1[redacted]"],
  [/\bBearer\s+[^\s"']+/gi, "Bearer [redacted]"],
]

export function scrubText(text: string): string {
  return SECRETS_IN_TEXT.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text)
}

function scrubValue(value: unknown): unknown {
  if (typeof value === "string") return scrubText(value)
  if (Array.isArray(value)) return value.map(scrubValue)
  return value
}

function redact(context: LogContext): LogContext {
  const safe: LogContext = {}
  for (const [key, value] of Object.entries(context)) {
    safe[key] = REDACTED_KEYS.test(key) ? "[redacted]" : scrubValue(value)
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
  // Este e o unico console.log legitimo do pacote: o coletor. Todo o resto passa
  // por aqui justamente para ganhar a redacao de REDACTED_KEYS.
  // eslint-disable-next-line no-console
  else console.log(line)
}

export const log = {
  debug: (event: string, context?: LogContext) => emit("debug", event, context),
  info: (event: string, context?: LogContext) => emit("info", event, context),
  warn: (event: string, context?: LogContext) => emit("warn", event, context),
  error: (event: string, context?: LogContext) => emit("error", event, context),
}
