# Public preview: a visitor's own card before signing up

Status: implemented on 15/11/2026. Decisions taken by the owner the same day are listed under
"Decisions".

## Problem

A visitor sees only mock data until they create an account, and the path to a first
real card is about 8 clicks across 6 screens. Every `/dashboard/*` route requires a
session, and the only public URL is `/svg/:id.svg`, which needs a saved SVG.

Goal: on the landing page, type a username, see your real card, and carry that exact
config into the wizard after signing up.

## Shape

```
landing block ──GET /api/preview?plugin&username&style&theme&size──▶ Pages Function
                                                                     │
          cache hit (Cache API) ◀────────────────────────────────────┤ 1. cache lookup
                                                                     │ 2. per-IP + global limit (D1)
                                                                     │ 3. SVG_GENERATOR binding, whitelisted body, preview: true
                                                                     │ 4. cache put (success only)
                                     image/svg+xml ◀─────────────────┘
"Save to my profile" ─▶ /signup?return_to=/dashboard/new/profile?source=preview&plugin=…  ─▶ wizard prefilled
```

| Piece                                 | File                                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Whitelist, parsing, wizard hand-off   | `weeb-dashboard/lib/preview/public-preview.ts`                                                                       |
| Endpoint                              | `weeb-dashboard/functions/api/preview.ts`                                                                            |
| Rate limit                            | `weeb-dashboard/functions/api/_shared/preview-rate-limit.ts`, table `preview_hits` (`drizzle/0005_preview_hits.sql`) |
| Generator preview mode                | `svg-generator/src/worker.ts` (`preview: true`), `previewCredentials` in `src/db/app-credentials.ts`                 |
| Landing block                         | `weeb-dashboard/components/landing/PreviewYourCard.tsx`                                                              |
| `return_to` on `/login` and `/signup` | `weeb-dashboard/lib/return-to.ts`                                                                                    |

- **GET with query params**, not POST: the normalized URL is the cache key.
- **The body sent to the generator is built from scratch** from validated fields. Nothing
  from the request is forwarded as-is: no `userId`, `essentialConfigs`, `customCss`,
  `debug`, `mock`, `dev`. The route deleted in b7d0e02 forwarded an attacker-supplied
  `userId`, which made the generator read that user's secrets. The generator also accepts
  inline `essentialConfigs`, and `debug` (which returns `pluginsData`).
- **The generator enforces it too.** With `preview: true` it reads no D1 secrets and no inline
  ones, returns no debug output and never uses mock data, whatever else the body carries.
- **Sections are chosen by the server**, 2 per plugin (table below), so a visitor cannot
  pick the expensive ones (image-heavy favorites, GitHub `code_habits`).
- **No D1 or R2 write for the preview itself.** The only D1 write is the rate-limit
  counter, and only on a cache miss.
- Response headers: `Content-Type: image/svg+xml`, `X-Content-Type-Options: nosniff`, and a
  CSP (`default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:`) so
  the SVG cannot run script if opened directly. `X-Preview-Cache: HIT|MISS` says which path
  served it.

## Plugins

What each `fetchData` needs, checked in the code and against the live APIs on 15/11/2026
(anonymous requests from this machine):

