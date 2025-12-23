/**
 * Utilitários para chamadas de API compartilhados
 */

import { ApiError, ConfigError } from './errors.js'

/**
 * Opções para requisições de API
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * Faz uma requisição HTTP com retry automático
 */
export async function fetchWithRetry(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Se for erro 4xx, não tenta novamente
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(
            `API request failed: ${response.statusText}`,
            response.status,
            url
          )
        }
        // Se for erro 5xx, tenta novamente
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Se for o último attempt ou erro não retryable, lança o erro
      if (attempt === retries || (error instanceof ApiError && error.statusCode && error.statusCode < 500)) {
        throw lastError
      }

      // Aguarda antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
    }
  }

  throw lastError || new Error('Unknown error in fetchWithRetry')
}

/**
 * Faz uma requisição JSON e retorna os dados parseados
 */
export async function fetchJson<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options)
  return response.json() as Promise<T>
}

/**
 * Valida se uma API key está presente
 */
export function requireApiKey(
  apiKey: string | undefined,
  keyName = 'apiKey'
): string {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new ConfigError(
      `${keyName} is required`,
      [keyName]
    )
  }
  return apiKey
}

/**
 * Valida se um token está presente
 */
export function requireToken(
  token: string | undefined,
  tokenName = 'token'
): string {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new ConfigError(
      `${tokenName} is required`,
      [tokenName]
    )
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
  return queryString ? `?${queryString}` : ''
}

