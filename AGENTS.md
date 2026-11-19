# WeebProfile — Guia para agentes de IA (Claude, GPT/Codex, etc.)

Gerador de SVGs para perfis GitHub. O usuário monta os cards no dashboard web e o sistema gera cards visuais com stats de código, anime e música, hospedados no R2 e regerados pelo cron, prontos para colar no README.

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
- `SECRETS_ENCRYPTION_KEY` (cifra os `plugin_secrets`), `STEAM_API_KEY` e `BATTLENET_CLIENT_ID`/`BATTLENET_CLIENT_SECRET` (credenciais da aplicação no gerador)
- Tokens e API keys de plugins dos usuários (o `pat` do GitHub, a key do LastFM etc.)
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

- `displayName`, `description`, `category` (uma de `PLUGIN_CATEGORIES` em `weeb-plugins/src/plugins/categories.ts`: `coding`, `music`, `anime`, `gaming`, `profile`, `fitness`, `languages`, `repository`; categoria nova precisa de rótulo em `landing.plugins.categories` e `wizard.plugins.categories`, cobrado por `lib/landing/landing-plugins.test.ts`)
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

**O header do terminal (32px, `TERMINAL_HEADER_HEIGHT`) não entra no `calculateHeight()`.** Ele é desenhado uma vez por SVG, acima de todos os plugins, e o `generateSvg` soma os 32px uma vez quando o estilo é terminal e o header está visível. Até 11/2026, 53 seções terminais tinham o header embutido na própria altura (o `audit:heights` media com o header desenhado): um card com três seções do Stack Overflow saía com 96px de terminal vazio com o header desligado, que é o padrão. Outras não contavam, e um card do Dev.to com o header ligado perdia os últimos 8px. O `audit:heights` mede sem o header, então ele compara exatamente o que a seção desenha.

Para medir: `pnpm --filter @weeb/svg-generator audit:heights -- --plugin=<nome> --variants --engine=all`. O `--variants` passa por cada opção que muda a altura (boolean invertido, cada valor de select, número no mínimo e no máximo), o `--engine=all` mede em Chrome, Firefox e WebKit e compara com o mais alto, e `--data-variants=<módulo>` troca o mock (mais itens, sem imagem). O teste da seção copia as linhas do `--json` para um `section-heights.test.ts` que chama `wrongHeights` (`plugins/shared/measured-heights.ts`). Linha de texto em terminal precisa de `line-height` fixo: só com `sm-text` (font-size) o Firefox desenhava 17px onde o Chrome desenha 16. A auditoria de 18/11/2026, seção por seção, antes e depois, está em [`docs/section-heights-audit.md`](docs/section-heights-audit.md).

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
- **Secrets do Worker** (`STEAM_API_KEY`, `BATTLENET_CLIENT_ID`, `BATTLENET_CLIENT_SECRET`, `CRON_SECRET`, `SECRETS_ENCRYPTION_KEY`) não são tocados pelo deploy. Sem o client da Battle.net, o card do WoW Forever falha com "no Battle.net client configured"; o resto do gerador segue.
- **Log dos builds:** no painel do Worker e como check run no commit do GitHub.
- **Voltar uma versão:** `pnpm exec wrangler rollback <version-id>` em `svg-generator/` (`wrangler deployments list` mostra as versões).

### Plano e limites da Cloudflare

A conta está no **Workers Paid**. Os Workers da conta e o projeto Pages (produção e preview) usam o modelo de uso `standard`, sem `limits` customizado (conferido em 15/11/2026). As Pages Functions são cobradas e limitadas como Workers.

| Limite (por invocação)    | Paid (nosso)                      | Free  |
| ------------------------- | --------------------------------- | ----- |
| Subrequests               | 10.000                            | 50    |
| CPU por request HTTP      | 5 min (padrão 30 s)               | 10 ms |
| CPU no cron (`7 3 * * *`) | 15 min (intervalo de 1 h ou mais) | 10 ms |

- **Por que importa:** a seção Code Habits do GitHub sozinha faz uns 115 subrequests para um usuário ativo (events, um `compare` por push, um `getCommit` por commit até 200, uma query GraphQL de linguagens). No Free, ou num Worker que ainda esteja no modelo legado `bundled`, o teto é 50: o fetch para no `Too many subrequests` e o card sai sem estatísticas.
- **Worker novo:** conferir o `usage_model` dele antes de contar com esses limites.

