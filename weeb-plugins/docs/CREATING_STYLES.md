# Creating a Style

This guide explains how to create a new visual style for WeebProfile (e.g., "Windows XP", "Material Design", etc.).

## Overview

Styles define the visual appearance of plugins. Each style is modular and self-contained, making it easy to add new styles without modifying existing code.

## Style Structure

```
src/styles/
├── {style-name}/
│   ├── index.ts          # Style definition & exports
│   ├── styles.css        # Style-specific CSS
│   └── themes.ts         # Theme definitions
└── registry.ts           # Style registry
```

## Creating a New Style

### 1. Create Style Directory

```bash
mkdir -p src/styles/windows-xp
```

### 2. Create Style Definition (index.ts)

```typescript
// src/styles/windows-xp/index.ts
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { windowsXpThemes } from './themes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load CSS file
function loadCSS(): string {
  const cssPath = resolve(__dirname, 'styles.css')
  return readFileSync(cssPath, 'utf8')
}

// Get theme variables
export function getWindowsXpThemeVariables(theme: keyof typeof windowsXpThemes) {
  const selectedTheme = windowsXpThemes[theme] || windowsXpThemes.default
  
  return {
    '--windows-xp-color-surface': selectedTheme.surface,
    '--windows-xp-color-background': selectedTheme.background,
    '--windows-xp-color-highlight': selectedTheme.highlight,
    '--windows-xp-color-default': selectedTheme.default,
    '--windows-xp-color-success': selectedTheme.success,
    '--windows-xp-color-muted': selectedTheme.muted,
    '--windows-xp-color-raw': selectedTheme.raw,
  }
}

// Export style definition
export const windowsXpStyle = {
  name: 'windows-xp',
  displayName: 'Windows XP',
  fontFamily: 'Tahoma, sans-serif',
  containerClass: 'windows-xp-container',
  getCSS: loadCSS,
  getThemeVariables: getWindowsXpThemeVariables,
  themes: windowsXpThemes,
}

export default windowsXpStyle
```

### 3. Create CSS File (styles.css)

```css
/* src/styles/windows-xp/styles.css */

/* Container */
#svg-main .windows-xp-container {
  --font-family: Tahoma, sans-serif;
  font-family: Tahoma, sans-serif;
  width: 100%;
  background: var(--windows-xp-color-background);
  border: 2px outset var(--windows-xp-color-surface);
}

/* Utility Classes */
#svg-main .text-windows-xp-highlight {
  color: var(--windows-xp-color-highlight) !important;
}

#svg-main .bg-windows-xp-highlight {
  background-color: var(--windows-xp-color-highlight) !important;
}

#svg-main .text-windows-xp-muted {
  color: var(--windows-xp-color-muted) !important;
}

#svg-main .text-windows-xp-raw {
  color: var(--windows-xp-color-raw) !important;
}

/* Style-specific components */
#svg-main .windows-xp-title {
  font-weight: bold;
  border-bottom: 1px solid var(--windows-xp-color-highlight);
  padding-bottom: 4px;
  margin-bottom: 8px;
}
```

### 4. Create Themes (themes.ts)

```typescript
// src/styles/windows-xp/themes.ts

export const windowsXpThemes = {
  default: {
    surface: '#ece9d8',
    background: '#d4d0c8',
    highlight: '#0054e3',
    default: '#000000',
    success: '#00ff00',
    muted: '#808080',
    raw: '#000000',
  },
  classic: {
    surface: '#c0c0c0',
    background: '#808080',
    highlight: '#000080',
    default: '#000000',
    success: '#008000',
    muted: '#808080',
    raw: '#000000',
  },
}

export type WindowsXpTheme = keyof typeof windowsXpThemes
```

### 5. Register Style

Add to `src/styles/registry.ts`:

```typescript
import windowsXpStyle from './windows-xp/index.js'

export const styleRegistry = {
  default: defaultStyle,
  terminal: terminalStyle,
  'windows-xp': windowsXpStyle,
}

export type StyleName = keyof typeof styleRegistry
```

### 6. Update PluginStyles Component

Update `src/templates/PluginStyles.tsx` to support the new style:

```typescript
import { styleRegistry } from '../../styles/registry.js'

export function PluginStyles({ style, children, ... }) {
  const styleDef = styleRegistry[style]
  if (!styleDef) {
    console.warn(`Unknown style: ${style}`)
    return <>{children}</>
  }

  const themeVariables = styleDef.getThemeVariables(theme)
  const themeStyles = {
    fontFamily: styleDef.fontFamily,
    ...themeVariables,
  }

  return (
    <div 
      className={styleDef.containerClass}
      style={themeStyles}
    >
      {children}
    </div>
  )
}
```

## CSS Best Practices

1. **Scope Everything**: Always scope CSS with `#svg-main`
2. **Use CSS Variables**: Use theme variables for colors
3. **Consistent Naming**: Follow pattern `{style}-{property}`
4. **Minimal CSS**: Only include style-specific CSS
5. **Utility Classes**: Provide utility classes for common patterns

## Theme Structure

All themes should follow this structure:

```typescript
{
  surface: string      // Container/surface color
  background: string   // Background color
  highlight: string    // Primary/accent color
  default: string      // Default text color
  success: string     // Success color
  muted: string       // Muted/secondary text
  raw: string         // Raw/primary text
}
```

## Testing Your Style

1. Create test components using your style
2. Test with different themes
3. Verify CSS is loaded correctly
4. Test in both `svg-generator` and `weeb-dashboard`

## Example: Complete Style

See `src/styles/default/` and `src/styles/terminal/` for complete examples.














