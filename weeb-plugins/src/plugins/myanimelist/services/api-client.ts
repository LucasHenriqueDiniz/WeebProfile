export interface JikanEdgeDiagnostics {
  requestId: string | null
  workerVersion: string | null
  cacheStatus: string | null
}

export interface JikanEdgeFetcher {
  fetch(request: Request): Promise<Response>
}

type JikanEdgeRuntime = typeof globalThis & {
  __weebJikanEdgeFetcher?: JikanEdgeFetcher
  __weebRequireJikanEdgeBinding?: boolean
}

function runtime(): JikanEdgeRuntime {
  return globalThis as JikanEdgeRuntime
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
  return {
    requestId: response.headers.get("x-request-id"),
    workerVersion: response.headers.get("x-worker-version"),
    cacheStatus: response.headers.get("x-cache-status"),
  }
}

/**
 * Quantas vezes tentar quando o Jikan devolve 429.
 *
 * Baixo de propósito: uma geração faz várias chamadas, e insistir muito num rate
 * limit atrasa todas as outras dentro do orçamento de tempo do Worker.
 */
const MAX_TENTATIVAS = 3

/**
 * Teto para a espera entre tentativas.
 *
 * O `Retry-After` é respeitado até este limite. Acima dele desistimos na hora, em
 * vez de dormir: um Cron Trigger tem 15 min de wall-clock (30s de CPU quando o
 * intervalo é menor que 1h), então esperar um minuto porque o servidor pediu
 * derrubaria a geração inteira em vez de degradar uma seção.
 */
const ESPERA_MAXIMA_MS = 5_000

/**
 * Lê o Retry-After nas duas formas que o HTTP permite: segundos ou data.
 * Devolve null quando ausente ou ilegível -- aí quem chama decide o fallback.
 */
export function esperaDoRetryAfter(header: string | null, agora = Date.now()): number | null {
  if (!header) return null

  const segundos = Number(header.trim())
  if (Number.isFinite(segundos)) return Math.max(0, segundos * 1000)

  const data = Date.parse(header)
  if (!Number.isNaN(data)) return Math.max(0, data - agora)

  return null
}

const dormir = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function jikanEdgeGet<T>(path: string, options: { timeoutMs?: number } = {}): Promise<T> {
  const url = new URL(path, baseUrl())
  const request = { method: "GET" as const, originPathname: `${url.origin}${url.pathname}` }

  for (let tentativa = 1; ; tentativa++) {
    // Controller por tentativa: reaproveitar um já abortado faria a segunda
    // tentativa morrer antes de sair.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000)
    let response: Response
    try {
      const init = {
        signal: controller.signal,
        headers: { Accept: "application/json", "User-Agent": "WeebProfile/1.0" },
      }
      const binding = runtime().__weebJikanEdgeFetcher
      if (binding) {
        response = await binding.fetch(new Request(url, init))
      } else {
        if (runtime().__weebRequireJikanEdgeBinding)
          throw new JikanEdgeError(
            "Jikan Edge service binding is unavailable",
            undefined,
            undefined,
            undefined,
            request
          )
        response = await fetch(url, init)
      }
    } catch (error) {
      if (error instanceof JikanEdgeError) throw error
      throw new JikanEdgeError(
        error instanceof Error && error.name === "AbortError"
          ? "Jikan Edge request timed out"
          : "Jikan Edge request failed",
        undefined,
        undefined,
        undefined,
        request
      )
    } finally {
      clearTimeout(timeoutId)
    }

    // 429 é o único status que merece nova tentativa: o servidor está dizendo
    // "de novo daqui a pouco". 4xx não muda se repetir, e 5xx aqui é o nosso
    // próprio worker -- insistir só multiplica a carga.
    if (response.status === 429 && tentativa < MAX_TENTATIVAS) {
      const pedida = esperaDoRetryAfter(response.headers.get("retry-after"))
      // Sem header, um backoff curto; o servidor não disse quanto esperar.
      const espera = pedida ?? tentativa * 500
      if (espera <= ESPERA_MAXIMA_MS) {
        await dormir(espera)
        continue
      }
      // Espera pedida acima do teto: desiste agora e deixa a seção degradar,
      // em vez de segurar a geração inteira.
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
}
