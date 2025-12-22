/**
 * Utilitários de validação compartilhados
 */

/**
 * Valida se uma string é um username válido
 * (letras, números, hífens, underscores, pontos)
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') {
    return false
  }
  return /^[a-zA-Z0-9._-]+$/.test(username)
}

/**
 * Valida se uma string é um email válido
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se uma string é uma API key válida
 * (geralmente alfanumérica, pode ter hífens)
 */
export function isValidApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false
  }
  // API keys geralmente são alfanuméricas com possíveis hífens
  return /^[a-zA-Z0-9-]+$/.test(apiKey) && apiKey.length >= 10
}

/**
 * Valida se uma string é um token válido
 * (similar a API key, mas pode ter mais caracteres especiais)
 */
export function isValidToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }
  // Tokens podem ser mais complexos (base64, JWT, etc)
  return token.length >= 10
}

/**
 * Valida se um número está dentro de um range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Valida se um array de strings contém apenas valores válidos
 */
export function isValidStringArray(arr: unknown, allowedValues?: string[]): boolean {
  if (!Array.isArray(arr)) {
    return false
  }
  
  if (allowedValues) {
    return arr.every(item => 
      typeof item === 'string' && allowedValues.includes(item)
    )
  }
  
  return arr.every(item => typeof item === 'string')
}

