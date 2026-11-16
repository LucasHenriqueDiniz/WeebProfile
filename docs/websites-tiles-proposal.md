# Proposal: one tile per site (not implemented)

## Why

In a README a card is an `<img>`. GitHub strips `<map>`, `<object>`, `<embed>` and
inline `<svg>`, and wraps every unlinked image in a link to the image itself. So an
image has exactly one click target. The links inside a card only work once the image
is open on its own: click the card, a new tab opens, click the site. Two clicks.

Measured on 15/11/2026: opened through `/svg/<id>.svg`, the links of a `websites` card
navigated 12/12 (3 sites x 4 variants). They cannot do better than two clicks.

The only way to get one click per site straight from the README is one image per site,
each inside its own `<a href>`, laid out side by side with a percentage width:

```html
<p align="center">
  <a href="https://heartopia.guide/"><img src="https://<host>/svg/<id>/0.svg" width="32%" alt="heartopia" /></a>
  <a href="https://developer.mozilla.org/"><img src="https://<host>/svg/<id>/1.svg" width="32%" alt="MDN" /></a>
  <a href="https://www.wikipedia.org/"><img src="https://<host>/svg/<id>/2.svg" width="32%" alt="Wikipedia" /></a>
</p>
```

## What it needs

**Generator** (`svg-generator`, `weeb-plugins/src/plugins/websites`)

- A tile render for one `WebsiteEntry`: the grid card alone, with a fixed size. Every
  tile in a row must have the same height, or the row is ragged, so title and
  description truncate instead of wrapping, and `calculateHeight` returns a constant.
- A way to ask for all tiles at once (`tiles: true` on `POST /`, answering
  `{ tiles: [{ url, svg, width, height }] }`), so a site's metadata is fetched once
  per generation, not once per tile. The card SVG and the tiles come from the same
  `fetchData` result.

**Route and storage** (`weeb-dashboard/functions`)

- Tiles in R2 at `svgs/<id>/tiles/<n>.svg`, written by the same generation that writes
  the card, and served by `/svg/<id>/<n>.svg` with the same CSP as `/svg/<id>.svg`.
- A tile index past the current count must still answer with an image (an empty tile,
  not a 404). A README keeps its snippet after the user removes a site, and a broken
  image is worse than a blank one.
- The cron's regeneration and the R2 cleanup on delete (`deleteSvgsFromR2`) have to
  cover the tiles too.

**Snippet** (`weeb-dashboard/lib/utils/markdown.ts`, owned by the embed-snippet work)

- A "one tile per site" snippet: one `<a href><img width="N%"></a>` per site, with
  `N = floor(100 / columns) - 1` so the row fits. The `href` is the normalized URL from
  `fetchData`, passed through `safeHref` before it goes into the snippet.
- The cost to say out loud in the UI: the hrefs live in the README. Adding, removing or
  reordering a site means pasting the snippet again, while the single card updates by
  itself. Changing a site's title or image does not need a new paste.

## Open questions

- Column count per row (3 for `half`? 4 for `full`?) and whether the user picks it.
- Whether the tile route should share the card's cache headers. Camo caches each image
  separately, so a regenerated row may update one tile at a time.
