# Weeb Plugins — Documentation

This folder documents how to author **plugins**, **styles**, and related metadata in the `weeb-plugins` repository.

## Contents

### Plugins

- `plugins/creating-plugins.md` — end-to-end guide to create and implement a plugin
- `plugins/create-plugin-script.md` — how to use the `pnpm create-plugin` scaffolder
- `plugins/plugin-metadata.md` — how `src/plugins/metadata.ts` works and how to keep it in sync

### Styles

- `styles/creating-styles.md` — how to create a style pack (CSS + themes + registry)

## Rules of thumb

- `docs/` is for humans.
- `.cursor/` is for the LLM rules (short, strict, checklist-y).
- Plugins must be deterministic: **fetch in `fetchData()`**, render in components, no side effects during render.
- CSS must be **scoped under `#svg-main`** (SVG embed safety).
