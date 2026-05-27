# WeebProfile — Guia para Claude

Gerador de SVGs para perfis GitHub. O usuário configura uma GitHub Action (ou o dashboard web) e o sistema gera cards visuais com stats de código, anime e música, salvos como Gists públicos.

---

## Estrutura do monorepo

```
WeebProfile/
├── weeb-plugins/        # Biblioteca core de plugins (React + TypeScript)
├── svg-generator/       # Servidor HTTP que converte React → SVG (Node.js + Playwright)
├── weeb-dashboard/      # Frontend de configuração (Next.js 15, App Router)
└── weeb-debug-tool/     # Ferramenta de desenvolvimento local para inspecionar plugins
```

Gerenciador de pacotes: **pnpm workspaces**. Nunca usar `npm` ou `yarn`.

---

## Comandos essenciais

```bash
# Desenvolvimento completo (dashboard + svg-generator em paralelo)
pnpm dev

# Pacotes individuais
pnpm dev:dashboard       # Next.js na porta padrão
pnpm dev:generator       # SVG Generator na porta 3001
pnpm dev:debug-tool      # Debug tool (frontend :5000, backend :5001)

# Build
pnpm build               # Apenas dashboard (Vercel)
pnpm build:railway       # plugins + svg-generator (Railway)
pnpm build:railway:full  # build:railway + instala Playwright + Chromium

# Qualidade de código (rodar antes de commitar)
pnpm typecheck
pnpm lint
pnpm format:check
pnpm check               # os três acima juntos

# Geração de assets (rodar após alterar plugins)
pnpm --filter @weeb/weeb-plugins run generate:metadata   # Regera metadata.ts centralizado
pnpm generate-previews                                    # Regera SVGs de preview
```

---

## Segurança — regras obrigatórias

**NUNCA** expor ou logar as seguintes informações:

- `DATABASE_URL` ou qualquer connection string com senha
- `CRON_SECRET` (autentica o endpoint de cron)
- `WEEB_GH_TOKEN` / `GH_TOKEN` (token GitHub do usuário)
- API keys de plugins (Steam `apiKey`, LastFM key, etc.)
- Qualquer valor de `essentialConfig` passado aos plugins

**Como os segredos funcionam:** dados sensíveis dos usuários (API keys, tokens) são armazenados no Supabase (`essentialConfigs`) e nunca viajam junto com a configuração pública. O `svg-generator` busca esses dados via `userId` em tempo de geração e os passa diretamente para `fetchData`. Nunca serializar ou retornar `essentialConfig` em respostas HTTP.

**Arquivos que NÃO devem ser commitados:**
- `.env` (qualquer variório de ambiente real)
- Qualquer arquivo com credentials reais

O `.env.example` do `svg-generator` contém apenas placeholders — é esse o padrão.

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
  essentialConfigKeys: ['apiKey'],           // chaves que ficam no Supabase
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
- `essentialConfigKeys` — segredos armazenados no Supabase (ex: `["apiKey"]`)
- `essentialConfigKeysMetadata` — descrição de cada segredo para o dashboard
- `sections[]` — cada seção com `id`, `name`, `description`, `configOptions[]`

### 4. Registrar no `PluginManager`

Arquivo: `weeb-plugins/src/plugins/manager.ts`

```typescript
import { meuPlugin } from './meuplugin/index'

// No construtor:
this.register(meuPlugin)
```

### 5. Regenerar o metadata centralizado

```bash
pnpm --filter @weeb/weeb-plugins run generate:metadata
```

`metadata.ts` é **auto-gerado** — nunca editar manualmente.

---

## Arquitetura do SVG Generator

**Fluxo de geração:**

```
HTTP POST /generate
  → sanitizeConfig()           # Remove campos perigosos do input
  → validateRequiredConfig()   # Valida campos obrigatórios
  → getUserEssentialConfigs()  # Busca segredos do Supabase por userId
  → PluginManager.fetchAllPluginsData()   # Chama API de cada plugin
  → renderPlugins()            # React → string HTML
  → measureHeight()            # Playwright mede altura real
  → createSvgContainer()       # Embala em SVG com dimensões corretas
  → retorna SVG string
```

**Browser (Playwright):** gerenciado como singleton em `svg-generator/src/layout/browser.ts`. Seleciona automaticamente: Railway → `chromium`, Windows → `msedge`, Linux/Mac → `chrome`.

**Portas:** `PORT` (Railway) ou `SVG_GENERATOR_PORT` (dev local, default 3001).

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

- Framework: **Next.js 15** com App Router
- State: **Zustand** (`stores/wizard-store.ts` — estado do wizard, `stores/svg-store.ts` — SVG gerado)
- UI: **shadcn/ui** + Tailwind CSS
- i18n: `next-intl` (`i18n/`)
- DB: **Drizzle ORM** sobre Supabase
- Deploy: **Vercel**

O dashboard envia POST para o `svg-generator` via `lib/svg-generator-client.ts`, que inclui retry com backoff exponencial (para cold starts no Railway).

---

## Variáveis de ambiente

### svg-generator (.env)
```
DATABASE_URL=postgresql://...   # Supabase — obrigatório em produção
SVG_GENERATOR_PORT=3001         # Porta local (Railway usa PORT)
NODE_ENV=development
CRON_SECRET=...                 # Autenticação do endpoint de cron
```

### weeb-dashboard (.env.local)
```
SVG_GENERATOR_URL=http://localhost:3001   # URL do svg-generator
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

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
- `weeb-plugins/src/plugins/metadata.ts` — não editar, rodar `generate:metadata`
- `weeb-plugins/src/plugins/generated-types.ts` — não editar
- Previews SVG em `plugins/*/previews/` — gerados por `generate-previews`

---

## Pontos de atenção

- **Playwright / Chromium** é instalado separadamente (`build:railway:full`). Em dev local pode precisar de instalação manual: `npx playwright install chromium`
- **Cold start no Railway:** o svg-generator demora alguns segundos para acordar após inatividade; o cliente do dashboard já tem retry automático
- **Imagens externas nos SVGs:** converter para base64 é necessário para SVGs embutidos em Gists (GitHub não carrega URLs externas em SVGs). O utilitário está em `weeb-plugins/src/utils/image-to-base64.ts`
- **metadata.ts é singleton:** o `PluginRegistry` valida na inicialização que todo plugin registrado tem entrada em `PLUGINS_METADATA`. Se esquecer de rodar `generate:metadata`, o servidor vai lançar erro na inicialização

---

## Referência rápida de arquivos importantes

| O que mudar | Arquivo |
|---|---|
| Registrar novo plugin | `weeb-plugins/src/plugins/manager.ts` |
| Metadados de plugin | `weeb-plugins/src/plugins/{name}/plugin.metadata.ts` |
| Metadata centralizado (auto-gerado) | `weeb-plugins/src/plugins/metadata.ts` |
| Temas visuais | `weeb-plugins/src/themes/themes.ts` |
| Lógica de geração SVG | `svg-generator/src/generator/svg-generator.ts` |
| Gerenciamento do browser | `svg-generator/src/layout/browser.ts` |
| Endpoint HTTP do gerador | `svg-generator/src/server.ts` |
| Estado global do wizard | `weeb-dashboard/stores/wizard-store.ts` |
| Cliente HTTP para o gerador | `weeb-dashboard/lib/svg-generator-client.ts` |
| Sanitização de input | `svg-generator/src/utils/sanitize.ts` |
