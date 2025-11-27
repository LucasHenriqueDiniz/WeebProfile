/**
 * Plugin Styles
 */

import { defaultStyleCSS } from './default'
import { terminalStyleCSS } from './terminal'

export const pluginStyles = {
  default: defaultStyleCSS,
  terminal: terminalStyleCSS,
}

export function getStyleCSS(styleName) {
  return pluginStyles[styleName] || pluginStyles.default || ''
}

export default pluginStyles
