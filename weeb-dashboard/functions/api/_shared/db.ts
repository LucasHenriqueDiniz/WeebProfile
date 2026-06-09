import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../../lib/db/schema"
import type { CloudflareEnv } from "./auth"

export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema })
}

export type DB = ReturnType<typeof getDb>
