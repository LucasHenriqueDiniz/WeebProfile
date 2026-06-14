# @weeb/svg-generator

Servidor HTTP Node.js para geração de SVGs usando React Server Components.

## 🎯 Características

- ✅ **Sem browser** - Altura calculada estaticamente por plugin (`calculateHeight`), sem Playwright/Puppeteer
- ✅ **React Server Components** - Renderização server-side com `react-dom/server`
- ✅ **ES Modules** - Imports nativos
- ✅ **Type Safe** - TypeScript rigoroso
- ✅ **Railway Ready** - Configurado para deploy no Railway
- ✅ **Seguro** - Busca essential configs diretamente do Cloudflare D1 (frontend nunca acessa)

## 📦 Instalação

```bash
pnpm install
```

## 🚀 Uso

### Desenvolvimento Local

```bash
# Build do projeto
pnpm build

# Rodar servidor em desenvolvimento (com watch)
pnpm dev:server

# Ou rodar servidor compilado
pnpm start
```

O servidor estará disponível em `http://localhost:3001`

### Produção (Railway)

O Railway detecta automaticamente a configuração e executa:

1. `pnpm install` (instala dependências)
2. `pnpm build` (compila TypeScript)
3. `pnpm start` (inicia servidor)

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do `svg-generator` com:

```env
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token-with-d1-edit
SVG_GENERATOR_PORT=3001
NODE_ENV=development
```

**Variáveis:**

- `CLOUDFLARE_ACCOUNT_ID` - **OBRIGATÓRIO** - ID da conta Cloudflare (`weebprofile-db`)
- `CLOUDFLARE_D1_DATABASE_ID` - **OBRIGATÓRIO** - ID do banco D1 (`weebprofile-db`, mesmo do `wrangler.toml` do dashboard)
- `CLOUDFLARE_API_TOKEN` - **OBRIGATÓRIO** - Token de API Cloudflare com permissão de leitura/escrita em D1
  - Crie em: Cloudflare Dashboard > My Profile > API Tokens > Create Token (template "Edit Cloudflare Workers" ou permissão customizada `D1:Edit`)
  - Usado via D1 REST API, já que este serviço roda fora do Workers/Pages e não tem binding direto ao D1
- `SVG_GENERATOR_PORT` - Porta do servidor (padrão: 3001)
- `PORT` - Porta alternativa (Railway define automaticamente)
- `NODE_ENV` - Ambiente (development/production)

