# GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para CI/CD do projeto WeebProfile.

## Workflows Disponíveis

### 1. `ci.yml` - CI Principal (Recomendado)
**Quando executa:** Push/PR para `main` ou `develop`

**O que faz:**
- ✅ Valida plugins (metadata, estrutura)
- ✅ Gera types automaticamente
- ✅ Type check dos plugins
- ✅ Build dos plugins
- ✅ Build do dashboard
- ✅ Lint (se configurado)

**Ordem de execução:**
1. `validate-plugins` → Valida metadata e estrutura
2. `build-plugins` → Build dos plugins (depende de validate-plugins)
3. `build-dashboard` → Build do dashboard (depende de build-plugins)
4. `lint` → Linting (executa em paralelo)

### 2. `validate-plugins.yml` - Validação de Plugins
**Quando executa:** Mudanças em `weeb-plugins/**`

**O que faz:**
- Valida metadata de plugins
- Verifica estrutura e consistência
- Gera types
- Type check

### 3. `build-plugins.yml` - Build de Plugins
**Quando executa:** Mudanças em `weeb-plugins/**`

**O que faz:**
- Valida plugins
- Gera types
- Build completo (`pnpm build`)
- Verifica se build foi bem-sucedido

### 4. `build-dashboard.yml` - Build do Dashboard
**Quando executa:** Mudanças em `weeb-dashboard/**` ou `weeb-plugins/**`

**O que faz:**
- Build das dependências (`build:deps`)
- Build do dashboard Next.js
- Verifica se build foi bem-sucedido

## Variáveis de Ambiente Necessárias

Para o build do dashboard, as seguintes variáveis são necessárias (podem ser definidas como secrets no GitHub):

- `DATABASE_URL` - URL do banco de dados PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL` - URL pública do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase

**Nota:** Os workflows usam valores padrão de teste se os secrets não estiverem configurados, permitindo que o build funcione mesmo sem secrets reais.

## Como Funciona

### Validação de Plugins

O workflow `validate-plugins` executa:
```bash
cd weeb-plugins
pnpm validate      # Valida metadata, estrutura, etc.
pnpm generate-types # Gera types TypeScript
pnpm typecheck     # Verifica tipos
```

### Build de Plugins

O workflow `build-plugins` executa:
```bash
cd weeb-plugins
pnpm build         # Valida + Gera types + Build TypeScript
```

### Build do Dashboard

O workflow `build-dashboard` executa:
```bash
pnpm build:deps    # Build das dependências (weeb-plugins, svg-generator)
cd weeb-dashboard
pnpm build         # Build do Next.js
```

## Badges de Status

Você pode adicionar badges ao README principal:

```markdown
![CI](https://github.com/USERNAME/WeebProfile/workflows/CI/badge.svg)
![Validate Plugins](https://github.com/USERNAME/WeebProfile/workflows/Validate%20Plugins/badge.svg)
![Build Plugins](https://github.com/USERNAME/WeebProfile/workflows/Build%20Plugins/badge.svg)
```

## Troubleshooting

### Build falha com "dist directory not found"
- Verifique se o `tsconfig.json` está configurado corretamente
- Verifique se há erros de TypeScript no build

### Validação falha
- Execute `pnpm validate` localmente para ver erros detalhados
- Verifique se todos os plugins têm metadata completa
- Verifique se `essentialConfigKeys` batem com `essentialConfigKeysMetadata`

### Types não são gerados
- Verifique se `scripts/generate-types.ts` existe
- Execute `pnpm generate-types` localmente para ver erros

