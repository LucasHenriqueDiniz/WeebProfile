/**
 * Content width for the signed-in pages: one source.
 *
 * The page heading and the content get the same class from here, so they cannot drift
 * apart again: at 1920px the old header's title sat at x=24 and the Settings content at
 * x=448, and every screen was off in its own way.
 *
 * Left-aligned, not centred. With the navigation anchored on the left (the rail), the
 * left gutter is what ties the rail, the heading and the content on one vertical line;
 * centring made the heading and the content agree with each other but lose the rail.
 * `max-width` still caps the line length, and the room left over goes to the right,
 * where it separates nothing.
 */

/** `app` lists and grids · `narrow` forms and reading · `full` no cap. */
export type ContentWidth = "app" | "narrow" | "full"

const MAX_WIDTH: Record<ContentWidth, string> = {
  // A card grid gets one column more than the old `container` (1536) without becoming
  // a strip too wide to scan.
  app: "max-w-[1600px]",
  // A wide form is a bad form: lines too long to read and labels far from their fields.
  narrow: "max-w-5xl",
  full: "max-w-none",
}

/** The same horizontal padding everywhere, so it drops out of the alignment. */
export const CONTENT_PADDING_X = "px-4 md:px-6 lg:px-8"

/** A page's content: the left gutter plus the width cap. */
export function contentContainer(width: ContentWidth = "app"): string {
  // No `mx-auto`: the left gutter is what lines up with the rail (see above).
  return `w-full ${MAX_WIDTH[width]} ${CONTENT_PADDING_X}`
}
