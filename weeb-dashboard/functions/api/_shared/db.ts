import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../../lib/db/schema"
import type { CloudflareEnv } from "./auth"

export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema })
}

export type DB = ReturnType<typeof getDb>

/**
 * D1 binds at most 100 parameters per statement
 * (https://developers.cloudflare.com/d1/platform/limits/). An `inArray` over more ids
 * than that fails with "too many SQL variables": the public templates listing gave a
 * 500 as soon as there were more than 100 of them.
 */
export const D1_MAX_BOUND_PARAMETERS = 100

/**
 * Runs `query` over `items` in chunks that fit D1's parameter limit and concatenates
 * the rows. `reserved` is how many other parameters the statement binds besides the
 * chunk (a user id in the WHERE, say).
 */
export async function queryInChunks<T, R>(items: T[], query: (chunk: T[]) => Promise<R[]>, reserved = 0): Promise<R[]> {
  const size = D1_MAX_BOUND_PARAMETERS - reserved
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size))
  return (await Promise.all(chunks.map(query))).flat()
}
