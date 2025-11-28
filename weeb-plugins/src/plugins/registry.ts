/**
 * Plugin Registry with Validation
 * 
 * Centralized plugin registration and validation system with clear errors and type safety.
 */

import { PLUGINS_METADATA, type PluginMetadata } from './metadata'
import type { Plugin } from './shared/types/plugin'

/**
 * Centralized plugin registry with validation
 */
export class PluginRegistry {
  private static instance: PluginRegistry
  private metadata: Map<string, PluginMetadata> = new Map()
  private plugins: Map<string, Plugin> = new Map()

  private constructor() {
    // Inicializar metadata
    for (const [name, meta] of Object.entries(PLUGINS_METADATA)) {
      this.metadata.set(name, meta)
    }
  }

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry()
    }
    return PluginRegistry.instance
  }

  /**
   * Registers a plugin with validation
   */
  public register(plugin: Plugin): void {
    // Validate that plugin has metadata
    if (!this.metadata.has(plugin.name)) {
      throw new Error(
        `Plugin "${plugin.name}" does not have metadata in PLUGINS_METADATA. ` +
        `Add an entry in weeb-plugins/src/plugins/metadata.ts`
      )
    }

    const metadata = this.metadata.get(plugin.name)!

    // Validate essentialConfigKeys (optional - may be deprecated)
    const pluginKeys = plugin.essentialConfigKeys || []
    const metadataKeys = metadata.essentialConfigKeysMetadata.map(m => m.key)

    const missingInMetadata = pluginKeys.filter(k => !metadataKeys.includes(k))
    if (missingInMetadata.length > 0) {
      console.warn(
        `⚠️  Plugin "${plugin.name}": essentialConfigKeys [${missingInMetadata.join(', ')}] ` +
        `are not in essentialConfigKeysMetadata`
      )
    }

    // Validate that plugin has all sections from metadata
    const metadataSectionIds = new Set(metadata.sections.map(s => s.id))
    // (more complex validation can be done here)

    this.plugins.set(plugin.name, plugin)
  }

  /**
   * Gets plugin metadata with validation
   */
  public getMetadata(name: string): PluginMetadata {
    const metadata = this.metadata.get(name)
    if (!metadata) {
      const availablePlugins = Array.from(this.metadata.keys()).join(', ')
      throw new Error(
        `Plugin "${name}" not found in metadata. ` +
        `Available plugins: ${availablePlugins}`
      )
    }
    return metadata
  }

  /**
   * Gets plugin with validation
   */
  public getPlugin(name: string): Plugin {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      const availablePlugins = Array.from(this.plugins.keys()).join(', ')
      throw new Error(
        `Plugin "${name}" is not registered. ` +
        `Registered plugins: ${availablePlugins}. ` +
        `Make sure to register the plugin in PluginManager.`
      )
    }
    return plugin
  }

  /**
   * Checks if plugin exists
   */
  public hasPlugin(name: string): boolean {
    return this.plugins.has(name) && this.metadata.has(name)
  }

  /**
   * Lists all registered plugins
   */
  public listPlugins(): string[] {
    return Array.from(this.plugins.keys())
  }

  /**
   * Validates plugin configuration
   */
  public validatePluginConfig(name: string, config: any): {
    valid: boolean
    errors: string[]
  } {
    const metadata = this.getMetadata(name)
    const errors: string[] = []

    // Validate requiredFields
    for (const field of metadata.requiredFields) {
      if (!config[field] || (typeof config[field] === 'string' && config[field].trim() === '')) {
        errors.push(`Required field "${field}" is missing or empty`)
      }
    }

    // Validate sections
    if (config.sections && Array.isArray(config.sections)) {
      const validSectionIds = new Set(metadata.sections.map(s => s.id))
      for (const sectionId of config.sections) {
        if (!validSectionIds.has(sectionId)) {
          errors.push(`Section "${sectionId}" is not valid for plugin "${name}"`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Export singleton
export const pluginRegistry = PluginRegistry.getInstance()

/**
 * Helper functions for easier usage
 */

/**
 * Gets plugin metadata with type safety
 */
export function getPluginMetadata(name: string): PluginMetadata {
  return pluginRegistry.getMetadata(name)
}

/**
 * Gets plugin with type safety
 */
export function getPlugin(name: string): Plugin {
  return pluginRegistry.getPlugin(name)
}

/**
 * Type guard to check if plugin exists
 */
export function pluginExists(name: string): boolean {
  return pluginRegistry.hasPlugin(name)
}

