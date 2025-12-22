import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY", {
      url,
      anonKey,
    })
    throw new Error(
      "Supabase public URL and anon key are required to create browser client. " +
      "Check your .env.local, restart the dev server and ensure NEXT_PUBLIC_SUPABASE_* are available."
    )
  }

  return createBrowserClient(url, anonKey)
}
