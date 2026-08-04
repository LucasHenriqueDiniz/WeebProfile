import { defineConfig } from "vitest/config"

/**
 * Separate from vite.config.ts on purpose. These tests cover the Pages Functions,
 * which are plain TypeScript running in the Workers runtime -- pulling in the app's
 * React plugin and path aliases would only add surface for the test run to break on.
 */
export default defineConfig({
  test: {
    // The modules under test use Web Crypto and fetch, both global in Node 22.
    environment: "node",
    include: ["functions/**/*.test.ts"],
  },
})
