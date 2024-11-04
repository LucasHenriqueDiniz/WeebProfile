import fs from "fs/promises"
import path from "path"
import logger from "source/helpers/logger"
import { PluginManager } from "source/plugins/@utils/PluginManager"

interface ValidationResult {
  pluginName: string
  status: "success" | "error"
  issues: string[]
}

async function validatePlugins(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []
  const pluginManager = PluginManager.getInstance()
  const plugins = pluginManager.getAllPlugins()

  // Required items with their descriptions
  const requiredItems = {
    "assets/default": {
      type: "directory",
      description: "for default style SVG assets",
    },
    "assets/terminal": {
      type: "directory",
      description: "for terminal style SVG assets",
    },
    "ENV_VARIABLES.ts": {
      type: "file",
      description: "containing plugin configuration variables",
    },
    "README.md": {
      type: "file",
      description: "documenting plugin usage and configuration",
    },
    "examples.yml": {
      type: "file",
      description: "showing example configurations",
    },
    test: {
      type: "directory",
      description: "for mockup data and test cases",
    },
  } as const

  for (const plugin of plugins) {
    const pluginName = plugin.name
    const issues: string[] = []
    const pluginPath = path.join(process.cwd(), "source/plugins", pluginName)

    logger({
      message: `Checking plugin: ${pluginName}`,
      level: "info",
      header: true,
    })

    // Check required files and directories
    for (const [item, { type, description }] of Object.entries(requiredItems)) {
      try {
        const itemPath = path.join(pluginPath, item)
        const stats = await fs.stat(itemPath)

        if (type === "directory" && !stats.isDirectory()) {
          issues.push(`${item} should be a directory (${description})`)
        } else if (type === "file" && !stats.isFile()) {
          issues.push(`${item} should be a file (${description})`)
        }
      } catch {
        issues.push(`Missing ${item} (${description})`)
      }
    }

    // Check if assets exist for each section
    const sections = plugin.sections
    const styles = ["default", "terminal"]

    for (const style of styles) {
      const assetsPath = path.join(pluginPath, "assets", style)
      try {
        const assets = await fs.readdir(assetsPath)

        for (const section of sections) {
          if (!assets.includes(`${section}.svg`)) {
            issues.push(`Missing ${style}/${section}.svg asset for section rendering`)
          }
        }
      } catch (error) {
        issues.push(`Error accessing ${style} assets directory: ${error}`)
      }
    }

    // Log results for this plugin
    if (issues.length === 0) {
      logger({
        message: `✅ Plugin "${pluginName}" validation successful`,
        level: "success",
      })
    } else {
      logger({
        message: `❌ Plugin "${pluginName}" has issues:`,
        level: "warn",
      })
      issues.forEach((issue) => {
        logger({
          message: `  - ${issue}`,
          level: "warn",
        })
      })
    }

    results.push({
      pluginName,
      status: issues.length === 0 ? "success" : "error",
      issues,
    })
  }

  return results
}

// Run validation
validatePlugins().catch((error) => {
  logger({
    message: `Error running plugin validation: ${error}`,
    level: "error",
    error,
  })
  process.exit(1)
})
