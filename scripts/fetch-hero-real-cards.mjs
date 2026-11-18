#!/usr/bin/env node
/**
 * Snapshots of real cards for the hero lab (/testhero/6): for each account in
 * weeb-dashboard/lib/landing/hero-real-accounts.json, the public preview endpoint's card
 * in both styles, saved to weeb-dashboard/public/hero/real/<plugin>-<style>.svg, plus a
 * manifest with each card's size.
 *
 *   node scripts/fetch-hero-real-cards.mjs            # only the cards not on disk yet
 *   node scripts/fetch-hero-real-cards.mjs --force    # all of them again
 *
 * The endpoint counts cache misses: 10 per IP per 10 minutes (docs/public-preview.md).
 * Eight platforms in two styles are 16, so a full run from one machine takes two goes; a
 * 429 is reported with its Retry-After and the rest of the run carries on.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const ACCOUNTS = join(ROOT, "weeb-dashboard/lib/landing/hero-real-accounts.json")
const MANIFEST = join(ROOT, "weeb-dashboard/lib/landing/hero-real-cards.json")
const OUT_DIR = join(ROOT, "weeb-dashboard/public/hero/real")
const ORIGIN = process.env.PREVIEW_ORIGIN || "https://weebprofile-dashboard.pages.dev"
const STYLES = ["default", "terminal"]
const force = process.argv.includes("--force")

const exists = (path) =>
  access(path).then(
    () => true,
    () => false
  )

const accounts = JSON.parse(await readFile(ACCOUNTS, "utf8"))
const manifest = (await exists(MANIFEST)) ? JSON.parse(await readFile(MANIFEST, "utf8")) : []
await mkdir(OUT_DIR, { recursive: true })

let fetched = 0
let failed = 0
for (const [plugin, username] of Object.entries(accounts)) {
  for (const style of STYLES) {
    const file = join(OUT_DIR, `${plugin}-${style}.svg`)
    const known = manifest.some((card) => card.plugin === plugin && card.style === style && card.username === username)
    if (!force && known && (await exists(file))) continue

    const query = new URLSearchParams({ plugin, username, style, theme: "default", size: "half" })
    const response = await fetch(`${ORIGIN}/api/preview?${query}`)
    const type = response.headers.get("content-type") ?? ""
    if (!response.ok || !type.includes("svg")) {
      failed += 1
      const retry = response.headers.get("retry-after")
      console.error(`FAIL ${plugin}/${style}: ${response.status}${retry ? `, retry after ${retry}s` : ""}`)
      continue
    }
    const svg = await response.text()
    const size = svg.match(/<svg[^>]*\swidth="(\d+)"[^>]*\sheight="(\d+)"/)
    if (!size) {
      failed += 1
      console.error(`FAIL ${plugin}/${style}: no width/height on the <svg>`)
      continue
    }
    await writeFile(file, svg)
    const entry = { plugin, style, username, width: Number(size[1]), height: Number(size[2]) }
    const at = manifest.findIndex((card) => card.plugin === plugin && card.style === style)
    if (at === -1) manifest.push(entry)
    else manifest[at] = entry
    fetched += 1
    console.log(`ok   ${plugin}/${style}: ${entry.width}x${entry.height}, ${svg.length} bytes`)
  }
}

manifest.sort((a, b) => `${a.plugin}/${a.style}`.localeCompare(`${b.plugin}/${b.style}`))
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\n${fetched} fetched, ${failed} failed, ${manifest.length} in the manifest`)
process.exit(failed ? 1 : 0)
