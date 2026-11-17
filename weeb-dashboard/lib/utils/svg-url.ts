/**
 * The address to paste in a README: served by this origin from R2 (functions/svg/[id].ts),
 * so it keeps working if the bucket's public URL changes, and through a regeneration.
 * In-app previews keep using storageUrl, which hits the bucket directly.
 */
export function publicSvgUrl(id: string, origin: string = window.location.origin): string {
  return `${origin}/svg/${id}.svg`
}

/** Tile `index` of the card: one site of its websites plugin (functions/svg/[id]/[tile].ts). */
export function publicTileUrl(id: string, index: number, origin: string = window.location.origin): string {
  return `${origin}/svg/${id}/${index}.svg`
}
