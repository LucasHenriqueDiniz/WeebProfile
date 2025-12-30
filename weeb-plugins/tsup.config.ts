import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'plugins/metadata': 'src/plugins/metadata.ts',
    'plugins/manager': 'src/plugins/manager.ts',
    'plugins/tags': 'src/plugins/tags.ts',
    'styles/index': 'src/styles/index.ts',
    'styles/server': 'src/styles/server.ts',
    'themes/index': 'src/themes/index.ts',
    'themes/theme-utils': 'src/themes/theme-utils.ts',
    'templates/index': 'src/templates/index.ts',
  },
  format: ['esm'],
  dts: true,
  bundle: true, // Explicitly enable bundling
  splitting: false, // Each entrypoint is self-contained, no internal relative imports
  sourcemap: true,
  clean: true,
  target: 'es2022',
  platform: 'node',
  outDir: 'dist',
  treeshake: true,
  // Bundle all internal dependencies (everything from src/)
  noExternal: [/^@weeb\/weeb-plugins/],
  // Ensure all relative imports get .js extension
  esbuildOptions(options) {
    options.mainFields = ['module', 'main']
  },
})

