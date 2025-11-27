/**
 * Default Theme CSS Variables
 * 
 * Lista de todas as variáveis CSS usadas pelos temas default
 * Exportado para uso no frontend
 */

export const DEFAULT_THEME_VARIABLES = [
  '--default-color-surface',
  '--default-color-background',
  '--default-color-default',
  '--default-color-success',
  '--default-color-muted',
  '--default-color-muted-light',
  '--default-color-raw',
  '--default-color-highlight',
] as const

export type DefaultThemeVariable = typeof DEFAULT_THEME_VARIABLES[number]

/**
 * Mapeamento de nomes amigáveis para variáveis CSS
 */
export const DEFAULT_THEME_VARIABLE_LABELS: Record<DefaultThemeVariable, string> = {
  '--default-color-surface': 'Surface',
  '--default-color-background': 'Background',
  '--default-color-default': 'Text',
  '--default-color-success': 'Success',
  '--default-color-muted': 'Muted',
  '--default-color-muted-light': 'Muted Light',
  '--default-color-raw': 'Raw',
  '--default-color-highlight': 'Highlight',
}

/**
 * Descrições das variáveis
 */
export const DEFAULT_THEME_VARIABLE_DESCRIPTIONS: Record<DefaultThemeVariable, string> = {
  '--default-color-surface': 'Cor da superfície/container',
  '--default-color-background': 'Cor de fundo',
  '--default-color-default': 'Cor do texto principal',
  '--default-color-success': 'Cor de sucesso',
  '--default-color-muted': 'Cor de texto secundário/muted',
  '--default-color-muted-light': 'Cor de texto muted claro',
  '--default-color-raw': 'Cor de texto raw (não usado mais)',
  '--default-color-highlight': 'Cor de destaque (botões, links, etc)',
}


