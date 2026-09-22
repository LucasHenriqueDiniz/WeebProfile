import React from "react"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import type { RenderOptions, RenderStrategy } from "../interfaces/IRenderer"

/**
 * Estratégia de renderização padrão usando renderToString
 * Implementação otimizada para servidor
 */
export class ServerRenderStrategy implements RenderStrategy {
  name = "server"
  description = "Uses renderToString for server-side rendering"

  async render(element: React.ReactElement, options?: RenderOptions): Promise<string> {
    const startTime = Date.now()
    const logger = LoggerFactory.getLogger("ServerRenderStrategy")

    try {
      logger.debug("Starting server render", {
        hasOptions: !!options,
        width: options?.width,
      })

      // Importa dinamicamente para evitar issues no client
      const { renderToString } = await import("react-dom/server")

      let renderedHtml = renderToString(element)

      // Aplica minificação se solicitado
      if (options?.minify) {
        renderedHtml = this.minifyHtml(renderedHtml)
      }

      const renderTime = Date.now() - startTime
      logger.debug("Server render completed", {
        renderTime,
        outputLength: renderedHtml.length,
      })

      return renderedHtml
    } catch (error) {
      logger.error("Server render failed", error instanceof Error ? error : new Error(String(error)))
      throw error
    }
  }

  /**
   * Minificação básica de HTML
   */
  private minifyHtml(html: string): string {
    return html
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/>\s+</g, "><") // Remove whitespace between tags
      .replace(/\n/g, "") // Remove newlines
      .trim()
  }
}

/**
 * Estratégia de renderização com cache
 * Implementa cache para renderizações repetidas
 */
export class CachedRenderStrategy implements RenderStrategy {
  name = "cached"
  description = "Uses caching for repeated renders"

  private cache = new Map<string, { html: string; timestamp: number }>()
  private maxCacheSize = 100
  private cacheTimeoutMs = 5 * 60 * 1000 // 5 minutos

  async render(element: React.ReactElement, options?: RenderOptions): Promise<string> {
    const logger = LoggerFactory.getLogger("CachedRenderStrategy")

    // Gera chave de cache baseada no elemento e opções
    const cacheKey = this.generateCacheKey(element, options)

    // Verifica cache
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      logger.debug("Cache hit", { cacheKey })
      return cached.html
    }

    // Cache miss - renderiza
    logger.debug("Cache miss, rendering", { cacheKey })
    const serverStrategy = new ServerRenderStrategy()
    const html = await serverStrategy.render(element, options)

    // Armazena no cache
    this.cache.set(cacheKey, { html, timestamp: Date.now() })

    // Limpa cache se necessário
    if (this.cache.size > this.maxCacheSize) {
      this.cleanCache()
    }

    return html
  }

  /**
   * Gera chave de cache para elemento React
   */
  private generateCacheKey(element: React.ReactElement, options?: RenderOptions): string {
    const elementString = React.createElement.toString?.call(element) || JSON.stringify(element)
    const optionsString = JSON.stringify(options || {})
    return `${elementString}-${optionsString}`
  }

  /**
   * Limpa entradas expiradas do cache
   */
  private cleanCache(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeoutMs) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))

    // Se ainda estiver muito grande, remove as mais antigas
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)

      const toDelete = entries.slice(0, entries.length - this.maxCacheSize)
      toDelete.forEach(([key]) => this.cache.delete(key))
    }
  }

  /**
   * Limpa todo o cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // TODO: Implementar tracking de hit rate
    }
  }
}

/**
 * Gerenciador de estratégias de renderização
 */
export class RenderStrategyManager {
  private strategies: Map<string, RenderStrategy> = new Map()
  private defaultStrategy: string = "server"
  private logger = LoggerFactory.getLogger("RenderStrategyManager")

  constructor() {
    // Registra estratégias padrão
    this.registerStrategy(new ServerRenderStrategy())
    this.registerStrategy(new CachedRenderStrategy())
  }

  /**
   * Registra uma nova estratégia
   */
  registerStrategy(strategy: RenderStrategy): void {
    this.strategies.set(strategy.name, strategy)
    this.logger.debug(`Registered render strategy: ${strategy.name}`)
  }

  /**
   * Obtém uma estratégia pelo nome
   */
  getStrategy(name?: string): RenderStrategy {
    const strategyName = name || this.defaultStrategy
    const strategy = this.strategies.get(strategyName)

    if (!strategy) {
      this.logger.warn(`Strategy not found: ${strategyName}, using default`)
      return this.strategies.get(this.defaultStrategy)!
    }

    return strategy
  }

  /**
   * Define a estratégia padrão
   */
  setDefaultStrategy(name: string): void {
    if (this.strategies.has(name)) {
      this.defaultStrategy = name
      this.logger.debug(`Default render strategy set to: ${name}`)
    } else {
      throw new Error(`Strategy not found: ${name}`)
    }
  }

  /**
   * Lista todas as estratégias disponíveis
   */
  listStrategies(): string[] {
    return Array.from(this.strategies.keys())
  }

  /**
   * Remove uma estratégia
   */
  removeStrategy(name: string): boolean {
    if (name === this.defaultStrategy) {
      throw new Error("Cannot remove default strategy")
    }

    const removed = this.strategies.delete(name)
    if (removed) {
      this.logger.debug(`Removed render strategy: ${name}`)
    }
    return removed
  }
}
