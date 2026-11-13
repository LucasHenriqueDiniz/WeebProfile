import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "plugins/index": "src/plugins/index.ts",
    "plugins/metadata": "src/plugins/metadata.ts",
    "plugins/manager": "src/plugins/manager.ts",
    "plugins/tags": "src/plugins/tags.ts",
    "styles/index": "src/styles/index.ts",
    "styles/server": "src/styles/server.ts",
    "fonts/server": "src/fonts/index.ts",
    "themes/index": "src/themes/index.ts",
    "themes/theme-utils": "src/themes/theme-utils.ts",
    "templates/index": "src/templates/index.ts",
  },
  format: ["esm"],
  dts: true,
  bundle: true, // Explicitly enable bundling
  // Code shared between entry points goes into one chunk instead of being copied
  // into each of them. Without it, plugins/* and styles/* each carried a full copy
  // of every plugin (and a PluginManager singleton of their own), so the dashboard
  // preview, which imports both, shipped the plugin code twice. The generator is
  // not affected either way: its tsconfig paths resolve this package to src/.
  // Chunk imports are relative with a .js extension, which verify-no-relative-imports
  // accepts.
  splitting: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  platform: "node",
  outDir: "dist",
  treeshake: true,
  // Bundle all internal dependencies (everything from src/)
  noExternal: [/^@weeb\/weeb-plugins/],
  // Ensure all relative imports get .js extension
  esbuildOptions(options) {
    options.mainFields = ["module", "main"]
  },
})
