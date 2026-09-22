import { PluginManager } from "@weeb/weeb-plugins"
import React from "react"
import { PluginError } from "../../core/errors/AppError"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import type { SvgConfig } from "../../shared/types"
import type { HtmlAndCss, IRenderer, PluginValidationResult, RenderResult } from "../interfaces/IRenderer"

/**
 * Serviço de renderização de plugins
 * Implementa IRenderer para abstrair a renderização React
 */
export class RenderService implements IRenderer {
  private logger = LoggerFactory.getLogger("RenderService")

  /**
   * Renderiza os plugins ativos
   */
  async renderPlugins(config: SvgConfig): Promise<RenderResult> {
    const startTime = Date.now()
    this.logger.debug("Starting plugin rendering", { pluginCount: Object.keys(config.plugins || {}).length })

    try {
      const pluginManager = PluginManager.getInstance()
      const pluginsData: Record<string, unknown> = {}
      const pluginsErrors: Record<string, Error> = {}
      const pluginElements: React.ReactElement[] = []

      // Processa cada plugin ativo
      for (const [pluginName, pluginConfig] of Object.entries(config.plugins || {})) {
        if (!pluginConfig?.enabled) {
          continue
        }

        try {
          this.logger.debug(`Rendering plugin: ${pluginName}`)

          // Valida plugin antes de renderizar
          const validation = await this.validatePlugin(pluginName, pluginConfig)
          if (!validation.canRender) {
            throw new Error(`Plugin validation failed: ${validation.errors.join(", ")}`)
          }

          // Obtém dados do plugin
          const data = await pluginManager.fetchPluginData(
            pluginName,
            {
              ...pluginConfig,
              // Adicionar configs globais
              style: config.style,
              size: config.size,
              terminalTheme: config.terminalTheme,
              defaultTheme: config.defaultTheme,
              hideTerminalEmojis: config.hideTerminalEmojis,
            },
            config.dev,
            config.essentialConfigs?.[pluginName]
          )
          pluginsData[pluginName] = data

          // Renderiza componente do plugin
          const plugin = pluginManager.get(pluginName)
          if (!plugin) {
            throw new Error(`Plugin not found: ${pluginName}`)
          }

          const element = plugin.render(
            {
              ...pluginConfig,
              // Adicionar configs globais
              style: config.style,
              size: config.size,
              terminalTheme: config.terminalTheme,
              defaultTheme: config.defaultTheme,
              hideTerminalEmojis: config.hideTerminalEmojis,
            },
            data
          ) as React.ReactElement
          pluginElements.push(element)

          this.logger.debug(`Plugin rendered successfully: ${pluginName}`)
        } catch (error) {
          const pluginError = error instanceof Error ? error : new Error(String(error))
          pluginsErrors[pluginName] = pluginError
          this.logger.error(`Failed to render plugin: ${pluginName}`, pluginError)

          // Adiciona elemento de erro mesmo assim
          const ErrorComponent = () =>
            React.createElement(
              "div",
              {
                className: "plugin-error",
                style: { color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px" },
              },
              React.createElement("strong", null, `Error in ${pluginName}:`),
              ` ${pluginError.message}`
            )
          const errorElement = React.createElement(ErrorComponent)
          pluginElements.push(errorElement)
        }
      }

      // Cria container com todos os plugins
      const element = React.createElement(
        "div",
        {
          className: "plugins-container",
          style: { display: "flex", flexDirection: "column", gap: "1rem" },
        },
        ...pluginElements
      )

      const renderTime = Date.now() - startTime
      this.logger.info("Plugin rendering completed", {
        renderTime,
        successCount: Object.keys(pluginsData).length,
        errorCount: Object.keys(pluginsErrors).length,
      })

      return {
        element,
        pluginsData,
        pluginsErrors,
        renderTime,
      }
    } catch (error) {
      this.logger.error("Plugin rendering failed", error instanceof Error ? error : new Error(String(error)))
      throw new PluginError(
        "RenderService",
        "Failed to render plugins",
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  /**
   * Converte elemento React para HTML
   */
  async reactToHtml(element: React.ReactElement, config: SvgConfig, width: number): Promise<HtmlAndCss> {
    const startTime = Date.now()

    try {
      // Importa renderToString dinamicamente para evitar issues no client
      const { reactToHtml } = await import("../../infrastructure/browser/react-to-html")

      this.logger.debug("Converting React to HTML", { width })

      const result = await reactToHtml(element, config, width)

      const conversionTime = Date.now() - startTime
      this.logger.debug("React to HTML conversion completed", { conversionTime })

      return result
    } catch (error) {
      this.logger.error("React to HTML conversion failed", error instanceof Error ? error : new Error(String(error)))
      throw new PluginError(
        "RenderService",
        "Failed to convert React to HTML",
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  /**
   * Valida se um plugin pode ser renderizado
   */
  async validatePlugin(pluginName: string, config: Record<string, unknown>): Promise<PluginValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const pluginManager = PluginManager.getInstance()

      // Verifica se plugin está registrado
      const plugin = pluginManager.get(pluginName)
      if (!plugin) {
        errors.push(`Plugin not registered: ${pluginName}`)
        return { canRender: false, errors, warnings }
      }

      // Verifica se plugin está habilitado
      if (!config?.enabled) {
        errors.push(`Plugin not enabled: ${pluginName}`)
        return { canRender: false, errors, warnings }
      }

      // Verifica se componente existe (usando o método render do plugin)
      if (!plugin.render) {
        errors.push(`Plugin render method not found: ${pluginName}`)
      }

      // Verifica seções configuradas
      const sections = (config?.sections as string[]) || []
      if (sections.length === 0) {
        warnings.push(`No sections configured for plugin: ${pluginName}`)
      }

      // Valida configurações específicas do plugin
      if (plugin.validate) {
        const validation = plugin.validate(config as any)
        if (!validation.valid) {
          errors.push(...(validation.errors || []))
        }
      }

      return {
        canRender: errors.length === 0,
        errors,
        warnings,
      }
    } catch (error) {
      this.logger.error(
        `Plugin validation failed: ${pluginName}`,
        error instanceof Error ? error : new Error(String(error))
      )
      errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`)
      return { canRender: false, errors, warnings }
    }
  }
}
