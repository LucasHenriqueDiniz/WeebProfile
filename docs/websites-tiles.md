# One tile per site (and per link badge)

## Why

In a README a card is an `<img>`. GitHub strips `<map>`, `<object>`, `<embed>` and
inline `<svg>`, and wraps every unlinked image in a link to the image itself. So an
image has exactly one click target. The links inside a card only work once the image
is open on its own: click the card, a new tab opens, click the site. Two clicks.

One click per site needs one image per site, each inside its own `<a href>`, laid out
side by side with a percentage width. That is what the tiles are:

```html
<p align="center">
  <a href="https://heartopia.guide/"><img align="top" width="33%" alt="…" src="https://<host>/svg/<id>/0.svg" /></a
  ><a href="https://developer.mozilla.org/"
    ><img align="top" width="33%" alt="MDN Web Docs" src="https://<host>/svg/<id>/1.svg" /></a
  ><a href="https://www.wikipedia.org/"><img align="top" width="33%" alt="…" src="https://<host>/svg/<id>/2.svg" /></a>
</p>
```

## How it works

| Piece                                                                                                                                                                                            | Where                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| A tile: one site at a fixed 270px width, the grid card alone. Text truncates to one line and a missing description keeps its line, so every tile of a card has the same height                   | `weeb-plugins/src/plugins/websites/components/WebsiteTile.tsx`                       |
| `Plugin.tiles(config, data)`: optional, only the websites plugin has it. Runs on the data `render` used, so a site is fetched once for the card and its tile                                     | `weeb-plugins/src/plugins/shared/types/plugin.ts`                                    |
| `tiles: true` on `POST /` answers `tiles: [{ href, title, svg, width, height }]`. A preview never draws them. If drawing throws, the key is left out and the card still publishes                | `svg-generator/src/generator/tiles.tsx`                                              |
| Both generations (manual and cron) ask for tiles and pass them to `publishGeneratedSvg`, which writes `svgs/<id>/tiles/<n>.svg` and `svgs/<id>/tiles.json` (the hrefs and titles) before the row | `weeb-dashboard/functions/api/_shared/storage.ts`                                    |
| `GET /svg/<id>/<n>.svg` serves a tile with the card's headers, CSP sandbox included                                                                                                              | `weeb-dashboard/functions/svg/[id]/[tile].ts`                                        |
| `GET /api/svgs/<id>/tiles` gives the owner the stored hrefs. The "One link per site" panel on the card's page builds the snippet from them                                                       | `weeb-dashboard/components/dashboard/WebsiteTilesPanel.tsx`, `lib/utils/markdown.ts` |

Rules that keep a README's links pointing at the right image:

- **The snippet reads the hrefs the last generation stored**, not the card's config.
  The config may have changed since, and a link must open the site its image shows.
- **A site whose page read fails keeps its place** (`fetchData.ts`). Dropping it moved
  every later site up one place, under the link of the site before it.
- **Tiles past the new count are deleted** on each generation. A removed site stops
  being served instead of showing its old image under another site's link.
- **A place with no tile answers a transparent 270×1 SVG**, not a 404. The README keeps
  asking for every tile its snippet had. A 404 is a broken-image icon, and a blank tile
  at full height leaves a hole. At one pixel the place collapses.
- **The hrefs live in the README.** Adding, removing or reordering a site means pasting
  the snippet again. Titles and images update by themselves. The panel says so.

## Measured (17/11/2026, Chromium 1234 via Playwright)

A card with 3 real sites (heartopia.guide, developer.mozilla.org, www.wikipedia.org),
generated without `dev` through the local dashboard's cron endpoint and the local
generator:

| Check                                       | Result                                                                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Stored in R2                                | tiles 0–2 and the manifest, titles and thumbnails read from the pages                                                         |
| `/svg/<id>/<n>.svg`                         | 0–2: 200, 270×210, CSP with `sandbox`. 3 and 11: 200, the 270×1 strip. 12: 404                                                |
| GitHub's sanitizer (`POST /markdown`)       | kept the 3 `<a href>`, each with its `<img width="33%" align="top">`; only `rel="nofollow"` was added and `src` moved to camo |
| Click each image of that HTML, 1280px wide  | 3/3 opened their site, one row of 269×209                                                                                     |
| Same, 390px wide                            | 3/3, one row of 118×92                                                                                                        |
| Control: same snippet without the `<a>`     | 0/3; GitHub linked each image to its camo URL, the two-click path                                                             |
| Each tile opened directly through the route | 3/3 navigated (`target="_top"`, as in the card)                                                                               |

## Costs and open questions

- **Size:** a tile is about 106KB before its thumbnail, 58KB of it the four embedded
  Poppins weights, which each image needs on its own. The tile only uses 400 and 600.
- **Columns:** fixed at 3. On a 390px phone a tile is 118px wide, small but readable as
  a thumbnail. Two columns would read better on phones and worse on desktop.
- **Camo caches each tile separately**, so a regenerated row may update one tile at a time.

## Link badges (About plugin)

The About plugin's links section draws its badges as tiles too (`layout: "inline"` on
`PluginTile`), so the hand-made README buttons (a site, LinkedIn, an email) come from a
card instead:

```html
<p align="center">
  <a href="https://lucashdo.com/"><img alt="lucashdo.com" src="https://<host>/svg/<id>/0.svg" /></a>
  <a href="mailto:you@example.com"><img alt="Email" src="https://<host>/svg/<id>/1.svg" /></a>
</p>
```

(The panel writes it on one line; whitespace between the tags is fine here.)

| What               | Site tiles (`grid`)                      | Link badges (`inline`)                                               |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------- |
| Size               | 270px wide, all the same                 | 36px tall, each as wide as its text (`badgeWidth`)                   |
| Snippet            | `width="33%"`, tags glued, three per row | no size, a space between tags: the gap, and the row wraps like words |
| Place with no tile | 270×1 strip                              | 1×1 square: the strip would be 270px of blank inside the row         |
| href               | http(s)                                  | http(s) or `mailto:` with one plain address (no `?`, `,` or `;`)     |

- **The manifest stores each tile's layout**, so the card page builds one snippet per
  kind ("One link per site", "One link per badge") with the indexes they have in the
  card. A manifest from before badges has no layout and reads as `grid`.
- **A place past the stored tiles answers the shape of the last one**: a card lists
  its plugins in order, so a badge removed from the end leaves a place after the last
  badge. Reading the manifest for that costs one R2 read, only on an empty place.
- **A badge's width is exact without a browser:** the badge always draws in its style's
  embedded font (JetBrains Mono at 0.6em in the terminal style, Poppins in the default
  one, sized 6% wider than its 400 widths for weight 500), whatever global font the card
  picked. Measured 18/11/2026 in Chrome: 96 of 96 tiles (12 labels, 2 styles, 4 global
  fonts) fit with no ellipsis; with the card's own font, 5 were cut.
- **`MAX_TILES` is 20**: the websites' 12 sites and the About plugin's 8 links.
