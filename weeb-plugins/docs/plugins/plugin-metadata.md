
`src/plugins/metadata.ts` (or your equivalent metadata registry) is the single source of truth for:

- display name, description, category
- required config fields (username, profile id, etc.)
- essential keys (tokens / api keys) + UI hints
- sections and their config options (defaults, labels, types)

## Principles

- Metadata must stay in sync with the plugin implementation.
- Metadata is part of your public API: consumers use it to render the configuration UI.

## Required fields

Typical metadata fields (names vary by repo, but the intent is the same):

- `id`: stable plugin identifier (do not change lightly)
- `title`: human name
- `description`
- `category`
- `icon`: lucide icon name (as expected by the consumer)
- `requiredFields`: list of required non-secret fields (e.g. username)
- `essentialConfigKeys`: list of secret keys required for prod fetch
- `essentialConfigKeysMetadata`: UI info for each essential key
- `sections`: list of sections available in this plugin

## Keep these in sync

### Essential keys
If a plugin requires:

```ts
essentialConfigKeys = ["API_KEY", "API_SECRET"]
```

Then metadata must:

- list the same keys under `essentialConfigKeys`
- describe each key under `essentialConfigKeysMetadata`

For each essential key metadata entry, include:

- `key` (exact match)
- `label`
- `type` (e.g. `password`, `text`)
- `placeholder`
- `description`
- `helpUrl` (optional, link to docs)
- `docKey` (stable internal docs reference)

## Sections

Each section must have a stable `id`. Avoid renames.

For each section config option:

- `key` (stable)
- `label`
- `type` (`boolean` | `number` | `select` | `text` etc.)
- `defaultValue`
- `description` (recommended)
- `min/max` (recommended for numbers)
- `options` (required for selects)

## Migration rules

If you must change metadata:

- Prefer additive changes (new fields/options)
- Avoid breaking changes (renames/removals)
- If you remove something, provide a migration path in consumers (or keep backwards compatibility)

## Checklist

- [ ] plugin folder exists and exports a valid plugin object
- [ ] `essentialConfigKeys` matches implementation
- [ ] each essential key has `essentialConfigKeysMetadata`
- [ ] section IDs are stable
- [ ] each option has a correct `defaultValue`
- [ ] plugin is exported/registered so consumers can discover it

