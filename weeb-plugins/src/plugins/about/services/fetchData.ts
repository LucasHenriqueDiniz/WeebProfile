/**
 * Data of the About plugin.
 *
 * Everything is typed by the user, so nothing is fetched but the intro's picture:
 * a README cannot load an image from inside an image, so it is downloaded once per
 * generation and embedded as a data URI. A picture that fails leaves the intro
 * without one rather than failing the card.
 */

import { embedImageOrNull } from "../../../utils/image-to-base64"
import { assertSafePublicUrl } from "../../../utils/url-guard"
import { MAX_NEOFETCH_FIELDS } from "../plugin.metadata"
import type { AboutConfig, AboutData, NeofetchField } from "../types"
import { resolveLinks } from "./links"
import { MOCK_LINKS, MOCK_NEOFETCH } from "./mock-data"
import { readOption } from "./options"

/** The picture is drawn at 174px at most; 400 KB is a large PNG or JPEG for that. */
const IMAGE_MAX_BYTES = 400_000
const IMAGE_TIMEOUT_MS = 8_000
const MAX_TITLE_LENGTH = 40
const MAX_LABEL_LENGTH = 24
const MAX_VALUE_LENGTH = 80

function cleanText(raw: unknown, max: number): string {
  if (typeof raw !== "string") return ""
  const text = raw.replace(/\s+/g, " ").trim()
  return [...text].slice(0, max).join("")
}

/** Lines with a label or a value, in the user's order. */
export function readFields(raw: unknown): NeofetchField[] {
  if (!Array.isArray(raw)) return []
  return raw
    .flatMap((item) => {
      if (!item || typeof item !== "object") return []
      const label = cleanText((item as NeofetchField).label, MAX_LABEL_LENGTH)
      const value = cleanText((item as NeofetchField).value, MAX_VALUE_LENGTH)
      return label || value ? [{ label, value }] : []
    })
    .slice(0, MAX_NEOFETCH_FIELDS)
}

/** The picture's address, or null unless it is a public https URL. */
export function readImageUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.trim() === "") return null
  try {
    return assertSafePublicUrl(raw.trim()).toString()
  } catch {
    return null
  }
}

export async function fetchAboutData(config: AboutConfig, dev = false, previewMode = false): Promise<AboutData> {
  const sections = Array.isArray(config.sections) ? config.sections : []
  const title = cleanText(readOption(config, "neofetch_title"), MAX_TITLE_LENGTH)
  const fields = readFields(readOption(config, "neofetch_fields"))
  const imageUrl = readImageUrl(readOption(config, "neofetch_image"))
  const links = resolveLinks(readOption(config, "links_items"))

  // The wizard preview and the dev tools never touch the network. They draw what the
  // user typed, the picture straight from its URL, and the mock for a section with
  // nothing typed yet, as the other plugins show sample data before any is set up.
  if (dev || previewMode) {
    const typedIntro = title !== "" || fields.length > 0 || imageUrl !== null
    return {
      neofetch: typedIntro ? { title, fields, image: imageUrl } : MOCK_NEOFETCH,
      links: links.length > 0 ? links : MOCK_LINKS,
    }
  }

  const image =
    imageUrl && sections.includes("neofetch")
      ? await embedImageOrNull(imageUrl, {
          maxBytes: IMAGE_MAX_BYTES,
          timeout: IMAGE_TIMEOUT_MS,
          // The URL is the user's: a public host could redirect into a private one.
          validateFinalUrl: assertSafePublicUrl,
          context: "about.neofetch_image",
        })
      : null

  return { neofetch: { title, fields, image }, links }
}
