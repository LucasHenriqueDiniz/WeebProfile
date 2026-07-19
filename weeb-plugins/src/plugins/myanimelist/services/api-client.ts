export interface JikanEdgeDiagnostics {
  requestId: string | null
  workerVersion: string | null
  cacheStatus: string | null
}

export class JikanEdgeError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
    readonly diagnostics?: JikanEdgeDiagnostics,
    readonly request?: { method: "GET"; originPathname: string }
  ) {
    super(message)
    this.name = "JikanEdgeError"
  }
}

function baseUrl(): string {
  const value = typeof process !== "undefined" ? process.env?.JIKAN_EDGE_BASE_URL : undefined
  if (!value) throw new JikanEdgeError("JIKAN_EDGE_BASE_URL is not configured")
  return value
}

function diagnostics(response: Response): JikanEdgeDiagnostics {
  return { requestId: response.headers.get("x-request-id"), workerVersion: response.headers.get("x-worker-version"), cacheStatus: response.headers.get("x-cache-status") }
}

export async function jikanEdgeGet<T>(path: string, options: { timeoutMs?: number } = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000)
  const url = new URL(path, baseUrl())
  const request = { method: "GET" as const, originPathname: `${url.origin}${url.pathname}` }
  let response: Response
  try {
    response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json", "User-Agent": "WeebProfile/1.0" } })
  } catch (error) {
    throw new JikanEdgeError(error instanceof Error && error.name === "AbortError" ? "Jikan Edge request timed out" : "Jikan Edge request failed", undefined, undefined, undefined, request)
  } finally {
    clearTimeout(timeoutId)
  }
  const body = (await response.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null
  if (!response.ok) {
    const detail = body?.error?.message || `Jikan Edge responded HTTP ${response.status}`
    const code = body?.error?.code
    const trace = diagnostics(response)
    throw new JikanEdgeError(
      `${request.method} ${request.originPathname} HTTP ${response.status}${code ? ` ${code}` : ""}: ${detail}; requestId=${trace.requestId ?? "-"}; workerVersion=${trace.workerVersion ?? "-"}; cacheStatus=${trace.cacheStatus ?? "-"}`,
      response.status,
      code,
      trace,
      request
    )
  }
  return body as T
}
