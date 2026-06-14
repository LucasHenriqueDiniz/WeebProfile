import fs from "node:fs/promises"
import path from "node:path"
import { generateSvg } from "../src/index.js"
import { normalizeConfig } from "../src/config/config-loader.js"

async function main() {
  const outDir = path.resolve(process.cwd(), "debug-previews")
  await fs.mkdir(outDir, { recursive: true })

  for (const style of ["default", "terminal"] as const) {
    for (const size of ["half", "full"] as const) {
      const config = normalizeConfig({
        style,
        size,
        plugins: {
          github: {
            enabled: true,
            sections: ["recent_activity"],
          },
        },
        pluginsOrder: ["github"],
        dev: true,
      })

      const result = await generateSvg(config)
      const fileName = `github-recent_activity-${style}-${size}.svg`
      await fs.writeFile(path.join(outDir, fileName), result.svg, "utf-8")
      console.log(`✅ ${fileName} (height=${result.height}px)`)
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
