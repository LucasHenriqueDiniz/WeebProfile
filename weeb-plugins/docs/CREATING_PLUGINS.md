# Creating a Plugin

This guide explains how to create a new plugin for WeebProfile.

## Overview

Plugins are modular data sources that fetch and display information. They automatically become available to both `svg-generator` and `weeb-dashboard` once created.

## Quick Start

### Using the Script (Recommended)

```bash
cd weeb-plugins
pnpm create-plugin my-plugin
```

This will:
- Create the plugin directory structure
- Replace all placeholders
- Register the plugin in the PluginManager
- Add metadata entry

### Manual Creation

1. Copy `src/plugins/_template/` to `src/plugins/my-plugin/`
2. Replace placeholders (see below)
3. Implement the plugin logic
4. Register in `src/plugins/index.ts`
5. Add metadata in `src/plugins/metadata.ts`

## Plugin Structure

```
my-plugin/
├── index.tsx              # Plugin definition
├── types.ts               # TypeScript types
├── components/
│   └── RenderMyPlugin.tsx # Main render component
├── services/
│   ├── fetchMyPlugin.ts   # Data fetching logic
│   └── mock-data.ts       # Mock data for development
├── styles.css             # Optional plugin-specific CSS
└── README.md              # Plugin documentation
```

## Plugin Definition

### index.tsx

```typescript
import React from 'react'
import type { Plugin } from '../types.js'
import type { PluginConfig, PluginData } from '../../types/index.js'
import type { EssentialPluginConfig } from '../shared/types/base.js'
import type { MyPluginConfig, MyPluginData } from './types.js'
import { RenderMyPlugin } from './components/RenderMyPlugin.js'
import { fetchMyPluginData } from './services/fetchMyPlugin.js'

export const myPluginPlugin: Plugin<PluginConfig & MyPluginConfig, PluginData & MyPluginData> = {
  name: 'my-plugin',
  essentialConfigKeys: ['apiKey'], // Required config keys
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as PluginConfig & MyPluginConfig,
  fetchData: async (config, dev = false, essentialConfig) => {
    if (!dev && !essentialConfig?.apiKey) {
      throw new Error('API key is required')
    }
    return await fetchMyPluginData(config, dev, essentialConfig)
  },
  render: (config, data) => {
    const style = (config as any).style || 'default'
    const size = (config as any).size || 'half'
    return (
      <RenderMyPlugin
        config={config as MyPluginConfig}
        data={data as MyPluginData}
        style={style}
        size={size}
      />
    )
  },
  // Optional: Plugin-specific CSS
  styles: `
    #svg-main .my-plugin-custom {
      /* Plugin-specific styles */
    }
  `,
}

export default myPluginPlugin
```

## Data Fetching

### services/fetchMyPlugin.ts

```typescript
import type { MyPluginConfig, MyPluginData } from '../types.js'
import type { EssentialPluginConfig } from '../../shared/types/base.js'
import { getMyPluginMockData } from './mock-data.js'

export async function fetchMyPluginData(
  config: MyPluginConfig,
  dev: boolean,
  essentialConfig?: EssentialPluginConfig
): Promise<MyPluginData> {
  if (dev) {
    return getMyPluginMockData()
  }

  const apiKey = essentialConfig?.apiKey
  if (!apiKey) {
    throw new Error('API key is required')
  }

  // Fetch real data from API
  const response = await fetch(`https://api.example.com/data`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return await response.json()
}
```

## Rendering Components

### components/RenderMyPlugin.tsx

```typescript
import React from 'react'
import type { MyPluginConfig, MyPluginData } from '../types.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'

interface RenderMyPluginProps {
  config: MyPluginConfig
  data: MyPluginData
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function RenderMyPlugin({
  config,
  data,
  style,
  size,
}: RenderMyPluginProps): React.ReactElement {
  if (!config.enabled || !config.sections.length) {
    return <></>
  }

  return (
    <section id="my-plugin-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            <DefaultTitle title="My Plugin" />
            {/* Default style rendering */}
          </>
        }
        terminalComponent={
          <>
            {/* Terminal style rendering */}
          </>
        }
      />
    </section>
  )
}
```

## Plugin-Specific CSS

### styles.css (Optional)

If your plugin needs custom CSS, create a `styles.css` file:

```css
/* Plugin-specific styles scoped to #svg-main */
#svg-main .my-plugin-custom-class {
  /* Styles */
}

#svg-main .my-plugin-icon {
  width: 20px;
  height: 20px;
}
```

The CSS will be automatically loaded by `svg-generator` and `weeb-dashboard`.

## Metadata

Add plugin metadata in `src/plugins/metadata.ts`:

```typescript
export const PLUGINS_METADATA = {
  // ... other plugins
  'my-plugin': {
    name: 'my-plugin',
    displayName: 'My Plugin',
    description: 'Description of my plugin',
    category: 'coding' | 'music' | 'anime',
    icon: 'IconName', // Lucide React icon name
    requiredFields: ['username'],
    essentialConfigKeys: ['apiKey'],
    essentialConfigKeysMetadata: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'your-api-key',
        description: 'Your API key',
        helpUrl: 'https://example.com/api-keys',
        docKey: 'my-plugin.api-key',
      },
    ],
    sections: [
      {
        id: 'section-name',
        name: 'Section Name',
        description: 'Section description',
        configOptions: [
          {
            key: 'section_hide_title',
            label: 'Hide title',
            type: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
    defaultConfig: {
      enabled: false,
      sections: ['section-name'],
    },
  },
}
```

## Registering the Plugin

### In src/plugins/index.ts

```typescript
export { myPluginPlugin } from './my-plugin/index.js'
```

### In src/plugins/manager.ts

```typescript
import { myPluginPlugin } from './my-plugin/index.js'

export class PluginManager {
  private constructor() {
    this.register(myPluginPlugin)
    // ... other plugins
  }
}
```

## Testing

Use mock data during development:

```typescript
// services/mock-data.ts
export function getMyPluginMockData(): MyPluginData {
  return {
    // Mock data structure
  }
}
```

## Best Practices

1. **Error Handling**: Always handle API errors gracefully
2. **Rate Limiting**: Respect API rate limits
3. **Caching**: Consider caching for expensive API calls
4. **Type Safety**: Use TypeScript types throughout
5. **Documentation**: Document all sections and config options
6. **Mock Data**: Provide realistic mock data for development
7. **CSS**: Keep plugin CSS minimal and scoped to `#svg-main`















