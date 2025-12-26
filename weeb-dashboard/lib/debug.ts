/**
 * Debug logging utilities
 * 
 * Controlled by environment variables and localStorage flags.
 * In production, all debug functions are no-ops.
 */

const DEBUG_WIZARD =
  process.env.NODE_ENV !== "production" &&
  (process.env.NEXT_PUBLIC_DEBUG_WIZARD === "1" ||
    (typeof window !== "undefined" && localStorage.getItem("debug:wizard") === "1"))

/**
 * Debug logger for wizard-related logs
 * 
 * Enable in dev: Set NEXT_PUBLIC_DEBUG_WIZARD=1 or localStorage.setItem('debug:wizard', '1')
 * 
 * @example
 * debugWizard('Plugin enabled:', pluginName)
 */
export const debugWizard = DEBUG_WIZARD
  ? (...args: any[]) => console.log("[wizard]", ...args)
  : () => {}

/**
 * Debug logger for preview-related logs
 */
export const debugPreview = DEBUG_WIZARD
  ? (...args: any[]) => console.log("[preview]", ...args)
  : () => {}
