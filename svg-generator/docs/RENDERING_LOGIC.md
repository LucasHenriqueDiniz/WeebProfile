# SVG Generator Rendering Logic

This document explains how the `svg-generator` renders plugins and generates SVG output.

## Overview

The `svg-generator` is a Node.js HTTP server that:
1. Receives configuration via HTTP POST
2. Renders React components using `@weeb/weeb-plugins`
3. Converts React components to SVG string
4. Returns the SVG with dimensions

## Architecture

```
Request → Validate Config → Load CSS → Render Plugins → Create SVG → Return
```

## Step-by-Step Process

### 1. Request Handling (`server.ts`)

The server receives a POST request with configuration:

```typescript
{
  style: "default" | "terminal",
  size: "half" | "full",
  plugins: {
    github: { enabled: true, sections: ["profile"], ... },
    lastfm: { enabled: true, sections: ["recent_tracks"], ... }
  },
  pluginsOrder: ["github", "lastfm"],
  defaultTheme: "defaultPurple",
  primaryColor: "#8957E5",
  customCss: "...",
  mock: true
}
```

### 2. Configuration Validation (`config/config-loader.ts`)

The config is validated and normalized:

- Checks if at least one plugin is enabled
- Validates plugin sections
- Normalizes theme names
- Sets default values

### 3. CSS Loading (`generator/css-loader.tsx`)

CSS is loaded from `@weeb/weeb-plugins/styles`:

```typescript
// Load style CSS
const styleCSS = getStyleCSS(config.style)

// Load plugin CSS (aggregated from all active plugins)
const pluginCSS = getPluginCSS(config.plugins)

// Generate primary color CSS (if custom color provided)
const primaryColorCSS = generatePrimaryColorCSS(config.primaryColor)

// Combine all CSS
const allCSS = [styleCSS, pluginCSS, primaryColorCSS, config.customCss]
```

CSS is returned as React `<style>` elements:

```tsx
<>
  <style>{styleCSS}</style>
  <style>{pluginCSS}</style>
  <style>{primaryColorCSS}</style>
  {config.customCss && <style>{config.customCss}</style>}
</>
```

### 4. Plugin Rendering (`renderer/react-renderer.tsx`)

Plugins are rendered using `PluginManager`:

```typescript
// Get PluginManager instance
const pluginManager = PluginManager.getInstance()

// Initialize plugins with config
pluginManager.initializeActivePlugins(pluginsConfig)

// Render each plugin in order
for (const pluginName of pluginsOrder) {
  const plugin = pluginManager.getPlugin(pluginName)
  const pluginConfig = pluginsConfig[pluginName]
  const pluginData = await plugin.fetchData(pluginConfig, dev, essentialConfig)
  
  // Render plugin component
  const rendered = plugin.render(pluginConfig, pluginData)
  components.push(rendered)
}
```

### 5. SVG Container Creation (`renderer/template-renderer.tsx`)

The rendered components are wrapped in an SVG container:

```tsx
<svg
  id="svg-main"
  width={width}
  height={height}
  className={containerClass}
  data-terminal-theme={terminalTheme}
  data-default-theme={defaultTheme}
>
  {cssDefs}  {/* All CSS as <style> tags */}
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <PluginStyles style={style} defaultTheme={defaultTheme}>
        {components}  {/* Rendered plugin components */}
      </PluginStyles>
    </div>
  </foreignObject>
</svg>
```

**Key Points:**
- `foreignObject` allows HTML/CSS inside SVG
- `xmlns` attributes are required for foreignObject
- CSS is injected as `<style>` tags
- `PluginStyles` wrapper applies theme variables

### 6. String Conversion (`generator/svg-generator.ts`)

The React element is converted to string:

```typescript
import { renderToString } from 'react-dom/server'

const svgElement = createSvgContainer({ ... })
const svgString = renderToString(svgElement)
```

### 7. Response

The server returns:

```json
{
  "success": true,
  "svg": "<svg>...</svg>",
  "width": 415,
  "height": 600
}
```

## CSS Injection Flow

```
1. Load style CSS from weeb-plugins
2. Aggregate plugin CSS from all active plugins
3. Generate primary color override CSS
4. Combine with custom CSS
5. Inject as <style> tags in SVG
6. CSS is scoped with #svg-main selector
```

## Plugin Rendering Flow

```
1. Validate plugin configuration
2. Initialize PluginManager with active plugins
3. For each plugin in pluginsOrder:
   a. Get plugin from PluginManager
   b. Fetch data (or use mock if dev=true)
   c. Call plugin.render(config, data)
   d. Add rendered component to array
4. Wrap all components in PluginStyles
5. Wrap in SVG container
```

## Height Calculation

Height is calculated using `height-calculator.ts`:

- Estimates based on number of plugins
- Considers section count
- Accounts for different sizes (half/full)
- Returns estimated height

## Error Handling

- Plugin errors are caught and logged
- Invalid configs return 400 error
- Missing plugins are skipped
- CSS loading errors fall back to basic CSS

## Key Components

### PluginManager

- Singleton pattern
- Manages plugin registry
- Handles plugin initialization
- Provides plugin instances

### PluginStyles

- Wraps plugin components
- Applies theme variables as inline styles
- Handles style-specific rendering (default/terminal)
- Applies CSS variables

### CSS Loader

- Loads CSS from weeb-plugins
- Aggregates plugin CSS
- Generates dynamic CSS (primary color)
- Returns React style elements

## Example: Complete Flow

```
1. POST /generate with config
2. Validate: ✓ plugins enabled, ✓ sections valid
3. Load CSS:
   - default.css from weeb-plugins
   - github styles.css
   - lastfm styles.css
   - primaryColor override CSS
4. Render:
   - github.render() → <RenderGithub />
   - lastfm.render() → <RenderLastFm />
5. Wrap:
   - <PluginStyles style="default">
     - <RenderGithub />
     - <RenderLastFm />
   - </PluginStyles>
6. SVG:
   - <svg>
     - <style>...</style>
     - <foreignObject>
       - <PluginStyles>...</PluginStyles>
     - </foreignObject>
   - </svg>
7. renderToString() → SVG string
8. Return { svg, width, height }
```

## Differences: Preview vs Final Generation

### Preview (weeb-dashboard)

- Uses React components directly
- CSS injected via `useEffect` and `<style>` element
- No API call needed
- Real-time updates

### Final Generation (svg-generator)

- Server-side rendering with `renderToString`
- CSS loaded from file system
- Returns static SVG string
- Used for final output

Both use the same CSS system and plugin rendering logic, ensuring consistency.














