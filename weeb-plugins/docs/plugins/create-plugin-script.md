
# `pnpm create-plugin` Scaffolder

This repo includes (or should include) a script that scaffolds a new plugin with the expected structure.

## Usage

```bash
pnpm create-plugin <kebab-case-name>
```

Example:

```bash
pnpm create-plugin spotify
pnpm create-plugin steam-profile
```

## What it should generate

At minimum:

```
src/plugins/<name>/
  index.tsx
  types.ts
  services/
    fetchData.ts
    mock-data.ts
  components/
    Render<Name>.tsx
  README.md
```

Optionally:

- `styles.css` if the plugin needs custom CSS
- a default metadata stub insertion guidance (manual step if the script doesn’t edit registries)

## After scaffolding — required manual steps

Even if the script creates the folder, you still need to:

- implement `fetchData()` logic
- implement rendering
- add metadata entry (`src/plugins/metadata.ts`)
- export/register the plugin (barrel/manager)

## Naming

- Folder name: `kebab-case`
- Plugin ID: stable, derived from folder name
- Avoid renames (config compatibility)
