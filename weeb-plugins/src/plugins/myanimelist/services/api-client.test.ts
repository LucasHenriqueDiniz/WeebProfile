import { afterEach, describe, expect, it, vi } from "vitest"
import { JikanEdgeError, jikanEdgeGet } from "./api-client"

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
  delete process.env.JIKAN_EDGE_BASE_URL
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
