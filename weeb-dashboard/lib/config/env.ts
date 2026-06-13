/**
 * Client-side env vars — uses Vite's import.meta.env (VITE_* prefix).
 * Server secrets (CLERK_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, etc.) are
 * accessed via Cloudflare Pages env bindings inside Pages Functions.
 */
function viteEnv(key: string): string {
  try {
    return (import.meta.env?.[key] as string) ?? ""
  } catch {
    return ""
  }
}

export const env = {
  get clerkPublishableKey() {
    return viteEnv("VITE_CLERK_PUBLISHABLE_KEY")
  },
  get svgGeneratorUrl() {
    return viteEnv("VITE_SVG_GENERATOR_URL") || "http://localhost:3001"
  },
  get siteUrl() {
    return viteEnv("VITE_SITE_URL") || (typeof window !== "undefined" ? window.location.origin : "")
  },
}
