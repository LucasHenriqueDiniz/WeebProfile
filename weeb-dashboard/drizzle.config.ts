import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  // To apply migrations to D1:
  //   wrangler d1 migrations apply weebprofile-db --remote
  // For local testing:
  //   wrangler d1 migrations apply weebprofile-db --local
  verbose: true,
  strict: true,
})
