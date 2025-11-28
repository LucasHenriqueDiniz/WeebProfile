# WeebProfile - Plugin Creation Guide

Guia completo para criar novos plugins no WeebProfile, com exemplos reais de tipos, dados e implementação.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de um Plugin](#estrutura-de-um-plugin)
3. [Tipos e Interfaces](#tipos-e-interfaces)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Exemplos Reais](#exemplos-reais)
6. [Mock Data](#mock-data)
7. [Componentes de Renderização](#componentes-de-renderização)
8. [Registrando o Plugin](#registrando-o-plugin)
9. [Testes e Validação](#testes-e-validação)
10. [Checklist Completo](#checklist-completo)

---

## Visão Geral

Um **plugin** no WeebProfile é um módulo independente que:

- Busca dados de uma plataforma externa (GitHub, LastFM, Steam, etc.)
- Renderiza esses dados em formato SVG
- Suporta múltiplos estilos (default, terminal)
- Permite customização via configurações

### Arquitetura de um Plugin

```
plugin-name/
├── index.tsx              # Definição principal do plugin
├── types.ts               # Tipos TypeScript específicos
├── services/
│   ├── fetchData.ts       # Lógica de busca de dados da API
│   └── mock-data.ts       # Dados mock para desenvolvimento
├── components/
│   └── RenderPluginName.tsx  # Componentes de renderização
└── README.md              # Documentação do plugin
```

---

## Estrutura de um Plugin

### 1. index.tsx - Definição Principal

Este arquivo exporta o objeto `Plugin` que define o plugin completo.

**Estrutura:**

```typescript
import type { Plugin } from '../types.js'
import type { PluginConfig, PluginData } from '../../types/index.js'
import type { EssentialPluginConfig } from '../shared/types/base.js'
import type { YourPluginConfig, YourPluginData } from './types.js'
import { RenderYourPlugin } from './components/RenderYourPlugin.js'
import { fetchYourPluginData } from './services/fetchData.js'

export const yourPluginPlugin: Plugin<
  PluginConfig & YourPluginConfig,
  PluginData & YourPluginData
> = {
  name: 'your-plugin',
  essentialConfigKeys: ['apiKey'], // Chaves necessárias (API keys, tokens)
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as PluginConfig & YourPluginConfig,
  fetchData: async (
    config: PluginConfig & YourPluginConfig,
    dev = false,
    essentialConfig?: EssentialPluginConfig
  ) => {
    if (dev) {
      return getMockYourPluginData()
    }

    const apiKey = requireApiKey(essentialConfig?.apiKey, 'apiKey')
    return await fetchYourPluginData(config as YourPluginConfig, apiKey)
  },
  render: (
    config: PluginConfig & YourPluginConfig,
    data: PluginData & YourPluginData
  ) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'

    return (
      <RenderYourPlugin
        config={config as YourPluginConfig}
        data={data as YourPluginData}
        style={style}
        size={size}
      />
    )
  },
}

export default yourPluginPlugin
```

---

## Tipos e Interfaces

### Tipos Base (Shared)

```typescript
// shared/types/base.ts

// Configurações essenciais (API keys, tokens)
export interface EssentialPluginConfig {
  [key: string]: string | undefined
}

// Configurações não-essenciais (preferências do usuário)
export interface NonEssentialPluginConfig {
  [key: string]: any
}

// Configuração base de um plugin
export interface BasePluginConfig {
  enabled: boolean
  sections: string[]
  essential?: EssentialPluginConfig
  nonEssential?: NonEssentialPluginConfig
}
```

### Tipos Específicos do Plugin

**Exemplo: LastFM Plugin**

```typescript
// types.ts

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base.js"

// Tipos de dados retornados pela API
export interface LastFmTrack {
  track: string
  artist: string
  date: string
  image?: string // Base64 ou URL
}

export interface LastFmArtist {
  artist: string
  image?: string
  totalPlays: string
}

export interface LastFmAlbum {
  album: string
  artist: string
  plays: string
  image?: string
}

export interface LastFmStatistics {
  totalScrobbles: string
  totalArtists: string
  lovedTracks: string
}

// Configurações não-essenciais (preferências do usuário)
export interface LastFmNonEssentialConfig extends NonEssentialPluginConfig {
  recent_tracks_max?: number
  top_artists_max?: number
  top_albums_max?: number
  top_tracks_max?: number
  recent_tracks_title?: string
  recent_tracks_hide_title?: boolean
  top_artists_title?: string
  top_artists_hide_title?: boolean
  top_artists_style?: "default" | "list" | "grid"
  // ... mais configurações
}

// Configuração completa do plugin
export interface LastFmConfig extends BasePluginConfig {
  nonEssential?: LastFmNonEssentialConfig
  username?: string // Se necessário para a API
  [key: string]: unknown // Index signature para compatibilidade
}

// Dados retornados pelo plugin
export interface LastFmData {
  recentTracks: LastFmTrack[]
  topArtists: LastFmArtist[]
  topAlbums: LastFmAlbum[]
  topTracks: TopTrack[]
  statistics: LastFmStatistics
  featuredTrack?: LastFmFeaturedTrack | null
  topArtistsInterval?: string
  topAlbumsInterval?: string
  topTracksInterval?: string
}
```

**Exemplo: GitHub Plugin**

```typescript
// types.ts

export interface GithubConfig extends BasePluginConfig {
  username: string
  profile_hide_title?: boolean
  profile_title?: string
  favorite_languages_max_languages?: number
  favorite_languages_ignore_languages?: string
  // ... mais configurações específicas
}

export interface GithubData {
  user: {
    login: string
    name: string
    bio?: string
    avatarUrl: string
    location?: string
    company?: string
    websiteUrl?: string
    twitterUsername?: string
    createdAt: string
    followers: number
    following: number
    repositories: { totalCount: number }
    contributionCalendar: {
      totalContributions: number
      weeks: ContributionWeek[]
    }
    // ... mais campos
  }
  activity: {
    totalCommitContributions: number
    totalRepositoriesWithContributedCommits: number
    // ... mais campos
  }
  languages: Array<{
    name: string
    size: number
    color: string
  }>
  repositories: {
    totalCount: number
    nodes: Array<{
      name: string
      description: string | null
      url: string
      stargazerCount: number
      forkCount: number
      // ... mais campos
    }>
  }
  // ... mais dados
}
```

---

## Implementação Passo a Passo

### Passo 1: Criar Estrutura de Pastas

```bash
cd weeb-plugins/src/plugins
mkdir your-plugin
cd your-plugin
mkdir services components
touch index.tsx types.ts services/fetchData.ts services/mock-data.ts components/RenderYourPlugin.tsx README.md
```

### Passo 2: Definir Tipos (types.ts)

```typescript
import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base.js"

// Tipos de dados da API
export interface YourPluginItem {
  id: string
  name: string
  description?: string
  image?: string
  // ... campos específicos da API
}

// Configurações não-essenciais
export interface YourPluginNonEssentialConfig extends NonEssentialPluginConfig {
  max_items?: number
  show_images?: boolean
  custom_title?: string
  hide_title?: boolean
  // ... mais configurações
}

// Configuração completa
export interface YourPluginConfig extends BasePluginConfig {
  nonEssential?: YourPluginNonEssentialConfig
  username?: string
  [key: string]: unknown
}

// Dados retornados
export interface YourPluginData {
  items: YourPluginItem[]
  totalCount: number
  // ... mais dados
}
```

### Passo 3: Implementar fetchData (services/fetchData.ts)

```typescript
import type { YourPluginConfig, YourPluginData } from "../types.js"
import type { EssentialPluginConfig } from "../../shared/types/base.js"
import { fetchJson, requireApiKey } from "../../shared/utils/api.js"
import { getMockYourPluginData } from "./mock-data.js"

export async function fetchYourPluginData(
  config: YourPluginConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<YourPluginData> {
  if (dev) {
    return getMockYourPluginData()
  }

  // Validar API key (se necessário)
  const apiKey = requireApiKey(essentialConfig?.apiKey, "apiKey")

  // Validar username (se necessário)
  if (!config.username) {
    throw new Error("Username is required for YourPlugin")
  }

  // Buscar dados da API
  const baseUrl = "https://api.yourplatform.com/v1"
  const username = config.username

  // Exemplo: buscar múltiplos endpoints
  const [items, stats] = await Promise.all([
    fetchJson<YourPluginItem[]>(`${baseUrl}/users/${username}/items?api_key=${apiKey}`),
    fetchJson<{ totalCount: number }>(`${baseUrl}/users/${username}/stats?api_key=${apiKey}`),
  ])

  // Aplicar limites de configuração
  const maxItems = config.nonEssential?.max_items || 10
  const limitedItems = items.slice(0, maxItems)

  // Converter imagens para base64 (se necessário para SVG)
  const itemsWithBase64 = await Promise.all(
    limitedItems.map(async (item) => {
      if (item.image && item.image.startsWith("http")) {
        // Converter URL para base64
        const base64 = await urlToBase64(item.image)
        return { ...item, image: base64 || item.image }
      }
      return item
    })
  )

  return {
    items: itemsWithBase64,
    totalCount: stats.totalCount,
  }
}
```

### Passo 4: Criar Mock Data (services/mock-data.ts)

```typescript
import type { YourPluginData, YourPluginItem } from "../types.js"
import { urlToBase64 } from "../../../utils/image-to-base64.js"

export async function getMockYourPluginData(): Promise<YourPluginData> {
  // Dados mock realistas
  const mockItems: YourPluginItem[] = [
    {
      id: "1",
      name: "Example Item 1",
      description: "This is a mock item for development",
      image: "https://example.com/image1.jpg",
    },
    {
      id: "2",
      name: "Example Item 2",
      description: "Another mock item",
      image: "https://example.com/image2.jpg",
    },
    // ... mais itens mock
  ]

  // Converter imagens para base64 (se necessário)
  const itemsWithBase64 = await Promise.all(
    mockItems.map(async (item) => {
      if (item.image) {
        const base64 = await urlToBase64(item.image)
        return { ...item, image: base64 || item.image }
      }
      return item
    })
  )

  return {
    items: itemsWithBase64,
    totalCount: mockItems.length,
  }
}
```

### Passo 5: Criar Componente de Renderização (components/RenderYourPlugin.tsx)

```typescript
import React from 'react'
import type { YourPluginConfig, YourPluginData } from '../types.js'
import { RenderBasedOnStyle } from '../../templates/Main/RenderBasedOnStyle.js'
import { DefaultSection } from './sections/DefaultSection.js'
import { TerminalSection } from './sections/TerminalSection.js'

interface RenderYourPluginProps {
  config: YourPluginConfig
  data: YourPluginData
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function RenderYourPlugin({
  config,
  data,
  style,
  size,
}: RenderYourPluginProps) {
  // Verificar se plugin está habilitado e tem sections
  if (!config.enabled || !config.sections.length) {
    return null
  }

  return (
    <section id="your-plugin-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <DefaultSection config={config} data={data} size={size} />
        }
        terminalComponent={
          <TerminalSection config={config} data={data} size={size} />
        }
      />
    </section>
  )
}
```

### Passo 6: Criar Seções (components/sections/)

**DefaultSection.tsx:**

```typescript
import React from 'react'
import type { YourPluginConfig, YourPluginData } from '../../types.js'

interface DefaultSectionProps {
  config: YourPluginConfig
  data: YourPluginData
  size: 'half' | 'full'
}

export function DefaultSection({ config, data, size }: DefaultSectionProps) {
  const title = config.nonEssential?.custom_title || 'Your Plugin'
  const hideTitle = config.nonEssential?.hide_title || false

  return (
    <div className="your-plugin-section">
      {!hideTitle && (
        <h2 className="section-title">{title}</h2>
      )}

      <div className="items-grid">
        {data.items.map((item) => (
          <div key={item.id} className="item-card">
            {item.image && (
              <img src={item.image} alt={item.name} className="item-image" />
            )}
            <h3 className="item-name">{item.name}</h3>
            {item.description && (
              <p className="item-description">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="stats">
        <span>Total: {data.totalCount}</span>
      </div>
    </div>
  )
}
```

**TerminalSection.tsx:**

```typescript
import React from 'react'
import type { YourPluginConfig, YourPluginData } from '../../types.js'

interface TerminalSectionProps {
  config: YourPluginConfig
  data: YourPluginData
  size: 'half' | 'full'
}

export function TerminalSection({ config, data, size }: TerminalSectionProps) {
  const title = config.nonEssential?.custom_title || 'Your Plugin'
  const hideTitle = config.nonEssential?.hide_title || false

  return (
    <div className="terminal-section">
      {!hideTitle && (
        <div className="terminal-header">
          <span className="terminal-prompt">$</span>
          <span className="terminal-command">{title}</span>
        </div>
      )}

      <div className="terminal-output">
        {data.items.map((item, index) => (
          <div key={item.id} className="terminal-line">
            <span className="terminal-line-number">{index + 1}</span>
            <span className="terminal-content">{item.name}</span>
            {item.description && (
              <span className="terminal-meta"> // {item.description}</span>
            )}
          </div>
        ))}
      </div>

      <div className="terminal-footer">
        <span>Total: {data.totalCount} items</span>
      </div>
    </div>
  )
}
```

---

## Exemplos Reais

### Exemplo 1: LastFM Plugin (Completo)

**types.ts:**

```typescript
export interface LastFmTrack {
  track: string
  artist: string
  date: string
  image?: string
}

export interface LastFmNonEssentialConfig extends NonEssentialPluginConfig {
  recent_tracks_max?: number
  top_artists_max?: number
  top_artists_style?: "default" | "list" | "grid"
  recent_tracks_hide_title?: boolean
}

export interface LastFmConfig extends BasePluginConfig {
  nonEssential?: LastFmNonEssentialConfig
}

export interface LastFmData {
  recentTracks: LastFmTrack[]
  topArtists: LastFmArtist[]
  statistics: {
    totalScrobbles: string
    totalArtists: string
  }
}
```

**fetchData.ts:**

```typescript
export async function fetchLastFmData(
  config: LastFmConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<LastFmData> {
  if (dev) {
    return getMockLastFmData()
  }

  const apiKey = requireApiKey(essentialConfig?.apiKey, "apiKey")
  const username = config.username || ""

  if (!username) {
    throw new Error("LastFM username is required")
  }

  const baseUrl = "https://ws.audioscrobbler.com/2.0"
  const maxTracks = config.nonEssential?.recent_tracks_max || 5
  const maxArtists = config.nonEssential?.top_artists_max || 10

  const [recentTracks, topArtists, stats] = await Promise.all([
    fetchJson<{ recenttracks: { track: LastFmTrack[] } }>(
      `${baseUrl}/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${maxTracks}`
    ),
    fetchJson<{ topartists: { artist: LastFmArtist[] } }>(
      `${baseUrl}/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=${maxArtists}`
    ),
    fetchJson<{ user: { playcount: string; artist_count: string } }>(
      `${baseUrl}/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`
    ),
  ])

  return {
    recentTracks: recentTracks.recenttracks.track.map((track) => ({
      track: track.name,
      artist: track.artist["#text"],
      date: track.date?.["#text"] || "now playing",
      image: track.image?.[2]?.["#text"] || undefined,
    })),
    topArtists: topArtists.topartists.artist.map((artist) => ({
      artist: artist.name,
      totalPlays: artist.playcount,
      image: artist.image?.[2]?.["#text"] || undefined,
    })),
    statistics: {
      totalScrobbles: stats.user.playcount,
      totalArtists: stats.user.artist_count,
      lovedTracks: "0",
    },
  }
}
```

### Exemplo 2: GitHub Plugin (Estrutura)

**types.ts:**

```typescript
export interface GithubConfig extends BasePluginConfig {
  username: string
  profile_hide_title?: boolean
  favorite_languages_max_languages?: number
}

export interface GithubData {
  user: {
    login: string
    name: string
    avatarUrl: string
    followers: number
    repositories: { totalCount: number }
  }
  languages: Array<{
    name: string
    size: number
    color: string
  }>
}
```

**fetchData.ts (usando GraphQL):**

```typescript
export async function fetchGithubData(config: GithubConfig, dev = false, pat?: string): Promise<GithubData> {
  if (dev) {
    return getMockGithubData()
  }

  if (!pat) {
    throw new Error("GitHub PAT is required")
  }

  const query = `
    query {
      user(login: "${config.username}") {
        login
        name
        avatarUrl
        followers
        repositories {
          totalCount
        }
      }
    }
  `

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })

  const json = await response.json()
  return json.data
}
```

---

## Mock Data

### Estrutura de Mock Data

Mock data deve ser:

- **Realista**: Dados que parecem reais
- **Completo**: Todos os campos preenchidos
- **Variado**: Diferentes valores para testar edge cases
- **Base64**: Imagens convertidas para base64 (para SVG)

### Exemplo Completo: LastFM Mock Data

```typescript
export async function getMockLastFmData(): Promise<LastFmData> {
  const mockTracks: LastFmTrack[] = [
    {
      track: "ワールドイズマイン-初音ミク「マジカルミライ 2021」Live- (feat. 初音ミク)",
      artist: "ryo (supercell)",
      date: "2 minutes ago",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/69c4ba9ed8c6bc6941dfafb451ed5c19.png",
    },
    {
      track: "I Wish That I Could Fall",
      artist: "Jamie Paige",
      date: "7 minutes ago",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/ee3f08309ee69254d1412dd2ee3e7a4c.jpg",
    },
    // ... mais tracks
  ]

  const mockArtists: LastFmArtist[] = [
    {
      artist: "Seycara Orchestral",
      totalPlays: "3102",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png",
    },
    // ... mais artists
  ]

  // Converter imagens para base64
  const tracksWithBase64 = await Promise.all(
    mockTracks.map(async (track) => {
      if (track.image) {
        const base64 = await urlToBase64(track.image)
        return { ...track, image: base64 || track.image }
      }
      return track
    })
  )

  return {
    recentTracks: tracksWithBase64,
    topArtists: mockArtists,
    statistics: {
      totalScrobbles: "151240",
      totalArtists: "11605",
      lovedTracks: "0",
    },
  }
}
```

---

## Componentes de Renderização

### Estrutura de Componentes

```
components/
├── RenderYourPlugin.tsx      # Componente principal
└── sections/
    ├── DefaultSection.tsx     # Estilo default
    ├── TerminalSection.tsx    # Estilo terminal
    └── shared/                # Componentes compartilhados
        ├── ItemCard.tsx
        └── StatsDisplay.tsx
```

### Padrão de Renderização

```typescript
export function RenderYourPlugin({ config, data, style, size }: Props) {
  // Verificar se plugin está habilitado
  if (!config.enabled || !config.sections.length) {
    return null
  }

  // Renderizar baseado no estilo
  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<DefaultSection {...props} />}
      terminalComponent={<TerminalSection {...props} />}
    />
  )
}
```

---

## Registrando o Plugin

### 1. Registrar no PluginManager

**Arquivo:** `src/plugins/manager.ts`

```typescript
import { yourPluginPlugin } from "./your-plugin/index.js"

export class PluginManager {
  private constructor() {
    this.register(yourPluginPlugin) // Adicionar aqui
    // ... outros plugins
  }
}
```

### 2. Adicionar Metadata

**Arquivo:** `src/plugins/metadata.ts`

```typescript
export const PLUGINS_METADATA = {
  // ... outros plugins
  "your-plugin": {
    name: "your-plugin",
    displayName: "Your Plugin",
    description: "Description of your plugin",
    category: "coding" | "music" | "anime" | "gaming",
    icon: "IconName", // Nome do ícone do Lucide React
    requiredFields: ["username"],
    essentialConfigKeys: ["apiKey"],
    essentialConfigKeysMetadata: [
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "Enter your API key",
        description: "Get your API key from...",
        helpUrl: "https://example.com/api-keys",
      },
    ],
    sections: [
      {
        id: "items",
        name: "Items",
        description: "Display your items",
        configOptions: [
          {
            key: "max_items",
            label: "Max Items",
            type: "number",
            defaultValue: 10,
            min: 1,
            max: 50,
          },
        ],
      },
    ],
    defaultConfig: {
      enabled: false,
      sections: ["items"],
      username: "",
    },
  },
}
```

---

## Testes e Validação

### Testar em Modo Dev

```typescript
// No fetchData.ts
if (dev) {
  return getMockYourPluginData()
}
```

### Validar Tipos

```bash
cd weeb-plugins
pnpm typecheck
```

### Validar Plugin

```bash
pnpm validate-plugins
```

### Testar Renderização

1. Criar SVG no dashboard com plugin habilitado
2. Verificar preview
3. Verificar SVG gerado

---

## Checklist Completo

### Estrutura

- [ ] Criar pasta do plugin
- [ ] Criar arquivos base (index.tsx, types.ts, etc.)
- [ ] Criar pastas (services/, components/)

### Tipos

- [ ] Definir tipos de dados da API
- [ ] Definir configurações não-essenciais
- [ ] Definir configuração completa do plugin
- [ ] Definir dados retornados

### Implementação

- [ ] Implementar fetchData.ts
- [ ] Implementar mock-data.ts
- [ ] Implementar componentes de renderização
- [ ] Implementar seções (default e terminal)

### Registro

- [ ] Registrar no PluginManager
- [ ] Adicionar metadata
- [ ] Adicionar ícone (Lucide React)

### Testes

- [ ] Testar em modo dev (mock data)
- [ ] Testar com dados reais
- [ ] Validar tipos TypeScript
- [ ] Validar plugin (script validate-plugins)
- [ ] Testar renderização no dashboard

### Documentação

- [ ] Criar README.md do plugin
- [ ] Documentar configurações disponíveis
- [ ] Documentar seções disponíveis
- [ ] Adicionar exemplos de uso

---

## Utilitários Compartilhados

### API Utils (`shared/utils/api.ts`)

```typescript
// Buscar JSON de uma API
fetchJson<T>(url: string, options?: RequestInit): Promise<T>

// Validar API key obrigatória
requireApiKey(key: string | undefined, keyName: string): string

// Buscar com retry automático
fetchWithRetry<T>(url: string, options?: RequestInit, maxRetries?: number): Promise<T>
```

### Validation Utils (`shared/utils/validation.ts`)

```typescript
// Validar username
isValidUsername(username: string): boolean

// Validar API key
isValidApiKey(key: string): boolean
```

### Formatting Utils (`shared/utils/formatting.ts`)

```typescript
// Formatar número
formatNumber(num: number): string

// Abreviar número (1K, 1M, etc)
abbreviateNumber(num: number): string

// Formatar tempo relativo
formatRelativeTime(date: string): string
```

### Image Utils (`utils/image-to-base64.ts`)

```typescript
// Converter URL de imagem para base64
urlToBase64(url: string): Promise<string | null>
```

---

## Exemplos de Configurações

### Configuração Simples (sem API key)

```typescript
// Plugin que não precisa de API key
essentialConfigKeys: [] // Vazio

// No fetchData
export async function fetchData(config, dev, essentialConfig) {
  // Não precisa validar API key
  const response = await fetch(`https://api.example.com/user/${config.username}`)
  return response.json()
}
```

### Configuração com Múltiplas API Keys

```typescript
// Plugin que precisa de múltiplas keys
essentialConfigKeys: ["apiKey", "secretKey"]

// No fetchData
const apiKey = requireApiKey(essentialConfig?.apiKey, "apiKey")
const secretKey = requireApiKey(essentialConfig?.secretKey, "secretKey")
```

### Configuração com OAuth Token

```typescript
// Plugin que usa OAuth token
essentialConfigKeys: ["accessToken"]

// No fetchData
const token = requireApiKey(essentialConfig?.accessToken, "accessToken")
const response = await fetch("https://api.example.com/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

---

## Dicas e Boas Práticas

### 1. Sempre Use Tipos

```typescript
// ✅ Bom
export interface YourPluginData {
  items: YourPluginItem[]
}

// ❌ Ruim
export interface YourPluginData {
  items: any[]
}
```

### 2. Trate Erros

```typescript
try {
  const data = await fetchData(config)
  return data
} catch (error) {
  if (error instanceof ApiError) {
    throw new PluginError(`Failed to fetch data: ${error.message}`)
  }
  throw error
}
```

### 3. Valide Entradas

```typescript
if (!config.username) {
  throw new Error("Username is required")
}

if (!isValidUsername(config.username)) {
  throw new Error("Invalid username format")
}
```

### 4. Use Mock Data Realista

```typescript
// ✅ Bom - dados realistas
const mockData = {
  items: [{ id: "1", name: "Real Item Name", description: "Real description" }],
}

// ❌ Ruim - dados genéricos
const mockData = {
  items: [{ id: "1", name: "Item 1", description: "Description" }],
}
```

### 5. Documente Configurações

```typescript
/**
 * Configurações não-essenciais do plugin
 *
 * @property max_items - Número máximo de itens a exibir (padrão: 10)
 * @property hide_title - Ocultar título da seção (padrão: false)
 */
export interface YourPluginNonEssentialConfig {
  max_items?: number
  hide_title?: boolean
}
```

---

**Última atualização:** 2024-12-19
