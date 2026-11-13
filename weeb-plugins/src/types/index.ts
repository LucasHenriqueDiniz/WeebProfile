/**
 * Tipos compartilhados do Source V2
 */

export interface PluginConfig {
  enabled: boolean
  sections: string[]
  [key: string]: unknown
}

export interface PluginData {
  [key: string]: unknown
}

/**
 * Mapa de dados de plugins
 *
 * Usamos any para evitar dependência circular com os tipos de plugin
 */
export type PluginDataMap = Record<string, any>
