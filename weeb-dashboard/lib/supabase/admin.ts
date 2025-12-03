import { createClient } from "@supabase/supabase-js"
import { env } from "../env"

export function createAdminClient() {
  return createClient(
    env.supabaseUrl,
    env.supabaseServiceRoleKey
  )
}


