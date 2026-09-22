/**
 * Generate React HTML Route
 *
 * POST /api/generate-react
 * Body: { plugin: string, section: string, style?: string, size?: 'half' | 'full' }
 */

import { Request, Response, Router } from "express"
import { renderToString } from "react-dom/server"
import { normalizeConfig } from "../../../svg-generator/src/config/config-loader"
import { injectDebugIds } from "../utils/inject-debug-ids"
import { renderPlugins } from "../utils/render-plugins"

const router = Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    const { plugin, section, style = "default", theme = "default", size = "half", sectionConfig = {} } = req.body

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
      [style === "terminal" ? "terminalTheme" : "defaultTheme"]: theme,
      size,
      plugins: pluginConfig,
      pluginsOrder: [plugin],
      dev: true, // Use mock data
    })

    // Render plugins using direct imports
    let pluginsContent
    try {
      const renderResult = await renderPlugins({
        plugins: pluginConfig,
        style,
        theme,
        size,
        dev: true,
      })
      pluginsContent = renderResult.element
      console.log("✅ React render successful (using direct imports)")
    } catch (error) {
      console.error("❌ Error rendering plugins:", error)
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
      throw error
    }

    // Get CSS - import directly from weeb-plugins/src
    let stylesModule, themeUtilsModule
    try {
      stylesModule = await import("../../../weeb-plugins/src/styles/server")
      themeUtilsModule = await import("../../../weeb-plugins/src/themes/theme-utils")
      console.log("✅ CSS modules imported successfully")
    } catch (error) {
      console.error("❌ Error importing CSS modules:", error)
      throw error
    }

    const completeCSS = await stylesModule.getCompleteCSS(style, { [plugin]: { enabled: true } })

    // Get theme based on style
    const selectedTheme =
      style === "terminal"
        ? (normalizedConfig as any).terminalTheme || "default"
        : normalizedConfig.defaultTheme || "default"

    // Get theme variables based on style
    const themeVariables =
      style === "terminal"
        ? themeUtilsModule.getTerminalThemeVariables(selectedTheme)
        : themeUtilsModule.getDefaultThemeVariables(selectedTheme, (normalizedConfig as any).customThemeColors)

    const themeVariablesCss = Object.entries(themeVariables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n")

    const fullCSS = `
      #svg-main {
${themeVariablesCss}
      }
      ${completeCSS}
    `

    // Create React HTML with proper container
    const containerClass = style === "terminal" ? "terminal-container" : "default-container"
    const mainClasses = `${size} ${style === "terminal" ? "terminal" : ""}`.trim()
    const reactHtml = `<div id="svg-main" class="${mainClasses}" style="font-family: Poppins, sans-serif; width: ${size === "half" ? 415 : 830}px;">
      <style>
        #svg-main {
${themeVariablesCss}
        }
        ${completeCSS}
      </style>
      <div class="${containerClass}">
        ${renderToString(pluginsContent)}
      </div>
    </div>`

    // Inject debug IDs for element matching
    const reactHtmlWithDebugIds = injectDebugIds(reactHtml, plugin, section)

    // Generate debug version for cache invalidation
    const debugVersion = Date.now()

    res.json({
      html: reactHtmlWithDebugIds,
      css: fullCSS,
      debugVersion,
    })
  } catch (error) {
    console.error("❌ Error generating React HTML:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate React HTML",
      details: error instanceof Error ? error.stack : String(error),
    })
  }
})

export default router
