import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase") ? "require" : false,
  },
  verbose: true,
  strict: true,
  schemaFilter: ["./lib/db/schema.ts", "./lib/db/index.ts"],
})

