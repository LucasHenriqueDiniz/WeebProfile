# Weeb Debug Tool - Architecture & Stack

## Visão Geral

O **Weeb Debug Tool** é uma ferramenta de desenvolvimento que permite visualizar e inspecionar sections de plugins do WeebProfile em tempo real, sem precisar fazer build completo. É projetado para desenvolvimento rápido e iteração.

## Stack Tecnológico

### Frontend

- **React 18** + **TypeScript** - Interface do usuário
- **Vite** - Build tool e dev server (porta 5000)
- **CSS-in-JS** (inline styles) - Estilização usando o tema GitHub (dark/light)

### Backend

- **Node.js** + **TypeScript**
- **Express.js** - Servidor HTTP (porta 5001)
- **tsx** - Execução de TypeScript diretamente (sem build)
- **nodemon** - Hot reload do servidor
- **chokidar** - File watching para regenerar CSS

### Integração com Workspace

- **pnpm workspaces** - Monorepo
- Importações diretas do `@weeb/weeb-plugins` (workspace package)
- Importações diretas do `@weeb/svg-generator` (source files)

## Como Funciona

### 1. Estrutura do Projeto

```
weeb-debug-tool/
├── src/                    # Frontend React
│   ├── App.tsx            # Componente principal
│   ├── components/        # Componentes React
│   │   ├── ReactPreview.tsx
│   │   ├── SvgPreview.tsx
│   │   ├── ElementInspector.tsx
│   │   └── ...
│   └── lib/
│       └── api.ts         # Cliente API HTTP
│
└── server/                 # Backend Express
    ├── index.ts           # Servidor principal
    ├── routes/            # Rotas API
    │   ├── plugins.ts
    │   ├── generate-react.ts
    │   └── generate-svg.ts
    └── utils/
        └── render-plugins.tsx
```

### 2. Como Lê os Plugins do `weeb-plugins`

#### Backend (Servidor)

**Passo 1: Listar Plugins** (`/api/plugins`)

```typescript
// server/routes/plugins.ts
import { PLUGINS_METADATA } from '@weeb-plugins/plugins/metadata'

// PLUGINS_METADATA é exportado pelo package @weeb/weeb-plugins
// Contém todos os plugins registrados com seus metadados
const plugins = Object.entries(PLUGINS_METADATA).map(([name, metadata]) => ({
  name: metadata.name || name,
  displayName: metadata.displayName || name,
  sections: metadata.sections.map(...)
}))
```

**Passo 2: Renderizar Plugins** (`/api/generate-react`, `/api/generate-svg`)

```typescript
// server/utils/render-plugins.tsx
import { PluginManager } from "@weeb-plugins/plugins/manager"

// PluginManager é um singleton que gerencia todos os plugins
const pluginManager = PluginManager.getInstance()

// Busca o plugin pelo nome
const plugin = pluginManager.get(pluginName)

// Busca dados do plugin (mock ou real, dependendo do modo dev)
const data = await plugin.fetchData(config, dev, undefined)

// Renderiza o componente React do plugin
const element = plugin.render(config, data)

// Converte para HTML string
const html = renderToString(element)
```

#### Frontend

**Passo 1: Buscar Lista de Plugins**

```typescript
// src/lib/api.ts
const response = await fetch("/api/plugins")
const { plugins } = await response.json()
```

**Passo 2: Gerar Preview**

```typescript
// Quando o usuário seleciona plugin/section, faz requisição:
const response = await fetch("/api/generate-react", {
  method: "POST",
  body: JSON.stringify({
    plugin: "myanimelist",
    section: "statistics",
    style: "default",
    size: "half",
  }),
})
const { html, css } = await response.json()
```

### 3. Fluxo de Dados

```
┌─────────────────┐
│  Frontend       │
│  (React + Vite) │
│  Porta 5000     │
└────────┬────────┘
         │ HTTP Requests
         │ /api/plugins
         │ /api/generate-react
         │ /api/generate-svg
         ▼
┌─────────────────┐
│  Backend        │
│  (Express + tsx)│
│  Porta 5001     │
└────────┬────────┘
         │ Importações diretas
         │ (sem build)
         ▼
┌──────────────────────────┐
│  @weeb/weeb-plugins      │
│  (workspace package)     │
│                          │
│  - PluginManager         │
│  - PLUGINS_METADATA      │
│  - Plugin implementations│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Plugins Source          │
│  weeb-plugins/src/       │
│  plugins/{name}/         │
└──────────────────────────┘
```

### 4. Hot Reload

#### Backend (Nodemon)

- `nodemon` monitora arquivos em `server/**/*.ts`
- Quando há mudanças, reinicia o servidor automaticamente
- **Também** monitora `../weeb-plugins/src/**/*` (configurado no nodemon.json)

#### CSS (Chokidar)

- `chokidar` monitora arquivos em `weeb-plugins/src/**/*.{ts,tsx}`
- Quando há mudanças, executa `pnpm generate-tailwind-css`
- Regenera o CSS do Tailwind automaticamente

#### Frontend (Vite)

- Vite HMR (Hot Module Replacement) para React
- Atualiza componentes instantaneamente

### 5. Importações Diretas (Sem Build)

O debug tool importa **diretamente dos arquivos-fonte**, não dos builds:

```typescript
// ✅ Funciona - importa do source
import { PluginManager } from "@weeb-plugins/plugins/manager"
import { PLUGINS_METADATA } from "@weeb-plugins/plugins/metadata"
import { generateSvg } from "../../../svg-generator/src/generator/svg-generator.js"

// ❌ NÃO usa builds
// NÃO importa de @weeb/weeb-plugins/dist
// NÃO importa de @weeb/svg-generator/dist
```

**Por quê?**

- **tsx** pode executar TypeScript diretamente
- Permite hot reload instantâneo
- Não precisa fazer build antes de testar
- Desenvolvimento mais rápido

### 6. Como os Plugins são Registrados

No `@weeb/weeb-plugins`:

1. **PluginManager** é um singleton que mantém registro de todos os plugins
2. Cada plugin se auto-registra quando seu módulo é importado
3. **PLUGINS_METADATA** é exportado e contém metadados de todos os plugins
4. O debug tool usa esses registros para listar e renderizar plugins

```typescript
// Exemplo (conceitual)
// weeb-plugins/src/plugins/myanimelist/index.ts
export const plugin = {
  name: 'myanimelist',
  sections: [...],
  fetchData: async (config, dev) => { ... },
  render: (config, data) => <Component {...data} />
}

// PluginManager.getInstance().register(plugin)
```

### 7. Modos de Operação

#### Modo Dev (mock data)

- `dev: true` nos requests
- Plugins retornam dados mock/example
- Útil para desenvolvimento sem APIs reais

#### Modo Real

- `dev: false`
- Plugins fazem requisições reais às APIs
- Requer configuração (tokens, etc.)

## Vantagens desta Arquitetura

1. **Sem Build**: Desenvolvimento instantâneo
2. **Hot Reload**: Mudanças aparecem automaticamente
3. **Isolamento**: Não afeta outros serviços (dashboard, svg-generator)
4. **Debugging**: Inspeção de elementos em tempo real
5. **Flexibilidade**: Pode testar qualquer plugin/section rapidamente

## Limitações

1. Requer Node.js com suporte a ES modules
2. Depende de `tsx` para executar TypeScript
3. Servidor deve rodar separadamente (porta 5001)
4. Frontend e backend são processos separados
