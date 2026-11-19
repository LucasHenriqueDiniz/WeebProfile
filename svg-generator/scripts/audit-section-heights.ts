/**
 * Height audit tool (DEV ONLY)
 *
 * For every plugin section, renders the section with mock data and compares
 * the height returned by `Plugin.calculateHeight()` against the height the
 * content actually occupies in a real browser (Playwright).
 *
 * This script is NOT part of the production svg-generator pipeline - it's a
 * one-off/maintenance tool to find sections whose `calculateHeight()` formula
 * is wrong (negative diff = content gets cut off, positive = blank space under it).
 *
 * Usage:
 *   pnpm --filter @weeb/svg-generator audit:heights
 *   pnpm --filter @weeb/svg-generator audit:heights -- --plugin=github
 *   pnpm --filter @weeb/svg-generator audit:heights -- --plugin=github --section=profile
 *   pnpm --filter @weeb/svg-generator audit:heights -- --size=half --style=default
 *   pnpm --filter @weeb/svg-generator audit:heights -- --variants --engine=all --json=heights.json
 *
 * Each plugin also gets a row "(all)": every section in one card, with the defaults.
 *
 * --variants   also renders each section with every option that can change its height
 *              set away from its default: each boolean flipped, each other select value,
 *              each number option at its min and at its max (one option at a time).
 * --engine     chrome (the installed Chrome, default), chromium, firefox, webkit, or all
 *              (chrome + firefox + webkit). The diff is taken against the tallest engine.
 * --options    JSON merged into every case's plugin config, e.g. --options='{"personality_type":"INTJ"}'.
 * --data-variants  path to a module whose default export maps a name to a function of the
 *              plugin's mock data; each section is also rendered with each changed mock
 *              (default options), labelled "data:<name>".
 * --probe=N    prints each case's box tree, N levels deep, from the first engine
 *              (tag, classes, top and height): where a formula goes wrong.
 * --json       writes every row to that file.
 * --md         writes the rows as a markdown table to that file.
 *
 * The process runs in UTC: sections that group by day (GitHub recent_activity) use the
 * process's time zone, and the section tests are measured in UTC.
 */

process.env.TZ = "UTC"

import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { chromium, firefox, webkit, type Browser } from "playwright-core"
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
type Engine = "chrome" | "chromium" | "firefox" | "webkit"
type Options = Record<string, unknown>

const WIDTHS: Record<Size, number> = { half: 415, full: 830 }
/** calc may be this much over the tallest engine and still count as exact. */
const TOLERANCE = 2

interface ConfigOption {
  key: string
  type: string
  defaultValue?: unknown
  min?: number
  max?: number
  options?: Array<{ value: string }>
}

interface SectionMetadata {
  id: string
  configOptions?: ConfigOption[]
}

interface AuditResult {
  plugin: string
  section: string
  size: Size
  style: Style
  variant: string
  /** Every section of the case, and the options it set: enough to replay it in a test. */
  sections: string[]
  options: Options
  calculated: number
  drawn: Partial<Record<Engine, number>>
  /** calculated - tallest drawn: negative cuts the card, positive leaves blank space. */
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
    engine: get("engine") ?? "chrome",
    variants: args.includes("--variants"),
    dataVariants: get("data-variants"),
    probe: get("probe") ? Number(get("probe")) : undefined,
    options: JSON.parse(get("options") ?? "{}") as Options,
    json: get("json"),
    md: get("md"),
  }
}

function engines(name: string): Engine[] {
  if (name === "all") return ["chrome", "firefox", "webkit"]
  if (name === "chrome" || name === "chromium" || name === "firefox" || name === "webkit") return [name]
  throw new Error(`unknown engine "${name}"`)
}

/**
 * PLAYWRIGHT_EXECUTABLE_PATH points at a Chromium binary directly, for environments
 * (containers, CI) that ship one but have no installed channel to resolve.
 */
async function launch(engine: Engine): Promise<Browser> {
  if (engine === "firefox") return firefox.launch({ headless: true })
  if (engine === "webkit") return webkit.launch({ headless: true })
  const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
  if (executablePath) return chromium.launch({ executablePath, headless: true })
  if (engine === "chromium") return chromium.launch({ headless: true })
  return chromium.launch({ channel: process.platform === "win32" ? "msedge" : "chrome", headless: true })
}

/** One option set per option that can change a section's height, plus the defaults. */
function optionVariants(section: SectionMetadata, globalOptions: ConfigOption[]): Array<[string, Options]> {
  const variants: Array<[string, Options]> = [["defaults", {}]]
  for (const option of [...(section.configOptions ?? []), ...globalOptions]) {
    const { key, type, defaultValue } = option
    if (type === "boolean") {
      variants.push([`${key}=${!defaultValue}`, { [key]: !defaultValue }])
    } else if (type === "select") {
      for (const { value } of option.options ?? []) {
        if (value !== defaultValue) variants.push([`${key}=${value}`, { [key]: value }])
      }
    } else if (type === "number") {
      const values = new Set([option.min ?? 1, option.max ?? 20])
      for (const value of values) {
        if (value !== defaultValue) variants.push([`${key}=${value}`, { [key]: value }])
      }
    }
  }
  return variants
}

