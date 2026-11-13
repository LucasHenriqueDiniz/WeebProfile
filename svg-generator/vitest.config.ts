import path from "path"
import { defineConfig } from "vitest/config"

/**
 * The Worker bundle resolves @weeb/weeb-plugins to ../weeb-plugins/src through the
 * tsconfig paths, which wrangler's esbuild follows. Vitest does not read them, so
 * without this alias it fell back to the package's exports -- weeb-plugins/dist, a
 * build that is only as new as the last `pnpm build:deps`. A test could then pass
 * against a dist that no longer matched src, and so not the code that ships: a
 * 16personalities test stayed green with its fix reverted in src.
 */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@weeb\/weeb-plugins\/(.*)$/,
        replacement: path.resolve(__dirname, "../weeb-plugins/src/$1"),
      },
    ],
  },
})
