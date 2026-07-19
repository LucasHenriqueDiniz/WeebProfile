/**
 * Shared publish-gate for SVG generation, used by both the cron job
 * (functions/api/cron/generate-svgs.ts) and the manual regenerate endpoint
 * (functions/api/svgs/[id]/generate.ts). A plugin can fail internally (e.g. an
 * upstream API outage) while the overall HTTP call to svg-generator still
 * succeeds -- the generator renders a <PluginError> box for that section
 * instead of throwing. That's a degraded result, not a fresh valid SVG:
 * publishing it would silently replace a previously-working card with one
 * showing a broken section, whether the trigger was the cron or a user click.
 */
export class PartialPluginFailureError extends Error {
  code = "PARTIAL_PLUGIN_FAILURE"
  constructor(public pluginErrors: Record<string, string>) {
    super(`Plugin error(s): ${JSON.stringify(pluginErrors)}`)
    this.name = "PartialPluginFailureError"
  }
}

/**
 * Throws if the svg-generator response reports any plugin error. Callers must
 * call this before saving to R2 / updating the DB row to "completed" -- on
 * throw, the existing storagePath/storageUrl/status for that SVG must be left
 * untouched so the previously-published version keeps serving.
 */
export function assertGenerationSucceeded(result: {
  hasErrors?: boolean
  pluginErrors?: Record<string, string>
}): void {
  if (result.hasErrors && result.pluginErrors && Object.keys(result.pluginErrors).length > 0) {
    throw new PartialPluginFailureError(result.pluginErrors)
  }
}
