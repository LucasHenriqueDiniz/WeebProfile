/**
 * List-scaling height audit (DEV ONLY)
 *
 * Unlike audit-section-heights.ts (which exercises each section with a single,
 * mock-data-determined item count), this script overrides each list section's
 * `*_max` nonEssential config across n=1..5 to verify calculateHeight() scales
 * correctly per-item count.
 *
 * Usage:
 *   pnpm --filter @weeb/svg-generator exec tsx scripts/audit-list-scaling.ts
 *   pnpm --filter @weeb/svg-generator exec tsx scripts/audit-list-scaling.ts --plugin=lyfta
 */

import { chromium, type Browser } from "playwright-core"
import { renderToString } from "react-dom/server"
import React from "react"
import { renderPlugins } from "../src/renderer/react-renderer.js"
import { normalizeConfig } from "../src/config/config-loader.js"
import { loadCss } from "../src/generator/css-loader.js"
import { PluginStyles } from "@weeb/weeb-plugins/templates"
import { PluginManager } from "@weeb/weeb-plugins/plugins"

type Style = "default" | "terminal"
type Size = "half" | "full"

interface ListCase {
  plugin: string
  section: string
  maxKey: string
  values: number[]
}

const CASES: ListCase[] = [
  { plugin: "lyfta", section: "exercises", maxKey: "exercises_max", values: [1, 2, 3, 4, 5] },
  { plugin: "lyfta", section: "recent_workouts", maxKey: "workouts_max", values: [1, 2, 3, 4] },
  { plugin: "codeforces", section: "recent_submissions", maxKey: "recent_submissions_max", values: [1, 2, 3, 4, 5] },
  { plugin: "codewars", section: "completed_kata", maxKey: "completed_kata_max", values: [1, 2, 3, 4, 5] },
  {
    plugin: "codewars",
    section: "languages_proficiency",
    maxKey: "languages_proficiency_max",
    values: [1, 2, 3, 4, 5],
  },
  { plugin: "duolingo", section: "languages_learning", maxKey: "languages_learning_max", values: [1, 2, 3] },
  { plugin: "stackoverflow", section: "tags_expertise", maxKey: "tags_expertise_max", values: [1, 2, 3, 4, 5] },
  { plugin: "lastfm", section: "recent_tracks", maxKey: "recent_tracks_max", values: [1, 2, 3, 4, 5] },
  { plugin: "lastfm", section: "top_artists", maxKey: "top_artists_max", values: [1, 2, 3, 4, 5] },
  { plugin: "lastfm", section: "top_albums", maxKey: "top_albums_max", values: [1, 2, 3, 4, 5] },
  { plugin: "lastfm", section: "top_tracks", maxKey: "top_tracks_max", values: [1, 2, 3, 4, 5] },
]

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (key: string) => {
    const prefix = `--${key}=`
    const found = args.find((a) => a.startsWith(prefix))
    return found ? found.slice(prefix.length) : undefined
  }
  const size = get("size") === "full" ? "full" : "half"
  return { plugin: get("plugin"), size: size as Size, width: size === "full" ? 830 : 415 }
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

async function auditOne(
  browser: Browser,
  pluginName: string,
  sectionId: string,
  maxKey: string,
  n: number,
  style: Style,
  size: Size,
  width: number
): Promise<{ calc: number; actual: number; diff: number; itemCount: number; error?: string }> {
  const pluginConfig: Record<string, unknown> = {
    enabled: true,
    sections: [sectionId],
    nonEssential: { [maxKey]: n },
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
    return { calc: 0, actual: 0, diff: 0, itemCount: 0, error: pluginsErrors[pluginName].message }
  }

  const data = pluginsData[pluginName]
  const manager = PluginManager.getInstance()
  const plugin = manager.get(pluginName)

  if (!plugin || !data) {
    return { calc: 0, actual: 0, diff: 0, itemCount: 0, error: "no data returned" }
  }

  const calc = plugin.calculateHeight(pluginsConfig[pluginName], data, size)

  const cssDefs = await loadCss(config)
  const containerClass = `${size} ${style} flex flex-col relative`
  const tree = React.createElement(
    "div",
    { id: "svg-main", className: containerClass, style: { width } },
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

  const actual = await measureHeight(browser, html, width)

  return { calc, actual, diff: actual - calc, itemCount: Math.min(n, 999) }
}

async function main() {
  const filters = parseArgs()
  console.log(`Launching browser (channel: ${getBrowserChannel()})...`)
  const browser = await chromium.launch({ channel: getBrowserChannel(), headless: true })

  let badCount = 0

  try {
    for (const c of CASES) {
      if (filters.plugin && c.plugin !== filters.plugin) continue

      console.log(`\n=== ${c.plugin}/${c.section} (override ${c.maxKey}) ===`)
      for (const style of ["default", "terminal"] as Style[]) {
        console.log(`  [${style}]`)
        for (const n of c.values) {
          const r = await auditOne(browser, c.plugin, c.section, c.maxKey, n, style, filters.size, filters.width)
          if (r.error) {
            console.log(`    n=${n}: ERROR ${r.error}`)
            continue
          }
          const flag = r.diff > 0 ? "OVERFLOW" : r.diff < -20 ? "OVERSIZED" : "ok"
          if (flag !== "ok") badCount++
          console.log(`    n=${n}: calc=${r.calc} actual=${r.actual} diff=${r.diff >= 0 ? "+" : ""}${r.diff} ${flag}`)
        }
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`\n${"=".repeat(50)}`)
  console.log(badCount === 0 ? "All n values within tolerance!" : `${badCount} out-of-tolerance results found.`)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
