# @weeb/svg-generator

Servidor HTTP Node.js para geração de SVGs usando React Server Components.

## 🎯 Características

- ✅ **Sem Puppeteer** - Cálculo manual de altura (rápido e leve)
- ✅ **React Server Components** - Renderização server-side com `react-dom/server`
- ✅ **ES Modules** - Imports nativos
- ✅ **Type Safe** - TypeScript rigoroso
- ✅ **Railway Ready** - Configurado para deploy no Railway
- ✅ **Seguro** - Busca essential configs diretamente do Supabase (frontend nunca acessa)

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
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SVG_GENERATOR_PORT=3001
NODE_ENV=development
```

**Variáveis:**

- `DATABASE_URL` - **OBRIGATÓRIO** - Connection string do PostgreSQL/Supabase
  - Obtenha em: Supabase Dashboard > Settings > Database > Connection string > URI
  - Substitua `[YOUR_PASSWORD]` pela senha do seu banco
- `SVG_GENERATOR_PORT` - Porta do servidor (padrão: 3001)
- `PORT` - Porta alternativa (Railway define automaticamente)
- `NODE_ENV` - Ambiente (development/production)

**Desenvolvimento Local:**

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env e adicionar sua DATABASE_URL
```

**Railway (Produção):**

1. Vá em Variables no projeto do Railway
2. Adicione `DATABASE_URL` com a connection string do Supabase
3. Railway define `PORT` automaticamente

**Importante**: Configure `DATABASE_URL` no Railway com a mesma connection string do weeb-dashboard.

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
  "userId": "user-id-here", // Para buscar essential configs do Supabase (produção)
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

O svg-generator busca essential configs (API keys, tokens) diretamente do Supabase quando recebe `userId`:

1. **Produção**: Sempre enviar `userId` → svg-generator busca do Supabase
2. **Testes**: Pode enviar `essentialConfigs` diretamente no JSON (apenas para desenvolvimento)

O frontend **NUNCA** acessa essential configs diretamente. Tudo fica isolado no svg-generator.

## 🏗️ Arquitetura

### Fluxo de Geração

1. **Request** → Recebe config + `userId` (ou `essentialConfigs` para testes)
2. **Buscar Configs** → Se `userId` fornecido, busca essential configs do Supabase
3. **Configuração** → Valida e normaliza config
4. **Cálculo de Dimensões** → Calcula altura estimada (sem Puppeteer)
5. **Carregamento CSS** → Carrega fonts, tailwind, globals
6. **Renderização Plugins** → Renderiza plugins ativos usando React
7. **Criação SVG** → Cria container SVG com foreignObject
8. **Renderização Final** → Converte React para string SVG usando `renderToString`

### Estrutura

```
svg-generator/
├── src/
│   ├── db/
│   │   └── essential-configs.ts  # Busca essential configs do Supabase
│   ├── generator/
│   │   ├── svg-generator.ts      # Gerador principal
│   │   ├── height-calculator.ts # Cálculo manual de altura
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

## 🔌 Conexão com Supabase

O svg-generator usa `DATABASE_URL` para conectar diretamente ao PostgreSQL do Supabase:

```typescript
// src/db/essential-configs.ts
const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.DATABASE_URL.includes("supabase") ? "require" : false,
})
```

**Configuração no Railway:**

1. Adicione a variável `DATABASE_URL` no Railway
2. Use a mesma connection string do weeb-dashboard
3. Formato: `postgresql://postgres:[password]@[host]:5432/postgres`

**Exemplo:**

```
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 🐛 Debug

Para ver informações de debug na resposta, inclua `"debug": true` no request (ou `"mock": true`).

A resposta incluirá:

- Config sanitizada (sem API keys/tokens)
- Dados dos plugins usados
- Erros ocorridos (se houver)
