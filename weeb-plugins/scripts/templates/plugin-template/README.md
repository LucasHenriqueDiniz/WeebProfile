# Plugin Template

This is the template/base for creating new plugins in WeebProfile.

## Structure

```
plugin-template/
├── index.tsx              # Main plugin definition
├── types.ts               # Plugin-specific types
├── plugin.metadata.ts     # Plugin metadata and configuration
├── services/
│   ├── fetchData.ts       # Data fetching logic
│   └── mock-data.ts       # Mock data for development
├── components/
│   └── RenderPLUGIN_NAME.tsx  # Render component
├── heights.ts             # ⚠️ DEPRECATED - No longer required
└── README.md              # This file
```

## How to Use

### 1. Use the create-plugin script (Recommended)

```bash
pnpm create-plugin my-plugin
```

This will automatically create:

- New folder `src/plugins/my-plugin/`
- All files with placeholders replaced
- Plugin registered in PluginManager
- i18n keys generated in `weeb-dashboard/messages/plugins/my-plugin/`

### 2. Manually

1. Copy `scripts/templates/plugin-template/` to `src/plugins/{plugin-name}/`
2. Replace all placeholders:
   - `PLUGIN_NAME` → plugin name (ex: "spotify")
   - `PluginName` → PascalCase (ex: "Spotify")
   - `PLUGIN_NAME_UPPER` → UPPER_CASE (ex: "SPOTIFY")
3. Implement logic in `services/fetchData.ts`
4. Implement components in `components/`
5. Register plugin in `src/plugins/manager.ts`
6. Run `pnpm generate-metadata` to create i18n keys

## Placeholders

- `PLUGIN_NAME` - Plugin name in kebab-case (ex: "spotify")
- `PluginName` - Plugin name in PascalCase (ex: "Spotify")
- `PLUGIN_NAME_UPPER` - Plugin name in UPPER_CASE (ex: "SPOTIFY")

## Height Calculation

⚠️ **IMPORTANT**: Height calculation is now done automatically using Playwright.

- The `heights.ts` file is **DEPRECATED** and can be safely deleted
- Heights are measured dynamically during SVG generation
- See: `svg-generator/src/layout/measure-height.ts`

## Internationalization (i18n)

All plugin strings are automatically internationalized:

### 1. Metadata Structure

All user-facing strings in `plugin.metadata.ts` are automatically extracted:

- `displayName` and `description`
- Section `name` and `description`
- All config option `label`, `description`, `tooltip`, `placeholder`
- Select option labels

### 2. Automatic i18n Key Generation

When you run `pnpm generate-metadata`, it creates:

```
weeb-dashboard/messages/plugins/{plugin-name}/
├── en.json    # English (required)
├── pt.json    # Portuguese (optional)
└── es.json    # Spanish (optional)
```

### 3. Translation Process

1. **English (en.json)**: Always generated - contains the original strings
2. **Other languages**: Generated if they exist, preserving existing translations
3. **Missing translations**: `validate-plugins` will warn about missing translations

### 4. i18n Key Format

Keys follow this pattern:

```json
{
  "displayName": "Plugin Name",
  "description": "Plugin description",
  "sections": {
    "section_id": {
      "name": "Section Name",
      "description": "Section description",
      "config": {
        "option_key": {
          "label": "Option Label",
          "description": "Option description",
          "tooltip": "Option tooltip",
          "placeholder": "Enter value..."
        }
      }
    }
  }
}
```

### 5. Best Practices

- **Always write metadata in English** - this becomes the source of truth
- **Keep strings concise** - they're used in UI forms
- **Use descriptive labels** - users should understand what each option does
- **Provide helpful descriptions** - explain what each configuration does
- **Add tooltips for complex options** - provide additional context

## Essential vs Non-Essential Configurations

### Essential (EssentialConfig)

- API keys, tokens, credentials
- Stored in `essentialConfigs` in database
- Accessed via `essentialConfig` parameter in `fetchData`
- Defined in `essentialConfigKeys` in plugin

### Non-Essential (NonEssentialConfig)

- User preferences (max_items, titles, etc)
- Stored in `pluginsConfig` in database
- Accessed via `config.nonEssential`

## Implementation Example

### 1. Define types (`types.ts`)

```typescript
export interface SpotifyNonEssentialConfig extends NonEssentialPluginConfig {
  max_tracks?: number
  show_artists?: boolean
}

export interface SpotifyConfig extends BasePluginConfig {
  nonEssential?: SpotifyNonEssentialConfig
}

export interface SpotifyData {
  tracks: Array<{ name: string; artist: string }>
}
```

### 2. Implement fetch (`services/fetchData.ts`)

```typescript
export async function fetchSpotifyData(
  config: SpotifyConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<SpotifyData> {
  if (dev) {
    return getMockSpotifyData()
  }

  const apiKey = requireApiKey(essentialConfig?.apiKey, "apiKey")

  const response = await fetchJson<SpotifyData>(`https://api.spotify.com/v1/me/tracks?api_key=${apiKey}`)

  return response
}
```

### 3. Implement rendering (`components/RenderSpotify.tsx`)

```typescript
export function RenderSpotify({ config, data, style, size }: RenderSpotifyProps) {
  return (
    <section id="spotify-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<DefaultList data={data.tracks} />}
        terminalComponent={<TerminalList data={data.tracks} />}
      />
    </section>
  )
}
```

## Shared Utils

Use utils in `shared/utils/`:

- `api.ts` - `fetchJson`, `requireApiKey`, `fetchWithRetry`
- `errors.ts` - `PluginError`, `ApiError`, `ConfigError`
- `validation.ts` - `isValidUsername`, `isValidApiKey`
- `formatting.ts` - `formatNumber`, `abbreviateNumber`, `formatRelativeTime`

## Shared Constants

Use constants in `shared/constants/`:

- `sections.ts` - Common sections
- `limits.ts` - Default limits
- `intervals.ts` - Time intervals

## Validation

The `validate-plugins` script checks:

- All required fields are present
- i18n keys exist for all languages
- Plugin structure is correct
- Metadata matches plugin implementation

Run it with:

```bash
pnpm validate-plugins
```

## Checklist

- [ ] Replace all placeholders
- [ ] Define plugin-specific types
- [ ] Implement `fetchData` with essentialConfig validation
- [ ] Create mock data for development
- [ ] Implement render components
- [ ] Register plugin in PluginManager
- [ ] Run `pnpm generate-metadata` to create i18n keys
- [ ] Test in dev mode (mock)
- [ ] Test with real data
- [ ] Verify all translations are complete
- [ ] Run `validate-plugins` to check for issues
