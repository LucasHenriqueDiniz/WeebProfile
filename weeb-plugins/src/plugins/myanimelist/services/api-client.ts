export interface JikanEdgeDiagnostics {
  requestId: string | null
  workerVersion: string | null
  cacheStatus: string | null
}

export class JikanEdgeError extends Error {
  constructor(message: string, readonly status?: number, readonly code?: string, readonly diagnostics?: JikanEdgeDiagnostics) {
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
  let response: Response
  try {
    response = await fetch(new URL(path, baseUrl()), { signal: controller.signal, headers: { Accept: "application/json", "User-Agent": "WeebProfile/1.0" } })
  } catch (error) {
    throw new JikanEdgeError(error instanceof Error && error.name === "AbortError" ? "Jikan Edge request timed out" : "Jikan Edge request failed")
  } finally {
    clearTimeout(timeoutId)
  }
  const body = (await response.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null
  if (!response.ok) throw new JikanEdgeError(body?.error?.message || `Jikan Edge responded HTTP ${response.status}`, response.status, body?.error?.code, diagnostics(response))
  return body as T
}
