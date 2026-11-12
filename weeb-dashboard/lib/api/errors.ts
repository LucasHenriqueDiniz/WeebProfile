/**
 * The API's error shapes and the exception apiRequest throws.
 *
 * Kept apart from client.ts, which reaches for window: this file has no DOM, so the
 * Pages Functions tests can build the exception from a route's real response.
 */

/** One plugin's missing secrets and fields, as svg-generator's validateRequiredConfig reports them. */
export interface MissingRequiredConfig {
  pluginName: string
  missingSecrets?: Array<{ key: string; label?: string }>
  missingFields?: Array<{ field: string; label?: string }>
}

export interface ApiError {
  error: string
  message?: string
  code?: string
  retryable?: boolean
  missing?: MissingRequiredConfig[]
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    message?: string
  ) {
    super(message || data.message || data.error || "API Error")
    this.name = "ApiException"
  }
}

const MISSING_CONFIG_CODES = new Set(["MISSING_REQUIRED_SECRETS", "MISSING_REQUIRED_CONFIG"])

/**
 * What is missing when a generation failed for lack of a secret or field; null for any
 * other failure.
 *
 * The response body lives on ApiException.data. The wizard read `code` and `missing`
 * off the exception itself, where they never are, so a card saved without its API key
 * said "houve um problema na geração" and redirected instead of naming the key.
 */
export function missingRequiredConfig(error: unknown): MissingRequiredConfig[] | null {
  if (!(error instanceof ApiException) || !MISSING_CONFIG_CODES.has(error.data.code ?? "")) return null
  return Array.isArray(error.data.missing) ? error.data.missing : []
}
