# Estrutura de Plugins - WeebProfile

Este documento descreve a estrutura modular de plugins do WeebProfile e como criar novos plugins.

## Visão Geral

Os plugins no WeebProfile seguem uma arquitetura modular que separa:
- **Configurações Essenciais**: API keys, tokens, credenciais (armazenadas em `essentialConfigs`)
- **Configurações Não-Essenciais**: Preferências do usuário (armazenadas em `pluginsConfig`)

## Estrutura de Diretórios

```
source-v2/src/plugins/
├── shared/                    # Infraestrutura compartilhada
│   ├── types/                 # Tipos base
│   │   ├── base.ts           # BasePluginConfig, EssentialPluginConfig, etc
│   │   └── plugin.ts         # Interface Plugin
│   ├── utils/                 # Utilitários compartilhados
│   │   ├── api.ts            # Helpers de API (fetchJson, requireApiKey, etc)
│   │   ├── validation.ts     # Validadores (isValidUsername, isValidApiKey, etc)
│   │   ├── formatting.ts     # Formatadores (formatNumber, formatRelativeTime, etc)
│   │   └── errors.ts          # Classes de erro (PluginError, ApiError, etc)
│   └── constants/             # Constantes compartilhadas
│       ├── sections.ts        # Seções comuns
│       ├── limits.ts          # Limites padrão
│       └── intervals.ts       # Intervalos de tempo
├── _template/                 # Template/boilerplate para novos plugins
│   ├── index.tsx             # Definição principal do plugin
│   ├── types.ts              # Tipos específicos do plugin
│   ├── services/
│   │   ├── fetchData.ts      # Lógica de busca de dados
│   │   └── mock-data.ts      # Dados mock para desenvolvimento
│   ├── components/
│   │   └── RenderPLUGIN_NAME.tsx  # Componente de renderização
│   └── README.md             # Documentação do template
└── [nome-do-plugin]/         # Plugins existentes (github, lastfm, myanimelist)
    ├── index.tsx             # Definição do plugin
    ├── types.ts              # Tipos específicos
    ├── services/             # Serviços de fetch
    └── components/            # Componentes React
```

## Criando um Novo Plugin

### Método 1: Usando o Script (Recomendado)

```bash
cd source-v2
pnpm create-plugin meu-plugin
```

O script irá:
1. Criar a estrutura completa do plugin
2. Substituir todos os placeholders (`PLUGIN_NAME`, `PluginName`, etc)
3. Registrar o plugin no PluginManager
4. Adicionar export no `index.ts`

### Método 2: Manualmente

1. Copie a pasta `_template/` para `src/plugins/[nome-do-plugin]/`
2. Substitua todos os placeholders:
   - `PLUGIN_NAME` → nome do plugin (ex: "spotify")
   - `PluginName` → PascalCase (ex: "Spotify")
   - `PLUGIN_NAME_UPPER` → UPPER_CASE (ex: "SPOTIFY")
3. Implemente a lógica em `services/fetchData.ts`
4. Implemente os componentes em `components/`
5. Registre o plugin em `src/plugins/manager.ts`

## Estrutura de um Plugin

### 1. index.tsx - Definição Principal

```typescript
import type { Plugin } from '../shared/types/plugin.js'
import type { PluginData } from '../../types/index.js'
import type { MeuPluginConfig, MeuPluginData } from './types.js'
import { RenderMeuPlugin } from './components/RenderMeuPlugin.js'
import { fetchMeuPluginData } from './services/fetchData.js'

export const meuPluginPlugin: Plugin<MeuPluginConfig, PluginData & MeuPluginData> = {
  name: 'meu-plugin',
  
  // Chaves de configuração essencial que este plugin requer
  essentialConfigKeys: ['apiKey'], // Ex: ['apiKey'] para LastFM
  
  // Configuração padrão do plugin
  config: {
    enabled: false,
    sections: [],
    nonEssential: {
      // Valores padrão para configs não-essenciais
    },
  } as MeuPluginConfig,
  
  /**
   * Busca dados do plugin
   */
  fetchData: async (config: MeuPluginConfig, dev = false, essentialConfig) => {
    return await fetchMeuPluginData(config, dev, essentialConfig) as PluginData & MeuPluginData
  },
  
  /**
   * Renderiza o plugin
   */
  render: (config: MeuPluginConfig, data: PluginData & MeuPluginData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    
    return (
      <RenderMeuPlugin
        config={config}
        data={data as MeuPluginData}
        style={style}
        size={size}
      />
    )
  },
}
```