async function measureHeight(browser: Browser, html: string, width: number): Promise<number> {
  const page = await browser.newPage({ viewport: { width, height: 100 } })

  // Block external network requests - mock data shouldn't depend on it,
  // and it keeps measurements fast/deterministic.
  await page.route("**/*", (route) => {
    const url = route.request().url()
    if (url.startsWith("data:") || url.startsWith("about:")) return route.continue()
    if (route.request().resourceType() === "document") return route.continue()
    return route.abort()
  })

  try {
    await page.setContent(html, { waitUntil: "load" })
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready.catch(() => {})
      await new Promise((r) => requestAnimationFrame(() => r(undefined)))
      await new Promise((r) => requestAnimationFrame(() => r(undefined)))
    })
    return await page.evaluate(() => {
      const el = document.getElementById("svg-main")
      return el ? Math.ceil(el.getBoundingClientRect().height) : 0
    })
  } finally {
    await page.close()
  }
}

async function probeTree(browser: Browser, html: string, width: number, depth: number): Promise<string> {
  const page = await browser.newPage({ viewport: { width, height: 100 } })
  try {
    await page.setContent(html, { waitUntil: "load" })
    // A string, not a function: tsx's esbuild wraps named functions in a __name helper
    // that does not exist in the page.
    return await page.evaluate(`(() => {
      const root = document.getElementById("svg-main")
      const top0 = root.getBoundingClientRect().top
      const lines = []
      function walk(el, d) {
        if (d > ${depth} || ["STYLE", "SCRIPT", "defs", "svg"].includes(el.tagName)) return
        const r = el.getBoundingClientRect()
        const cls = (el.getAttribute("class") || "").slice(0, 70)
        const text = el.children.length === 0 ? ' "' + (el.textContent || "").trim().slice(0, 30) + '"' : ""
        lines.push("  ".repeat(d) + el.tagName.toLowerCase() + " y=" + +(r.top - top0).toFixed(2) + " h=" + +r.height.toFixed(2) + " w=" + +r.width.toFixed(2) + " ." + cls + text)
        for (const child of Array.from(el.children)) walk(child, d + 1)
      }
      walk(root, 0)
      return lines.join("\\n")
    })()`)
  } finally {
    await page.close()
  }
}

/** The section's HTML as the generator lays it out, and its calculateHeight(). */
async function renderSection(
  pluginName: string,
  sectionIds: string[],
  size: Size,
  style: Style,
  options: Options,
  mutate?: (data: any) => any
): Promise<{ html: string; calculated: number } | { error: string }> {
  const config = normalizeConfig({
    style,
    size,
    // Options at the root of the plugin config, where the dashboard stores them.
    plugins: { [pluginName]: { enabled: true, sections: sectionIds, ...options } as never },
    pluginsOrder: [pluginName],
    dev: true,
  })

  const rendered = await renderPlugins(config)
  const { pluginsConfig, pluginsData, pluginsErrors } = rendered
  if (pluginsErrors[pluginName]) return { error: pluginsErrors[pluginName].message }

  const plugin = PluginManager.getInstance().get(pluginName)
  if (!plugin || !pluginsData[pluginName]) return { error: "no data returned" }
  const data = mutate ? mutate(structuredClone(pluginsData[pluginName])) : pluginsData[pluginName]
  // A changed mock: rendered as renderPlugins renders a plugin, one React root of its own.
  const element = mutate
    ? React.createElement(
        "div",
        null,
        React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: renderToString(plugin.render(pluginsConfig[pluginName], data) as React.ReactElement, {
              identifierPrefix: `${pluginName}-`,
            }),
          },
        })
      )
    : rendered.element

  const calculated = plugin.calculateHeight(pluginsConfig[pluginName], data, size)
  const cssDefs = await loadCss(config)

  const tree = React.createElement(
    "div",
    { id: "svg-main", className: `${size} ${style} flex flex-col relative`, style: { width: WIDTHS[size] } },
    cssDefs,
    React.createElement(
      PluginStyles,
      {
        style,
        terminalTheme: config.terminalTheme,
        defaultTheme: config.defaultTheme,
        // Sections only: calculateHeight never counts the terminal header, generateSvg
        // adds it once per SVG. Drawn here, it showed every terminal section 32px short.
        hideTerminalHeader: true,
      },
      element
    )
  )

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">${renderToString(tree)}</body></html>`
  return { html, calculated }
}

function formatRow(r: AuditResult, engineList: Engine[]): string {
  if (r.error) return `${r.plugin}/${r.section} ${r.style}/${r.size} [${r.variant}] ERROR ${r.error}`
  const drawn = engineList.map((e) => r.drawn[e]).join("/")
  return `${r.plugin}/${r.section} ${r.style}/${r.size} [${r.variant}] calc=${r.calculated} drawn=${drawn} diff=${r.diff > 0 ? "+" : ""}${r.diff}`
}

