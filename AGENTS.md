# WeebProfile — Guia para agentes de IA (Claude, GPT/Codex, etc.)

Gerador de SVGs para perfis GitHub. O usuário configura uma GitHub Action (ou o dashboard web) e o sistema gera cards visuais com stats de código, anime e música, salvos como Gists públicos.

Este arquivo é a fonte única de instruções para assistentes de IA neste repositório. `CLAUDE.md` apenas importa este arquivo (`@AGENTS.md`) — não duplique conteúdo nele.

---

## Estrutura do monorepo

```
WeebProfile/
├── weeb-plugins/        # Biblioteca core de plugins (React + TypeScript)
├── svg-generator/        # Cloudflare Worker que renderiza React → SVG (sem browser)
├── weeb-dashboard/       # Frontend (Vite SPA + Cloudflare Pages Functions)
└── weeb-debug-tool/      # Ferramenta de desenvolvimento local para inspecionar plugins
```

Gerenciador de pacotes: **pnpm workspaces**. Nunca usar `npm` ou `yarn`.

---

## Comandos essenciais

```bash
# Desenvolvimento completo (dashboard + svg-generator em paralelo)
pnpm dev

# Pacotes individuais
pnpm dev:dashboard       # Vite dev server (weeb-dashboard)
pnpm dev:generator       # SVG Generator (wrangler dev, Cloudflare Worker)
pnpm dev:debug-tool      # Debug tool (frontend :5000, backend :5001)

# weeb-dashboard — Cloudflare Pages local (Functions + D1 + R2)
cd weeb-dashboard
pnpm dev:pages           # wrangler pages dev dist (NÃO usar --d1, ver "Pontos de atenção")
pnpm db:generate         # gera migration Drizzle (drizzle-kit generate)
pnpm db:migrate          # aplica migration (drizzle-kit migrate)
pnpm db:studio           # Drizzle Studio
pnpm deploy              # wrangler pages deploy dist

# Build
pnpm build               # weeb-dashboard (Vite build → Cloudflare Pages)
pnpm deploy:generator    # deploy manual do gerador (o normal é o Workers Builds, ver "Deploy do gerador")

# Qualidade de código (rodar antes de commitar)
pnpm typecheck
pnpm lint
pnpm format:check
pnpm check               # os três acima juntos

# Geração de assets (rodar após alterar plugins)
pnpm --filter @weeb/weeb-plugins run generate-metadata   # Regera metadata.ts centralizado
pnpm generate-previews                                    # Regera SVGs de preview
```

---

## Segurança — regras obrigatórias

**NUNCA** expor ou logar as seguintes informações:

- `CLERK_SECRET_KEY` (autenticação do dashboard)
- `CRON_SECRET` / `INTERNAL_SECRET` (autenticam endpoints internos)
- `WEEB_GH_TOKEN` / `GH_TOKEN` (token GitHub do usuário)
- API keys de plugins (Steam `apiKey`, LastFM key, etc.)
- Qualquer valor de `essentialConfig` passado aos plugins

**Como os segredos funcionam:** dados sensíveis dos usuários (API keys, tokens) ficam na tabela `plugin_secrets` do **Cloudflare D1** e nunca viajam junto com a configuração pública (`svgs.plugins_config`).

- O `weeb-dashboard` (Pages Functions) acessa o D1 via binding (`env.DB`, ver `functions/api/_shared/db.ts`).
- O `svg-generator` (Cloudflare Worker) também acessa o D1 via binding (`env.DB`, ver `svg-generator/wrangler.toml` + `src/db/essential-configs.ts`) — mesmo banco `weebprofile-db`.
- O `svg-generator` busca esses dados via `userId` em tempo de geração e os passa diretamente para `fetchData`. Nunca serializar ou retornar `essentialConfig`/`plugin_secrets` em respostas HTTP — apenas booleans de "configurado/não configurado" (ver `functions/api/profile/essential-configs.ts` e `functions/api/secrets/presence.ts`).

**Arquivos que NÃO devem ser commitados:**

- `.env` / `.env.local` (qualquer variável de ambiente real)
- Qualquer arquivo com credentials reais

Os `.env.example` (`svg-generator/` e `weeb-dashboard/`) contêm apenas placeholders — é esse o padrão.

---

## Como adicionar um novo plugin

### 1. Criar a estrutura de arquivos

