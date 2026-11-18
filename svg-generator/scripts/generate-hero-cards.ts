#!/usr/bin/env tsx
/**
 * The example cards the landing hero rotates through: whole cards, rendered by the
 * generator with mock data and animations on, so each plays its entrance when it
 * comes up. Writes weeb-dashboard/public/hero/<slug>.svg and the manifest the hero
 * reads (weeb-dashboard/lib/landing/hero-cards.json: size and plugins of each card).
 *
 * Run from the repo root after a change to a plugin's look or to the animations:
 *   pnpm generate-hero-cards
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { generateSvg } from "../src/generator/svg-generator.js"
import type { SvgConfig } from "../src/types/index.js"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const PUBLIC_DIR = join(ROOT, "weeb-dashboard", "public", "hero")
const MANIFEST = join(ROOT, "weeb-dashboard", "lib", "landing", "hero-cards.json")

interface HeroCard {
  slug: string
  style: "default" | "terminal"
  theme: string
  /** plugin id → sections, in the order they stack. */
  plugins: Record<string, string[]>
}

// One of each look: the default style with images, a terminal with the header, the
// GitHub calendar, and a terminal in another theme. Picked to come out about the same
// height, since the hero reserves the tallest one's.
const HERO_CARDS: HeroCard[] = [
  {
    slug: "readme",
    style: "default",
    theme: "default",
    plugins: { github: ["profile"], myanimelist: ["anime_bar"], lastfm: ["top_artists"] },
  },
  { slug: "anime-terminal", style: "terminal", theme: "default", plugins: { myanimelist: ["statistics"] } },
  {
    slug: "github-calendar",
    style: "default",
    theme: "purple",
    plugins: { github: ["profile", "calendar", "favorite_license"] },
  },
  {
    slug: "coding-dracula",
    style: "terminal",
    theme: "dracula",
    plugins: {
      codewars: ["rank_honor", "languages_proficiency", "completed_kata"],
      stackoverflow: ["reputation", "badges", "answers_questions"],
    },
  },
]

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true })
  const manifest = []
  for (const card of HERO_CARDS) {
    const config: SvgConfig = {
      style: card.style,
      size: "half",
      dev: true,
      animations: true,
      hideTerminalHeader: false,
      ...(card.style === "terminal" ? { terminalTheme: card.theme } : { defaultTheme: card.theme }),
      pluginsOrder: Object.keys(card.plugins),
      plugins: Object.fromEntries(
        Object.entries(card.plugins).map(([plugin, sections]) => [
          plugin,
          { enabled: true, sections, username: "preview" },
        ])
      ) as SvgConfig["plugins"],
    }
    const result = await generateSvg(config)
    const errors = Object.keys(result._debug?.pluginsErrors ?? {})
    if (errors.length > 0) throw new Error(`${card.slug}: plugins failed: ${errors.join(", ")}`)

    writeFileSync(join(PUBLIC_DIR, `${card.slug}.svg`), result.svg)
    manifest.push({ slug: card.slug, width: result.width, height: result.height, plugins: Object.keys(card.plugins) })
    process.stdout.write(`${card.slug}: ${result.width}x${result.height}, ${Math.round(result.svg.length / 1024)} KB\n`)
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