**Desenvolvimento Local:**

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env e adicionar suas credenciais Cloudflare (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN)
```

**Railway (Produção):**

1. Vá em Variables no projeto do Railway
2. Adicione `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID` e `CLOUDFLARE_API_TOKEN`
3. Railway define `PORT` automaticamente

**Importante**:

- `CLOUDFLARE_D1_DATABASE_ID` deve ser o mesmo banco `weebprofile-db` usado pelo `weeb-dashboard` (ver `database_id` em `weeb-dashboard/wrangler.toml`)

## 📏 Cálculo de Altura

O `svg-generator` calcula a altura do SVG somando `calculateHeight()` de cada plugin habilitado (implementado em `weeb-plugins`), sem depender de browser/Playwright. Isso mantém o pacote leve e compatível com deploy como Cloudflare Worker.

Cada plugin retorna um upper-bound seguro em pixels com base em sua config e dados; o `PluginManager.calculateTotalHeight()` soma esses valores e adiciona um buffer de 24px de segurança.

### Teste Local

```bash
# Testar geração completa com dados mock
pnpm test:generator
```

## 📡 API

### POST `/`

Gera um SVG baseado na configuração fornecida.

**Request Body:**

```json
{
  "style": "default" | "terminal",
  "size": "half" | "full",
  "plugins": {
    "github": {
      "enabled": true,
      "username": "octocat",
      "sections": ["profile", "activity"]
    },
    "lastfm": {
      "enabled": true,
      "sections": ["recent_tracks", "top_artists_grid"]
    },
    "myanimelist": {
      "enabled": true,
      "username": "user",
      "sections": ["statistics", "anime_favorites"]
    }
  },
  "pluginsOrder": ["github", "lastfm", "myanimelist"],
  "primaryColor": "#58a6ff",
  "customCss": "...",
  "terminalTheme": "dark",
  "defaultTheme": "light",
  "hideTerminalEmojis": false,
  "hideTerminalHeader": false,
  "userId": "user-id-here", // Para buscar essential configs do Cloudflare D1 (produção)
  "mock": false // true para usar dados mockados
}
```

**Response:**

```json
{
  "success": true,
  "svg": "<svg>...</svg>",
  "width": 415,
  "height": 800
}
```

## 🔐 Segurança

O svg-generator busca essential configs (API keys, tokens) diretamente do Cloudflare D1 quando recebe `userId`:

1. **Produção**: Sempre enviar `userId` → svg-generator busca do D1
2. **Testes**: Pode enviar `essentialConfigs` diretamente no JSON (apenas para desenvolvimento)

O frontend **NUNCA** acessa essential configs diretamente. Tudo fica isolado no svg-generator.

## 🏗️ Arquitetura

### Fluxo de Geração

1. **Request** → Recebe config + `userId` (ou `essentialConfigs` para testes)
2. **Buscar Configs** → Se `userId` fornecido, busca essential configs do Cloudflare D1
3. **Configuração** → Valida e normaliza config
4. **Cálculo de Dimensões** → Soma `calculateHeight()` de cada plugin habilitado (sem browser)
5. **Carregamento CSS** → Carrega fonts, tailwind, globals
6. **Renderização Plugins** → Renderiza plugins ativos usando React
7. **Criação SVG** → Cria container SVG com foreignObject
8. **Renderização Final** → Converte React para string SVG usando `renderToString`

### Estrutura

```
svg-generator/
├── src/
│   ├── db/
│   │   ├── d1-client.ts          # Cliente REST do Cloudflare D1
│   │   └── essential-configs.ts  # Busca essential configs (plugin_secrets) do D1
│   ├── generator/
│   │   ├── svg-generator.ts      # Gerador principal
│   │   └── css-loader.tsx       # Carregamento de CSS
│   ├── renderer/
│   │   ├── react-renderer.tsx   # Renderização de plugins
│   │   └── template-renderer.tsx # Criação do container SVG
│   ├── config/
│   │   └── config-loader.ts     # Validação e normalização
│   ├── server.ts                # Servidor HTTP
│   └── index.ts                 # Exports da biblioteca
├── railway.json                 # Configuração Railway
└── package.json
```

## 🔌 Conexão com Cloudflare D1

O svg-generator roda como serviço Node standalone no Railway, então não tem binding direto ao D1 (isso só existe dentro de Workers/Pages Functions). Por isso ele acessa o D1 via REST API:

```typescript
// src/db/d1-client.ts
fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  }
)
```

`getUserEssentialConfigs()` usa esse cliente para ler a tabela `plugin_secrets` (a mesma usada pelo weeb-dashboard).

**Configuração no Railway:**

1. Adicione `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID` e `CLOUDFLARE_API_TOKEN`
2. `CLOUDFLARE_D1_DATABASE_ID` deve ser o mesmo `database_id` do `weebprofile-db` configurado em `weeb-dashboard/wrangler.toml`
3. `CLOUDFLARE_API_TOKEN` precisa de permissão de leitura/escrita em D1 (Cloudflare Dashboard > My Profile > API Tokens)

## 🐛 Debug

Para ver informações de debug na resposta, inclua `"debug": true` no request (ou `"mock": true`).

A resposta incluirá:

- Config sanitizada (sem API keys/tokens)
- Dados dos plugins usados
- Erros ocorridos (se houver)
