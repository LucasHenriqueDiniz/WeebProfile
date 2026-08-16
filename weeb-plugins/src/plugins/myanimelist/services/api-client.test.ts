import { afterEach, describe, expect, it, vi } from "vitest"
import { JikanEdgeError, jikanEdgeGet, esperaDoRetryAfter } from "./api-client"

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
  delete process.env.JIKAN_EDGE_BASE_URL
  delete (globalThis as { __weebJikanEdgeFetcher?: unknown }).__weebJikanEdgeFetcher
  delete (globalThis as { __weebRequireJikanEdgeBinding?: unknown }).__weebRequireJikanEdgeBinding
})

function response(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "x-request-id": "request-1",
      "x-worker-version": "worker-1",
      "x-cache-status": "MISS",
    },
  })
}

function rateLimited(retryAfter?: string) {
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (retryAfter !== undefined) headers["retry-after"] = retryAfter
  return new Response(JSON.stringify({ error: { message: "rate limited" } }), { status: 429, headers })
}

describe("esperaDoRetryAfter", () => {
  it("le a forma em segundos", () => {
    expect(esperaDoRetryAfter("2")).toBe(2000)
    expect(esperaDoRetryAfter(" 0 ")).toBe(0)
  })

  // O HTTP permite as duas formas, e servidor nenhum garante qual manda.
  it("le a forma de data", () => {
    const agora = Date.parse("2026-08-15T12:00:00Z")
    expect(esperaDoRetryAfter("Sat, 15 Aug 2026 12:00:03 GMT", agora)).toBe(3000)
  })

  it("nunca devolve espera negativa para data no passado", () => {
    const agora = Date.parse("2026-08-15T12:00:00Z")
    expect(esperaDoRetryAfter("Sat, 15 Aug 2026 11:59:00 GMT", agora)).toBe(0)
  })

  it("devolve null quando ausente ou ilegivel", () => {
    expect(esperaDoRetryAfter(null)).toBeNull()
    expect(esperaDoRetryAfter("logo ali")).toBeNull()
  })
})

describe("jikanEdgeGet: rate limit", () => {
  it("repete apos 429 e devolve o sucesso seguinte", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(rateLimited("0"))
      .mockResolvedValueOnce(response(200, { data: { ok: true } }))

    const result = await jikanEdgeGet<{ data: { ok: boolean } }>("/v1/users/test/favorites")

    expect(result.data.ok).toBe(true)
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
  })

  it("desiste depois do teto de tentativas em vez de insistir para sempre", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockResolvedValue(rateLimited("0"))

    await expect(jikanEdgeGet("/v1/users/test/favorites")).rejects.toThrow(JikanEdgeError)
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
  })

  // Uma geração faz várias chamadas dentro do orçamento do Worker (Cron Trigger
  // cai para 30s de CPU quando o intervalo é menor que 1h). Dormir o que o
  // servidor pedir derrubaria tudo em vez de degradar uma seção.
  it("nao dorme quando o Retry-After passa do teto", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockResolvedValue(rateLimited("120"))

    const inicio = Date.now()
    await expect(jikanEdgeGet("/v1/users/test/favorites")).rejects.toThrow(/429/)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(Date.now() - inicio).toBeLessThan(1000)
  })

  // 4xx nao muda se repetir, e 5xx aqui e o nosso proprio worker: insistir so
  // multiplicaria a carga em cima de algo que ja esta mal.
  it("nao repete status que nao seja 429", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockResolvedValue(response(503, { error: { message: "down" } }))

    await expect(jikanEdgeGet("/v1/users/test/favorites")).rejects.toThrow(JikanEdgeError)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it("usa backoff proprio quando o 429 vem sem Retry-After", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(rateLimited())
      .mockResolvedValueOnce(response(200, { data: 1 }))

    await jikanEdgeGet("/v1/users/test/favorites")

    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
  })
})

describe("jikanEdgeGet", () => {
  it("uses the configured edge URL", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockResolvedValue(response(200, { data: { ok: true } }))

    const result = await jikanEdgeGet<{ data: { ok: boolean } }>("/v1/users/test/favorites")

    expect(result.data.ok).toBe(true)
    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0]!
    expect(url.toString()).toBe("https://edge.example/v1/users/test/favorites")
    expect(options?.headers).toEqual({ Accept: "application/json", "User-Agent": "WeebProfile/1.0" })
  })

  it("uses the service binding and preserves pathname/query without calling global fetch", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://jikan-edge.example"
    const serviceFetch = vi.fn().mockResolvedValue(response(200, { data: { ok: true } }))
    ;(globalThis as { __weebJikanEdgeFetcher?: { fetch: typeof serviceFetch } }).__weebJikanEdgeFetcher = {
      fetch: serviceFetch,
    }
    ;(globalThis as { __weebRequireJikanEdgeBinding?: boolean }).__weebRequireJikanEdgeBinding = true
    globalThis.fetch = vi.fn()

    await expect(
      jikanEdgeGet<{ data: { ok: boolean } }>("/v1/users/Amayacrab/animelist?page=2&limit=100")
    ).resolves.toEqual({ data: { ok: true } })

    expect(globalThis.fetch).not.toHaveBeenCalled()
    const request = serviceFetch.mock.calls[0]![0]
    expect(request.method).toBe("GET")
    expect(request.url).toBe("https://jikan-edge.example/v1/users/Amayacrab/animelist?page=2&limit=100")
    expect(request.headers.get("accept")).toBe("application/json")
  })

  it.each([404, 429, 500])("preserves HTTP %i as a structured error", async (status) => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockResolvedValue(response(status, { error: { code: "EDGE_ERROR", message: "failed" } }))

    await expect(jikanEdgeGet("/v1/users/test/statistics")).rejects.toMatchObject({
      status,
      code: "EDGE_ERROR",
      diagnostics: { requestId: "request-1", workerVersion: "worker-1", cacheStatus: "MISS" },
    })
  })

  it("preserves the unsupported userupdates response instead of making it an empty payload", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(response(501, { error: { code: "USER_UPDATES_UNSUPPORTED", message: "Not supported" } }))

    await expect(jikanEdgeGet("/v1/users/test/userupdates")).rejects.toMatchObject({
      status: 501,
      code: "USER_UPDATES_UNSUPPORTED",
    })
  })

  it("surfaces timeouts as errors", async () => {
    process.env.JIKAN_EDGE_BASE_URL = "https://edge.example"
    globalThis.fetch = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"))

    await expect(jikanEdgeGet("/v1/users/test/favorites", { timeoutMs: 1 })).rejects.toBeInstanceOf(JikanEdgeError)
  })
})
