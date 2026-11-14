/**
 * Lists the section previews that are missing: one per section and preview style, at the
 * path generate-preview-images writes to (scripts/preview-paths.ts). Sections come from
 * PLUGINS_METADATA, the generated metadata `pnpm validate` keeps in step with the plugins.
 *
 * Execute: pnpm validate-previews [--warn-only]
 *
 * It used to look for previews/<plugin>_<section>.svg, a layout the generator never
 * used, and read section ids with a regex over plugin.metadata.ts. Every preview read
 * as missing, so the CI step was advisory and nobody could tell a real gap from noise.
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { PLUGINS_METADATA } from "../src/plugins/metadata.js"
import { PREVIEW_STYLES, previewPath, type PreviewStyle } from "./preview-paths.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, "../src/plugins")

interface ExpectedPreview {
  plugin: string
  section: string
  style: PreviewStyle
  path: string
}

export function expectedPreviews(pluginsDir: string = PLUGINS_DIR): ExpectedPreview[] {
  const metadata = PLUGINS_METADATA as Record<string, { sections?: Array<{ id: string }> }>
  return Object.keys(metadata)
    .sort()
    .flatMap((plugin) =>
      (metadata[plugin]?.sections ?? []).flatMap((section) =>
        PREVIEW_STYLES.map((style) => ({
          plugin,
          section: section.id,
          style,
          path: previewPath(pluginsDir, plugin, style, section.id),
        }))
      )
    )
}

function main() {
  const warnOnly = process.argv.includes("--warn-only") || process.argv.includes("-w")
  const expected = expectedPreviews()
  const missing = expected.filter((preview) => !fs.existsSync(preview.path))

  const byPlugin = new Map<string, ExpectedPreview[]>()
  for (const preview of expected) byPlugin.set(preview.plugin, [...(byPlugin.get(preview.plugin) ?? []), preview])

  console.log("🔍 Section previews\n")
  for (const [plugin, previews] of byPlugin) {
    const absent = previews.filter((p) => missing.includes(p))
    console.log(
      `${absent.length === 0 ? "✅" : "⚠️ "} ${plugin}: ${previews.length - absent.length}/${previews.length}`
    )
    for (const p of absent) console.log(`     - ${p.style}/${p.section}.svg (${path.relative(process.cwd(), p.path)})`)
  }

  console.log(
    `\n${expected.length - missing.length} of ${expected.length} previews present, ${missing.length} missing.`
  )
  if (missing.length === 0) process.exit(0)

  console.log("\n💡 With the svg-generator running (pnpm dev:generator): pnpm generate-previews")
  process.exit(warnOnly ? 0 : 1)
}

// Runs only as a script, so the test can import expectedPreviews.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main()
