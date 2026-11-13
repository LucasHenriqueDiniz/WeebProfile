/**
 * Escapes text for a <style> element of an SVG that browsers parse as XML.
 *
 * The SVG is served as image/svg+xml (R2 and /api/svg/:id), so it goes through the
 * XML parser, where <style> is ordinary element content and not the raw text it is
 * in HTML. React's renderToString applies the HTML rule -- it only breaks up
 * "</style" -- so a customCss of `a{} <script>...</script>` came out as a real
 * script element that ran on the dashboard's origin when the URL was opened.
 *
 * Escaping "&" and "<" as entities is the XML rule for text content: the parser
 * turns them back into the same characters, so the CSS the browser sees is exactly
 * what the author wrote -- `content: "<3"` still renders "<3" -- but nothing in it
 * can open an element or an entity.
 */
export function escapeStyleText(css: string): string {
  return css.replace(/&/g, "&amp;").replace(/</g, "&lt;")
}
