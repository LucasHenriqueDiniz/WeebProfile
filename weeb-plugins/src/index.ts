/**
 * @weeb/weeb-plugins
 *
 * Weeb Plugins - Plugins e templates otimizados
 */

// Plugins
export * from "./plugins/index.js"

// Templates
export * from "./templates/index.js"

// Types
export * from "./types/index.js"

// Utils
export * from "./utils/number.js"
export * from "./utils/pseudo-commands.js"
export * from "./utils/string.js"
export * from "./utils/emoji.js"
export { ImageComponent } from "./utils/image.js"

// Themes
export * from "./themes/index.js"

// Styles - NOT exported for browser compatibility
// Use @weeb/weeb-plugins/styles only in Node.js environments (svg-generator)
// For browser (weeb-dashboard), use generated files from lib/styles
