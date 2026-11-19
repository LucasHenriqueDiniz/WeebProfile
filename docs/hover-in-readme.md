# Hover effects and new tabs in a GitHub README

Measured on 19/11/2026. Short answer:

- **Hover inside a card, in the README: no.** No technique changed a single pixel on hover,
  in any of the three engines, inside the SVG or around it.
- **Hover once the card is opened on its own: yes.** Clicking a card in the README opens the
  SVG (through camo) in a new tab, and there `:hover` works in all three engines.
- **The only hover feedback a README gives is the browser's own:** the `title` tooltip
  (GitHub keeps `title` on `<a>` and `<img>`), the link cursor and the URL in the status bar.
- **A README link cannot be forced into a new tab.** GitHub strips `target` from every `<a>`
  the README writes. Only the link GitHub adds itself, around an image with no link, has
  `target="_blank"`, and it opens the image, not a site.
- **Inside an opened card, `_blank` already opens a new tab through camo, but not through our
  `/svg/<id>.svg` route**, whose CSP `sandbox` blocks popups. The cards use `_top`, which
  navigates in both.

Nothing here is cheap and working inside the README, so there is no prototype.

## How it was measured

- **Engines:** Chromium 151.0.7922.34 (Playwright 1.62.1), Firefox 150.0.2 and WebKit 26.4
  (Playwright 1.60.0), headless, on macOS.
- **The README HTML is GitHub's, not hand-written.** A test README went through
  `gh api markdown -f mode=gfm`, and that output was put inside `article.markdown-body` of a
  real logged-out `github.com` page, so GitHub's own CSS and scripts apply. Images load
  through the real camo URLs the API signed.
- **The hover SVG** is `lab/07-hover.svg` from the profile repo (`LucasHenriqueDiniz/LucasHenriqueDiniz`
  at `8d59949`, served by jsDelivr and then camo), plus a local fixture with the shapes our
  cards use: an HTML `<div>` inside a `<foreignObject>` with `:hover` (what the cards'
  Tailwind `hover:` classes compile to), an SVG `<rect>` with `:hover`, a rule on `svg:hover`,
  and three HTML links (`_top`, `_blank`, none).
- **"Changed on hover"** = screenshot of the element's box with the mouse away, then with the
  mouse on the element's center, compared pixel by pixel (a pixel counts when R+G+B differ by
  more than 30). Computed styles of the `<a>` and `<img>` were compared too.
- **Positive controls**, to show the method sees a change when there is one: the fixture
  opened directly (below, changes in all engines) and GitHub's "Commits" link on the same page
  (Chromium 2721 / 4464 px, Firefox 913, WebKit 893; background `transparent` →
  `rgba(129,139,152,0.1)`).
- 3 runs per cell. Every run gave the same result, so the tables show one value per cell.

## Hover

### Inside the README

| Technique                                                             | Chromium | Firefox | WebKit | Measured                                                                                                                                   |
| --------------------------------------------------------------------- | -------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `:hover` on an element inside the SVG (`<img>`, local fixture)        | no       | no      | no     | 0 px changed on the `<foreignObject>` div, the `<rect>` and the link                                                                       |
| `svg:hover` rule inside the SVG (`<img>`)                             | no       | no      | no     | 0 px                                                                                                                                       |
| Same SVG through camo, bare `<img>` (GitHub wraps it in its own link) | no       | no      | no     | 0 / 39284 px on GitHub's page, no computed style change on `<a>` or `<img>`                                                                |
| README's own `<a href><img></a>`                                      | no       | no      | no     | 0 / 39284 px, no computed style change                                                                                                     |
| Markdown `[![alt](src)](href "title")`                                | no       | no      | no     | 0 / 39284 px                                                                                                                               |
| `style`, `class` or `onmouseover` on the `<img>`                      | —        | —       | —      | stripped by the sanitizer (only `width` survived, GitHub put its own `max-width`)                                                          |
| `<picture><source media="(hover: hover)">`                            | no       | no      | no     | kept (wrapped in `<themed-picture>`), but it picks the source once per device; all three picked it on desktop and nothing changes on hover |
| `title` on `<a>` and on `<img>`                                       | kept     | kept    | kept   | in the DOM after the sanitizer; the tooltip itself is browser UI that screenshots don't capture                                            |
| Link cursor on a linked image (computed `cursor` of the `<img>`)      | pointer  | pointer | auto   | WebKit computes `auto`, which over a link is its hand cursor; not checked visually                                                         |

