/**
 * Height audit tool (DEV ONLY)
 *
 * For every plugin section, renders the section with mock data and compares
 * the height returned by `Plugin.calculateHeight()` against the height the
 * content actually occupies in a real browser (Playwright).
 *
 * This script is NOT part of the production svg-generator pipeline - it's a
 * one-off/maintenance tool to find sections whose `calculateHeight()` formula
 * is wrong (overflow = content gets cut off, oversized = wasted space).
 *
 * Usage:
 *   pnpm --filter @weeb/svg-generator audit:heights
 *   pnpm --filter @weeb/svg-generator audit:heights -- --plugin=github
 *   pnpm --filter @weeb/svg-generator audit:heights -- --plugin=github --section=profile
 *   pnpm --filter @weeb/svg-generator audit:heights -- --size=half --style=default
 */

import { chromium, type Browser } from "playwright-core"
import { renderToString } from "react-dom/server"
import React from "react"
import { renderPlugins } from "../src/renderer/react-renderer.js"
import { normalizeConfig } from "../src/config/config-loader.js"
import { loadCss } from "../src/generator/css-loader.js"
import { PluginStyles } from "@weeb/weeb-plugins/templates"
import { PluginManager } from "@weeb/weeb-plugins/plugins"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

type Size = "half" | "full"
type Style = "default" | "terminal"

const WIDTHS: Record<Size, number> = { half: 415, full: 830 }

interface AuditResult {
  plugin: string
  section: string
  size: Size
  style: Style
  calculated: number
  actual: number
  diff: number
  error?: string
}

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (key: string) => {
    const prefix = `--${key}=`
    const found = args.find((a) => a.startsWith(prefix))
    return found ? found.slice(prefix.length) : undefined
  }
  return {
    plugin: get("plugin"),
    section: get("section"),
    size: get("size") as Size | undefined,
    style: get("style") as Style | undefined,
  }
}

function getBrowserChannel(): "msedge" | "chrome" | "chromium" | undefined {
  const envChannel = process.env.PLAYWRIGHT_CHANNEL
  if (envChannel === "msedge" || envChannel === "chrome" || envChannel === "chromium") {
    return envChannel
  }
  if (process.platform === "win32") return "msedge"
  return "chrome"
}

async function measureHeight(browser: Browser, html: string, width: number): Promise<number> {
  const page = await browser.newPage({ viewport: { width, height: 100 } })

  // Block external network requests - mock data shouldn't depend on it,
  // and it keeps measurements fast/deterministic.
  await page.route("**/*", (route) => {
    const url = route.request().url()
    if (url.startsWith("data:") || url.startsWith("about:") || url === html) {
      return route.continue()
    }
    if (route.request().resourceType() === "document") {
      return route.continue()
    }
    return route.abort()
  })

  try {
    await page.setContent(html, { waitUntil: "load" })
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts?.ready) await document.fonts.ready.catch(() => {})
      await new Promise((r) => requestAnimationFrame(() => r(undefined)))
      await new Promise((r) => requestAnimationFrame(() => r(undefined)))
    })
    const height = await page.evaluate(() => {
      const el = document.getElementById("svg-main")
      return el ? Math.ceil(el.getBoundingClientRect().height) : 0
    })
    return height
  } finally {
    await page.close()
  }
}

async function auditSection(
  browser: Browser,
  pluginName: string,
  sectionId: string,
  size: Size,
  style: Style
): Promise<AuditResult> {
  const pluginConfig: Record<string, unknown> = {
    enabled: true,
    sections: [sectionId],
  }

  const config = normalizeConfig({
    style,
    size,
    plugins: { [pluginName]: pluginConfig },
    pluginsOrder: [pluginName],
    dev: true,
  })

  const { element, pluginsConfig, pluginsData, pluginsErrors } = await renderPlugins(config)

  if (pluginsErrors[pluginName]) {
    return {
      plugin: pluginName,
      section: sectionId,
      size,
      style,
      calculated: 0,
      actual: 0,
      diff: 0,
      error: pluginsErrors[pluginName].message,
    }
  }

  const data = pluginsData[pluginName]
  const manager = PluginManager.getInstance()
  const plugin = manager.get(pluginName)

  if (!plugin || !data) {
    return {
      plugin: pluginName,
      section: sectionId,
      size,
      style,
      calculated: 0,
      actual: 0,
      diff: 0,
      error: "no data returned",
    }
  }

  const calculated = plugin.calculateHeight(pluginsConfig[pluginName], data, size)

  const cssDefs = await loadCss(config)

  const containerClass = `${size} ${style} flex flex-col relative`
  const tree = React.createElement(
    "div",
    { id: "svg-main", className: containerClass, style: { width: WIDTHS[size] } },
    cssDefs,
    React.createElement(
      PluginStyles,
      {
        style,
        terminalTheme: config.terminalTheme,
        defaultTheme: config.defaultTheme,
        hideTerminalHeader: config.hideTerminalHeader,
      },
      element
    )
  )

  const bodyHtml = renderToString(tree)
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">${bodyHtml}</body></html>`

  const actual = await measureHeight(browser, html, WIDTHS[size])

  return {
    plugin: pluginName,
    section: sectionId,
    size,
    style,
    calculated,
    actual,
    diff: actual - calculated,
  }
}