---

## Temas e estilos

**Dois estilos visuais:** `default` e `terminal`

**Temas built-in** (em `weeb-plugins/src/themes/themes.ts`):

- Default: `default`, `purple`, `pink`, `cyan`, `orange`, `blue`, `green`, `red`
- Terminal: `default`, `dracula`, `monokai`

**Variáveis CSS de tema** — prefixo `--default-color-*` ou `--terminal-color-*`. Cada plugin herda essas variáveis; não usar cores hardcoded.

**Custom themes:** usuário pode sobrescrever qualquer variável `--default-color-*` via `customThemeColors: Record<string, string>` no wizard do dashboard. O worker e o preview só aceitam cor simples (`sanitizeCustomThemeColors`). Até 11/2026 o worker descartava o campo e o SVG gerado saía no tema base, embora o preview mostrasse as cores.

**`ui_config` é regravado inteiro ao salvar.** O que o editor não carregar some do D1 no próximo save: o editor de perfil não carregava `customThemeColors`, e o de repositório não carregava nada do `ui_config`. Os dois wizards salvam com `buildStyleUiConfig` e os dois editores carregam com `readStyleUiConfig` (`lib/config/svg-config-helpers.ts`). Campo novo de estilo entra nas duas funções; `svg-config-helpers.test.ts` faz a ida e volta.

### Modo de cor `auto` (claro/escuro)

Um SVG só, claro no GitHub claro e escuro no GitHub escuro. Liga com `ui_config.colorMode = "auto"` (sem coluna nova; o `theme` continua sendo a paleta) e vale para os dois estilos.

- **Como sai no SVG:** o `PluginStyles` não põe as variáveis inline (declaração inline ganha de qualquer regra, media query inclusa). Emite um `<style>` com a paleta clara na regra base e a escura dentro de `@media (prefers-color-scheme: dark)`, escopado por `data-theme-scope` (`buildAutoThemeCss` em `themes/theme-utils.ts`).
- **Paletas:** `defaultDarkThemes` (contraparte escura de cada tema default) e `terminalLightThemes` (contraparte clara de cada terminal), em `themes.ts`. Variável de tema nova precisa existir nas duas; `theme-utils.test.ts` confere. As faixas zebradas do `TerminalGrid` usam `--terminal-color-stripe` (preto a 25% no escuro, 4% no claro); preto a 25% fixo deixava o texto cinza em 1,9:1 na variante clara. O mesmo teste exige 4,5:1 de todo texto do terminal claro, no fundo e na faixa.
- **`customThemeColors` no auto:** valem todas na variante clara. A escura herda só `--default-color-highlight`; superfície e texto vêm da paleta escura, senão uma superfície branca customizada desfaria o modo escuro.
- **Estilo default é transparente:** no auto mudam texto, destaque e superfícies; o fundo é o da página.
- **Preview do dashboard:** mostra as duas variantes empilhadas, cada uma sobre o fundo da página do GitHub (`ColorVariantsPreview`). A variante é forçada por `colorVariant`, sem media query, então não depende do tema de quem está vendo.

**Comportamento medido (15/11/2026, Playwright 1.60 headless, SVG servido como `image/svg+xml` dentro de `<img>`, contexto novo e URL única por combinação):** Chromium e Firefox avaliam `prefers-color-scheme` dentro do SVG pelo `color-scheme` da página que embute. WebKit não: ignora a página. Variante que o terminal auto desenhou:

| SO \ `color-scheme` da página | Chromium 151 / Firefox 150                     | WebKit 26.4                                          |
| ----------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| claro                         | `light` → claro, `dark` → escuro, sem → claro  | claro nas 3 (18/18 em 3 rodadas, terminal e dracula) |
| escuro                        | `light` → claro, `dark` → escuro, sem → escuro | oscila entre rodadas: 8/18 escuro                    |