| Plugin          | Needs                 | Upstream, anonymous                                                                 | Sections                               | In the preview                                        |
| --------------- | --------------------- | ----------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| GitHub          | username + PAT        | GraphQL has no anonymous access (`API rate limit exceeded` with no token)           | `profile`, `favorite_languages`        | yes, with `GITHUB_PREVIEW_TOKEN`                      |
| MyAnimeList     | username              | `jikan-edge` service binding (api.jikan.moe timed out from here)                    | `statistics`, `anime_bar`              | yes                                                   |
| AniList         | username              | public GraphQL, 1 request; blocks the Worker (see below)                            | `statistics`, `favorites_anime`        | no: 502 on every request today                        |
| Codewars        | username              | public REST, up to 3 requests                                                       | `rank_honor`, `languages_proficiency`  | yes                                                   |
| Codeforces      | handle                | public REST, up to 4 requests, throttled in code                                    | `rating_rank`, `contests_participated` | yes                                                   |
| Duolingo        | username              | unofficial `2017-06-30/users`, 2 requests                                           | `current_streak`, `languages_learning` | yes                                                   |
| Dev.to          | username              | public REST                                                                         | `profile`, `recent_articles`           | yes                                                   |
| Steam           | SteamID64 (or vanity) | application key `STEAM_API_KEY`, already a Worker secret                            | `statistics`, `top_games`              | yes                                                   |
| Stack Overflow  | numeric user id       | 300 requests/day per IP without a key (`quota_max: 300`); the Worker's IP is shared | —                                      | no: one busy hour empties it, and an id is not a name |
| Repository      | owner/repo + PAT      | same as GitHub                                                                      | —                                      | no                                                    |
| LastFM          | username + apiKey     | a LastFM key is an application key like Steam's, but there is none yet              | —                                      | no, unless a `LASTFM_API_KEY` app secret is added     |
| Lyfta           | apiKey                | personal key, personal data                                                         | —                                      | no                                                    |
| Websites        | URLs                  | fetches arbitrary URLs                                                              | —                                      | no: a public SSRF-shaped fetcher                      |
| 16Personalities | result URL            | no username                                                                         | —                                      | no                                                    |

### AniList blocks the Worker

Measured on 2026-11-18 with a probe Worker on this account (`wrangler dev --remote`, colo
POA, `CF-Worker: lucas-hdo.workers.dev`), the same query that answers 200 from a laptop:

| Request from the Worker                                  | Answer   |
| -------------------------------------------------------- | -------- |
| `POST graphql.anilist.co`, the plugin's headers (no UA)  | 403      |
| same, with the `User-Agent` of the app, Chrome and curl  | 403 (×3) |
| `GET anilist.co/`                                        | 403      |
| `GET s4.anilist.co/…/cover/medium/….jpg` (the cover CDN) | 403      |

Every 403 comes from AniList's own Cloudflare zone (`server: cloudflare`, no origin
headers) with the same body: `"You have been manually blocked. Please come to the
principal's office."` AniList put the block there, on the whole zone, and nothing the
request carries changes it; the covers would fail even if the query went through. Not
measured: whether it targets this account's Workers or every Worker.

The preview answers 502 `PREVIEW_UPSTREAM_FAILED` on every attempt, and `error_log` records
AniList's message and the `cf-ray` (it was a bare "AniList responded 403."). No saved card
uses AniList (0 of 16 on that date), so the daily cron does not hit it. The way out is
AniList lifting the block (their Discord, quoting a `cf-ray`), or the plugin leaving the
landing page's list until then.

Codeforces' `problems_solved` was left out: it counts only the last 100 submissions, so a
legendary grandmaster shows "Total: 72".

## Decisions

### GitHub credential: an application token used only for previews

A new Worker secret, `GITHUB_PREVIEW_TOKEN`: a **classic token with no scopes**, which reads
only public data (the GitHub plugin is built around classic tokens). Its 5,000
requests/hour are shared by every visitor, behind the cache and the global limit.

It is injected only when the dashboard marks the request `preview: true`. It never fills in
for a signed-in user who has not stored a PAT: their cards would silently spend the
preview's quota. Without the secret, a GitHub preview answers `503 PREVIEW_UNAVAILABLE` and
the other platforms keep working.

### Rate limit: D1, per IP and global

| Option                                       | Why not / why                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **D1 fixed window per IP hash + global cap** | Chosen. Same pattern as `generation_starts` (one atomic upsert), accurate across data centers, one write per miss. |
| Workers Rate Limiting binding                | Not available to Pages Functions, windows of 10 or 60 s only, per location and eventually consistent.              |
| KV                                           | Eventually consistent (about 60 s), 1 write per second per key.                                                    |
| Turnstile                                    | Stops bots, not a person in a loop; a widget and two new secrets. Worth adding later if abuse shows up.            |

