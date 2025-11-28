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
    this.name = 'PluginError'
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
    this.name = 'ApiError'
  }
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
    this.name = 'ConfigError'
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
    this.name = 'ValidationError'
  }
}

