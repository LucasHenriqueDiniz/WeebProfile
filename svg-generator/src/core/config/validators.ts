import { AppConfig } from "./types"

export class ConfigValidator {
  static validateAppConfig(config: AppConfig): ValidationResult {
    const errors: string[] = []

    // Validate server config
    if (config.server.port < 1 || config.server.port > 65535) {
      errors.push("Server port must be between 1 and 65535")
    }

    // Validate database config
    if (!config.database.url) {
      errors.push("Database URL is required")
    }

    if (config.database.poolSize < 1) {
      errors.push("Database pool size must be at least 1")
    }

    // Validate playwright config
    if (config.playwright.timeout < 1000) {
      errors.push("Playwright timeout must be at least 1000ms")
    }

    if (config.playwright.poolSize < 1) {
      errors.push("Browser pool size must be at least 1")
    }

    // Validate logging config
    const validLogLevels = ["debug", "info", "warn", "error"]
    if (!validLogLevels.includes(config.logging.level)) {
      errors.push(`Invalid log level: ${config.logging.level}`)
    }

    // Validate cache config
    if (config.cache.ttl < 0) {
      errors.push("Cache TTL must be non-negative")
    }

    if (config.cache.maxSize < 1) {
      errors.push("Cache max size must be at least 1")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateEnvironmentVariables(): ValidationResult {
    const errors: string[] = []
    const required = ["DATABASE_URL"]

    for (const envVar of required) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`)
      }
    }

    // Validate optional but important variables
    if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
      errors.push("PORT must be a valid number")
    }

    if (process.env.DB_POOL_SIZE && isNaN(parseInt(process.env.DB_POOL_SIZE))) {
      errors.push("DB_POOL_SIZE must be a valid number")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}
