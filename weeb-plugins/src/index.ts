/**
 * @weeb/weeb-plugins
 * 
 * Weeb Plugins - Plugins e templates otimizados
 */

// Plugins
export * from './plugins/index'

// Templates
export * from './templates/index'

// Types
export * from './types/index'

// Utils
export * from './utils/number'
export * from './utils/pseudo-commands'
export * from './utils/string'
export * from './utils/emoji'
export { ImageComponent } from './utils/image'

// Themes
export * from './themes/index'

// Styles - NOT exported for browser compatibility
// Use @weeb/weeb-plugins/styles only in Node.js environments (svg-generator)
// For browser (weeb-dashboard), use generated files from lib/styles

