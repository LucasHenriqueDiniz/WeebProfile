/**
 * Default Themes
 * 
 * Re-export from weeb-plugins/themes/themes
 * Themes are now just CSS variables
 */

import { defaultThemes as themes } from '../weeb-plugins/themes/themes'

// Convert CSS variables format to old format for compatibility
// This is used by Step3Style.tsx to get default values
export const defaultThemes = {
  default: {
    surface: themes.default['--default-color-surface'],
    background: themes.default['--default-color-background'],
    default: themes.default['--default-color-default'],
    success: themes.default['--default-color-success'],
    muted: themes.default['--default-color-muted'],
    mutedLight: themes.default['--default-color-muted-light'],
    raw: themes.default['--default-color-raw'],
    highlight: themes.default['--default-color-highlight'],
  },
  defaultCustom: {
    surface: themes.default['--default-color-surface'],
    background: themes.default['--default-color-background'],
    default: themes.default['--default-color-default'],
    success: themes.default['--default-color-success'],
    muted: themes.default['--default-color-muted'],
    mutedLight: themes.default['--default-color-muted-light'],
    raw: themes.default['--default-color-raw'],
    highlight: themes.default['--default-color-highlight'],
  },
}
