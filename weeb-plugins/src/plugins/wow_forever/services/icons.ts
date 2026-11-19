/**
 * Icons of WoW Forever game objects (items, professions, achievements, specializations),
 * embedded as data URIs.
 *
 * The equipment response names an item but not its icon: the icon is a game file with an
 * id of its own (Red Linen Shirt is item 2575, icon 135029), so it takes a media call per
 * object. An object's icon does not change, so it is fetched once and kept: in this
 * isolate's memory, and in the plugin cache (R2 in the generator) for every later
 * generation. A card whose icons are all cached makes no media call at all.
 */

import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import { pluginCacheGet, pluginCachePut } from "../../../utils/plugin-cache"
import type { WowRegion } from "../types"
import { NotServedError, getStatic, type BattlenetCredentials } from "./battlenet"

export type IconKind = "item" | "profession" | "achievement" | "playable-specialization"

/** 56x56 JPEGs of about 2 KB. */
const ICON_MAX_BYTES = 30_000
/** Distinct icons kept in memory per isolate. About 3 KB each. */
const MEMORY_LIMIT = 2_000
/** Kept for an icon the API has no media for, so it is not asked again. */
const NO_ICON = "none"

const memory = new Map<string, string>()

/** Test hook: the memory outlives a test otherwise. */
export function clearIconMemory(): void {
  memory.clear()
}

function remember(key: string, value: string): void {
  if (memory.size >= MEMORY_LIMIT) {
    const oldest = memory.keys().next().value
    if (oldest !== undefined) memory.delete(oldest)
  }
  memory.set(key, value)
}

interface MediaResponse {
  assets?: Array<{ key: string; value: string }>
}

/** The cache key: the same icon for every region, so the region is not part of it. */
export const iconCacheKey = (kind: IconKind, id: number): string => `wow_forever/icon/${kind}/${id}`

async function fetchIcon(
  credentials: BattlenetCredentials,
  region: WowRegion,
  kind: IconKind,
  id: number
): Promise<string | null> {
  let media: MediaResponse
  try {
    media = await getStatic<MediaResponse>(credentials, region, `/data/wow/media/${kind}/${id}`)
  } catch (error) {
    if (error instanceof NotServedError) return null
    throw error
  }
  const url = media.assets?.find((asset) => asset.key === "icon")?.value
  if (!url) return null
  // Throws when the image cannot be fetched, so a passing failure is not kept as "no icon".
  return (await urlToDataUriDirect(url, { maxBytes: ICON_MAX_BYTES })).dataUri
}

/**
 * `null` from fetchIcon means the API has no icon for the object, which is kept; a throw
 * (rate limit, timeout, an image that did not load) is not.
 *
 * The icon of one object as a data URI, or null. Never throws: a card is drawn without an
 * icon rather than not drawn.
 */
export async function iconFor(
  credentials: BattlenetCredentials,
  region: WowRegion,
  kind: IconKind,
  id: number
): Promise<string | null> {
  const key = iconCacheKey(kind, id)
  const inMemory = memory.get(key)
  if (inMemory !== undefined) return inMemory === NO_ICON ? null : inMemory

  const cached = await pluginCacheGet(key)
  if (cached) {
    remember(key, cached)
    return cached === NO_ICON ? null : cached
  }

  let icon: string | null
  try {
    icon = await fetchIcon(credentials, region, kind, id)
  } catch {
    // A rate limit or a timeout: no icon this time, and nothing kept, so it is retried.
    return null
  }
  // A 404 means the API has no media for it, which does not change either.
  const value = icon ?? NO_ICON
  remember(key, value)
  await pluginCachePut(key, value)
  return icon
}
