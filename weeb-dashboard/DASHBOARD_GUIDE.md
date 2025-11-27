# WeebProfile - Dashboard Guide

Guia completo sobre o funcionamento do Dashboard, estrutura, fluxos e arquitetura.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Dashboard](#arquitetura-do-dashboard)
3. [Wizard de Criação](#wizard-de-criação)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Fluxos Principais](#fluxos-principais)
6. [Componentes Principais](#componentes-principais)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Preview System](#preview-system)

---

## Visão Geral

O **WeebProfile Dashboard** é uma aplicação Next.js que permite aos usuários criar, gerenciar e visualizar SVGs dinâmicos de forma visual, sem necessidade de escrever YAML ou configurar GitHub Actions.

### Funcionalidades Principais

- ✅ **Wizard Visual**: Criação de SVGs através de um wizard em 4 passos
- ✅ **Preview em Tempo Real**: Visualização instantânea das mudanças
- ✅ **Gerenciamento de Plugins**: Ativação/desativação e configuração de plugins
- ✅ **Templates e Temas**: Múltiplos estilos (default, terminal) e temas
- ✅ **Autenticação**: Login via GitHub OAuth (Supabase Auth)
- ✅ **Armazenamento**: Configurações salvas no Supabase

---

## Arquitetura do Dashboard

### Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, Radix UI
- **State**: Zustand (com persistência)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Animações**: Framer Motion
- **Icons**: Lucide React

### Estrutura de Diretórios

```
weeb-dashboard/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── login/               # Página de login
│   └── dashboard/           # Dashboard routes
│       ├── page.tsx         # Lista de SVGs
│       ├── new/            # Wizard de criação
│       └── [id]/           # Visualização/edição
├── components/              # Componentes React
│   ├── wizard/             # Componentes do wizard
│   ├── ui/                 # Componentes UI base (Radix)
│   └── app-sidebar.tsx     # Sidebar principal
├── stores/                 # Zustand stores
│   └── wizard-store.ts    # Estado do wizard
├── hooks/                  # Custom hooks
│   └── useAuth.ts         # Hook de autenticação
├── lib/                    # Utilitários
│   ├── api/               # Clientes de API
│   └── db/                # Schema do banco
└── public/                # Assets estáticos
```

---

## Wizard de Criação

### Visão Geral

O wizard é um fluxo de 4 passos que guia o usuário na criação de um SVG:

1. **Step 1: Básico** - Nome, slug e configurações básicas
2. **Step 2: Estilo** - Tamanho, estilo, tema e cores
3. **Step 3: Plugins** - Seleção e configuração de plugins
4. **Step 4: Preview** - Visualização final e geração

### Step 1: Básico

**Campos:**

- `name`: Nome do SVG (ex: "My GitHub Stats")
- `slug`: URL-friendly identifier (ex: "my-github-stats")
- `useProfileConfig`: Usar configurações do perfil como padrão

**Validação:**

- Nome obrigatório (mínimo 1 caractere)
- Slug obrigatório, válido (a-z, 0-9, -, \_), único no banco

**Componente:** `components/wizard/steps/Step1Basic.tsx`

```typescript
// Exemplo de uso
const { name, slug, setBasicInfo } = useWizardStore()

setBasicInfo("My GitHub Stats", "my-github-stats", false)
```

---

### Step 2: Estilo

**Configurações:**

- **Tamanho:**
  - `half`: 415px de largura (padrão)
  - `full`: 830px de largura

- **Estilo:**
  - `default`: Estilo padrão com cards e seções
  - `terminal`: Estilo terminal/console

- **Tema (se terminal):**
  - `default`, `dracula`, `monokai`, `nord`, etc.

- **Tema (se default):**
  - `default`, `dark`, `light`, etc.

- **Opções Terminal:**
  - `hideTerminalEmojis`: Ocultar emojis
  - `hideTerminalHeader`: Ocultar header

- **Customização:**
  - `primaryColor`: Cor primária (hex, ex: "#ff7a00")
  - `customCss`: CSS customizado (opcional)

**Componente:** `components/wizard/steps/Step2Style.tsx`

```typescript
// Exemplo de uso
const { style, size, primaryColor, setStyle, setSize, setPrimaryColor } = useWizardStore()

setStyle("terminal")
setSize("full")
setPrimaryColor("#8b5cf6")
```

---

### Step 3: Plugins

**Estrutura de Plugin:**

Cada plugin tem:

- `enabled`: Boolean (ativo/inativo)
- `username`: String (username da plataforma)
- `sections`: String[] (seções habilitadas)
- Configurações específicas por seção

**Plugins Disponíveis:**

1. **GitHub**
   - Sections: `profile`, `activity`, `calendar`, `repositories`, `favorite_languages`, `favorite_license`, `code_habits`
   - Essential Config: `pat` (Classic Token)

2. **LastFM**
   - Sections: `recent_tracks`, `top_artists`, `top_albums`, `top_tracks`, `statistics`
   - Essential Config: `apiKey`

3. **MyAnimeList**
   - Sections: `statistics`, `anime_bar`, `manga_bar`, `anime_favorites`, `character_favorites`, etc.
   - Essential Config: `username`, `password` (ou `clientId`, `clientSecret`)

**Validação Step 3:**

- Pelo menos 1 plugin habilitado
- Cada plugin habilitado precisa de:
  - Username válido (não vazio)
  - Pelo menos 1 section selecionada

**Componente:** `components/wizard/steps/Step3Plugins.tsx`

```typescript
// Exemplo de uso
const { plugins, pluginsOrder, togglePlugin, setPluginUsername, setPluginSections } = useWizardStore()

// Habilitar plugin
togglePlugin("github")

// Configurar username
setPluginUsername("github", "octocat")

// Selecionar sections
setPluginSections("github", ["profile", "activity", "calendar"])

// Reordenar plugins
reorderPlugins(["github", "lastfm", "myanimelist"])
```

---

### Step 4: Preview

**Funcionalidades:**

- Preview do SVG em tempo real
- Opções de download
- Compartilhamento (copiar URL)
- Edição rápida (voltar para steps anteriores)

**Geração do SVG:**

Quando o usuário clica em "Finish":

1. Valida todos os steps
2. Salva configuração no Supabase
3. Chama API de geração de SVG
4. Retorna URL permanente do SVG

**Componente:** `components/wizard/steps/Step4Preview.tsx`

```typescript
// Exemplo de geração
const handleFinish = async () => {
  const svgData = {
    name,
    style,
    size,
    pluginsOrder: pluginsOrder.join(","),
    pluginsConfig: {
      // Configurações dos plugins
      PLUGIN_GITHUB: true,
      PLUGIN_GITHUB_USERNAME: "octocat",
      PLUGIN_GITHUB_SECTIONS: "profile,activity,calendar",
      // ...
    },
  }

  const result = await svgApi.create(svgData)
  // SVG gerado e salvo
}
```

---

## Estrutura de Dados

### Wizard State (Zustand)

```typescript
interface WizardState {
  // Step 1
  name: string
  slug: string
  useProfileConfig: boolean

  // Step 2
  style: "default" | "terminal"
  size: "half" | "full"
  terminalTheme: string
  defaultTheme: string
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  customCss: string
  primaryColor: string

  // Step 3
  plugins: Record<string, PluginConfig>
  pluginsOrder: string[]

  // Step 4
  previewUrl: string | null
  currentStep: number

  // Validação
  isValid: {
    step1: boolean
    step2: boolean
    step3: boolean
    step4: boolean
  }
}
```

### Plugin Config

```typescript
interface PluginConfig {
  enabled: boolean
  username: string
  sections: string[]
  [key: string]: any // Configurações específicas por seção
}
```

### SVG Data (Banco de Dados)

```typescript
interface SvgRecord {
  id: string
  user_id: string
  name: string
  slug: string
  style: "default" | "terminal"
  size: "half" | "full"
  terminal_theme?: string
  default_theme?: string
  hide_terminal_emojis: boolean
  hide_terminal_header: boolean
  custom_css?: string
  primary_color: string
  plugins_order: string // "github,lastfm,myanimelist"
  plugins_config: Record<string, any> // Configurações dos plugins
  created_at: string
  updated_at: string
}
```

### Essential Configs (Banco de Dados)

```typescript
interface EssentialConfigRecord {
  id: string
  user_id: string
  plugin_name: string // "github", "lastfm", etc.
  config_key: string // "pat", "apiKey", etc.
  config_value: string // Valor criptografado
  created_at: string
  updated_at: string
}
```

---

## Fluxos Principais

### Fluxo de Criação de SVG

```
1. Usuário acessa /dashboard/new
   ↓
2. Autenticação verificada (redirect se não autenticado)
   ↓
3. Wizard inicializado com estado padrão
   ↓
4. Step 1: Usuário preenche nome e slug
   ↓
5. Step 2: Usuário escolhe estilo e tema
   ↓
6. Step 3: Usuário configura plugins
   ↓
7. Preview atualizado em tempo real (Step 3+)
   ↓
8. Step 4: Usuário visualiza preview final
   ↓
9. Usuário clica "Finish"
   ↓
10. Validação de todos os steps
    ↓
11. POST /api/svgs (cria registro no banco)
    ↓
12. POST /api/svgs/[id]/generate (gera SVG)
    ↓
13. SVG salvo no Supabase Storage
    ↓
14. URL permanente retornada
    ↓
15. Redirect para /dashboard/[id]
```

### Fluxo de Preview

```
1. Usuário altera configuração (Step 2+)
   ↓
2. Wizard store atualizado
   ↓
3. Preview component detecta mudança
   ↓
4. POST /api/preview/generate
   - Payload: configuração atual
   ↓
5. SVG Generator processa
   - Busca dados dos plugins
   - Renderiza componentes React
   - Gera SVG via Puppeteer
   ↓
6. SVG retornado como base64 ou URL temporária
   ↓
7. Preview atualizado na tela
```

### Fluxo de Edição

```
1. Usuário acessa /dashboard/[id]/edit
   ↓
2. GET /api/svgs/[id] (busca configuração)
   ↓
3. Wizard store populado com dados existentes
   ↓
4. Usuário edita configurações
   ↓
5. Preview atualizado em tempo real
   ↓
6. Usuário salva alterações
   ↓
7. PUT /api/svgs/[id] (atualiza registro)
   ↓
8. POST /api/svgs/[id]/generate (regenera SVG)
   ↓
9. Redirect para /dashboard/[id]
```

---

## Componentes Principais

### Wizard Component

**Arquivo:** `components/wizard/Wizard.tsx`

**Responsabilidades:**

- Gerenciar navegação entre steps
- Validação de steps
- Salvar/atualizar SVG
- Integração com API

**Props:**

```typescript
interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}
```

### Step Components

**Step1Basic.tsx**

- Formulário de nome e slug
- Validação em tempo real
- Checkbox "use profile config"

**Step2Style.tsx**

- Seletores de tamanho e estilo
- Color picker para cor primária
- Editor de CSS customizado
- Opções específicas por estilo

**Step3Plugins.tsx**

- Lista de plugins disponíveis
- Toggle para habilitar/desabilitar
- Input de username por plugin
- Seleção de sections (checkboxes)
- Configurações por section (dialogs)
- Drag-and-drop para reordenar

**Step4Preview.tsx**

- Preview do SVG (img ou iframe)
- Botões de ação (download, share, edit)
- Informações do SVG (dimensões, estilo)

### Preview Component

**Arquivo:** `components/wizard/Preview.tsx`

**Funcionalidades:**

- Busca preview via API quando configuração muda
- Loading state durante geração
- Error handling
- Refresh manual

**API Endpoint:** `/api/preview/generate`

---

## State Management

### Wizard Store (Zustand)

**Arquivo:** `stores/wizard-store.ts`

**Características:**

- Persistência local (localStorage)
- Validação de steps
- Aplicação de defaults de plugins
- Reset de estado

**Actions Principais:**

```typescript
// Navegação
setStep(step: number)

// Step 1
setBasicInfo(name: string, slug: string, useProfileConfig?: boolean)

// Step 2
setStyle(style: "default" | "terminal")
setSize(size: "half" | "full")
setPrimaryColor(color: string)
setCustomCss(css: string)

// Step 3
togglePlugin(plugin: string)
setPluginUsername(plugin: string, username: string)
setPluginSections(plugin: string, sections: string[])
setSectionConfig(plugin: string, sectionId: string, config: Record<string, any>)
reorderPlugins(newOrder: string[])

// Validação
validateStep(step: number): boolean

// Reset
reset()
```

**Persistência:**

```typescript
// Salva automaticamente no localStorage
persist(
  (set, get) => ({ ... }),
  {
    name: "wizard-storage",
    partialize: (state) => ({
      // Apenas campos específicos são persistidos
      name: state.name,
      slug: state.slug,
      // ...
    })
  }
)
```

---

## API Integration

### SVG API Client

**Arquivo:** `lib/api/svg-api.ts`

**Métodos:**

```typescript
// Criar novo SVG
create(data: CreateSvgData): Promise<SvgResponse>

// Buscar SVG por ID
getById(id: string): Promise<SvgResponse>

// Listar SVGs do usuário
list(): Promise<SvgListResponse>

// Atualizar SVG
update(id: string, data: UpdateSvgData): Promise<SvgResponse>

// Deletar SVG
delete(id: string): Promise<void>

// Gerar SVG
generate(id: string): Promise<GenerateSvgResponse>
```

### Preview API

**Endpoint:** `POST /api/preview/generate`

**Payload:**

```typescript
{
  style: "default" | "terminal"
  size: "half" | "full"
  pluginsOrder: string[]
  pluginsConfig: Record<string, any>
  primaryColor: string
  // ... outras configurações
}
```

**Response:**

```typescript
{
  previewUrl: string // URL temporária ou base64
  dimensions: {
    width: number
    height: number
  }
}
```

---

## Preview System

### Como Funciona

1. **Configuração Mudou** → Preview component detecta
2. **Debounce** → Aguarda 500ms antes de buscar (evita muitas requisições)
3. **API Call** → POST `/api/preview/generate` com configuração atual
4. **SVG Generator** → Processa e gera SVG
5. **Response** → URL ou base64 do SVG
6. **Render** → Exibe no preview component

### Otimizações

- **Debounce**: Evita requisições excessivas
- **Cache**: Preview pode ser cacheado por alguns segundos
- **Loading States**: Feedback visual durante geração
- **Error Handling**: Mensagens claras em caso de erro

### Exemplo de Implementação

```typescript
const { plugins, style, size } = useWizardStore()
const [previewUrl, setPreviewUrl] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  const timer = setTimeout(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/preview/generate", {
        method: "POST",
        body: JSON.stringify({
          style,
          size,
          pluginsOrder: Object.keys(plugins),
          pluginsConfig: buildPluginsConfig(plugins),
        }),
      })
      const data = await response.json()
      setPreviewUrl(data.previewUrl)
    } catch (error) {
      console.error("Preview generation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, 500) // Debounce 500ms

  return () => clearTimeout(timer)
}, [plugins, style, size])
```

---

## Autenticação

### Fluxo de Login

1. Usuário clica "Login with GitHub"
2. Redirect para `/auth/callback` (Supabase OAuth)
3. Supabase processa OAuth
4. Session criada
5. Redirect para `/dashboard`

### Hook useAuth

**Arquivo:** `hooks/useAuth.ts`

```typescript
const { user, loading, signIn, signOut } = useAuth()

// Verificar autenticação
if (!user) {
  router.push("/login")
}

// Login
await signIn()

// Logout
await signOut()
```

---

## Banco de Dados (Supabase)

### Tabelas Principais

**svgs**

- Armazena configurações de SVGs
- Relacionado com `users` via `user_id`

**essential_configs**

- Armazena credenciais sensíveis (API keys, tokens)
- Criptografado no banco
- Relacionado com `users` e plugins

**users**

- Gerenciado pelo Supabase Auth
- Dados básicos do usuário

### Schema Example

```sql
-- Tabela de SVGs
CREATE TABLE svgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('default', 'terminal')),
  size TEXT NOT NULL CHECK (size IN ('half', 'full')),
  primary_color TEXT DEFAULT '#ff7a00',
  plugins_order TEXT NOT NULL,
  plugins_config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Tabela de Essential Configs
CREATE TABLE essential_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plugin_name TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value TEXT NOT NULL, -- Criptografado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plugin_name, config_key)
);
```

---

## Melhores Práticas

### Validação

- Sempre validar antes de avançar para próximo step
- Feedback visual claro (bordas vermelhas, mensagens)
- Validação em tempo real quando possível

### Performance

- Debounce em preview generation
- Lazy load de componentes pesados
- Cache de previews quando possível

### UX

- Loading states em todas as operações assíncronas
- Mensagens de erro claras e acionáveis
- Confirmação antes de ações destrutivas
- Auto-save de progresso (persistência)

### Segurança

- Essential configs nunca expostos no frontend
- Validação no backend também
- Sanitização de inputs do usuário
- Rate limiting em APIs

---

## Troubleshooting

### Preview não atualiza

- Verificar se debounce está funcionando
- Verificar console para erros de API
- Verificar se configuração está válida

### Plugin não aparece

- Verificar se plugin está registrado no PluginManager
- Verificar se metadata está correta
- Verificar console para erros

### Validação falha

- Verificar regras de validação no wizard-store
- Verificar se campos obrigatórios estão preenchidos
- Verificar formato de dados (slug, etc)

---

**Última atualização:** 2024-12-19
