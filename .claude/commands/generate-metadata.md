Regenerate the centralized `metadata.ts` for weeb-plugins after any plugin change:

```bash
pnpm --filter @weeb/weeb-plugins run generate:metadata
```

Run this after:
- Adding a new plugin
- Modifying any `plugin.metadata.ts`
- Adding or removing sections from a plugin

After running, confirm the output in `weeb-plugins/src/plugins/metadata.ts` is correct and run `pnpm typecheck` to verify no errors.
