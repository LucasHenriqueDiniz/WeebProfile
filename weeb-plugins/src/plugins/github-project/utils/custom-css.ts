/**
 * Sistema de CSS Custom para GitHub Project Plugin
 *
 * Permite CSS customizado de forma segura e organizada
 */

import { sanitizeCSS } from "../security/css-sanitizer"

export interface CustomCSSConfig {
  /** CSS customizado */
  css: string
  /** Permitir animações */
  allowAnimations?: boolean
  /** Permitir imports externos */
  allowExternalImports?: boolean
  /** Permitir JavaScript inline */
  allowInlineJS?: boolean
}

export class CustomCSSManager {
  private static instance: CustomCSSManager
  private cache = new Map<string, string>()

  static getInstance(): CustomCSSManager {
    if (!CustomCSSManager.instance) {
      CustomCSSManager.instance = new CustomCSSManager()
    }
    return CustomCSSManager.instance
  }

  /**
   * Processa CSS customizado
   */
  processCustomCSS(config: CustomCSSConfig): string {
    const cacheKey = JSON.stringify(config)

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      // Sanitizar CSS para segurança
      const sanitizedCSS = sanitizeCSS(config.css, {
        allowAnimations: config.allowAnimations ?? true,
        allowExternalImports: config.allowExternalImports ?? false,
        allowInlineJS: config.allowInlineJS ?? false,
      })

      // Adicionar prefixo #svg-main para escopo
      const scopedCSS = this.addScope(sanitizedCSS)

      // Cache do resultado
      this.cache.set(cacheKey, scopedCSS)

      return scopedCSS
    } catch (error) {
      console.error("Error processing custom CSS:", error)
      return "/* Custom CSS processing failed */"
    }
  }

  /**
   * Adiciona escopo #svg-main ao CSS
   */
  private addScope(css: string): string {
    // Se já tiver escopo, não adiciona novamente
    if (css.includes("#svg-main")) {
      return css
    }

    // Adicionar escopo a cada regra
    return css
      .split("}")
      .filter((rule) => rule.trim())
      .map((rule) => {
        if (!rule) return ""

        const trimmedRule = rule.trim()
        if (!trimmedRule) return ""

        // Se for comentário ou @media, mantém como está
        if (trimmedRule.startsWith("/*") || trimmedRule.startsWith("@") || trimmedRule.startsWith("--")) {
          return trimmedRule + "}"
        }

        // Adiciona escopo #svg-main
        const selectors = trimmedRule.split("{")[0].trim()
        const properties = trimmedRule.split("{").slice(1).join("{").trim()

        if (!selectors || !properties) {
          return trimmedRule + "}"
        }

        // Múltiplos seletores separados por vírgula
        const scopedSelectors = selectors
          .split(",")
          .map((selector) => {
            const trimmedSelector = selector.trim()

            // Se já tiver escopo, não adiciona
            if (trimmedSelector.includes("#svg-main")) {
              return trimmedSelector
            }

            // Pular seletores globais como *, :root, @font-face
            if (
              ["*", ":root", "@font-face", "@keyframes", "@media"].some((global) => trimmedSelector.startsWith(global))
            ) {
              return trimmedSelector
            }

            // Adicionar escopo
            return `#svg-main ${trimmedSelector}`
          })
          .join(", ")

        return `${scopedSelectors} { ${properties}`
      })
      .filter((rule) => rule.trim())
      .join("\n")
  }

  /**
   * Gera CSS completo com custom + base
   */
  generateCompleteCSS(baseCSS: string, customCSS?: string): string {
    if (!customCSS || !customCSS.trim()) {
      return baseCSS
    }

    const processedCustom = this.processCustomCSS({
      css: customCSS,
      allowAnimations: true,
      allowExternalImports: false,
      allowInlineJS: false,
    })

    return `${baseCSS}\n\n/* Custom CSS */\n${processedCustom}`
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}
