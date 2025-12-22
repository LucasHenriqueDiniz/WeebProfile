
# Creating Plugins

This repository provides a plugin library consumed by external apps (e.g. dashboard / SVG generator).
A **plugin** is responsible for:

1) validating config/essential keys,
2) fetching data (or returning mock data in dev),
3) rendering via templates/styles.

## Prerequisites

- Node + pnpm installed
- You can run repository scripts:
  - `pnpm install`
  - `pnpm lint` / `pnpm typecheck` (if present)

## Plugin anatomy

A plugin typically lives at:

```
src/plugins/<plugin-name>/
  index.tsx
  types.ts
  services/
    fetchData.ts
    mock-data.ts
  components/
    Render<Plugin>.tsx
  README.md
  styles.css (optional)
```

> The exact structure can vary, but keep the separation: **fetching in services**, **rendering in components**.

## Step 1 — Scaffold the plugin

Use the scaffolder:

```bash
pnpm create-plugin <kebab-case-name>
```

If you don’t have the script, copy an existing plugin folder and rename it carefully.

## Step 2 — Define types

In `types.ts`, define:

- the config schema shape for this plugin
- the returned data shape produced by `fetchData()`

Keep these types **strict** and **exported** so consumers can type-check.

## Step 3 — Implement `fetchData()`

Your plugin `index.tsx` should expose a `fetchData(config, dev, essentialConfig)` function (or a wrapper calling your service).

Rules:

- When `dev === true`: return `mock-data.ts` **without network calls**
- When `dev === false`: validate required essential keys, then fetch real data

Pseudo-pattern:

```ts
export async function fetchData(config, dev, essentialConfig) {
  if (dev) return getMockData(config)

  assertEssentialKeys(essentialConfig, ["API_KEY"])
  return fetchRealData(config, essentialConfig)
}
```

### Essential keys vs non-essential config

- **Essential keys**: secrets/tokens/api keys (provided separately)
- **Non-essential config**: user preferences (layout, limits, toggles)

Never silently fall back when an essential key is missing in prod. Throw a clear error.

## Step 4 — Render

Rendering must be **pure**:

- no fetch inside React components
- no random side effects
- deterministic output for given `(config, data, style)`

Usually you’ll render via templates or a style switcher (e.g. “default/terminal”):

```tsx
export function RenderPlugin({ data, config, style }) {
  if (!config.enabled) return null
  // render using templates/styles
}
```

## Step 5 — Register + export

You typically must ensure the plugin is discoverable:

- exported from `src/plugins/index.ts` (or equivalent barrel)
- registered in a manager/registry file (if your architecture uses one)
- metadata added to `src/plugins/metadata.ts`

If your consumers rely on stable identifiers, **do not rename plugin IDs** lightly.

## Step 6 — Add/Update metadata

See: `plugin-metadata.md`

## Step 7 — Validate locally

Recommended checks:

- `pnpm lint`
- `pnpm typecheck`
- run any existing dev preview / consumer app smoke test

## Common pitfalls

- Doing network fetches when `dev === true`
- Missing `#svg-main` CSS scoping (leaks into host pages)
- Renaming section IDs (breaks saved configs)
- Mixing secrets into non-essential config