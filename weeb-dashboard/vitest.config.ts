import path from "node:path"
import { defineConfig } from "vitest/config"

/**
 * Separate from vite.config.ts on purpose. These tests cover the Pages Functions,
 * which are plain TypeScript running in the Workers runtime, and the locale files
 * (plain JSON) -- pulling in the app's React plugin and path aliases would only add
 * surface for the test run to break on.
 */
export default defineConfig({
  // Only the "@" alias, the same as vite.config.ts: the stores import through it.
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    // The modules under test use Web Crypto and fetch, both global in Node 22.
    environment: "node",
    include: ["functions/**/*.test.ts", "i18n/**/*.test.ts", "lib/**/*.test.ts", "stores/**/*.test.ts"],
  },
})
