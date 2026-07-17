Scaffold a new WeebProfile plugin named: $ARGUMENTS

Follow the checklist from CLAUDE.md exactly, using `steam` as the canonical reference:

### Step 1 — Create file structure

```
weeb-plugins/src/plugins/$ARGUMENTS/
├── index.tsx
├── plugin.metadata.ts
├── types.ts
├── components/
│   ├── Render{Name}.tsx      # receives { config, data, style, size }
│   └── {Section}.tsx         # one component per section
├── services/
│   ├── fetchData.ts          # real API calls
│   └── mock-data.ts          # static mock data for dev/preview
└── previews/                 # auto-generated, leave empty
```

### Step 2 — Implement `index.tsx`

Copy the pattern from `weeb-plugins/src/plugins/steam/index.tsx`.

### Step 3 — Implement `plugin.metadata.ts`

Copy the pattern from `weeb-plugins/src/plugins/steam/plugin.metadata.ts`.
Required fields: `displayName`, `description`, `category`, `icon`, `requiredFields`, `essentialConfigKeys`, `essentialConfigKeysMetadata`, `sections[]`.

### Step 4 — Register in PluginManager

Add import and `this.register(...)` in `weeb-plugins/src/plugins/manager.ts`.

### Step 5 — Regenerate metadata and verify

```bash
pnpm --filter @weeb/weeb-plugins run generate:metadata
pnpm typecheck
```

**Security rule:** API keys and tokens MUST go in `essentialConfigKeys` (stored in Supabase), never in `requiredFields` (public config).
