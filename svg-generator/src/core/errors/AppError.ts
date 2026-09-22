export abstract class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly timestamp: Date
  public readonly context?: string

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: string
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date()
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    }
  }
}

// Erros Específicos
export class ValidationError extends AppError {
  public details?: Record<string, unknown>

  constructor(message: string, details?: Record<string, unknown>, context?: string) {
    super(message, "VALIDATION_ERROR", 400, true, context)
    this.details = details
  }
}

export class DatabaseError extends AppError {
  public originalError?: Error

  constructor(message: string, originalError?: Error, context?: string) {
    super(message, "DATABASE_ERROR", 503, true, context)
    this.originalError = originalError
  }
}

export class PluginError extends AppError {
  public pluginName: string
  public originalError?: Error

  constructor(pluginName: string, message: string, originalError?: Error) {
    super(`Plugin ${pluginName}: ${message}`, "PLUGIN_ERROR", 422, true, pluginName)
    this.pluginName = pluginName
    this.originalError = originalError
  }
}

export class ConfigurationError extends AppError {
  public field?: string

  constructor(message: string, field?: string) {
    super(message, "CONFIGURATION_ERROR", 500, true)
    this.field = field
  }
}

export class TimeoutError extends AppError {
  public operation: string
  public timeout: number

  constructor(operation: string, timeout: number) {
    super(`Operation ${operation} timed out after ${timeout}ms`, "TIMEOUT_ERROR", 408)
    this.operation = operation
    this.timeout = timeout
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, "AUTHORIZATION_ERROR", 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier ? `${resource} with identifier '${identifier}' not found` : `${resource} not found`
    super(message, "NOT_FOUND", 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, "RATE_LIMIT", 429)
  }
}
