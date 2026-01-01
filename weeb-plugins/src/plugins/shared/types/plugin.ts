/**
 * Interface base para plugins
 * 
 * Todos os plugins devem implementar esta interface
 */

import type React from 'react'
import type { BasePluginConfig, EssentialPluginConfig } from './base'
import type { PluginData } from '../../../types/index'

/**
 * Interface principal de um plugin
 * 
 * @template TConfig - Tipo específico da configuração do plugin (deve estender BasePluginConfig)
 * @template TData - Tipo específico dos dados retornados pelo plugin
 */
export interface Plugin<TConfig extends BasePluginConfig = BasePluginConfig, TData extends PluginData = PluginData> {
  /** Nome único do plugin (ex: 'github', 'lastfm') */
  name: string
  
  /** Chaves de configuração essencial que este plugin requer (ex: ['apiKey'] para LastFM) */
  essentialConfigKeys: string[]
  
  /** Configuração padrão do plugin */
  config: TConfig
  
  /**
   * Função para buscar dados do plugin
   *
   * @param config - Configuração do plugin (inclui enabled, sections, nonEssential)
   * @param dev - Se true, retorna dados mock
   * @param essentialConfig - Configurações essenciais (API keys, tokens) vindas do perfil
   * @param previewMode - Se true, otimiza para preview (ex: não converte imagens para base64)
   * @returns Dados do plugin
   */
  fetchData: (
    config: TConfig,
    dev?: boolean,
    essentialConfig?: EssentialPluginConfig,
    previewMode?: boolean
  ) => Promise<TData>
  
  /**
   * Função para renderizar o plugin
   * 
   * @param config - Configuração do plugin
   * @param data - Dados do plugin
   * @returns Componente React renderizado
   */
  render: (config: TConfig, data: TData) => React.ReactNode
  
  /**
   * Função opcional para validar configuração
   */
  validate?: (config: TConfig) => ValidationResult
  
  /**
   * CSS opcional específico do plugin
   * Será automaticamente carregado e injetado
   */
  styles?: string
}

/**
 * Resultado de validação de configuração
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
}