Only cache misses count: **10 per IP per 10 minutes**, and **300 per hour for everyone
together**, which protects the shared quotas (GitHub token, Steam key, Jikan) from many IPs
at once. A refusal answers `429 PREVIEW_RATE_LIMITED` with `Retry-After`. The IP is stored
as a SHA-256 hash, and the daily cron deletes rows older than a day.

## Cache

- **Cache API** (`caches.default`). It works in Pages Functions on `*.pages.dev`, and its
  contents stay in the data center that wrote them, so another region misses once. No write
  quota (KV would have one).
- Key: `plugin / lowercased username / sections / style / theme / size` under
  `/__preview-cache/v1/` on the request's own origin. Bump `PREVIEW_CACHE_VERSION` to drop
  every entry.
- **TTL 1 hour.** Only clean renders (no `pluginErrors`) are stored; a failed upstream or a
  missing account is never cached.
- A hit returns before the rate limit and before the generator: no D1 write, no upstream
  request.

## Errors

| Status | Code                      | When                                                                              |
| ------ | ------------------------- | --------------------------------------------------------------------------------- |
| 400    | `INVALID_PREVIEW_REQUEST` | unknown plugin, bad username, theme of the other style, bad Steam input           |
| 404    | `PREVIEW_USER_NOT_FOUND`  | the plugin says the account does not exist                                        |
| 404    | `PREVIEW_PROFILE_PRIVATE` | AniList answers a private profile like a missing one; the plugin tells them apart |
| 429    | `PREVIEW_RATE_LIMITED`    | IP or global window full; `Retry-After` set                                       |
| 502    | `PREVIEW_UPSTREAM_FAILED` | the platform failed; the plugin's message goes to `error_log`, not to the visitor |
| 503    | `PREVIEW_UNAVAILABLE`     | GitHub without `GITHUB_PREVIEW_TOKEN` on the generator                            |

## Hand-off to the wizard

- "Save to my profile" goes to `/signup?return_to=/dashboard/new/profile?source=preview&…`
  (straight to the wizard when already signed in).
- `/login` and `/signup` validate `return_to` with `safeReturnTo` (parse, same origin, keep
  only the path) and pass it to Clerk's `forceRedirectUrl`, `signUpForceRedirectUrl` and
  `signInForceRedirectUrl`, and to the links between the two pages. It is kept in
  `sessionStorage` for Clerk's sub-routes (`/signup/verify-email-address`), which drop the
  query; a bare `/login` without it clears it.
- `/dashboard/new/profile?source=preview&…` parses the same whitelist and loads the card with
  the store's `loadFromTemplate`. An unauthenticated visit redirects to `/login?return_to=…`
  instead of dropping the query (this also keeps `?template=`).
- A Steam ID is not carried: it is a profile setting (`plugin_secrets`), which the wizard
  asks for as it does today. A GitHub card needs the user's own PAT after signing up.

## Rollout

1. Apply the migration before merging, from `weeb-dashboard/`:
   `pnpm exec wrangler d1 migrations apply weebprofile-db --remote`. Without
   `preview_hits`, every cache miss answers 500 (recorded in `error_log`).
2. Create the classic token (no scopes) and set it on the generator, from `svg-generator/`:
   `pnpm exec wrangler secret put GITHUB_PREVIEW_TOKEN`.
3. Deploy the generator before the dashboard: an older generator ignores `preview: true`
   and would treat the request as an anonymous normal render (no GitHub token, no Steam ID).

## Not doing

- No saved SVG, no `/svg/:id` for previews, no R2.
- No user-chosen sections or custom CSS in the preview.
- No change to how signed-in users' cards get credentials.
