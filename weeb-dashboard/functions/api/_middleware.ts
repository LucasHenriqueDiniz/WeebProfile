import type { PagesFunction } from "@cloudflare/workers-types"
import { serverError, type CloudflareEnv } from "./_shared/auth"
import { recordServerError, takeAttachedError } from "./_shared/error-log"

/**
 * Its 503 is a status report for the uptime monitor, which polls it: recording it
 * would write a row per poll for as long as a dependency is down. The failures that
 * dependency causes in real requests are recorded where they happen.
 */
const NOT_RECORDED = new Set(["/api/health"])

/**
 * Records every 5xx the API answers in the error_log table (see _shared/error-log.ts).
 * The write happens in waitUntil, after the response has gone out.
 */
export const onRequest: PagesFunction<CloudflareEnv> = async (context) => {
  const { request, env } = context

  let response: Response
  let error: unknown
  try {
    ;({ response, error } = takeAttachedError((await context.next()) as unknown as Response))
  } catch (thrown) {
    // A handler that throws instead of returning serverError() used to reach the
    // user as the platform's error page; it now gets the same JSON 500 as the rest.
    ;({ response } = takeAttachedError(serverError(thrown)))
    error = thrown
  }

  const { pathname } = new URL(request.url)
  if (response.status >= 500 && !NOT_RECORDED.has(pathname)) {
    // Read from a clone: the original body still has to reach the client.
    const copy = error === undefined ? response.clone() : null
    const status = response.status
    context.waitUntil(
      (async () => {
        const body = copy ? (await copy.text().catch(() => "")).slice(0, 500) : undefined
        await recordServerError(env, { method: request.method, path: pathname, status, error, body })
      })()
    )
  }

  return response
}