GitHub's stylesheet has no hover rule for images: every linked image measured 0 px on hover.
GitHub also underlines README links all the time now (`text-decoration-line: underline` before
and after hover, 0 px changed on a text link), so not even a link's underline appears on hover.

Why it can't work: an SVG shown through `<img>` is a static image document. The browser sends
it no pointer events, so `:hover` never matches inside it, and the sanitizer removes every
way the README could style the `<img>` from outside.

### With the card opened on its own

Clicking a card in the README opens the camo URL in a new tab (GitHub's link, `target="_blank"`).
There the SVG is a document and gets the mouse.

| Opened from                                                                            | Element                        | Chromium | Firefox | WebKit |
| -------------------------------------------------------------------------------------- | ------------------------------ | -------- | ------- | ------ |
| Real camo URL of `07-hover.svg`                                                        | `svg:hover .hv`                | yes      | yes     | yes    |
| Local, camo's headers (`default-src 'none'; img-src data:; style-src 'unsafe-inline'`) | `<foreignObject>` div `:hover` | yes      | yes     | yes    |
| same                                                                                   | `<rect>` `:hover`              | yes      | yes     | yes    |
| same                                                                                   | HTML `<a>` `:hover`            | yes      | yes     | yes    |
| Local, our route's CSP (`… sandbox`)                                                   | the same three                 | yes      | yes     | yes    |

- On camo the square went from `rgb(110,118,129)` to `rgb(46,160,67)` as soon as the mouse
  entered the tab, even outside the drawing: in a standalone SVG document `svg:hover` matches
  anywhere in the viewport. Hover on a specific element is what reads as a hover effect.
- **Cards already carry hover styles that only show here.** Steam (recent and top games),
  MyAnimeList favorites, several GitHub sections and 16personalities use Tailwind `hover:`
  classes (`hover:bg-default-hover`, `hover:border-default-highlight`, `hover:underline`,
  `hover:scale-110`…), and the card's stylesheet ships the compiled rules (a production
  MyAnimeList card has four `:hover` rules). They are dead in the README and live after the
  click.

## New tab

### README links

| README writes                              | Sanitizer returns                                                      | Click (3 engines, 3/3 each)              |
| ------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------- |
| `<a href target="_blank" rel="noopener">`  | `<a href rel="nofollow">` (target dropped)                             | same tab                                 |
| `<a href target="_top">`, `target="_self"` | `<a href rel="nofollow">`                                              | not clicked; same markup as above        |
| `<img>` with no link                       | `<a target="_blank" rel="noopener noreferrer nofollow" href="<camo>">` | new tab, on `camo.githubusercontent.com` |

On the real rendered README at `8d59949` (not injected), after GitHub's scripts ran: the 6
links the README wrote around images had no `target`, and the 42 links GitHub added around
unlinked images all had `_blank`, in all three engines. A tile (`<a href="site"><img></a>`)
therefore opens its site in the same tab, and there is no markup that changes that. Ctrl/⌘
or middle click still opens a new tab, as for any link.

### Links inside an opened card

The fixture's HTML links, clicked with the SVG opened as a document:

| Served with                                                      | `_top`    | none      | `_blank`                            |
| ---------------------------------------------------------------- | --------- | --------- | ----------------------------------- |
| camo's headers (the README click lands here)                     | navigates | navigates | new tab, site's scripts run         |
| our route today (`sandbox`)                                      | navigates | navigates | nothing                             |
| route with `sandbox allow-popups`                                | —         | —         | new tab, **site's scripts blocked** |
| route with `sandbox allow-popups allow-popups-to-escape-sandbox` | —         | —         | new tab, site's scripts run         |

Same result in Chromium, Firefox and WebKit, 3/3 each. "Scripts run" = the stub page that
answered for the link set `document.title` from a `<script>`. With the fixture in an `<img>`
(local page, no link around it), clicking the `_blank` link's area did nothing (0/3 per
engine). In the README the click goes to GitHub's link around the image.

Switching our links to `_blank` would need both `allow-popups` and
`allow-popups-to-escape-sandbox` in the route's CSP: with only `allow-popups` the new tab
inherits the sandbox and the site opens with its scripts off. It would also change the wizard
preview (`<iframe sandbox>`), where `_top` is inert by design (see the table in
`weeb-plugins/src/utils/external-link.tsx`). Not done here; it is a product choice, not a
fix.

## What is left

- **Native tooltip and status-bar URL:** not captured. Headless screenshots don't include
  browser UI. The `title` attribute is there; the tooltip is standard browser behavior.
- **Real Safari and the GitHub mobile app:** not tested, only Playwright's WebKit.
- **Touch:** not tested. On phones there is no hover anyway.
