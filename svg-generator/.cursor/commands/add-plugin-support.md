# /add-plugin-support

A new plugin was added to `@weeb/weeb-plugins`. Verify what (if anything) `svg-generator` must change.

## Checklist
- Confirm the server keeps plugin handling generic:
  - request `plugins` map
  - `pluginsOrder`
  - `validateConfig` rules (enabled + sections)
- Confirm essential configs fetch can include the new plugin key:
  - DB query result mapping (plugin id -> essential config)
- Confirm CSS aggregation includes the new plugin styles (usually comes from weeb-plugins build).
- Update docs if request examples enumerate plugins.

## Output
- If no change needed: say so, and list what was verified.
- If change needed: provide a minimal diff and explain why.
