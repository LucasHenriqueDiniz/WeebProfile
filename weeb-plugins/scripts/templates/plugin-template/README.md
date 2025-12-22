# Template de Plugin

Este é o template/base para criar novos plugins no WeebProfile.

## Estrutura

```
plugin-template/
├── index.tsx              # Definição principal do plugin
├── types.ts               # Tipos específicos do plugin
├── services/
│   ├── fetchData.ts       # Lógica de busca de dados
│   └── mock-data.ts       # Dados mock para desenvolvimento
├── components/
│   └── RenderPLUGIN_NAME.tsx  # Componente de renderização
└── README.md              # Este arquivo
```

## Como Usar

### 1. Usar o script create-plugin (Recomendado)

```bash
pnpm create-plugin meu-plugin
```

Isso criará automaticamente:
- Nova pasta `src/plugins/meu-plugin/`
- Todos os arquivos com placeholders substituídos
- Plugin registrado no PluginManager

### 2. Manualmente

1. Copie a pasta `scripts/templates/plugin-template/` para `src/plugins/{nome-do-plugin}/`
2. Substitua todos os placeholders:
   - `PLUGIN_NAME` → nome do plugin (ex: "spotify")
   - `PluginName` → PascalCase (ex: "Spotify")
   - `PLUGIN_NAME_UPPER` → UPPER_CASE (ex: "SPOTIFY")
3. Implemente a lógica em `services/fetchData.ts`
4. Implemente os componentes em `components/`
5. Registre o plugin em `src/plugins/manager.ts`

## Placeholders

- `PLUGIN_NAME` - Nome do plugin em kebab-case (ex: "spotify")
- `PluginName` - Nome do plugin em PascalCase (ex: "Spotify")
- `PLUGIN_NAME_UPPER` - Nome do plugin em UPPER_CASE (ex: "SPOTIFY")

## Configurações Essenciais vs Não-Essenciais

### Essenciais (EssentialConfig)
- API keys, tokens, credenciais
- Armazenadas em `essentialConfigs` no banco de dados
- Acessadas via parâmetro `essentialConfig` em `fetchData`
- Definidas em `essentialConfigKeys` no plugin

### Não-Essenciais (NonEssentialConfig)
- Preferências do usuário (max_items, titles, etc)
- Armazenadas em `pluginsConfig` no banco de dados
- Acessadas via `config.nonEssential`

## Exemplo de Implementação

### 1. Definir tipos (`types.ts`)

```typescript
export interface SpotifyNonEssentialConfig extends NonEssentialPluginConfig {
  max_tracks?: number
  show_artists?: boolean
}

export interface SpotifyConfig extends BasePluginConfig {
  nonEssential?: SpotifyNonEssentialConfig
}

export interface SpotifyData {
  tracks: Array<{ name: string; artist: string }>
}
```

### 2. Implementar fetch (`services/fetchData.ts`)

```typescript
export async function fetchSpotifyData(
  config: SpotifyConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig
): Promise<SpotifyData> {
  if (dev) {
    return getMockSpotifyData()
  }

  const apiKey = requireApiKey(essentialConfig?.apiKey, 'apiKey')
  
  const response = await fetchJson<SpotifyData>(
    `https://api.spotify.com/v1/me/tracks?api_key=${apiKey}`
  )
  
  return response
}
```

### 3. Implementar renderização (`components/RenderSpotify.tsx`)

```typescript
export function RenderSpotify({ config, data, style, size }: RenderSpotifyProps) {
  return (
    <section id="spotify-plugin">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<DefaultList data={data.tracks} />}
        terminalComponent={<TerminalList data={data.tracks} />}
      />
    </section>
  )
}
```

## Utils Compartilhados

Use os utils em `shared/utils/`:

- `api.ts` - `fetchJson`, `requireApiKey`, `fetchWithRetry`
- `errors.ts` - `PluginError`, `ApiError`, `ConfigError`
- `validation.ts` - `isValidUsername`, `isValidApiKey`
- `formatting.ts` - `formatNumber`, `abbreviateNumber`, `formatRelativeTime`

## Constants Compartilhados

Use as constants em `shared/constants/`:

- `sections.ts` - Seções comuns
- `limits.ts` - Limites padrão
- `intervals.ts` - Intervalos de tempo

## Checklist

- [ ] Substituir todos os placeholders
- [ ] Definir tipos específicos do plugin
- [ ] Implementar `fetchData` com validação de essentialConfig
- [ ] Criar dados mock para desenvolvimento
- [ ] Implementar componentes de renderização
- [ ] Registrar plugin no PluginManager
- [ ] Testar em modo dev (mock)
- [ ] Testar com dados reais
- [ ] Documentar configurações disponíveis

