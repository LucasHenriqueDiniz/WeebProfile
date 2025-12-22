/**
 * Tipos principais do Core V2
 */

/**
 * Configuração de um plugin individual
 * Totalmente dinâmico - suporta qualquer plugin
 */
export interface PluginConfig {
  enabled: boolean
  sections: string[]
  username?: string // Alguns plugins podem ter username aqui, outros em essentialConfigs
  [key: string]: any // Permite propriedades adicionais específicas do plugin
}

/**
 * Mapa de configurações de plugins
 * Totalmente dinâmico - suporta qualquer plugin sem hardcoding
 */
export interface PluginConfigMap {
  [pluginName: string]: PluginConfig | undefined
}

export interface SvgConfig {
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  plugins: PluginConfigMap
  pluginsOrder?: string[] // Ordem dos plugins (dinâmico)
  customCss?: string
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  primaryColor?: string // Cor primária personalizada
  dev?: boolean // Modo desenvolvimento (usa dados mock)
  useRealMeasurement?: boolean // Se true, mede altura real com Playwright (mais lento mas preciso)
  // Configurações essenciais (API keys, tokens) por plugin
  // Totalmente dinâmico - suporta qualquer plugin
  essentialConfigs?: {
    [pluginName: string]: {
      [key: string]: string | undefined
    } | undefined
  }
}

export interface SvgGenerationResult {
  svg: string
  height: number
  width: number
  debug?: {
    config: SvgConfig // Config sanitizada (sem API keys/tokens)
    pluginsData: Record<string, any> // Dados dos plugins usados na geração
    pluginsErrors?: Record<string, string> // Erros ocorridos (se houver)
  }
}

