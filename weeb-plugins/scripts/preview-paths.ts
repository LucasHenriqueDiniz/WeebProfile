/**
 * Where a section preview lives, shared by the script that writes previews and the one
 * that checks for them. validate-previews kept its own idea of the path
 * (previews/<plugin>_<section>.svg, with no style folder), so it reported every
 * preview as missing and CI learned to ignore it.
 */
import * as path from "path"

export const PREVIEW_STYLES = ["default", "terminal"] as const
export type PreviewStyle = (typeof PREVIEW_STYLES)[number]

export function previewPath(pluginsDir: string, plugin: string, style: PreviewStyle, sectionId: string): string {
  return path.join(pluginsDir, plugin, "previews", style, `${sectionId}.svg`)
}
