/**
 * Utilitários para chamadas de API compartilhados
 */

import { ApiError, ConfigError } from "./errors"
import { USER_AGENT } from "../../../utils/user-agent"

/**
 * Opções para requisições de API
 */
export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * Per-attempt timeout and retries. They were 30 s and 3 retries: one call could take
 * 126 s, and Codeforces makes three in a row, while the dashboard gives up on the
 * whole generation at 60 s. Now the worst case is about 17 s per call.
 */
const DEFAULT_TIMEOUT_MS = 8_000
const DEFAULT_RETRIES = 1

/**
 * Runs `read` on the response of a request, retrying 5xx and network failures.
 * The attempt's timer stays on until `read` has finished: clearing it when the
 * headers arrived left the body read without any limit.
 */
async function requestWithRetry<T>(
  url: string,
  options: ApiRequestOptions,
  read: (response: Response) => Promise<T>
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryDelay = 1000,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      if (!response.ok) {
        // 4xx: não tenta novamente
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(`API request failed: ${response.statusText}`, response.status, url)
        }
        // 5xx: tenta novamente
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await read(response)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === retries || (error instanceof ApiError && error.statusCode && error.statusCode < 500)) {
        throw lastError
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
    } finally {
      clearTimeout(timeoutId)
    }
  }

  throw lastError || new Error("Unknown error in fetchWithRetry")
}

/**
 * Faz uma requisição HTTP com retry automático. Only the headers are under the
 * timeout here, since the caller reads the body; prefer fetchJson.
 */
export async function fetchWithRetry(url: string, options: ApiRequestOptions = {}): Promise<Response> {
  return requestWithRetry(url, options, async (response) => response)
}

export async function fetchJson<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
  return requestWithRetry(url, options, (response) => response.json() as Promise<T>)
}

/**
 * Valida se uma API key está presente
 */
export function requireApiKey(apiKey: string | undefined, keyName = "apiKey"): string {
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new ConfigError(`${keyName} is required`, [keyName])
  }
  return apiKey
}

/**
 * Valida se um token está presente
 */
export function requireToken(token: string | undefined, tokenName = "token"): string {
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new ConfigError(`${tokenName} is required`, [tokenName])
  }
  return token
}

/**
 * Cria query string a partir de um objeto
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}
