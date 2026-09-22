/**
 * CSS Sanitizer para GitHub Project Plugin
 *
 * Remove códigos perigosos e valida CSS customizado
 */

export interface SanitizerOptions {
  allowAnimations?: boolean
  allowExternalImports?: boolean
  allowInlineJS?: boolean
}

export function sanitizeCSS(css: string, options: SanitizerOptions = {}): string {
  const { allowAnimations = true, allowExternalImports = false, allowInlineJS = false } = options

  let sanitizedCSS = css

  // Remove comentários perigosos
  sanitizedCSS = sanitizedCSS.replace(/\/\*\s*javascript:.*?\s*\*\//gi, "")
  sanitizedCSS = sanitizedCSS.replace(/\/\*\s*expression\(.+?\)\s*\*\//gi, "")

  // Remove imports externos se não permitido
  if (!allowExternalImports) {
    sanitizedCSS = sanitizedCSS.replace(/@import\s+url\([^)]+\)/gi, "/* @import removido por segurança */")
    sanitizedCSS = sanitizedCSS.replace(/@import\s+["'][^"']+["']/gi, "/* @import removido por segurança */")
  }

  // Remove JavaScript inline se não permitido
  if (!allowInlineJS) {
    sanitizedCSS = sanitizedCSS.replace(/javascript:/gi, "/* javascript: removido */")
    sanitizedCSS = sanitizedCSS.replace(/expression\(/gi, "/* expression() removido */")
    sanitizedCSS = sanitizedCSS.replace(/vbscript:/gi, "/* vbscript: removido */")
    sanitizedCSS = sanitizedCSS.replace(/on\w+\s*=/gi, "/* evento removido */")
  }

  // Remove animações se não permitido
  if (!allowAnimations) {
    sanitizedCSS = sanitizedCSS.replace(/@keyframes\s+\w+/gi, "/* @keyframes removido */")
    sanitizedCSS = sanitizedCSS.replace(/animation\s*:/gi, "/* animation: removido */")
    sanitizedCSS = sanitizedCSS.replace(/transition\s*:/gi, "/* transition: removido */")
  }

  // Remove URLs de dados se não permitido
  sanitizedCSS = sanitizedCSS.replace(/data:text\/html/gi, "/* data: URL removido */")
  sanitizedCSS = sanitizedCSS.replace(/data:application\/javascript/gi, "/* data: URL removido */")

  // Validação básica de CSS
  const lines = sanitizedCSS.split("\n")
  const validLines = lines.filter((line) => {
    const trimmed = line.trim()

    // Permitir comentários normais
    if (trimmed.startsWith("/*") && trimmed.endsWith("*/")) {
      return true
    }

    // Permitir @media queries
    if (trimmed.startsWith("@media")) {
      return true
    }

    // Permitir @font-face
    if (trimmed.startsWith("@font-face")) {
      return true
    }

    // Permitir variáveis CSS
    if (trimmed.startsWith("--")) {
      return true
    }

    // Permitir regras CSS válidas
    if (trimmed.includes("{") && trimmed.includes("}")) {
      return true
    }

    // Remover linhas vazias ou suspeitas
    return trimmed.length > 0 && !trimmed.includes("<script")
  })

  return validLines.join("\n")
}

/**
 * Valida CSS customizado
 */
export function validateCustomCSS(css: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Verificar padrões perigosos
  const dangerousPatterns = [
    /javascript:/gi,
    /expression\(/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /@import\s+url\([^)]+\)/gi,
  ]

  dangerousPatterns.forEach((pattern, index) => {
    if (pattern.test(css)) {
      errors.push(`Padrão perigoso detectado (índice ${index})`)
    }
  })

  // Verificar sintaxe básica
  const openBraces = (css.match(/\{/g) || []).length
  const closeBraces = (css.match(/\}/g) || []).length

  if (openBraces !== closeBraces) {
    errors.push("Número de chaves abertas e fechadas não coincide")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
