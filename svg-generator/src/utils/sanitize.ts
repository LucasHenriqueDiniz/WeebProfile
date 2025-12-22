/**
 * Utilitários para sanitizar dados sensíveis
 */

/**
 * Censura um valor sensível mantendo as primeiras 3 letras e substituindo o resto por *
 * Exemplos:
 * - "senha" -> "sen**"
 * - "abcdefg" -> "abc****"
 * - "ab" -> "ab*"
 */
function censorValue(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') {
    return '***'
  }
  
  if (value.length <= 3) {
    return value.substring(0, value.length) + '*'.repeat(Math.max(3 - value.length, 1))
  }
  
  return value.substring(0, 3) + '*'.repeat(value.length - 3)
}

/**
 * Censura dados sensíveis de um objeto (API keys, tokens, etc)
 * Mantém as primeiras 3 letras e substitui o resto por *
 */
export function sanitizeConfig(config: any): any {
  if (!config || typeof config !== 'object') {
    return config
  }

  if (Array.isArray(config)) {
    return config.map(item => sanitizeConfig(item))
  }

  const sanitized: any = {}
  const sensitiveKeys = [
    'token',
    'apiKey',
    'api_key',
    'apikey',
    'accessToken',
    'access_token',
    'secret',
    'password',
    'auth',
    'authorization',
    'credentials',
  ]

  for (const [key, value] of Object.entries(config)) {
    const lowerKey = key.toLowerCase()
    
    // Censurar chaves sensíveis mantendo primeiras 3 letras
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = censorValue(String(value))
      continue
    }

    // Recursivamente sanitizar objetos e arrays
    if (value && typeof value === 'object') {
      sanitized[key] = sanitizeConfig(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Censura essentialConfigs (contém tokens e API keys)
 */
export function sanitizeEssentialConfigs(essentialConfigs: Record<string, any>): Record<string, any> {
  if (!essentialConfigs || typeof essentialConfigs !== 'object') {
    return {}
  }

  const sanitized: Record<string, any> = {}
  
  for (const [pluginName, config] of Object.entries(essentialConfigs)) {
    if (config && typeof config === 'object') {
      sanitized[pluginName] = sanitizeConfig(config)
    } else if (typeof config === 'string') {
      sanitized[pluginName] = censorValue(config)
    } else {
      sanitized[pluginName] = '***'
    }
  }

  return sanitized
}

