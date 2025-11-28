/**
 * Script para executar migrations SQL
 */

import postgres from "postgres"
import { config } from "dotenv"
import { resolve } from "path"
import { readFileSync } from "fs"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.DATABASE_URL?.includes("supabase") ? "require" : false,
})

async function runMigration() {
  try {
    const migrationFile = process.argv[2]
    if (!migrationFile) {
      console.error("❌ Usage: node scripts/run-migration.js <path-to-sql-file>")
      process.exit(1)
    }

    console.log(`📖 Reading migration file: ${migrationFile}`)
    const sqlFile = readFileSync(resolve(process.cwd(), migrationFile), "utf-8")
    
    console.log("🚀 Executing migration...")
    await sql.unsafe(sqlFile)
    
    console.log("✅ Migration executed successfully!")
  } catch (error) {
    console.error("❌ Error:", error.message)
    throw error
  } finally {
    await sql.end()
  }
}

runMigration()

