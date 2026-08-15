# WeebProfile - Web Client (Novo)

Projeto Next.js 16 limpo e configurado do zero.

## 🚀 Setup

1. **Instalar dependências:**

```bash
pnpm install
```

2. **Configurar variáveis de ambiente:**

```bash
cp .env.local.example .env.local
```

Preencha as variáveis no `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `VITE_CLERK_PUBLISHABLE_KEY` - mesma chave, prefixos diferentes (Functions e build do Vite)
- `CLERK_SECRET_KEY` - autenticação server-side
- `R2_PUBLIC_URL` - URL pública do bucket de SVGs
- `SVG_GENERATOR_URL` - só para dev local; em produção o acesso é por service binding

> D1 e R2 **não são variáveis de ambiente** — são bindings no `wrangler.toml`.
> Segredos de produção vão por `wrangler pages secret put`, nunca no arquivo.

3. **Banco de dados (Cloudflare D1, SQLite):**

```bash
pnpm db:generate                                      # gera migration Drizzle
npx wrangler d1 migrations apply weebprofile-db --remote
```

> As migrations reais vivem em `drizzle/`. Não existe `db:push` — isso era do
> tempo do Postgres.

4. **Rodar em desenvolvimento:**

```bash
pnpm dev
```

## 📁 Estrutura

```
weeb-dashboard/
├── src/                    # SPA (Vite + TanStack Router)
│   ├── routes/            # Rotas
│   └── router.tsx         # Definição das rotas
├── functions/api/         # Cloudflare Pages Functions (o backend)
│   ├── _shared/           # auth, db, storage, validation, secrets, crypto
│   └── cron/              # regeneração agendada
├── lib/db/                # Drizzle ORM (schema)
├── drizzle/               # Migrations SQLite (as reais)
├── components/            # Componentes React
├── stores/                # Zustand
└── wrangler.toml          # Bindings D1/R2, service binding, vars
```

## Stack

- **Vite + TanStack Router** — SPA, não Next.js (a doc dizia Next até 08/2026)
- **Cloudflare Pages Functions** — backend, em `functions/api/`
- **Clerk** — autenticação
- **Drizzle ORM sobre Cloudflare D1** (SQLite)
- **Cloudflare R2** — armazenamento dos SVGs
- **Tailwind CSS** + shadcn/ui
- **react-i18next** — pt, en, es

## 🔄 Próximos passos

1. Migrar componentes do projeto antigo conforme necessário
2. Adicionar API routes para SVGs
3. Integrar com workspace `source` (plugins)
4. Adicionar geração de SVGs

## 📝 Scripts

- `pnpm dev` - Desenvolvimento com Turbopack
- `pnpm build` - Build de produção
- `pnpm start` - Rodar produção
- `pnpm db:generate` - Gerar migrations
- `pnpm db:push` - Aplicar schema (dev)
- `pnpm db:studio` - Abrir Drizzle Studio
