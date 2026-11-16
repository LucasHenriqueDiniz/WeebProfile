import { lt, eq, sql } from "drizzle-orm"
import type { CloudflareEnv } from "./auth"
import { getDb } from "./db"
import { previewHits } from "../../../lib/db/schema"

/**
 * Limits for the public preview (GET /api/preview), which needs no account.
 *
 * Only cache misses are counted: a hit costs nothing upstream. Per IP, so one visitor
 * cannot loop it; and globally, because the quotas it spends are shared by everyone --
 * the GitHub preview token's 5,000 requests an hour, the Steam key, Jikan -- and many
 * IPs at once would get through a per-IP limit alone.
 *
 * In D1 rather than the Workers Rate Limiting binding: that binding is not available
 * to Pages Functions, only takes 10 or 60 second windows, and counts per location.
 */
export const PREVIEW_LIMITS = {
  ip: { max: 10, windowSeconds: 10 * 60 },
  global: { max: 300, windowSeconds: 60 * 60 },
} as const

/** Rows older than this are deleted by the daily cron; no window is longer than an hour. */
const RETENTION_MS = 24 * 60 * 60 * 1000

export type PreviewScope = keyof typeof PREVIEW_LIMITS
export type PreviewSlot = { claimed: true } | { claimed: false; scope: PreviewScope; retryAfterSeconds: number }

type Db = ReturnType<typeof getDb>

/**
 * The part of an address one visitor controls. An IPv6 host usually gets a whole /64
 * (any VPS does), so counting each address would give one visitor 2^64 buckets; the
 * first four groups are the visitor. IPv4 addresses, and anything unparseable, count
 * as they are.
 */
export function addressKey(ip: string): string {
  // IPv4, and IPv4-mapped IPv6 (::ffff:1.2.3.4), whose /64 would hold every IPv4 visitor.
  if (!ip.includes(":") || ip.includes(".")) return ip
  const [head, tail = ""] = ip.toLowerCase().split("%")[0].split("::")
  const left = head ? head.split(":") : []
  const right = ip.includes("::") && tail ? tail.split(":") : []
  // An embedded IPv4 tail (::ffff:1.2.3.4) is two groups; it is past the /64 anyway.
  const groups = ip.includes("::")
    ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right]
    : left
  if (groups.length < 4 || groups.slice(0, 4).some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return ip
  return `${groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`
}

/**
 * The address is not stored as-is. A hash of an IPv4 address can be reversed by trying
 * them all, so this is not anonymisation; it keeps addresses out of casual reads of the
 * table, and rows live for a day at most.
 */
export async function ipBucket(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(addressKey(ip)))
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")
  return `ip:${hex}`
}

/**
 * Counts one request in `bucket`, unless the bucket's window is full.
 *
 * One statement, so two requests racing for the last slot cannot both get it. The
 * insert creates the row; on conflict, a window that has ended starts over at 1, and an
 * open one gains 1 only while under the limit. RETURNING yields a row only when one of
 * those happened. Every expression in SET reads the row as it was before the update.
 */
async function claimBucket(
  db: Db,
  bucket: string,
  limit: { max: number; windowSeconds: number },
  now: Date
): Promise<{ claimed: true } | { claimed: false; retryAfterSeconds: number }> {
  const startedAt = now.toISOString()
  const windowFloor = new Date(now.getTime() - limit.windowSeconds * 1000).toISOString()
  const windowEnded = sql`${previewHits.windowStart} <= ${windowFloor}`

  const claimed = await db
    .insert(previewHits)
    .values({ bucket, windowStart: startedAt, count: 1 })
    .onConflictDoUpdate({
      target: previewHits.bucket,
      set: {
        count: sql`CASE WHEN ${windowEnded} THEN 1 ELSE ${previewHits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${windowEnded} THEN ${startedAt} ELSE ${previewHits.windowStart} END`,
      },
      setWhere: sql`${windowEnded} OR ${previewHits.count} < ${limit.max}`,
    })
    .returning({ bucket: previewHits.bucket })

  if (claimed.length > 0) return { claimed: true }

  // Only to tell the caller when to come back. If the row cannot be read the answer is
  // the whole window, never NaN in Retry-After.
  const [row] = await db.select().from(previewHits).where(eq(previewHits.bucket, bucket)).limit(1)
  const windowStart = Date.parse(row?.windowStart ?? "")
  const freeAt = (Number.isFinite(windowStart) ? windowStart : now.getTime()) + limit.windowSeconds * 1000
  return { claimed: false, retryAfterSeconds: Math.max(1, Math.ceil((freeAt - now.getTime()) / 1000)) }
}

/** The global window's state, read without writing: null while it has room. */
async function globalFull(db: Db, now: Date): Promise<{ retryAfterSeconds: number } | null> {
  const [row] = await db.select().from(previewHits).where(eq(previewHits.bucket, "global")).limit(1)
  const windowStart = Date.parse(row?.windowStart ?? "")
  if (!row || !Number.isFinite(windowStart)) return null
  const freeAt = windowStart + PREVIEW_LIMITS.global.windowSeconds * 1000
  if (freeAt <= now.getTime() || row.count < PREVIEW_LIMITS.global.max) return null
  return { retryAfterSeconds: Math.max(1, Math.ceil((freeAt - now.getTime()) / 1000)) }
}

/**
 * Takes a preview slot for `ip`, then one from the global budget.
 *
 * A spent global budget is read first, without writing: otherwise every request from a
 * new address while previews are closed would still insert its IP row, an unbounded
 * write from an unauthenticated caller. Then the visitor's own limit, so that one
 * visitor over it never touches the shared budget. A request that loses the race for
 * the last global slot has already counted against its IP; that is accepted.
 */
export async function claimPreviewSlot(db: Db, ip: string, now: Date): Promise<PreviewSlot> {
  const closed = await globalFull(db, now)
  if (closed) return { claimed: false, scope: "global", retryAfterSeconds: closed.retryAfterSeconds }

  const own = await claimBucket(db, await ipBucket(ip), PREVIEW_LIMITS.ip, now)
  if (!own.claimed) return { claimed: false, scope: "ip", retryAfterSeconds: own.retryAfterSeconds }

  const shared = await claimBucket(db, "global", PREVIEW_LIMITS.global, now)
  if (!shared.claimed) return { claimed: false, scope: "global", retryAfterSeconds: shared.retryAfterSeconds }

  return { claimed: true }
}

/** Never throws: called from the cron, which must not stop over a missing table. */
export async function prunePreviewHits(env: CloudflareEnv, now = new Date()): Promise<void> {
  const cutoff = new Date(now.getTime() - RETENTION_MS).toISOString()
  try {
    await getDb(env).delete(previewHits).where(lt(previewHits.windowStart, cutoff))
  } catch (failure) {
    console.error("preview_hits: could not prune:", failure)
  }
}
