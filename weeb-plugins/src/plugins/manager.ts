/**
 * PluginManager V2
 * 
 * Gerenciador melhorado de plugins
 */

import type { Plugin } from './shared/types/plugin'
import type { PluginRegistry } from './types'
import type { EssentialPluginConfig } from './shared/types/base'
import { githubPlugin } from './github/index'
import { lastFmPlugin } from './lastfm/index'
import { myAnimeListPlugin } from './myanimelist/index'
import { personality16Plugin } from './16personalities/index'
import type { PluginConfig, PluginData } from '../types/index'

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<string, Plugin> = new Map()
  private activePlugins: Set<string> = new Set()

  private constructor() {
    // Registrar plugins disponíveis
    this.register(githubPlugin)
    this.register(lastFmPlugin)
    this.register(myAnimeListPlugin)
    this.register(personality16Plugin)
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager()
    }
    return PluginManager.instance
  }

  public register<T extends PluginConfig = PluginConfig, D extends PluginData = PluginData>(
    plugin: Plugin<T, D>
  ): void {
    // Type assertion necessário devido à estrutura genérica dos plugins
    // Convertemos via unknown para permitir diferentes tipos de config
    this.plugins.set(plugin.name, plugin as unknown as Plugin)
  }

  public get(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  public getAll(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Inicializa plugins ativos baseado na configuração
   */
  public initializeActivePlugins(pluginsConfig: Record<string, { enabled?: boolean }>): void {
    this.activePlugins.clear()

    for (const [name, config] of Object.entries(pluginsConfig)) {
      if (config.enabled && this.plugins.has(name)) {
        this.activePlugins.add(name)
      }
    }
  }

  /**
   * Retorna lista de plugins ativos
   */
  public getActivePlugins(): Array<[string, Plugin]> {
    return Array.from(this.activePlugins)
      .map((name) => {
        const plugin = this.plugins.get(name)
        return plugin ? [name, plugin] : null
      })
      .filter((item): item is [string, Plugin] => item !== null)
  }

  /**
   * Busca dados de um plugin específico
   */
  public async fetchPluginData(
    name: string,
    config: Plugin['config'],
    dev = false,
    essentialConfig?: EssentialPluginConfig
  ): Promise<PluginData> {
    const plugin = this.get(name)
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`)
    }
    return await plugin.fetchData(config, dev, essentialConfig)
  }

  /**
   * Busca dados de todos os plugins ativos
   */
  public async fetchAllPluginsData(
    pluginsConfig: Record<string, Plugin['config']>,
    dev = false,
    essentialConfigs?: Record<string, EssentialPluginConfig>
  ): Promise<Record<string, PluginData>> {
    const activePlugins = this.getActivePlugins()
    const results: Record<string, PluginData> = {}

    await Promise.all(
      activePlugins.map(async ([name, plugin]) => {
        const config = pluginsConfig[name]
        if (config) {
          try {
            // Obter essentialConfig específico do plugin (se disponível)
            const essentialConfig = essentialConfigs?.[name]
            const data = await plugin.fetchData(config, dev, essentialConfig)
            results[name] = data
          } catch (error) {
            console.error(`Error fetching data for plugin ${name}:`, error)
            // Não adicionar ao results em caso de erro
          }
        }
      })
    )

    return results
  }
}

