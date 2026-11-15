import { eq } from "drizzle-orm"
import { svgs, type NewSvg, type Svg } from "../../../lib/db/schema"
import type { CloudflareEnv } from "./auth"
import type { DB } from "./db"
import { deleteSvgFromR2, saveSvgToR2 } from "./storage"

/**
 * Publishes a freshly generated SVG and records it on its row. Null when the row is
 * gone: the SVG, or the whole account, was deleted while it was being generated.
 *
 * The object has to be written before the row can point at it, so a deletion that
 * lands in between would leave a public image with no row, and its key carries only
 * the SVG id: nothing could find it again. When the update matches no row, the object
 * is deleted here. A deletion that lands after this update is the deleting side's to
 * cover, which is why it deletes the object again once the rows are gone (see
 * account/index.ts and svgs/[id].ts).
 */
export async function publishGeneratedSvg(
  env: CloudflareEnv,
  db: DB,
  id: string,
  svgContent: string,
  fields: Partial<NewSvg>
): Promise<Svg | null> {
  const { path, url } = await saveSvgToR2(env, id, svgContent)
  const [row] = await db
    .update(svgs)
    .set({ ...fields, storagePath: path, storageUrl: url })
    .where(eq(svgs.id, id))
    .returning()
  if (row) return row

  await deleteSvgFromR2(env, id)
  return null
}