async function main() {
  const filters = parseArgs()
  const sizes: Size[] = filters.size ? [filters.size] : ["half", "full"]
  const styles: Style[] = filters.style ? [filters.style] : ["default", "terminal"]

  console.log(`🚀 Launching browser (channel: ${getBrowserChannel()})...`)
  const browser = await chromium.launch({ channel: getBrowserChannel(), headless: true })

  const results: AuditResult[] = []

  try {
    for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
      if (filters.plugin && pluginName !== filters.plugin) continue

      for (const section of (metadata as { sections: Array<{ id: string }> }).sections) {
        if (filters.section && section.id !== filters.section) continue

        for (const size of sizes) {
          for (const style of styles) {
            process.stdout.write(`  ${pluginName}/${section.id} (${size}/${style})... `)
            try {
              const result = await auditSection(browser, pluginName, section.id, size, style)
              results.push(result)
              if (result.error) {
                console.log(`❌ ${result.error}`)
              } else {
                console.log(
                  `calc=${result.calculated} actual=${result.actual} diff=${result.diff >= 0 ? "+" : ""}${result.diff}`
                )
              }
            } catch (error) {
              console.log(`💥 ${error instanceof Error ? error.message : String(error)}`)
              results.push({
                plugin: pluginName,
                section: section.id,
                size,
                style,
                calculated: 0,
                actual: 0,
                diff: 0,
                error: error instanceof Error ? error.message : String(error),
              })
            }
          }
        }
      }
    }
  } finally {
    await browser.close()
  }

  // Report
  const errors = results.filter((r) => r.error)
  const overflow = results.filter((r) => !r.error && r.diff > 0)
  const oversized = results.filter((r) => !r.error && r.diff < -20)
  const ok = results.filter((r) => !r.error && r.diff <= 0 && r.diff >= -20)

  console.log(`\n${"=".repeat(70)}`)
  console.log(
    `📊 Summary: ${results.length} tested | ${ok.length} ok | ${overflow.length} overflow | ${oversized.length} oversized | ${errors.length} errors`
  )
  console.log("=".repeat(70))

  if (overflow.length > 0) {
    console.log(`\n⚠️  OVERFLOW (calculateHeight() too small - content may be cut off):`)
    for (const r of overflow.sort((a, b) => b.diff - a.diff)) {
      console.log(
        `  ${r.plugin}/${r.section} (${r.size}/${r.style}): calc=${r.calculated} actual=${r.actual} diff=+${r.diff}`
      )
    }
  }

  if (oversized.length > 0) {
    console.log(`\n📏 OVERSIZED (calculateHeight() too generous - wasted space, diff < -20px):`)
    for (const r of oversized.sort((a, b) => a.diff - b.diff)) {
      console.log(
        `  ${r.plugin}/${r.section} (${r.size}/${r.style}): calc=${r.calculated} actual=${r.actual} diff=${r.diff}`
      )
    }
  }

  if (errors.length > 0) {
    console.log(`\n💥 ERRORS:`)
    for (const r of errors) {
      console.log(`  ${r.plugin}/${r.section} (${r.size}/${r.style}): ${r.error}`)
    }
  }

  if (overflow.length === 0 && oversized.length === 0 && errors.length === 0) {
    console.log(`\n✅ All sections within tolerance!`)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
