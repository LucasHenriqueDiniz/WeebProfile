# Setup - WeebProfile Dashboard

## 🎯 Arquitetura

O projeto usa um **serviço Node.js separado** (`svg-generator`) para geração de SVG que roda isolado do Next.js.

### Estrutura

```
weeb-dashboard/          # Next.js Dashboard
svg-generator/          # Serviço HTTP para geração de SVGs
weeb-plugins/           # Biblioteca de plugins compartilhada
```

## 🚀 Como Usar

### Desenvolvimento

**Terminal 1**: Dashboard Next.js

```bash
cd weeb-dashboard
pnpm dev
```

**Terminal 2**: Serviço SVG Generator (opcional, se testar geração localmente)

```bash
cd svg-generator
pnpm dev
```

### Build de Dependências

Antes de rodar o dashboard, é necessário buildar as dependências:

```bash
# Build plugins e svg-generator
pnpm build:deps
```

Ou individualmente:

```bash
cd weeb-plugins
pnpm build

cd ../svg-generator
pnpm build
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie/atualize `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_postgresql_url

# SVG Generator (opcional, se rodar localmente)
SVG_GENERATOR_URL=http://localhost:3001

# Cron Secret (para cron jobs)
CRON_SECRET=your_secret_key
```

### Em Produção

- **Dashboard**: Deploy na Vercel (usa Vercel Cron para regeneração automática)
- **SVG Generator**: Deploy separado (Railway, Render, etc.) ou como Vercel Serverless Function

## 🧪 Testar

1. Configure as variáveis de ambiente
2. Execute migrations: `pnpm db:push`
3. Inicie o dashboard: `pnpm dev`
4. Acesse `http://localhost:3000` e faça login
5. Crie uma nova imagem SVG através do wizard

## 📚 Documentação

- Veja `README.md` para mais detalhes
- Veja `svg-generator/README.md` para documentação do serviço de geração

## 🐛 Troubleshooting

### Erro: "SVG Generator service not available"

**Solução**: Certifique-se de que o serviço está rodando ou configure `SVG_GENERATOR_URL` no `.env.local` apontando para o serviço em produção.

### Erro: "Cannot find module"

**Solução**: Build das dependências:

```bash
pnpm build:deps
```

### Porta já em uso

**Solução**: Mude a porta no `.env.local`:

```bash
SVG_GENERATOR_URL=http://localhost:3002
```

E configure a porta no `svg-generator` se rodar localmente.
