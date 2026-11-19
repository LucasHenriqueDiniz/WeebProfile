# Wizard

The screen that creates and edits a card: `/dashboard/new/profile`, `/dashboard/new/repository` and `/dashboard/:id/edit`.

## Layout (`WizardShell`)

- **Bar**: back, the card's name and kind, pending settings, language and theme, save.
- **Plugin strip** (`PluginStrip`, profile only): every plugin in one row. Picking one opens its settings; a plugin on the card shows how many sections it draws, or a warning.
- **Stage**: the live preview at the card's real width (scaled down when the column is narrower), with a floating toolbar for the style (`default` / `terminal`) and the width (415 / 830).
- **Drawer**: tabs for the selected plugin (`PluginDetailPanel` → `PluginCard`), the order of the cards (`CardOrderPanel`) and the style (`StyleConfiguration`). The repository wizard has its own panel (`RepositoryConfigPanel`) and no order tab.
- **Phones and tablets**: a switch between the settings and the preview; save stays at the bottom.

Every area stays mounted and only toggles visibility, so switching tabs never remounts the preview (the card would restart its animations).

## State

- `useWizardStore` (profile) and `useRepositoryWizardStore` (repository), both persisted.
- `useWizardController` / `useRepositoryWizardController`: loading, the active tab, save.
- `usePluginWorkspace`: the selected plugin, secrets, required fields and what is missing.
