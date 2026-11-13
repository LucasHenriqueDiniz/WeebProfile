/**
 * Classes de erro customizadas para plugins
 */

/**
 * Erro base para plugins
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public pluginName?: string,
    public cause?: Error
  ) {
    super(message)
    this.name = "PluginError"
  }
}

/**
 * Erro de API (falha na requisição, rate limit, etc)
 */
export class ApiError extends PluginError {
  constructor(
    message: string,
    public statusCode?: number,
    public apiName?: string,
    cause?: Error
  ) {
    super(message, undefined, cause)
    this.name = "ApiError"
  }
}

/**
 * The error a fetchData throws when the provider fails for any reason other than
 * "user not found". It must propagate: the generator turns it into a pluginErrors
 * entry, and the dashboard then keeps the previous SVG and records this message in
 * last_error -- which is why it names the provider and the HTTP status.
 *
 * Several plugins used to return their mock data here instead, which reached the
 * dashboard as a success and was published over the user's last good card.
 */
export function upstreamFailure(provider: string, error: unknown): Error {
  // ApiError's own message is fetchJson's generic "API request failed: <statusText>",
  // and statusText is often empty -- the status code is the useful part.
  const reason =
    error instanceof ApiError && error.statusCode
      ? `HTTP ${error.statusCode}`
      : (error instanceof Error ? error.message : String(error)).replace(/[:\s]+$/, "")
  return new PluginError(`${provider} API request failed: ${reason}`, provider.toLowerCase())
}

/**
 * Erro de configuração (faltando API key, token inválido, etc)
 */
export class ConfigError extends PluginError {
  constructor(
    message: string,
    public missingKeys?: string[],
    pluginName?: string
  ) {
    super(message, pluginName)
    this.name = "ConfigError"
  }
}

/**
 * Erro de validação (dados inválidos, formato incorreto, etc)
 */
export class ValidationError extends PluginError {
  constructor(
    message: string,
    public validationErrors?: string[],
    pluginName?: string
  ) {
    super(message, pluginName)
    this.name = "ValidationError"
  }
}
