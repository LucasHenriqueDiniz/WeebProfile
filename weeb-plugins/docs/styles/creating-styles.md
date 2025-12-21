
A **style pack** controls how templates/plugins render visually (CSS + theme variables).
Because output is embedded (often as SVG/HTML), **CSS must be strictly scoped**.

## Style pack layout

Recommended structure:

```
src/styles/<style-name>/
  index.ts
  styles.css
  themes.ts
src/styles/registry.ts
```

Your repo may have slightly different naming; keep the same separation:

- `styles.css`: scoped CSS
- `themes.ts`: theme tokens + variable mapping
- `index.ts`: style definition/export
- `registry.ts`: registration/discovery

## Step 1 — Create the folder

```bash
mkdir -p src/styles/<style-name>
```

## Step 2 — Write scoped CSS (mandatory)

All selectors must be scoped under `#svg-main`:

```css
#svg-main .my-style-title { /* ... */ }
#svg-main .text-my-style-highlight { /* ... */ }
```

### Why `#svg-main`?
To prevent CSS from leaking into the host page when embedded.

## Step 3 — Theme variables

Use CSS variables for colors and key tokens (avoid hard-coded colors).
A common pattern:

- `--<style>-color-surface`
- `--<style>-color-background`
- `--<style>-color-highlight`
- `--<style>-color-default`
- `--<style>-color-success`
- `--<style>-color-muted`
- `--<style>-color-raw`

In `themes.ts`, define:

- supported theme names (e.g. `dark`, `light`, `dracula`, etc.)
- a function that returns the variables map for a given theme

## Step 4 — Export style definition

In `index.ts`:

- export the style name
- export a `getThemeVariables(themeName)` function (or whatever your templates expect)
- export any helpers used by templates

## Step 5 — Register the style

Add it to `src/styles/registry.ts` (or the repo’s equivalent), so consumers can list/select it.

## Checklist

- [ ] CSS is fully scoped under `#svg-main`
- [ ] uses variables instead of hard-coded colors
- [ ] theme variables are returned consistently
- [ ] style is registered so consumers can discover it
- [ ] no global selectors, no leaks
