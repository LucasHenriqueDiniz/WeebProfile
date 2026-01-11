#!/usr/bin/env tsx
/**
 * Script to update template descriptions to English and improve customization
 *
 * This script updates the existing templates in the database with:
 * - English descriptions
 * - Better customization options
 * - More appealing names and descriptions
 */

import { db } from "../lib/db"
import { templates } from "../lib/db/schema"
import { eq } from "drizzle-orm"

const templateUpdates = [
  {
    id: "2e377ed8-3083-4e20-aac5-c1e9714b8faa",
    name: "Ultimate Weeb Profile",
    description:
      "The complete anime enthusiast profile: GitHub stats, MyAnimeList favorites, and personality insights all in one stunning layout",
  },
  {
    id: "683fa912-a4b0-4c22-b0c3-386bb80ec414",
    name: "Anime Fan Profile",
    description:
      "Perfect for anime lovers: Combine your GitHub development activity with MyAnimeList stats and personality type",
  },
  {
    id: "822b603a-f89f-4e2a-80e8-0dcb19ff8305",
    name: "Gaming Developer",
    description:
      "Level up your profile: Show off your coding skills on GitHub alongside your Steam gaming achievements and stats",
  },
  {
    id: "af71db99-0af2-45bb-b2ad-9a5dc31abc5c",
    name: "Minimal Terminal",
    description: "Clean and sleek terminal-style design featuring your essential GitHub stats with maximum readability",
  },
  {
    id: "b86dc8e4-c697-4c09-896e-375ec4b0624d",
    name: "Music & Anime",
    description:
      "Harmonize your profile: Display your musical taste from LastFM alongside your favorite anime and manga",
  },
  {
    id: "c0ace8b6-cc55-4cd5-af21-bbeac440dede",
    name: "Dev Otaku",
    description:
      "The perfect blend for developer anime fans: Comprehensive GitHub stats paired with MyAnimeList favorites",
  },
  {
    id: "d284434f-3d03-4d29-8a66-e0bcea02b5be",
    name: "Developer Portfolio",
    description:
      "Professional developer profile: Showcase your GitHub contributions alongside your musical preferences from LastFM",
  },
  {
    id: "dba95f37-f20f-4212-ab3d-032b2b9c3f06",
    name: "Code Master",
    description:
      "The ultimate developer profile: Complete GitHub statistics with repositories, languages, and coding patterns",
  },
]

async function updateTemplates() {
  console.log("🔄 Updating template descriptions to English...\n")

  try {
    for (const update of templateUpdates) {
      console.log(`📝 Updating: ${update.name}`)

      const result = await db
        .update(templates)
        .set({
          name: update.name,
          description: update.description,
        })
        .where(eq(templates.id, update.id))
        .returning()

      if (result.length > 0) {
        console.log(`   ✅ Updated successfully`)
      } else {
        console.log(`   ❌ Template not found: ${update.id}`)
      }
    }

    console.log("\n✨ Template updates completed!")
    console.log(`   Updated ${templateUpdates.length} templates`)
  } catch (error) {
    console.error("❌ Error updating templates:", error)
    process.exit(1)
  }
}

async function main() {
  await updateTemplates()
  process.exit(0)
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})
