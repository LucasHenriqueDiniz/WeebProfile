# @weeb/source-v2

Source V2 — modular, type-safe **plugins**, **templates**, and **styles** for the Weeb ecosystem (used by the dashboard and SVG renderer).

## What this repo is

This package is the **core “weeb-plugins” library**:

- A registry/manager that exposes plugins via a consistent contract (`fetchData`, config, sections).
- Shared templates used by multiple plugins to render consistent layouts.
- Style packs (CSS + theme variables) designed for **safe embedding** (SVG/HTML).

### Consumers

Typically used by:

- `weeb-dashboard` (config UI + preview)
- `svg-generator` (final image rendering)
- `weeb-debug-tool` (dev tool for debuging and preview svg generation)

---

## Goals

- ✅ **Clear modular structure** — plugins are isolated and easy to reason about
- ✅ **Type-safe** — shared, strict types across the system
- ✅ **Scalable** — new plugins can be added with minimal boilerplate
- ✅ **Performance-minded** — predictable, deterministic rendering
- ✅ **Dev-friendly** — mock data in dev mode, real fetch in prod

---

## Installation

```bash
pnpm install
```

---

## Development

```bash
# Build
pnpm build

# Dev / watch mode
pnpm dev

# Typecheck without building
pnpm typecheck
```

---

## Usage (as a library)

```ts
import { PluginManager } from "@weeb/source-v2/plugins"
import { DefaultTemplate } from "@weeb/source-v2/templates"

// Plugins
const manager = PluginManager.getInstance()
const githubData = await manager.fetchPluginData(
  "github",
  config,
  false,            // dev = false
  essentialConfig   // secrets/tokens
)

// Templates
const element = <DefaultTemplate data={githubData} />
```

---

## Project structure

- `src/plugins/` — plugin implementations (github, lastfm, myanimelist, ...)
  - `shared/` — shared infrastructure
    - `types/` — base types (`Plugin`, `BasePluginConfig`, etc.)
    - `utils/` — API, validation, formatting, errors
    - `constants/` — shared constants
- `scripts/templates/plugin-template/` — plugin boilerplate (used by the scaffolder)
- `src/templates/` — rendering templates (used by plugins)
- `src/styles/` — style packs (CSS + themes + registry)
- `src/utils/` — shared utilities (repo-wide)
- `src/types/` — shared types (repo-wide)

> **CSS safety:** any CSS intended for embedded output must be scoped under `#svg-main` to avoid leaking into the host page.

---

## Creating a new plugin

Use `create-plugin` script to scaffold a new plugin:

```bash
pnpm create-plugin my-plugin
```

It creates:

- a new folder at `src/plugins/my-plugin/` with expected structure
- files with placeholders replaced
- automatic registration in PluginManager
- internationalization keys in `weeb-dashboard/messages/plugins/my-plugin/`
- (if supported by your current setup) registration wiring for discovery

For full contract and checklist, see:

- `scripts/templates/plugin-template/README.md` - Complete plugin development guide
- `docs/plugins/creating-plugins.md`
- `docs/plugins/create-plugin-script.md`

---

## Essential vs non-essential configuration

| Type                   | What it contains                           | Where it lives          | How it’s accessed                 |
| ---------------------- | ------------------------------------------ | ----------------------- | --------------------------------- |
| **EssentialConfig**    | API keys, tokens, sensitive credentials    | `essentialConfigs` (DB) | `fetchData(..., essentialConfig)` |
| **NonEssentialConfig** | User preferences (limits, titles, toggles) | `pluginsConfig` (DB)    | `config.nonEssential`             |

### EssentialConfig (secrets)

- Must be declared by each plugin via `essentialConfigKeys`.
- Must never be stored inside user-facing config objects.

### NonEssentialConfig (preferences)

- Safe, user-editable settings (e.g. `max_items`, `show_titles`, layout toggles).

---

## Internationalization (i18n)

The plugin system includes built-in internationalization support:

### Automatic i18n Generation

When you run `pnpm generate-metadata` or use `pnpm create-plugin`, the system:

1. Extracts all user-facing strings from `plugin.metadata.ts`
2. Generates i18n keys in `weeb-dashboard/messages/plugins/{plugin-name}/`
3. Creates files for all supported languages (en, pt, es)

### Translation Files

```json
{
  "displayName": "Plugin Name",
  "description": "Plugin description",
  "sections": {
    "section_id": {
      "name": "Section Name",
      "config": {
        "option_key": {
          "label": "Option Label",
          "description": "Option description"
        }
      }
    }
  }
}
```

### Best Practices

- **Write metadata in English** - becomes the source of truth
- **Use descriptive labels** - users should understand options immediately
- **Provide helpful descriptions** - explain what each configuration does

### Validation

The `validate-plugins` script checks for missing translations and warns about incomplete i18n coverage.

---

## Recent Improvements

### Height Calculation

⚠️ **Important**: Height calculation is now automatic!

- No more manual `heights.ts` files required
- Heights are measured dynamically using Playwright during SVG generation
- Old `heights.ts` files are deprecated and can be safely deleted
- See: `svg-generator/src/layout/measure-height.ts`

### Enhanced Plugin Creation

The `create-plugin` script now:

- Automatically generates internationalization keys
- Creates proper i18n file structure
- Provides better guidance for next steps
- Handles template fallbacks gracefully

### Cleanup Features

The `generate-metadata` script now:

- Automatically removes translation files for deleted plugins
- Preserves existing translations when possible
- Provides better error reporting
- Maintains clean i18n structure

---

## Documentation

- `docs/README.md` — docs index
- `docs/plugins/creating-plugins.md` — plugin authoring guide
- `docs/plugins/create-plugin-script.md` — scaffolder usage
- `docs/plugins/plugin-metadata.md` — metadata contract and sync rules
- `docs/styles/creating-styles.md` — styles authoring guide
- `docs/MIGRATION_JS_TO_TS.md` — JS → TS migration notes (if applicable)

---

## Known Limitations

### Spotify Plugin

⚠️ **The Spotify plugin is currently disabled** due to Spotify's API restrictions:

- Development mode apps are limited to **25 pre-approved users** maximum
- Commercial/Enterprise access requires **250k+ monthly active users**
- Each user must be manually approved in the Spotify Developer Dashboard

These restrictions make it **impossible** to create a public-facing plugin that allows users to connect their Spotify accounts freely.

See `src/plugins/spotify/README.md` for more details.

---
