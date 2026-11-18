/**
 * Data of the About plugin.
 *
 * Everything is typed by the user, so nothing is fetched but the intro's picture, and
 * only when it has an address: a README cannot load an image from inside an image, so
 * it is downloaded once per generation and embedded as a data URI. An image uploaded in
 * the wizard is already one and is embedded as it is. A picture that fails leaves the
 * intro without one rather than failing the card.
 */

import { validImageDataUri } from "../../../utils/image-data-uri"
import { embedImageOrNull } from "../../../utils/image-to-base64"
import { assertSafePublicUrl } from "../../../utils/url-guard"
import { MAX_NEOFETCH_FIELDS } from "../plugin.metadata"
import type { AboutConfig, AboutData, NeofetchField, PictureSource } from "../types"
import { resolveLinks } from "./links"
import { MOCK_LINKS, MOCK_NEOFETCH } from "./mock-data"
import { readOption } from "./options"

/** The picture is drawn at 174px at most; 400 KB is a large PNG or JPEG for that. */
const IMAGE_MAX_BYTES = 400_000
/** Twice the 174px it is drawn at, for a sharp picture on a 2x screen. */
const GITHUB_AVATAR_SIZE = 348
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

/** A GitHub login: letters, digits and single hyphens, up to 39 characters. */
const GITHUB_LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/

/** The avatar's address for a GitHub username (with or without @), or null for anything else. */
export function githubAvatarUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const login = raw.trim().replace(/^@/, "")
  return GITHUB_LOGIN.test(login) ? `https://github.com/${login}.png?size=${GITHUB_AVATAR_SIZE}` : null
}

/** What the picture is: an embedded image, an address to embed, or nothing. */
type Picture = { kind: "embedded"; dataUri: string } | { kind: "address"; url: string } | null

export function readPicture(config: AboutConfig): Picture {
  const source = readOption(config, "neofetch_picture") as PictureSource | undefined
  if (source === "none") return null
  if (source === "github") {
    const url = githubAvatarUrl(readOption(config, "neofetch_github_user"))
    return url ? { kind: "address", url } : null
  }
  const image = readOption(config, "neofetch_image")
  const dataUri = validImageDataUri(image)
  if (dataUri) return { kind: "embedded", dataUri }
  const url = readImageUrl(image)
  return url ? { kind: "address", url } : null
}

export async function fetchAboutData(config: AboutConfig, dev = false, previewMode = false): Promise<AboutData> {
  const sections = Array.isArray(config.sections) ? config.sections : []
  const title = cleanText(readOption(config, "neofetch_title"), MAX_TITLE_LENGTH)
  const fields = readFields(readOption(config, "neofetch_fields"))
  const picture = readPicture(config)
  const links = resolveLinks(readOption(config, "links_items"))

  // The wizard preview and the dev tools never touch the network. They draw what the
  // user typed, the picture straight from its URL, and the mock for a section with
  // nothing typed yet, as the other plugins show sample data before any is set up.
  if (dev || previewMode) {
    const image = picture?.kind === "embedded" ? picture.dataUri : (picture?.url ?? null)
    const typedIntro = title !== "" || fields.length > 0 || image !== null
    return {
      neofetch: typedIntro ? { title, fields, image } : MOCK_NEOFETCH,
      links: links.length > 0 ? links : MOCK_LINKS,
    }
  }

  const image = !picture
    ? null
    : picture.kind === "embedded"
      ? picture.dataUri
      : sections.includes("neofetch")
        ? await embedImageOrNull(picture.url, {
            maxBytes: IMAGE_MAX_BYTES,
            timeout: IMAGE_TIMEOUT_MS,
            // The URL is the user's: a public host could redirect into a private one.
            validateFinalUrl: assertSafePublicUrl,
            context: "about.neofetch_image",
          })
        : null

  return { neofetch: { title, fields, image }, links }
}
