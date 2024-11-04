/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react"
import PluginVariables from "./PluginVariables"
import { PluginRegistry } from "../plugins"

// WeebProfile base configuration
export interface PluginsRawConfig {
  dev?: boolean
  gist_id: string
  gh_token: string
  filename: string
  storage_method: string
  size: string
  style: string
  custom_css: string
  plugins_order: string[]
  custom_path: string
  hide_terminal_emojis: boolean
}

// Base interface for all plugin configs
export interface BasePluginConfig {
  plugin_enabled: boolean
  sections: string[]
  hide_header?: boolean
}

// Base interface for plugin metadata
export interface PluginMetadata<TConfig extends BasePluginConfig> {
  name: string
  envVariables: Record<keyof TConfig, PluginVariables>
  sections: string[]
}

// Base interface for plugin functionality
export interface PluginFunctions<TConfig extends BasePluginConfig, TData> {
  renderer: (plugin: TConfig, data: TData) => ReactNode
  fetchData: (plugin: TConfig, dev?: boolean) => Promise<TData>
}

// Combined Plugin interface
export interface Plugin<
  TName extends PluginName,
  TConfig extends BasePluginConfig = PluginRegistry[TName]["config"],
  TData = PluginRegistry[TName]["data"],
> extends PluginMetadata<TConfig>,
    PluginFunctions<TConfig, TData> {
  name: TName
}

// explicit plugin registry type

// Add a type to ensure plugin names match registry keys
export type PluginName = keyof PluginRegistry

// Helper type to get config type for a specific plugin
export type PluginConfig<K extends keyof PluginRegistry> = PluginRegistry[K]["config"]

// Helper type to get data type for a specific plugin
export type PluginData<K extends keyof PluginRegistry> = PluginRegistry[K]["data"]

// Plugin instance type
export type PluginInstance<K extends keyof PluginRegistry & string> = Plugin<
  K,
  PluginRegistry[K]["config"],
  PluginRegistry[K]["data"]
>

// Combined configuration type (base config + plugin configs)
export type PluginConfigMap = {
  [K in PluginName]?: PluginRegistry[K]["config"]
}

export interface PluginsConfig extends PluginsRawConfig, PluginConfigMap {
  [key: string]: any
}

// Tipo para o resultado do fetch de dados dos plugins
export type PluginDataResult<TName extends PluginName> = {
  name: TName
  data: PluginRegistry[TName]["data"] | null
}

// Interface para o resultado final do fetch de todos os plugins
export type PluginDataMap = {
  [K in PluginName]: PluginRegistry[K]["data"] | null
}

// Função auxiliar para criar um plugin com type safety
export function createPlugin<TName extends PluginName>(plugin: Plugin<TName>): Plugin<TName> {
  return plugin
}

// Collection of all plugins
export const plugins = [] as readonly Plugin<PluginName>[]
