/**
 * Tipos base compartilhados para plugins
 * 
 * Define a estrutura fundamental de configurações de plugins,
 * separando dados sensíveis (essenciais) de preferências do usuário (não-essenciais)
 */

/**
 * Configurações essenciais - dados sensíveis (API keys, tokens, etc)
 * Esses dados são armazenados separadamente no banco de dados
 */
export interface EssentialPluginConfig {
  [key: string]: string | undefined
}

/**
 * Configurações não-essenciais - preferências do usuário
 * Essas são armazenadas em pluginsConfig no banco de dados
 */
export interface NonEssentialPluginConfig {
  [key: string]: any
}

/**
 * Configuração base de um plugin
 *
 * Separa claramente:
 * - enabled: se o plugin está ativo
 * - sections: quais seções estão habilitadas
 * - essential: credenciais sensíveis (vem do essentialConfigs do perfil)
 * - nonEssential: preferências do usuário (vem do pluginsConfig)
 * - previewMode: se está em modo preview (não converte imagens para base64)
 */
export interface BasePluginConfig {
  enabled: boolean
  sections: string[]
  essential?: EssentialPluginConfig
  nonEssential?: NonEssentialPluginConfig
  previewMode?: boolean
}