### 2. types.ts - Tipos Específicos

```typescript
import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base.js'

/**
 * Configurações não-essenciais (preferências do usuário)
 */
export interface MeuPluginNonEssentialConfig extends NonEssentialPluginConfig {
  max_items?: number
  show_title?: boolean
  custom_title?: string
}

/**
 * Configuração completa do plugin
 */
export interface MeuPluginConfig extends BasePluginConfig {
  nonEssential?: MeuPluginNonEssentialConfig
}

/**
 * Dados retornados pelo plugin
 */
export interface MeuPluginData {
  items: Array<{ id: string; name: string }>
  total: number
}
```

### 3. services/fetchData.ts - Lógica de Fetch

```typescript
import type { MeuPluginConfig, MeuPluginData } from '../types.js'
import type { EssentialPluginConfig } from '../../shared/types/base.js'
import { getMockMeuPluginData } from './mock-data.js'
import { requireApiKey, fetchJson } from '../../shared/utils/api.js'
import { ConfigError } from '../../shared/utils/errors.js'

export async function fetchMeuPluginData(
  config: MeuPluginConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<MeuPluginData> {
  // Modo desenvolvimento - retornar dados mock
  if (dev) {
    return getMockMeuPluginData()
  }

  // Validar configurações essenciais necessárias
  const apiKey = requireApiKey(essentialConfig?.apiKey, 'apiKey')

  // Buscar dados via API
  const response = await fetchJson<MeuPluginData>(
    `https://api.example.com/data?api_key=${apiKey}`
  )
  
  return response
}
```

### 4. services/mock-data.ts - Dados Mock

```typescript
import type { MeuPluginData } from '../types.js'

export function getMockMeuPluginData(): MeuPluginData {
  return {
    items: [
      { id: '1', name: 'Example Item 1' },
      { id: '2', name: 'Example Item 2' },
    ],
    total: 2,
  }
}
```

### 5. components/RenderMeuPlugin.tsx - Renderização

```typescript
import React from 'react'
import type { MeuPluginConfig, MeuPluginData } from '../types.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'

