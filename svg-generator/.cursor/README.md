# svg-generator Cursor setup

## What’s here
- `.cursor/rules/*.mdc`: workspace rules (some always-on, others attach by file patterns)
- `.cursor/commands/*.md`: slash commands for common tasks (debug, refactors, deploy)

## Recommended
- Keep `00-core.mdc` alwaysApply=true.
- Keep security rules alwaysApply=true.
- Use `90-debug-checklist.mdc` when you’re actively debugging.
