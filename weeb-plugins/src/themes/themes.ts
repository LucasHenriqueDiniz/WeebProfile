/**
 * Theme Definitions - CSS Variables Only
 * 
 * All themes are defined as CSS variable values.
 * The default theme is the base, and other themes override specific variables.
 */

export interface ThemeVariables {
  // Default style variables
  '--default-color-surface': string
  '--default-color-background': string
  '--default-color-default': string
  '--default-color-success': string
  '--default-color-muted': string
  '--default-color-muted-light': string
  '--default-color-raw': string
  '--default-color-highlight': string
}

export interface TerminalThemeVariables {
  // Terminal style variables
  '--terminal-color-surface': string
  '--terminal-color-background': string
  '--terminal-color-highlight': string
  '--terminal-color-default': string
  '--terminal-color-success': string
  '--terminal-color-muted': string
  '--terminal-color-muted-light': string
  '--terminal-color-raw': string
}

/**
 * Default themes - only highlight color changes
 * All other variables stay the same as default
 */
export const defaultThemes: Record<string, ThemeVariables> = {
  default: {
    '--default-color-surface': '#ffffff',
    '--default-color-background': '#ffffff',
    '--default-color-default': '#9fa9b5', 
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#FF7A3D',
  },

  purple: {
    '--default-color-surface': '#f7f2ff',
    '--default-color-background': '#f2e9ff',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#8957E5',
  },

  pink: {
    '--default-color-surface': '#fff0f7',
    '--default-color-background': '#ffe4f0',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#E5579A',
  },

  cyan: {
    '--default-color-surface': '#ecfeff',
    '--default-color-background': '#e0fbff',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#06b6d4',
  },

  orange: {
    '--default-color-surface': '#fff7ed',
    '--default-color-background': '#ffedd5',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#f97316',
  },

  blue: {
    '--default-color-surface': '#eff6ff',
    '--default-color-background': '#dbeafe',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#3b82f6',
  },

  green: {
    '--default-color-surface': '#ecfdf5',
    '--default-color-background': '#d1fae5',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#10b981',
  },

  red: {
    '--default-color-surface': '#fef2f2',
    '--default-color-background': '#fee2e2',
    '--default-color-default': '#9fa9b5',
    '--default-color-success': '#2da44e',
    '--default-color-muted': '#6e7781',
    '--default-color-muted-light': '#8c959f',
    '--default-color-raw': '#9fa9b5',
    '--default-color-highlight': '#ef4444',
  },
}

/**
 * Terminal themes
 */
export const terminalThemes: Record<string, TerminalThemeVariables> = {
  default: {
    '--terminal-color-surface': '#161b22',   
    '--terminal-color-background': '#0d1117', 
    '--terminal-color-highlight': '#58a6ff',
    '--terminal-color-default': '#c9d1d9',
    '--terminal-color-success': '#3fb950',
    '--terminal-color-muted': '#8b949e',
    '--terminal-color-muted-light': '#6e7681',
    '--terminal-color-raw': '#c9d1d9',
  },
  dracula: {
    '--terminal-color-surface': '#282a36',
    '--terminal-color-background': '#1e1f29',
    '--terminal-color-highlight': '#bd93f9',
    '--terminal-color-default': '#f8f8f2',
    '--terminal-color-success': '#50fa7b',
    '--terminal-color-muted': '#6272a4',
    '--terminal-color-muted-light': '#8be9fd',
    '--terminal-color-raw': '#f8f8f2',
  },
  monokai: {
    '--terminal-color-surface': '#272822',
    '--terminal-color-background': '#1e1e1e',
    '--terminal-color-highlight': '#a6e22e',
    '--terminal-color-default': '#f8f8f2',
    '--terminal-color-success': '#a6e22e',
    '--terminal-color-muted': '#75715e',
    '--terminal-color-muted-light': '#e6db74',
    '--terminal-color-raw': '#f8f8f2',
  },
}

