/**
 * @weeb/svg-generator
 *
 * SVG Generator - Gerador de SVG otimizado
 *
 * IMPORTANTE: Este pacote é server-only e não deve ser importado no cliente
 */

export { generateSvg } from "./generator/svg-generator.js"
export { calculateSvgWidth, calculateEstimatedHeight } from "./generator/height-calculator.js"
export { loadCss } from "./generator/css-loader.js"
export { normalizeConfig, validateConfig } from "./config/config-loader.js"
export type { SvgConfig, SvgGenerationResult, PluginConfigMap } from "./types/index.js"
