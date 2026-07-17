/**
 * Generate SVG Route
 *
 * POST /api/generate-svg
 * Body: { plugin: string, section: string, style?: string, size?: 'half' | 'full' }
 */

import { Request, Response } from "express"
import { generateSvg } from "../../../svg-generator/src/generator/svg-generator.js"
import { normalizeConfig } from "../../../svg-generator/src/config/config-loader.js"

export async function generateSvgRoute(req: Request, res: Response) {
  try {
    const { plugin, section, style = "default", size = "half", sectionConfig = {} } = req.body

    if (!plugin || !section) {
      return res.status(400).json({ error: "plugin and section are required" })
    }

    // Prepare plugin config
    const pluginConfig: Record<string, any> = {
      [plugin]: {
        enabled: true,
        sections: [section],
        username: "example", // Mock data
        ...sectionConfig, // Merge section-specific configs
      },
    }

    // Normalize config
    const normalizedConfig = normalizeConfig({
      style,
      size,
      plugins: pluginConfig,
      pluginsOrder: [plugin],
      dev: true, // Use mock data
    })

    // Generate SVG
    let result
    try {
      result = await generateSvg(normalizedConfig)
      console.log("✅ SVG generated successfully")
    } catch (error) {
      console.error("❌ Error generating SVG:", error)
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
      throw error
    }

    res.json({
      svg: result.svg,
      height: result.height,
      width: result.width,
    })
  } catch (error) {
    console.error("❌ Error generating SVG:", error)
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate SVG",
      details: error instanceof Error ? error.stack : String(error),
    })
  }
}
