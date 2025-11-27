/**
 * Script para popular templates de teste
 * 
 * Execute: pnpm tsx scripts/seed-templates.ts [userId]
 * 
 * Se userId não for fornecido, será usado um userId padrão de teste.
 * Para produção, forneça um userId real de um usuário existente.
 */

// Load environment variables from .env.local BEFORE importing db
// Using require to ensure synchronous loading before ES modules
const dotenv = require("dotenv")
const path = require("path")

// Get script directory (we're in weeb-dashboard/scripts/)
// process.cwd() should be weeb-dashboard when running from there
const scriptDir = process.cwd()

// Try to load .env.local first, then .env as fallback
const envLocal = dotenv.config({ path: path.join(scriptDir, ".env.local") })
const env = dotenv.config({ path: path.join(scriptDir, ".env") })

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not set")
  console.error(`Looking for .env files in: ${scriptDir}`)
  console.error(`Found .env.local: ${envLocal.parsed ? "Yes" : "No"}`)
  console.error(`Found .env: ${env.parsed ? "Yes" : "No"}`)
  if (envLocal.error) {
    console.error(`Error loading .env.local: ${envLocal.error.message}`)
  }
  console.error("Please make sure .env.local exists and contains DATABASE_URL")
  process.exit(1)
}

// Now import db after env vars are loaded
import { db } from "../lib/db"
import { templates } from "../lib/db/schema"

async function seedTemplates() {
  console.log("🌱 Seeding templates...")

  try {
    // Get userId from command line args or use default test user
    const userId = process.argv[2] || "00000000-0000-0000-0000-000000000000"

    if (!userId) {
      console.error("❌ Error: userId is required")
      console.error("Usage: pnpm tsx scripts/seed-templates.ts <userId>")
      console.error("Or set a default userId in the script")
      process.exit(1)
    }

    console.log(`📝 Using userId: ${userId}`)

    // Template 1: Dev Profile (GitHub + LastFM)
    const devTemplate = {
      userId,
      name: "Dev Profile",
      description: "Perfect for developers: GitHub stats and LastFM music taste",
      svgId: null,
      style: "default",
      size: "half",
      theme: "default",
      hideTerminalEmojis: false,
      hideTerminalHeader: false,
      customCss: null,
      pluginsOrder: "github,lastfm",
      pluginsConfig: {
        PLUGIN_GITHUB: true,
        PLUGIN_GITHUB_SECTIONS: "profile,stargazers,top_repositories",
        PLUGIN_LASTFM: true,
        PLUGIN_LASTFM_SECTIONS: "recent_tracks,top_artists",
      },
      isPublic: true,
    }

    // Template 2: Weeb Profile (GitHub + MyAnimeList + 16Personalities)
    const weebTemplate = {
      userId,
      name: "Weeb Profile",
      description: "For anime lovers: GitHub, MyAnimeList, and personality type",
      svgId: null,
      style: "default",
      size: "half",
      theme: "purple",
      hideTerminalEmojis: false,
      hideTerminalHeader: false,
      customCss: null,
      pluginsOrder: "github,myanimelist,16personalities",
      pluginsConfig: {
        PLUGIN_GITHUB: true,
        PLUGIN_GITHUB_SECTIONS: "profile,stargazers",
        PLUGIN_MYANIMELIST: true,
        PLUGIN_MYANIMELIST_SECTIONS: "anime_list,manga_list",
        PLUGIN_16PERSONALITIES: true,
        PLUGIN_16PERSONALITIES_SECTIONS: "personality",
      },
      isPublic: true,
    }

    // Template 3: Terminal Minimal (Terminal style, minimal plugins)
    const terminalTemplate = {
      userId,
      name: "Terminal Minimal",
      description: "Clean terminal style with minimal GitHub stats",
      svgId: null,
      style: "terminal",
      size: "half",
      theme: "dracula",
      hideTerminalEmojis: false,
      hideTerminalHeader: false,
      customCss: null,
      pluginsOrder: "github",
      pluginsConfig: {
        PLUGIN_GITHUB: true,
        PLUGIN_GITHUB_SECTIONS: "profile,stargazers",
      },
      isPublic: true,
    }

    // Insert templates
    const [dev] = await db.insert(templates).values(devTemplate).returning()
    console.log("✅ Created template:", dev.name)

    const [weeb] = await db.insert(templates).values(weebTemplate).returning()
    console.log("✅ Created template:", weeb.name)

    const [terminal] = await db.insert(templates).values(terminalTemplate).returning()
    console.log("✅ Created template:", terminal.name)

    console.log("\n✨ Successfully seeded 3 templates!")
    console.log(`   - ${dev.name} (${dev.id})`)
    console.log(`   - ${weeb.name} (${weeb.id})`)
    console.log(`   - ${terminal.name} (${terminal.id})`)
  } catch (error) {
    console.error("❌ Error seeding templates:", error)
    process.exit(1)
  }
}

seedTemplates()
