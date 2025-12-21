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

- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role (para operações admin)
- `DATABASE_URL` - URL de conexão do PostgreSQL (do Supabase)

3. **Configurar banco de dados:**

```bash
# Gerar migrations
pnpm db:generate

# Aplicar migrations (ou usar db:push para desenvolvimento)
pnpm db:push
```

4. **Rodar em desenvolvimento:**

```bash
pnpm dev
```

## 📁 Estrutura

```
weeb-dashboard/
├── app/                    # Next.js App Router
│   ├── auth/              # Rotas de autenticação
│   ├── dashboard/         # Dashboard do usuário
│   ├── api/               # API routes
│   └── test/              # Páginas de teste
├── lib/
│   ├── db/                # Drizzle ORM (schema, queries)
│   └── supabase/          # Clientes Supabase (client, server, admin)
├── components/            # Componentes React
├── hooks/                 # React hooks customizados
├── stores/                # Zustand stores
└── drizzle.config.ts      # Configuração do Drizzle Kit
```

## ✅ O que está configurado

- ✅ Next.js 16 com App Router
- ✅ TypeScript
- ✅ Tailwind CSS 4
- ✅ Supabase Auth (GitHub OAuth)
- ✅ Drizzle ORM
- ✅ Middleware para sessões
- ✅ Páginas de Login e Dashboard básicas

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
