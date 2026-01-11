/**
 * Utilities for sanitizing sensitive data
 */

/**
 * Censors a sensitive value keeping first 3 letters and replacing the rest with *
 * Examples:
 * - "password" -> "pas*****"
 * - "abcdefg" -> "abc****"
 * - "ab" -> "ab*"
 */
function censorValue(value: string | undefined | null): string {
  if (!value || typeof value !== "string") {
    return "***"
  }

  if (value.length <= 3) {
    return value.substring(0, value.length) + "*".repeat(Math.max(3 - value.length, 1))
  }

  return value.substring(0, 3) + "*".repeat(value.length - 3)
}

/**
 * Censors sensitive data from an object (API keys, tokens, etc)
 * Keeps first 3 letters and replaces the rest with *
 */
export function sanitizeConfig(config: any): any {
  if (!config || typeof config !== "object") {
    return config
  }

  if (Array.isArray(config)) {
    return config.map((item) => sanitizeConfig(item))
  }

  const sanitized: any = {}
  const sensitiveKeys = [
    "token",
    "apiKey",
    "api_key",
    "apikey",
    "accessToken",
    "access_token",
    "secret",
    "password",
    "auth",
    "authorization",
    "credentials",
  ]

  for (const [key, value] of Object.entries(config)) {
    const lowerKey = key.toLowerCase()

    // Censor sensitive keys keeping first 3 letters
    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      sanitized[key] = censorValue(String(value))
      continue
    }

    // Recursively sanitize objects and arrays
    if (value && typeof value === "object") {
      sanitized[key] = sanitizeConfig(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Censors essentialConfigs (contains tokens and API keys)
 */
export function sanitizeEssentialConfigs(essentialConfigs: Record<string, any>): Record<string, any> {
  if (!essentialConfigs || typeof essentialConfigs !== "object") {
    return {}
  }

  const sanitized: Record<string, any> = {}

  for (const [pluginName, config] of Object.entries(essentialConfigs)) {
    if (config && typeof config === "object") {
      sanitized[pluginName] = sanitizeConfig(config)
    } else if (typeof config === "string") {
      sanitized[pluginName] = censorValue(config)
    } else {
      sanitized[pluginName] = "***"
    }
  }

  return sanitized
}