```
weeb-plugins/src/plugins/{nome}/
├── index.tsx              # Implementação da interface Plugin
├── plugin.metadata.ts     # Metadados (seções, campos, opções de config)
├── types.ts               # Tipos TypeScript específicos
├── components/
│   ├── Render{Nome}.tsx   # Componente raiz que recebe { config, data, style, size }
│   └── {Secao}.tsx        # Um componente por seção
├── services/
│   ├── fetchData.ts       # Busca dados reais da API
│   └── mock-data.ts       # Dados fake para modo dev/preview
└── previews/              # SVGs de preview (gerados automaticamente)
```

### 2. Implementar `index.tsx`

```typescript
import type { Plugin } from '../shared/types/plugin'
import type { PluginConfig, PluginData } from '../../types/index'
import type { EssentialPluginConfig } from '../shared/types/base'
import type { MinhaConfig, MeusDados } from './types'
import { RenderMeuPlugin } from './components/RenderMeuPlugin'
import { fetchMeuPlugin } from './services/fetchData'

export const meuPlugin: Plugin<PluginConfig & MinhaConfig, PluginData & MeusDados> = {
  name: 'meuplugin',                         // snake_case, único
  essentialConfigKeys: ['apiKey'],           // chaves armazenadas em plugin_secrets (D1)
  config: { enabled: false, sections: [] } as PluginConfig & MinhaConfig,

  fetchData: async (config, dev = false, essentialConfig?: EssentialPluginConfig, previewMode = false) => {
    return await fetchMeuPlugin(config, dev, essentialConfig?.apiKey, previewMode)
  },

  render: (config, data) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size  = ((config as any).size  || 'half')    as 'half'    | 'full'
    return <RenderMeuPlugin config={config} data={data} style={style} size={size} />
  },
}
```

### 3. Implementar `plugin.metadata.ts`

Ver `steam/plugin.metadata.ts` como referência canônica. Campos obrigatórios:

- `displayName`, `description`, `category` (`"coding" | "music" | "anime" | "gaming"`)
- `icon` (nome de ícone do `lucide-react`)
- `requiredFields` — campos que vão para a config pública (ex: `["username"]`)
- `essentialConfigKeys` — segredos armazenados em `plugin_secrets` (D1) (ex: `["apiKey"]`)
- `essentialConfigKeysMetadata` — descrição de cada segredo para o dashboard
- `sections[]` — cada seção com `id`, `name`, `description`, `configOptions[]`

### 4. Registrar no `PluginManager`

Arquivo: `weeb-plugins/src/plugins/manager.ts`

```typescript
import { meuPlugin } from "./meuplugin/index"

// No construtor:
this.register(meuPlugin)
```

### 5. Implementar `calculateHeight()` (se aplicável)

A altura do SVG é calculada **estaticamente** somando o `calculateHeight()` de cada seção habilitada (sem browser/Playwright). Se o plugin tiver seções com altura variável (listas, grids), garanta que `calculateHeight()` reflita o layout real renderizado.

### 6. Regenerar o metadata centralizado

```bash
pnpm --filter @weeb/weeb-plugins run generate-metadata
```

`metadata.ts` é **auto-gerado** — nunca editar manualmente.

---

## Arquitetura do SVG Generator

**svg-generator** é um **Cloudflare Worker** (`wrangler deploy`), **sem browser/Playwright** — toda a renderização é feita com `renderToString` (react-dom/server) e a altura é calculada estaticamente por plugin.

**Fluxo de geração** (`POST /` — ver `src/worker.ts`):

```
HTTP POST /                                        # só via service binding — sem rota pública
  → getUserEssentialConfigs(env.DB, userId)       # busca segredos no D1 via binding (se userId fornecido)
  → withAppCredentials()                           # injeta credenciais da aplicação (ex: STEAM_API_KEY)
  → validateRequiredConfig()                      # valida secrets/campos obrigatórios
  → renderPlugins()                                # PluginManager → React → fetchData de cada plugin
  → calculateTotalHeight()                         # soma calculateHeight() de cada seção (sem browser)
  → createSvgContainer()                           # embala em SVG com dimensões corretas
  → retorna { success, svg, width, height }
```

**Acesso ao D1:** binding `DB` definido em `svg-generator/wrangler.toml` (mesmo banco `weebprofile-db` do dashboard), sem REST API/credenciais separadas. Se o D1 estiver inacessível, o endpoint responde `503 { code: "D1_UNREACHABLE" }` quando `userId` é informado.

**Imagens:** `weeb-plugins/src/utils/image-to-base64.ts` embute os bytes exatos da imagem como data URI — **sem decode, resize ou recompressão**. Não usa Photon nem Sharp (a doc afirmava o contrário até 08/2026). Valida MIME, magic bytes e `maxBytes` antes de aceitar.

**Autenticação:** o gerador não tem rota pública (`workers_dev = false`). O dashboard chega nele pelo service binding `SVG_GENERATOR`. Cron Triggers e service bindings não dependem de rota.

