import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      // @cf-wasm/photon is only used (dynamically imported) by @weeb/weeb-plugins'
      // image-to-base64 helper when running in a Cloudflare Worker. The dashboard's
      // browser bundle never hits that code path, but Vite/Rollup still tries to
      // statically bundle the dynamic import's WASM, which it doesn't support.
      external: ["@cf-wasm/photon", "@cf-wasm/photon/workerd"],
    },
  },
  optimizeDeps: {
    exclude: ["@cf-wasm/photon"],
  },
  server: {
    port: 3000,
  },
})
