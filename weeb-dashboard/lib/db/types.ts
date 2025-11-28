/**
 * Tipos para configurações essenciais (API keys, tokens, etc)
 * 
 * Essas são credenciais sensíveis que precisam ser armazenadas separadamente
 * das configurações não-essenciais (preferências do usuário)
 * 
 * Totalmente dinâmico: suporta qualquer plugin sem hardcoding
 */
export interface EssentialConfigs {
  [pluginName: string]: {
    [key: string]: string | undefined
  } | undefined
}

