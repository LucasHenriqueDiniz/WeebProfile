/**
 * Generates sample SVGs for the sections whose calculateHeight() formulas were
 * fixed for variable list lengths (n=1,2,5), so the fix can be reviewed visually.
 *
 * Usage:
 *   pnpm --filter @weeb/svg-generator exec tsx scripts/generate-list-scaling-previews.ts
 */

import fs from "node:fs/promises"
import path from "node:path"
import { generateSvg } from "../src/index.js"
import { normalizeConfig } from "../src/config/config-loader.js"

type Style = "default" | "terminal"
type Size = "half" | "full"

interface ListCase {
  plugin: string
  section: string
  maxKey: string
}

const CASES: ListCase[] = [
  { plugin: "lyfta", section: "exercises", maxKey: "exercises_max" },
  { plugin: "lyfta", section: "recent_workouts", maxKey: "workouts_max" },
  { plugin: "codeforces", section: "recent_submissions", maxKey: "recent_submissions_max" },
  { plugin: "codewars", section: "completed_kata", maxKey: "completed_kata_max" },
  { plugin: "codewars", section: "languages_proficiency", maxKey: "languages_proficiency_max" },
  { plugin: "duolingo", section: "languages_learning", maxKey: "languages_learning_max" },
  { plugin: "stackoverflow", section: "tags_expertise", maxKey: "tags_expertise_max" },
  { plugin: "lastfm", section: "recent_tracks", maxKey: "recent_tracks_max" },
  { plugin: "lastfm", section: "top_artists", maxKey: "top_artists_max" },
  { plugin: "lastfm", section: "top_albums", maxKey: "top_albums_max" },
  { plugin: "lastfm", section: "top_tracks", maxKey: "top_tracks_max" },
]

const N_VALUES = [1, 2, 5]
const SIZES: Size[] = ["half", "full"]
const STYLES: Style[] = ["default", "terminal"]

async function main() {
  const outDir = path.resolve(process.cwd(), "debug-previews")
  await fs.mkdir(outDir, { recursive: true })

  for (const c of CASES) {
    for (const size of SIZES) {
      for (const style of STYLES) {
        for (const n of N_VALUES) {
          const pluginConfig: Record<string, unknown> = {
            enabled: true,
            sections: [c.section],
            nonEssential: { [c.maxKey]: n },
          }

          const config = normalizeConfig({
            style,
            size,
            plugins: { [c.plugin]: pluginConfig },
            pluginsOrder: [c.plugin],
            dev: true,
          })

          const result = await generateSvg(config)

          const fileName = `${c.plugin}-${c.section}-${style}-${size}-n${n}.svg`
          await fs.writeFile(path.join(outDir, fileName), result.svg, "utf-8")
          console.log(`✅ ${fileName} (height=${result.height}px)`)
        }
      }
    }
  }

  console.log(`\nDone! SVGs saved to ${outDir}`)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
