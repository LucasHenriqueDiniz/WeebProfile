# @weeb/svg-generator

Cloudflare Worker que renderiza SVGs a partir dos plugins do `@weeb/weeb-plugins`.

> Este README foi reescrito em 08/2026. A versão anterior descrevia um servidor HTTP
> Node rodando no Railway, com acesso ao D1 por REST API — nada disso é verdade
> desde a migração para Workers, e contradizia o `AGENTS.md`.

## Características

- **Worker, não servidor Node** — `wrangler deploy`, sem processo, sem `PORT`
- **Sem browser** — altura calculada estaticamente por `calculateHeight()` de cada seção; nada de Playwright em runtime
- **React no servidor** — `renderToString` do `react-dom/server`
- **D1 por binding** — `env.DB`, sem REST API nem credenciais separadas
- **Sem rota pública** — `workers_dev = false`; só o service binding do dashboard alcança

## Desenvolvimento

```bash
pnpm dev          # wrangler dev, em http://localhost:3001
pnpm typecheck
pnpm test         # vitest
```

## Deploy

```bash
pnpm deploy       # wrangler deploy
```

## Configuração

Não há `.env`. Bindings e vars ficam no `wrangler.toml`; segredos vão por
`wrangler secret put`.

| Binding / var            | Onde            | Para quê                                                                         |
| ------------------------ | --------------- | -------------------------------------------------------------------------------- |
| `DB`                     | `wrangler.toml` | D1 `weebprofile-db`, o mesmo do dashboard                                        |
| `JIKAN_EDGE`             | `wrangler.toml` | service binding do proxy da API do MyAnimeList                                   |
| `DASHBOARD_URL`          | `wrangler.toml` | destino da chamada de cron                                                       |
| `CRON_SECRET`            | secret          | autentica essa chamada                                                           |
| `SECRETS_ENCRYPTION_KEY` | secret          | **obrigatório** — decifra `plugin_secrets`; sem ele a leitura falha, não degrada |
| `STEAM_API_KEY`          | secret          | credencial da aplicação para a Steam Web API (`src/db/app-credentials.ts`)       |

## API

### `POST /`

Alcançável apenas pelo service binding `SVG_GENERATOR` do dashboard. Recebe
`{ style, size, plugins, pluginsOrder, theme, customCss, userId, ... }` e devolve
`{ success, svg, width, height }`.

`503 { code: "D1_UNREACHABLE" }` quando `userId` é informado e o D1 não responde —
distinguir isso de "segredo ausente" evita reportar falta de credencial que na
verdade não pôde ser verificada.

### `GET /test`

String fixa, para checagem de vida. É o que o `/api/health` do dashboard usa.

## Fluxo de geração

```
POST /  (via service binding)
  → getUserEssentialConfigs(env.DB, userId)   # segredos do usuário, decifrados
  → withAppCredentials()                       # credenciais da aplicação (STEAM_API_KEY)
  → validateRequiredConfig()                   # secrets e campos obrigatórios
  → renderPlugins()                            # fetchData + React de cada plugin
  → calculateTotalHeight()                     # soma calculateHeight(), sem browser
  → createSvgContainer() → renderToString()
```

## Cron

`crons = ["7 3 * * *"]` chama `POST /api/cron/generate-svgs` no dashboard, que é
quem sabe quais SVGs estão devidos e escreve no R2.

⚠️ Um Cron Trigger é morto em **15 min de wall-clock**, e a CPU cai de 15 min para
30s se o intervalo for menor que 1 hora. O loop atual gera em série; ver a coluna
"Cron → Queues" no board antes de aumentar a frequência.

## Auditoria de altura

`pnpm audit:heights` usa `playwright-core` para medir num browser real e comparar
com o que o `calculateHeight()` prevê. É a única coisa aqui que usa Playwright, e é
ferramenta de desenvolvimento — não entra no runtime.

## Segurança

- Segredos vêm do D1 já decifrados e **nunca** voltam numa resposta HTTP
- `utils/sanitize.ts` **não sanitiza input** — ele reda segredos em saída de debug. O nome engana
- Logs são JSON estruturado via `utils/log.ts`, com `userId` redigido
