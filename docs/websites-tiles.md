# One tile per site

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
