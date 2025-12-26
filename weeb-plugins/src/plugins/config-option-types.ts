/**
 * Type definitions for configuration option help fields
 * 
 * This file provides types that can be used in plugin.metadata.ts files
 * to get autocomplete and type safety for help-related fields.
 */

/**
 * Helper fields for configuration options (tooltip, helpUrl, docUrl)
 * 
 * Use this type to get autocomplete when defining configOptions in plugin.metadata.ts:
 * 
 * @example
 * ```typescript
 * import type { ConfigOptionHelpFields } from '../config-option-types'
 * 
 * const option: ConfigOptionHelpFields & {
 *   key: string
 *   label: string
 *   type: "string"
 *   // ... other required fields
 * } = {
 *   key: "example",
 *   label: "Example",
 *   type: "string",
 *   tooltip: "This is a helpful tooltip",
 *   helpUrl: "https://example.com/help",
 *   docUrl: "https://example.com/docs"
 * }
 * ```
 */
export type ConfigOptionHelpFields = {
  /**
   * Tooltip text to display when hovering over the help icon.
   * Supports multi-line text with \n for line breaks.
   */
  tooltip?: string
  
  /**
   * URL to open when clicking the help link icon.
   * Usually points to external documentation or setup instructions.
   */
  helpUrl?: string
  
  /**
   * URL to documentation page (alternative to helpUrl).
   * Can be used for more detailed documentation links.
   */
  docUrl?: string
}


