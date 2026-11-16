import { readFileSync } from "node:fs"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

/**
 * The Clerk publishable key the Functions read, from [vars] in wrangler.toml. It is
 * public by design (it ships in the bundle) and already committed there.
 *
 * The SPA needs it at build time as VITE_CLERK_PUBLISHABLE_KEY, and that variable only
 * existed in the Pages production environment: every preview deploy built without
 * it and showed "auth not configured" on /login, so no PR could be tested signed in.
 * A VITE_CLERK_PUBLISHABLE_KEY in the environment still wins.
 */
function publishableKeyFromWranglerToml(): string | undefined {
  const toml = readFileSync(path.resolve(__dirname, "wrangler.toml"), "utf-8")
  const vars = toml.split(/^\[vars\]$/m)[1]?.split(/^\[/m)[0] ?? ""
  return vars.match(/^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\s*=\s*"(pk_[^"]+)"/m)?.[1]
}

process.env.VITE_CLERK_PUBLISHABLE_KEY ||= publishableKeyFromWranglerToml()

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
  },
  server: {
    port: 3000,
  },
})