async function main() {
  const filters = parseArgs()
  const sizes: Size[] = filters.size ? [filters.size] : ["half", "full"]
  const styles: Style[] = filters.style ? [filters.style] : ["default", "terminal"]
  const engineList = engines(filters.engine)
  const dataVariants: Record<string, (data: any) => any> = filters.dataVariants
    ? (await import(pathToFileURL(resolve(filters.dataVariants)).href)).default
    : {}

  const browsers = new Map<Engine, Browser>()
  for (const engine of engineList) {
    const browser = await launch(engine)
    console.log(`🚀 ${engine} ${browser.version()}`)
    browsers.set(engine, browser)
  }

  const results: AuditResult[] = []

  try {
    for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
      if (filters.plugin && pluginName !== filters.plugin) continue
      const { sections, globalConfigOptions } = metadata as {
        sections: SectionMetadata[]
        globalConfigOptions?: ConfigOption[]
      }

      // Each section alone, then (unless one section is asked for) all of them in one card:
      // the gaps between sections and the terminal body's padding only show there.
      const units: Array<{ id: string; ids: string[]; section?: SectionMetadata }> = sections.map((s) => ({
        id: s.id,
        ids: [s.id],
        section: s,
      }))
      if (!filters.section && sections.length > 1) units.push({ id: "(all)", ids: sections.map((s) => s.id) })

      for (const { id, ids, section } of units) {
        if (filters.section && id !== filters.section) continue
        const variants: Array<[string, Options, ((data: any) => any)?]> =
          filters.variants && section ? optionVariants(section, globalConfigOptions ?? []) : [["defaults", {}]]
        for (const [name, mutate] of Object.entries(dataVariants)) variants.push([`data:${name}`, {}, mutate])

        for (const [variant, options, mutate] of variants) {
          for (const size of sizes) {
            for (const style of styles) {
              const row: AuditResult = {
                plugin: pluginName,
                section: id,
                size,
                style,
                variant,
                sections: ids,
                options: { ...filters.options, ...options },
                calculated: 0,
                drawn: {},
                diff: 0,
              }
              try {
                const rendered = await renderSection(
                  pluginName,
                  ids,
                  size,
                  style,
                  { ...filters.options, ...options },
                  mutate
                )
                if ("error" in rendered) {
                  row.error = rendered.error
                } else {
                  row.calculated = rendered.calculated
                  for (const [engine, browser] of browsers) {
                    row.drawn[engine] = await measureHeight(browser, rendered.html, WIDTHS[size])
                  }
                  row.diff = rendered.calculated - Math.max(...Object.values(row.drawn))
                  if (filters.probe !== undefined) {
                    console.log(
                      await probeTree(browsers.values().next().value!, rendered.html, WIDTHS[size], filters.probe)
                    )
                  }
                }
              } catch (error) {
                row.error = error instanceof Error ? error.message : String(error)
              }
              results.push(row)
              console.log(`  ${formatRow(row, engineList)}`)
            }
          }
        }
      }
    }
  } finally {
    for (const browser of browsers.values()) await browser.close()
  }

  const errors = results.filter((r) => r.error)
  const cut = results.filter((r) => !r.error && r.diff < 0)
  const blank = results.filter((r) => !r.error && r.diff > TOLERANCE)
  const ok = results.length - errors.length - cut.length - blank.length

  console.log(`\n${"=".repeat(70)}`)
  console.log(
    `📊 ${results.length} tested in ${engineList.join(", ")} | ${ok} exact (0 to +${TOLERANCE}) | ${cut.length} cut | ${blank.length} blank space | ${errors.length} errors`
  )
  console.log("=".repeat(70))

  if (cut.length > 0) {
    console.log(`\n✂️  CUT (calculateHeight() shorter than what is drawn):`)
    for (const r of cut.sort((a, b) => a.diff - b.diff)) console.log(`  ${formatRow(r, engineList)}`)
  }
  if (blank.length > 0) {
    console.log(`\n📏 BLANK SPACE (calculateHeight() over what is drawn by more than ${TOLERANCE}px):`)
    for (const r of blank.sort((a, b) => b.diff - a.diff)) console.log(`  ${formatRow(r, engineList)}`)
  }
  if (errors.length > 0) {
    console.log(`\n💥 ERRORS:`)
    for (const r of errors) console.log(`  ${formatRow(r, engineList)}`)
  }

  if (filters.json) writeFileSync(filters.json, JSON.stringify({ engines: engineList, results }, null, 2))
  if (filters.md) {
    const head = `| plugin | section | variant | style | size | calc | ${engineList.join(" | ")} | diff |`
    const rule = `|${" --- |".repeat(7 + engineList.length)}`
    const lines = results.map((r) =>
      r.error
        ? `| ${r.plugin} | ${r.section} | ${r.variant} | ${r.style} | ${r.size} | error: ${r.error} |`
        : `| ${r.plugin} | ${r.section} | ${r.variant} | ${r.style} | ${r.size} | ${r.calculated} | ${engineList.map((e) => r.drawn[e]).join(" | ")} | ${r.diff > 0 ? "+" : ""}${r.diff} |`
    )
    writeFileSync(filters.md, [head, rule, ...lines].join("\n") + "\n")
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