interface RenderMeuPluginProps {
  config: MeuPluginConfig
  data: MeuPluginData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderMeuPlugin({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderMeuPluginProps): React.ReactElement {
  if (!config.enabled || !data) {
    return <></>
  }

  return (
    <section id="meu-plugin-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {/* Implemente sua renderização default aqui */}
            <div>Meu Plugin - Default Style</div>
          </>
        }
        terminalComponent={
          <>
            {/* Implemente sua renderização terminal aqui */}
            <div>Meu Plugin - Terminal Style</div>
          </>
        }
      />
    </section>
  )
}
```

## Configurações Essenciais vs Não-Essenciais

### Essenciais (EssentialConfig)

- **O que são**: API keys, tokens, credenciais sensíveis
- **Onde ficam**: Campo `essentialConfigs` JSONB no banco de dados (tabela `profiles`)
- **Como acessar**: Via parâmetro `essentialConfig` em `fetchData`
- **Como definir**: Em `essentialConfigKeys` no plugin

Exemplo:
```typescript
essentialConfigKeys: ['apiKey', 'username']
```

### Não-Essenciais (NonEssentialConfig)

- **O que são**: Preferências do usuário (max_items, titles, etc)
- **Onde ficam**: Campo `pluginsConfig` JSONB no banco de dados
- **Como acessar**: Via `config.nonEssential`
- **Como definir**: Em `types.ts` do plugin

Exemplo:
```typescript
export interface MeuPluginNonEssentialConfig extends NonEssentialPluginConfig {
  max_items?: number
  show_title?: boolean
}
```

## Utils Compartilhados

### api.ts
- `fetchJson<T>(url, options)` - Fetch JSON com retry automático
- `requireApiKey(apiKey, keyName)` - Valida e retorna API key
- `requireToken(token, tokenName)` - Valida e retorna token
- `buildQueryString(params)` - Cria query string

### validation.ts
- `isValidUsername(username)` - Valida username
- `isValidApiKey(apiKey)` - Valida API key
- `isValidToken(token)` - Valida token
- `isInRange(value, min, max)` - Valida range numérico

### formatting.ts
- `formatNumber(num)` - Formata número com separadores
- `abbreviateNumber(num)` - Abrevia número (1.5K, 2.3M)
- `formatRelativeTime(date)` - Formata data relativa
- `truncate(str, maxLength)` - Trunca string

### errors.ts
- `PluginError` - Erro base para plugins
- `ApiError` - Erro de API (statusCode, apiName)
- `ConfigError` - Erro de configuração (missingKeys)
- `ValidationError` - Erro de validação

## Constants Compartilhados

### sections.ts
```typescript
export const COMMON_SECTIONS = {
  PROFILE: 'profile',
  STATISTICS: 'statistics',
  ACTIVITY: 'activity',
  FAVORITES: 'favorites',
  RECENT: 'recent',
  TOP: 'top',
}
```

### limits.ts
```typescript
export const DEFAULT_LIMITS = {
  MAX_ITEMS_SMALL: 5,
  MAX_ITEMS_MEDIUM: 10,
  MAX_ITEMS_LARGE: 20,
  MAX_ITEMS_XLARGE: 50,
}
```

## Checklist de Criação de Plugin

- [ ] Usar `pnpm create-plugin nome-do-plugin` ou copiar template manualmente
- [ ] Substituir todos os placeholders (`PLUGIN_NAME`, `PluginName`, etc)
- [ ] Definir tipos específicos em `types.ts`
- [ ] Implementar `fetchData` com validação de `essentialConfig`
- [ ] Criar dados mock para desenvolvimento
- [ ] Implementar componentes de renderização (default e terminal)
- [ ] Registrar plugin no `PluginManager` (se feito manualmente)
- [ ] Adicionar export no `index.ts` (se feito manualmente)
- [ ] Testar em modo dev (mock)
- [ ] Testar com dados reais
- [ ] Documentar configurações disponíveis

## Exemplos de Plugins Existentes

- **GitHub** (`github/`): Usa token OAuth, múltiplas seções
- **LastFM** (`lastfm/`): Usa API key + username, múltiplas seções
- **MyAnimeList** (`myanimelist/`): Usa token, múltiplas seções

Consulte esses plugins como referência para implementação completa.

## Script create-plugin

O script `create-plugin.ts` automatiza a criação de novos plugins:

```bash
pnpm create-plugin nome-do-plugin
```

**O que o script faz:**
1. Valida nome do plugin (kebab-case)
2. Copia template para nova pasta
3. Substitui placeholders automaticamente
4. Cria estrutura completa (services, components)
5. Registra plugin no PluginManager
6. Adiciona export no index.ts

**Placeholders substituídos:**
- `PLUGIN_NAME` → nome do plugin (ex: "spotify")
- `PluginName` → PascalCase (ex: "Spotify")
- `PLUGIN_NAME_UPPER` → UPPER_CASE (ex: "SPOTIFY")

**Validações:**
- Nome deve estar em kebab-case (apenas letras minúsculas, números e hífens)
- Plugin não pode já existir

## Próximos Passos

Após criar um plugin:
1. Implemente a lógica de fetch em `services/fetchData.ts`
2. Crie dados mock em `services/mock-data.ts`
3. Implemente renderização em `components/RenderPlugin.tsx`
4. Teste com `pnpm dev`
5. Documente configurações disponíveis

Para mais detalhes, veja `src/plugins/_template/README.md`.