**Dev local:** `pnpm dev:generator` (= `wrangler dev`).

**Testes:** o bundle do Worker lê `@weeb/weeb-plugins` do `src` (paths do `tsconfig.json`), e o `svg-generator/vitest.config.ts` faz os testes lerem do mesmo lugar. Sem ele, o vitest caía no `dist` pelos `exports` do pacote, e um teste podia passar com o `src` quebrado até o próximo `pnpm build:deps`. Para exercitar o caminho de produção, gere sem `dev` e simule só o `fetch` (ver o bloco "Dev.to sem dev" em `worker.test.ts`).

### Deploy do gerador

Pelo **Workers Builds**, a integração git da Cloudflare para Workers (o dashboard usa a do Pages). A Cloudflare clona o repo e gera o próprio token de deploy na conta: nada de `CLOUDFLARE_API_TOKEN` no GitHub. O job de deploy que existia no CI dependia desse secret, que não estava cadastrado, e falhou nos 19 pushes na main entre 15/08 e 13/11/2026.

Configuração em Workers & Pages → `weeb-svg-generator` → Settings → Builds:

| Campo                       | Valor                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Branch de produção          | `main`                                                                                                                       |
| Diretório raiz              | `svg-generator`                                                                                                              |
| Comando de build            | `pnpm install --frozen-lockfile && pnpm -w build:deps && pnpm --filter @weeb/weeb-plugins --filter @weeb/svg-generator test` |
| Comando de deploy           | `npx wrangler deploy`                                                                                                        |
| Variáveis de build          | `SKIP_DEPENDENCY_INSTALL=1`, `PNPM_VERSION=10.24.0`, `NODE_VERSION=24.19.0`                                                  |
| Build watch paths (incluir) | `svg-generator/*`, `weeb-plugins/*`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`                                 |
| Preview builds              | desligados: o gerador não tem ambiente de preview                                                                            |

- **Testes no comando de build:** o Workers Builds não espera o CI do GitHub. Teste vermelho para o build antes do `wrangler deploy`.
- **Install explícito:** com o diretório raiz em `svg-generator/`, o lockfile e o `packageManager` ficam um nível acima. `SKIP_DEPENDENCY_INSTALL` desliga a detecção automática e o comando instala o workspace inteiro com a versão de pnpm e Node do repo (`package.json` e `.nvmrc`).
- **Secrets do Worker** (`STEAM_API_KEY`, `CRON_SECRET`, `SECRETS_ENCRYPTION_KEY`) não são tocados pelo deploy.
- **Log dos builds:** no painel do Worker e como check run no commit do GitHub.
- **Voltar uma versão:** `pnpm exec wrangler rollback <version-id>` em `svg-generator/` (`wrangler deployments list` mostra as versões).

---

## Temas e estilos

**Dois estilos visuais:** `default` e `terminal`

**Temas built-in** (em `weeb-plugins/src/themes/themes.ts`):

- Default: `default`, `purple`, `pink`, `cyan`, `orange`, `blue`, `green`, `red`
- Terminal: variantes equivalentes

**Variáveis CSS de tema** — prefixo `--default-color-*` ou `--terminal-color-*`. Cada plugin herda essas variáveis; não usar cores hardcoded.

**Custom themes:** usuário pode sobrescrever qualquer variável via `customThemeColors: Record<string, string>` no wizard do dashboard.

**CSS de plugin:** cada plugin pode ter CSS específico em `styles` no objeto do plugin. O `svg-generator` injeta automaticamente via `PluginStyles.tsx`.

---

## Dashboard (weeb-dashboard)

- Framework: **Vite SPA** + **TanStack Router** (não é mais Next.js)
- State: **Zustand** (`stores/wizard-store.ts` — estado do wizard, `stores/svg-store.ts` — SVG gerado)
- UI: **shadcn/ui** + Tailwind CSS
- i18n: **react-i18next** (`i18n/`) — mensagens em `messages/plugins/{plugin}/{lang}.json`
- Auth: **Clerk** (`@clerk/react` no frontend, `@clerk/backend` nas Pages Functions)
- DB: **Drizzle ORM** sobre **Cloudflare D1** (SQLite)
- Storage de SVGs: **Cloudflare R2** (bucket `weebprofile-svgs`, binding `SVGS_BUCKET`)
- API: **Cloudflare Pages Functions** (`functions/api/**`)
- Deploy: **Cloudflare Pages** (`wrangler pages deploy dist`)
- Brand/design system: ver [`weeb-dashboard/BRAND.md`](weeb-dashboard/BRAND.md)

As Pages Functions chamam o `svg-generator` pelo service binding `SVG_GENERATOR` via `functions/api/_shared/svg-generation.ts` (`generateSvgViaService`), que inclui retry com backoff exponencial e traduz os erros do gerador. O código de erro de D1 (`D1_UNREACHABLE`) fica numa constante lá; o teste de `svgs/[id]/generate` cobre o contrato.

**Bindings/config Cloudflare:** definidos em `weeb-dashboard/wrangler.toml` ([[d1_databases]], [[r2_buckets]], [vars]). Secrets (`CLERK_SECRET_KEY`, `CRON_SECRET`, `INTERNAL_SECRET`) são configurados via `wrangler pages secret put <KEY>` — não ficam no `wrangler.toml`.

---

## Variáveis de ambiente

### svg-generator

Não usa `.env` — é um Cloudflare Worker, configurado via `svg-generator/wrangler.toml` ([[d1_databases]] binding `DB`, mesmo banco do dashboard). Ver `.env.example` para detalhes de dev local.

### weeb-dashboard (.env.local)

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...          # lida pela SPA (Vite)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # lida pelas Pages Functions; mesma chave
CLERK_SECRET_KEY=sk_test_...
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
SVG_GENERATOR_URL=http://localhost:3001
CRON_SECRET=...
```

O `NEXT_PUBLIC_` do nome é resto do Next.js, mas a variável está viva: as Functions leem ela, e o valor de produção está no `[vars]` do `wrangler.toml`.

D1 e R2 não são variáveis de ambiente — são bindings configurados em `wrangler.toml`.

Copiar de `.env.example` e preencher. **Nunca commitar valores reais.**

---

## Padrões de código

### Componentes React de plugin

- Recebem sempre `{ config, data, style, size }` como props
- `style: 'default' | 'terminal'` controla o visual
- `size: 'half' | 'full'` controla largura (415px vs 830px)
- Usar variáveis CSS de tema, nunca cores hardcoded
- Cada seção é um componente separado em `components/`

### TypeScript

- Tipagem estrita; sem `any` exceto onde o padrão do plugin exige (ex: `(config as any).style`)
- `EssentialPluginConfig` é `Record<string, string>` — acesso por chave dinâmica é esperado
- Rodar `pnpm typecheck` antes de commitar

### Dados mock

- Todo plugin tem `services/mock-data.ts` com dados estáticos realistas
- `fetchData(config, dev=true)` deve retornar mock sem fazer chamadas externas
- `previewMode=true` sinaliza para não converter imagens em base64 (performance)

### Arquivos auto-gerados

- `weeb-plugins/src/plugins/metadata.ts` — não editar, rodar `generate-metadata`
- `weeb-plugins/src/plugins/generated-types.ts` — não editar
- Previews SVG em `plugins/*/previews/` — gerados por `generate-previews`

---

## Logs de erro

Os dois serviços guardam erro em lugares diferentes, porque a Cloudflare não persiste log de Pages Functions (só existe o tail ao vivo).

| Serviço                                 | Onde fica                                                                             | Retenção                              | Como ler                                                                                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `svg-generator` (Worker, inclui o cron) | Workers Logs (`[observability]` em `svg-generator/wrangler.toml`)                     | 3 dias no Free, 7 no Paid             | Workers Logs do Worker `weeb-svg-generator` no dashboard da Cloudflare. Filtrar por `event` (`plugin.fetch_failed`, `cron.batch_rejected`, `cron.svg_failed`, `generate.failed`) |
| `weeb-dashboard` (Pages Functions)      | Tabela `error_log` no D1, uma linha por resposta 5xx (`functions/api/_middleware.ts`) | 30 dias, podada pelo endpoint de cron | `pnpm --filter weeb-dashboard logs:errors`                                                                                                                                       |

- Todo log do gerador passa por `svg-generator/src/utils/log.ts`, que tira `userId`/`apiKey`/`token` por chave e `?key=`/`Bearer` de dentro do texto. Não usar `console.*` direto lá.
- No dashboard, `return serverError(e)` já basta para o erro ir para o `error_log`; a mensagem é gravada com a cadeia de `cause` e sem os `params` do Drizzle.
- `/api/health` não é gravado: o monitor consulta ele em loop.
- A tabela vem da migration `0003_error_log.sql`. Sem ela aplicada em produção (`wrangler d1 migrations apply weebprofile-db --remote`), o dashboard segue funcionando, só não grava.

## Pontos de atenção

- **Migrations do D1 não rodam no deploy.** Aplicar à mão, de `weeb-dashboard/`: `pnpm exec wrangler d1 migrations apply weebprofile-db --remote`, antes do merge que depende delas. A `0004_generation_starts.sql` é exigida pela regeração manual (`POST /api/svgs/:id/generate`): sem ela essa rota responde 500 (registrado no `error_log`); o resto do dashboard não usa a tabela.
- **Regeração manual tem piso por usuário** (`GENERATION_FLOOR_SECONDS`, 20s, em `functions/api/_shared/generation-rate-limit.ts`) que o `force` não pula; o `force` só pula o cooldown de 20 minutos. Responde 429 `GENERATION_RATE_LIMITED` com `Retry-After`.
- **svg-generator não usa mais Playwright/Chromium** — a altura do SVG é calculada estaticamente somando `calculateHeight()` de cada seção. Qualquer mudança de layout que afete altura precisa atualizar essa função no plugin correspondente.
- **Opções de seção chegam na raiz da config do plugin** (é como o dashboard grava e como o renderer achata `sectionConfigs`), nunca em `nonEssential`. O `PluginManager` copia a raiz para `config.nonEssential` antes de chamar `fetchData`, `render` e `calculateHeight` (`plugins/shared/plugin-options.ts`), então ler de um ou de outro dá o mesmo valor. Chamar um plugin sem passar pelo manager perde isso. Ao testar opções, passe-as na raiz, como produção faz — `plugin-options.test.ts` compara as duas formas.
- **Dev local do dashboard com D1:** usar `pnpm dev:pages` (= `wrangler pages dev dist`, **sem** `--d1`). Passar `--d1 DB=weebprofile-db` cria um banco SQLite local **diferente** do resolvido via `wrangler.toml`, e não terá as migrations aplicadas.
- **Imagens externas nos SVGs:** converter para base64 é necessário para SVGs embutidos em Gists (GitHub não carrega URLs externas em SVGs). O utilitário está em `weeb-plugins/src/utils/image-to-base64.ts`.
- **metadata.ts é singleton:** o `PluginManager.register` recusa plugin sem entrada em `PLUGINS_METADATA`, então esquecer o `generate-metadata` faz o gerador lançar erro na inicialização. O `pnpm validate` (no CI) confere o mesmo nos dois sentidos, e o `pnpm validate-config-options` (no CI, reprova) acusa opção de config que nenhum componente lê.
- **`weeb-dashboard/wrangler.toml` → `SVG_GENERATOR_URL`:** após o primeiro `pnpm deploy:generator`, atualizar para a URL real `https://<nome>.<subdomínio>.workers.dev` do Worker (o subdomínio só é conhecido após o deploy / `wrangler whoami`).