Chromium e Firefox: 12/12 cada (terminal default e dracula; claro = #f6f8fa / #ffffff, escuro = #161b22 / #0d1117 no default). Terminal sem `auto` (controle): escuro nas 6, nos três browsers.

**No GitHub real** (README de perfil, deslogado, onde o tema do GitHub segue o SO; o GitHub põe `color-scheme: dark` no `<html>` no tema escuro). Corpo do terminal auto:

| Browser      | GitHub claro             | GitHub escuro                                                       |
| ------------ | ------------------------ | ------------------------------------------------------------------- |
| Chromium 151 | claro (repo e camo)      | escuro (repo e camo)                                                |
| Firefox 150  | claro (repo e camo)      | escuro (repo e camo)                                                |
| WebKit 26.4  | claro (9/9 em 3 rodadas) | **claro em 7/9**: escuro só 2/3 pelo arquivo do repo, 0/6 pelo camo |

Conclusão: no Safari um card auto pode sair claro sobre o GitHub escuro. Isso é medido no WebKit do Playwright com tema emulado, não no Safari de verdade. E com o SO claro ele ignora uma página escura (18/18 claro), então quem escolheu no GitHub um tema diferente do SO também vê a variante errada.

**Fallback com duas URLs (medido, mesmo README):** `<picture><source media="(prefers-color-scheme: dark)" srcset="…escuro.svg"><img src="…claro.svg"></picture>`. O sanitizer do GitHub mantém e embrulha em `<themed-picture>`. Acertou nos três browsers, nos dois temas: WebKit escuro 3/3, claro 3/3. O `media` do `<source>` é avaliado no documento do GitHub. Não medido: se ele segue o tema escolhido no GitHub quando difere do SO (só dá para medir logado, mudando o tema da conta). O dashboard ainda não serve as duas variantes fixas de um card auto, e o snippet (`lib/utils/markdown.ts`) não usa `<picture>`.

- **`<themed-picture>` é inline** nos três browsers, então dois cards de 50% lado a lado cabem numa linha, desde que os tags estejam colados. Par clonado no DOM do GitHub, com `<img align="top" width="50%">`: com tags colados, 1 linha em 390/768/1034/1280/1440 px, igual ao par de `<img>` puro. Com quebra de linha ou indentação dentro do `<picture>`: 2 linhas em todas as larguras. Foi clone no DOM, não um README publicado.

**CSS de plugin:** cada plugin pode ter CSS específico em `styles` no objeto do plugin. O `svg-generator` injeta automaticamente via `PluginStyles.tsx`.

---

## Dashboard (weeb-dashboard)

- Framework: **Vite SPA** + **TanStack Router** (não é mais Next.js)
- State: **Zustand** (`stores/wizard-store.ts` — estado do wizard, `stores/svg-store.ts` — SVG gerado)
- UI: **shadcn/ui** + Tailwind CSS
- i18n: **react-i18next** (`i18n/`) — textos da interface em `public/locales/{lang}/translation.json` (a cópia que o site serve; `messages/{lang}.json` era uma segunda cópia que divergiu e foi removida), textos dos plugins em `messages/plugins/{plugin}/{lang}.json` (escritos pelo `generate-metadata`, que põe chave nova em pt e es com o texto em inglês, para traduzir à mão; os campos dos itens de uma lista `object-array` entram em `config.<opção>.items`). `i18n/locales.test.ts` confere que os três idiomas têm as mesmas chaves e os mesmos placeholders
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
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # lida pelas Pages Functions
CLERK_SECRET_KEY=sk_test_...
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
SVG_GENERATOR_URL=http://localhost:3001
CRON_SECRET=...
```

O `NEXT_PUBLIC_` do nome é resto do Next.js, mas a variável está viva: as Functions leem ela, e o valor de produção está no `[vars]` do `wrangler.toml`.

A SPA recebe a mesma chave como `VITE_CLERK_PUBLISHABLE_KEY` no build. O `vite.config.ts` tira ela do `[vars]` do `wrangler.toml` quando a variável não vem do ambiente, então nenhum build precisa dela. Antes ela só existia no ambiente de produção do Pages, e todo deploy de preview saía com o login desligado.

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
| `svg-generator` (Worker, inclui o cron) | Workers Logs (`[observability]` em `svg-generator/wrangler.toml`)                     | 7 dias (3 no Free)                    | Workers Logs do Worker `weeb-svg-generator` no dashboard da Cloudflare. Filtrar por `event` (`plugin.fetch_failed`, `cron.batch_rejected`, `cron.svg_failed`, `generate.failed`) |
| `weeb-dashboard` (Pages Functions)      | Tabela `error_log` no D1, uma linha por resposta 5xx (`functions/api/_middleware.ts`) | 30 dias, podada pelo endpoint de cron | `pnpm --filter weeb-dashboard logs:errors`                                                                                                                                       |

- Todo log do gerador passa por `svg-generator/src/utils/log.ts`, que tira `userId`/`apiKey`/`token` por chave e `?key=`/`Bearer` de dentro do texto. Não usar `console.*` direto lá.
- No dashboard, `return serverError(e)` já basta para o erro ir para o `error_log`; a mensagem é gravada com a cadeia de `cause` e sem os `params` do Drizzle.
- `/api/health` não é gravado: o monitor consulta ele em loop.
- A tabela vem da migration `0003_error_log.sql`. Sem ela aplicada em produção (`wrangler d1 migrations apply weebprofile-db --remote`), o dashboard segue funcionando, só não grava.

## Pontos de atenção

- **Migrations do D1 não rodam no deploy.** Aplicar à mão, de `weeb-dashboard/`: `pnpm exec wrangler d1 migrations apply weebprofile-db --remote`, antes do merge que depende delas. A `0004_generation_starts.sql` é exigida pela regeração manual (`POST /api/svgs/:id/generate`): sem ela essa rota responde 500 (registrado no `error_log`); o resto do dashboard não usa a tabela.
- **Tiles (websites e badges de link do About):** cada geração (manual e cron) pede `tiles: true` ao gerador e grava, ao lado do card, um SVG por item em `svgs/<id>/tiles/<n>.svg` e os links em `svgs/<id>/tiles.json`, com o `layout` de cada um (`grid` para os sites, três por linha; `inline` para os badges, cada um na própria largura). A rota `/svg/<id>/<n>.svg` serve o tile, e um índice sem tile responde um SVG transparente em vez de 404, porque o README continua pedindo: a faixa de 270×1 depois de um site, 1×1 depois de um badge. Até 20 tiles por card (`MAX_TILES`, 12 sites + 8 links). Apagar um card apaga os tiles junto (`deleteSvgFromR2`). Detalhes e medições em [`docs/websites-tiles.md`](docs/websites-tiles.md).
- **Print da página no plugin websites:** cada site escolhe a imagem em `image_source`: `auto` (og:image, depois o ícone), `screenshot` ou `custom` (o `image`). Site sem a opção segue a regra antiga: `image` se houver, preview se não. O print é uma Quick Action do Browser Run (binding `BROWSER` do gerador), 1200×630 em JPEG, com anúncios bloqueados e banner de consentimento escondido por CSS (script injetado é barrado pelo CSP de muitas páginas). Fica no R2 do dashboard em `screenshots/<sha256 da URL>.jpg` (binding `SCREENSHOTS`) e é refeito depois de 7 dias; se falhar, o site usa a cópia antiga ou o preview. Medido em 18/11/2026: 4 a 18 s de browser por página, e as 10 h mensais do Paid cobrem uns 800 sites com print. O `quickAction` exige `compatibility_date` ≥ 2026-03-24 (o gerador está em 2026-06-10, o máximo do workerd do wrangler 4.98). No `wrangler dev` o Browser Run local não tem `quickAction` e o site cai no preview; com `remote = true` em `[browser]` ele usa o Browser Run de verdade da conta.
- **Histórico de estrelas do `github_repo`** vem de `GET /repos/{owner}/{repo}/stargazers/history` (`services/star-history.ts`). Desde 07/2026 a listagem de stargazers (`/stargazers` no REST, `stargazers` no GraphQL) só responde a admins e colaboradores do repo; para os outros, 404 no REST e `totalCount: 0` no GraphQL, com qualquer token. Até 11/2026 o card lia o `starred_at` dessa listagem, e todo repo que a conta do token não administrava saía sem gráfico (o `star_graph` com 0px): 7 de 10 repos testados. O histórico responde a qualquer token: estrelas por dia em semanas de domingo, 30 semanas por página, até 100 páginas. Os dias seguem o fuso do Pacífico, então uma estrela feita antes das 7h ou 8h UTC (conforme o horário de verão) cai no dia anterior (12 de 44 estrelas conferidas contra o `starred_at`; os totais batem).
- **WakaTime lê com o token pessoal de `wakatime.com/oauth`**, não com a API key. Medido em 19/11/2026: a API key (`waka_…`) responde 401 como Bearer e 403 "API Keys are only for plugins" como Basic. O plugin manda o token como `Authorization: Bearer`, nunca na URL. Pela doc da WakaTime, token OAuth de `response_type=code` vale 100 anos e de `response_type=token` vale 12 h (medido: `expires_in=43200`); a página `/oauth` não diz a validade do token pessoal, feita para README stats. O plugin do metrics faz a mesma coisa, uma chamada com o token colado uma vez (`?api_key=`), e com API key hoje recebe 403. Range em recálculo responde 202 com os últimos números: o plugin espera 3 s, tenta uma vez e desenha o que vier (falha se vier vazio, para o card anterior ficar). Sem token, `/users/:user/stats` só responde o range que o usuário deixou público e nunca traz projetos, por isso não há modo sem token.
- **Regeração manual tem piso por usuário** (`GENERATION_FLOOR_SECONDS`, 20s, em `functions/api/_shared/generation-rate-limit.ts`) que o `force` não pula; o `force` só pula o cooldown de 20 minutos. Responde 429 `GENERATION_RATE_LIMITED` com `Retry-After`.
- **svg-generator não usa mais Playwright/Chromium** — a altura do SVG é calculada estaticamente somando `calculateHeight()` de cada seção. Qualquer mudança de layout que afete altura precisa atualizar essa função no plugin correspondente.
- **Opções de seção chegam na raiz da config do plugin** (é como o dashboard grava e como o renderer achata `sectionConfigs`), nunca em `nonEssential`. O `PluginManager` copia a raiz para `config.nonEssential` antes de chamar `fetchData`, `render` e `calculateHeight` (`plugins/shared/plugin-options.ts`), então ler de um ou de outro dá o mesmo valor. Chamar um plugin sem passar pelo manager perde isso. Ao testar opções, passe-as na raiz, como produção faz — `plugin-options.test.ts` compara as duas formas.
- **Deploys de preview usam os dados de produção:** o `[env.preview]` do `wrangler.toml` aponta para o mesmo D1, o mesmo R2 e o mesmo gerador. Com `CLERK_SECRET_KEY` no ambiente de preview (`pnpm --filter weeb-dashboard exec wrangler pages secret put CLERK_SECRET_KEY --env preview`), dá para entrar num preview e testar logado, mas o código do branch lê e grava nos dados reais. Testar lendo; salvar, gerar ou excluir num preview é fazer isso em produção. A `SECRETS_ENCRYPTION_KEY` fica fora do preview: a Cloudflare não devolve o valor de produção, e outra chave gravaria no D1 compartilhado chaves de plugin que produção não decifra. Sem ela, as rotas de chaves de plugin respondem 500 no preview.
- **Dev local do dashboard com D1:** usar `pnpm dev:pages` (= `wrangler pages dev dist`, **sem** `--d1`). Passar `--d1 DB=weebprofile-db` cria um banco SQLite local **diferente** do resolvido via `wrangler.toml`, e não terá as migrations aplicadas.
- **`Cache-Control` da rota `/svg/<id>.svg` é `no-cache, s-maxage=60`** (`SVG_CACHE_CONTROL`). O `no-cache` faz o browser buscar o card de novo a cada view, e só uma cópia nova refaz as animações. O `s-maxage` faz o camo do GitHub guardar o card por um minuto, então a rota recebe o mesmo que recebia com `max-age=60`. Não pôr `max-age`, `ETag` nem `Last-Modified` nessa rota: o WebKit deixa de animar no reload. Medições em `docs/animations.md`, seção "Replay ao recarregar o README".
- **Opção de config tipo `image`** (About, `neofetch_image`): o wizard (`ImageInput`) guarda a imagem enviada **dentro do `plugins_config`**, como data URI PNG/JPEG/WebP de até 150 KB (reduzida para 384px quando passa disso ou de 512px), e o gerador embute como está, sem fetch. Não há upload para R2 nem rota pública de imagens. O plugin só aceita o que `validImageDataUri` aceita (tipo raster e magic bytes batendo; SVG nunca, porque pode carregar script). Também aceita uma URL https, baixada como as outras.
- **Imagens externas nos SVGs:** converter para base64 é necessário porque o SVG entra no README como imagem, e o navegador não carrega URL externa de dentro de um SVG exibido como imagem. O utilitário está em `weeb-plugins/src/utils/image-to-base64.ts`.
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