---

## Referência rápida de arquivos importantes

| O que mudar                                | Arquivo                                                  |
| ------------------------------------------ | -------------------------------------------------------- |
| Registrar novo plugin                      | `weeb-plugins/src/plugins/manager.ts`                    |
| Metadados de plugin                        | `weeb-plugins/src/plugins/{name}/plugin.metadata.ts`     |
| Metadata centralizado (auto-gerado)        | `weeb-plugins/src/plugins/metadata.ts`                   |
| Temas visuais                              | `weeb-plugins/src/themes/themes.ts`                      |
| Lógica de geração SVG                      | `svg-generator/src/generator/svg-generator.ts`           |
| Renderização React → SVG                   | `svg-generator/src/renderer/react-renderer.tsx`          |
| Acesso ao D1 (svg-generator)               | `svg-generator/src/db/essential-configs.ts`              |
| Worker entry point do gerador              | `svg-generator/src/worker.ts`                            |
| Config Cloudflare (D1 binding) do gerador  | `svg-generator/wrangler.toml`                            |
| Estado global do wizard                    | `weeb-dashboard/stores/wizard-store.ts`                  |
| Cliente do gerador (service binding)       | `weeb-dashboard/functions/api/_shared/svg-generation.ts` |
| Auth (Clerk) + tipos de binding Cloudflare | `weeb-dashboard/functions/api/_shared/auth.ts`           |
| Acesso ao D1 (Pages Functions)             | `weeb-dashboard/functions/api/_shared/db.ts`             |
| Acesso ao R2 (SVGs)                        | `weeb-dashboard/functions/api/_shared/storage.ts`        |
| Config Cloudflare (D1/R2/vars/secrets)     | `weeb-dashboard/wrangler.toml`                           |
| Redação de segredos em log/debug           | `svg-generator/src/utils/sanitize.ts`                    |
| Validação de body (zod)                    | `weeb-dashboard/functions/api/_shared/validation.ts`     |
| Design system do dashboard                 | `weeb-dashboard/BRAND.md`                                |
