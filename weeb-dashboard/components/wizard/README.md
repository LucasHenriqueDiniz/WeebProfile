# Tela de Criação de Imagens SVG - Documentação Técnica Detalhada

## 🎯 Visão Geral e Contexto

A tela `/new` (Wizard) é o componente mais complexo da aplicação WeebProfile, responsável pela criação e configuração de imagens SVG personalizadas através de um sistema de plugins modulares. Esta documentação técnica visa fornecer entendimento profundo da implementação atual para facilitar brainstorming de melhorias.

**Arquitetura Principal:**

- **Framework**: Next.js 14 com App Router + React 19
- **Estado**: Zustand para gerenciamento global
- **Styling**: Tailwind CSS + shadcn/ui components
- **Plugins**: Sistema modular com metadata centralizada
- **Preview**: Renderização dinâmica de componentes React

**Métricas Atuais:**

- **Bundle Size**: ~2MB (estimado, sem code splitting)
- **Componentes**: 8 principais + múltiplos subcomponentes
- **Estado**: ~15 campos no store global
- **Plugins**: 20+ disponíveis dinamicamente

## 🔄 Fluxo Geral de Criação - Análise Detalhada

### 1. Entrada e Inicialização

```typescript
// Wizard.tsx - Linha 30-50
export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"plugins" | "style">("plugins")

  // Estado global do wizard - Zustand store
  const {
    name, slug, plugins, pluginsOrder, style, size,
    theme, hideTerminalEmojis, hideTerminalHeader,
    customCss, customThemeColors,
    setBasicInfo, reset
  } = useWizardStore()
```

**Problema Crítico**: O componente `Wizard` é responsável por:

- Coordenação de 8+ componentes filhos
- Gerenciamento de estado complexo
- Validação e serialização
- Navegação e feedback

### 2. Lógica de Plugins Habilitados

```typescript
// Wizard.tsx - Linha 51-66 - LÓGICA PROBLEMÁTICA
const enabledPlugins = Object.keys(plugins).filter((name) => {
  const plugin = plugins[name]
  const isEnabled = plugin?.enabled && plugin.sections && plugin.sections.length > 0

  console.log(`[Wizard] Plugin ${name}:`, {
    // DEBUG LOGS EM PRODUÇÃO
    exists: !!plugin,
    enabled: plugin?.enabled,
    sections: plugin?.sections,
    sectionsLength: plugin?.sections?.length,
    isEnabled,
  })

  return isEnabled
})
```

**Problemas Identificados:**

1. **Console Logs**: Múltiplos logs de debug em produção
2. **Lógica Confusa**: Verificação duplicada de `enabled` e `sections.length > 0`
3. **Performance**: Filter executado em cada render
4. **Duplicação**: Mesmo cálculo feito no `PluginConfiguration.tsx`

### 3. Processo de Finalização

```typescript
// Wizard.tsx - Linha 81-92
const handleFinish = async () => {
  // Verificar se há configs faltando
  if (hasMissingEssential) {
    toast({
      title: "Configuração incompleta",
      description: "Por favor, preencha todos os campos obrigatórios dos plugins habilitados",
      variant: "destructive",
    })
    return
  }

  setIsSaving(true)
  // ... resto da lógica
}
```

**Problema**: Validação acontece apenas no final, não em tempo real durante configuração.

## Fluxo Geral de Criação

### 1. Entrada na Tela

- **Rota**: `/dashboard/new` (criação) ou `/dashboard/{id}/edit` (edição)
- **Estado Inicial**: Carregamento do wizard store com configurações padrão
- **Layout**: Split-screen com configuração à esquerda e preview à direita

### 2. Configuração de Plugins

- **Seleção de Plugins**: Interface expansível por categoria (Coding, Music, Anime, Gaming)
- **Configurações Essenciais**: Campos obrigatórios (API keys, tokens, usernames)
- **Seções**: Seleção granular de quais partes do plugin incluir
- **Configurações de Seção**: Diálogos modais para opções específicas

### 3. Configuração de Estilo

- **Style**: Escolha entre "default" (moderno) e "terminal" (retro)
- **Theme**: Seleção de cores pré-definidas ou customização
- **Size**: Largura da imagem (415px half, 830px full)
- **Opções do Terminal**: Emoji e header visibility
- **CSS Customizado**: Campo textarea para estilos adicionais

### 4. Preview em Tempo Real

- **Renderização Dinâmica**: Atualização automática conforme mudanças
- **Dados Mock**: Uso de dados simulados para preview
- **Responsive**: Ajuste automático do tamanho do container

### 5. Validação e Finalização

- **Validação de Campos**: Verificação de configurações obrigatórias faltantes
- **Geração Automática**: Criação do nome e slug baseado nos plugins selecionados
- **Envio para API**: Serialização das configurações
- **Redirecionamento**: Para página de visualização com URL da imagem

## Estrutura da Interface

### Layout Principal (Wizard.tsx)

```
┌─────────────────────────────────────────────────┐
│ Header (com stats dinâmicas)                    │
├─────────────────┬───────────────────────────────┤
│                 │                               │
│   Configuração  │        Preview                │
│   (2/3 width)   │     (1/3 width, 450px)        │
│                 │                               │
│  ┌─────────────┐ │  ┌─────────────────────────┐ │
│  │ Plugins Tab │ │  │                         │ │
│  │             │ │  │    Live Preview          │ │
│  │ Style Tab   │ │  │                         │ │
│  └─────────────┘ │  └─────────────────────────┘ │ │
│                 │                               │ │
│                 │  ┌─────────────────────────┐  │ │
│                 │  │     Finalize Button      │ │ │
│                 │  │  (sticky bottom)         │ │ │
└─────────────────┴───────────────────────────────┘
```

#### Características do Layout:

- **Split Layout**: Divisão fixa com configuração à esquerda (flexível) e preview à direita (450px fixo)
- **Tabs**: Navegação entre configuração de plugins e estilos
- **Background Animado**: Elementos decorativos com movimento sutil
- **Responsive**: Adapta para diferentes tamanhos de tela
- **Overflow Management**: Scroll independente para cada seção

## Componentes Principais

### 1. Wizard (Orquestrador Principal)

**Arquivo**: `Wizard.tsx`
**Responsabilidades**:

- Coordenação do fluxo completo de criação
- Gerenciamento de estado global via Zustand store
- Validação de configurações antes do envio
- Serialização de dados para API
- Navegação e feedback de usuário

**Estado Gerenciado**:

```typescript
{
  ;(name,
    slug,
    plugins,
    pluginsOrder,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    customCss,
    customThemeColors)
}
```

**Problemas Identificados**:

- **Complexidade Excessiva**: Componente principal muito grande (506 linhas)
- **Lógica Espalhada**: Validação, serialização e UI misturadas
- **Console Logs**: Múltiplos logs de debug em produção
- **Re-renders**: Possível otimização com memoização

### 2. PluginConfiguration

**Arquivo**: `PluginConfiguration.tsx`
**Funcionalidades**:

- Lista expansível de plugins por categoria
- Filtros: busca, categoria, "apenas habilitados"
- Configurações essenciais (API keys, tokens)
- Seleção de seções por plugin
- Status visual de configuração (badges)

**Estados Locais**:

- `expandedPlugins`: Controle de expansão dos cards
- `unlockedConfigs`: Permite edição de campos já salvos
- `savingConfigs`: Estados de loading para salvamento

**Problemas**:

- **Performance**: Re-render desnecessário na busca
- **UX**: Interface de filtros poderia ser mais intuitiva
- **Estado**: unlockedConfigs não persiste entre sessões

### 3. SectionConfigDialog

**Arquivo**: `SectionConfigDialog.tsx`
**Propósito**: Configuração granular de seções específicas dos plugins

**Tipos de Configuração Suportados**:

- **number**: Input numérico com stepper
- **boolean**: Switch toggle
- **string**: Input de texto simples
- **select**: Dropdown com opções
- **array**: Lista editável de itens

**Características**:

- **Persistência**: Estado local durante edição
- **Validação**: Tipagem forte dos valores
- **Documentação**: Tooltips e links de ajuda
- **Preview**: Imagens de preview das seções

### 4. ProfileConfigModal

**Arquivo**: `ProfileConfigModal.tsx`
**Propósito**: Gerenciamento centralizado de credenciais sensíveis

**Funcionalidades**:

- **Username**: Campo global para identificação
- **Essential Configs**: API keys, tokens OAuth por plugin
- **OAuth Integration**: Conexão direta com Spotify
- **Validação**: Verificação de campos obrigatórios
- **Persistência**: Salvamento via API separada

**Problemas**:

- **Duplicação**: Lógica similar ao PluginConfiguration
- **OAuth Flow**: Tratamento limitado de erros
- **UX**: Modal muito grande, difícil navegação

### 5. StyleConfiguration

**Arquivo**: `StyleConfiguration.tsx`
**Funcionalidades**:

- **Style Selector**: Default vs Terminal
- **Theme Picker**: 9+ temas pré-definidos + custom
- **Size Options**: Half (415px) vs Full (830px)
- **Terminal Options**: Hide emojis/header
- **Custom Colors**: Paleta completa para tema custom
- **Custom CSS**: Textarea para estilos avançados

**Problemas**:

- **Organização**: Opções espalhadas sem hierarquia clara
- **Custom Theme**: Interface de cores básica, sem presets
- **CSS**: Sem syntax highlighting ou validação

### 6. LivePreview

**Arquivo**: `LivePreview.tsx`
**Responsabilidades**:

- Container responsivo para preview
- Cálculo automático de dimensões
- Integração com PreviewRenderer

**Características**:

- **Tamanho Dinâmico**: Ajuste baseado em `size` prop
- **Fallback**: Mensagem quando nenhum plugin habilitado
- **Styling**: Custom scrollbar para container

### 7. PreviewRenderer

**Arquivo**: `PreviewRenderer.tsx`
**Propósito**: Renderização dinâmica dos plugins usando componentes React

**Processo**:

1. **Flattening**: Converte sectionConfigs para formato plano
2. **Plugin Loading**: Carrega componentes dinamicamente
3. **Data Mock**: Usa dados simulados para preview
4. **Render**: Monta componentes React em ordem

**Problemas**:

- **Performance**: Carregamento síncrono de múltiplos plugins
- **Bundle Size**: Todos os plugins carregados mesmo se não usados
- **Error Handling**: Tratamento limitado de erros de renderização

## Funcionalidades Avançadas

### Sistema de Plugins

- **Modular**: Plugins independentes com metadata centralizada
- **Configuração Hierárquica**: Plugin → Seções → Opções específicas
- **Tipagem Forte**: TypeScript para todas as configurações
- **Extensibilidade**: Fácil adição de novos plugins

### Gerenciamento de Estado

- **Zustand Store**: Estado global centralizado
- **Persistência**: Configurações salvas automaticamente
- **Validação**: Verificação em tempo real de campos obrigatórios
- **Optimistic Updates**: UI responde imediatamente às mudanças

### Preview em Tempo Real

- **Debounced Updates**: Evita re-renders excessivos
- **Mock Data**: Dados simulados para desenvolvimento
- **Dynamic Sizing**: Ajuste automático das dimensões
- **Error Boundaries**: Isolamento de erros por plugin

### Sistema de Temas

- **CSS Variables**: Temas baseados em variáveis CSS
- **Custom Colors**: 20+ variáveis customizáveis
- **Terminal Style**: Tema retro com estética de terminal
- **Responsive**: Adaptação automática aos temas

## Problemas Identificados

### UX/UI Problems

1. **Complexidade Cognitiva**
   - **Problema**: Muitos conceitos abstratos (plugins, seções, configurações essenciais)
   - **Impacto**: Usuários novatos ficam perdidos
   - **Solução**: Onboarding progressivo, tooltips explicativos

2. **Hierarquia Visual Pobre**
   - **Problema**: Elementos importantes não se destacam
   - **Impacto**: Usuários não sabem por onde começar
   - **Solução**: Visual hierarchy mais clara, CTAs prominentes

3. **Feedback Insuficiente**
   - **Problema**: Estados de loading/success/error inconsistentes
   - **Impacto**: Usuários não sabem se ações funcionaram
   - **Solução**: Estados visuais consistentes, micro-interações

4. **Navegação Não Linear**
   - **Problema**: Fluxo assume conhecimento prévio
   - **Impacto**: Usuários pulam etapas importantes
   - **Solução**: Wizard com steps obrigatórios

### Technical Problems

1. **Bundle Size**
   - **Problema**: Todos os plugins carregados no bundle inicial
   - **Impacto**: Tempo de carregamento alto
   - **Solução**: Code splitting, lazy loading

2. **Re-renders Excessivos**
   - **Problema**: Componentes não memoizados adequadamente
   - **Impacto**: Performance degradada em dispositivos móveis
   - **Solução**: React.memo, useMemo estratégicos

3. **Estado Complexo**
   - **Problema**: Lógica de estado espalhada por múltiplos componentes
   - **Impacto**: Bugs difíceis de debuggar
   - **Solução**: Centralização maior no store

4. **API Calls Ineficientes**
   - **Problema**: Múltiplas chamadas desnecessárias
   - **Impacto**: Performance e uso de quota
   - **Solução**: Caching, debouncing

## Aspectos de Performance

### Current Issues

1. **Initial Load**
   - Bundle size: ~2MB+ (estimado)
   - Plugin loading: Síncrono para todos os plugins
   - Mock data fetching: Blocking

2. **Runtime Performance**
   - Re-renders: Múltiplos componentes não memoizados
   - Debouncing: Apenas para cores custom, não para outros campos
   - Memory leaks: Possível vazamento em timers

3. **Network**
   - API calls: Sem caching inteligente
   - Images: Sem lazy loading ou optimization
   - Bundle: Sem code splitting granular

### Optimization Opportunities

1. **Code Splitting**

   ```typescript
   // Lazy load plugin components
   const PluginComponent = lazy(() => import(`@/plugins/${pluginName}`))
   ```

2. **Memoization Strategy**

   ```typescript
   const memoizedPlugins = useMemo(() => filterPlugins(plugins), [plugins, filters])
   ```

3. **Virtual Scrolling**
   - Para listas grandes de plugins
   - Reduz DOM nodes e melhora performance

## Sugestões de Melhoria

### UX/UI Improvements

1. **Progressive Disclosure**
   - Começar simples, revelar complexidade gradualmente
   - Tooltips contextuais
   - Help system integrado

2. **Visual Hierarchy**
   - CTAs mais prominentes
   - Grouping lógico de funcionalidades
   - Status indicators mais claros

3. **Mobile Optimization**
   - Layout adaptativo para mobile
   - Touch-friendly controls
   - Swipe gestures para navegação

4. **Accessibility**
   - ARIA labels completos
   - Keyboard navigation
   - Screen reader support

### Technical Improvements

1. **State Management**

   ```typescript
   // Slice-based architecture
   const useWizardSlice = () => useWizardStore((state) => state.plugins)
   ```

2. **Component Architecture**

   ```typescript
   // Compound components pattern
   <PluginCard>
     <PluginCard.Header />
     <PluginCard.Config />
     <PluginCard.Sections />
   </PluginCard>
   ```

3. **Performance Optimizations**
   - React 18 concurrent features
   - Bundle analyzer integration
   - Service worker para caching

4. **Testing Strategy**
   - Unit tests para lógica complexa
   - Integration tests para fluxos completos
   - E2E tests para user journeys

### New Features

1. **Templates**
   - Configurações pré-definidas por categoria
   - Import/export de configurações
   - Community templates

2. **Real-time Collaboration**
   - Multi-user editing
   - Live cursors
   - Comments system

3. **Advanced Customization**
   - Drag & drop plugin ordering
   - Conditional configurations
   - Plugin marketplace

## Considerações Técnicas

### Architecture Decisions

1. **Zustand vs Redux**
   - **Prós**: Simples, TypeScript-friendly, pequeno bundle
   - **Contras**: Menos tooling, debugging mais difícil
   - **Recomendação**: Manter por simplicidade

2. **Plugin System**
   - **Prós**: Modular, extensível, isolamento claro
   - **Contras**: Complexidade de setup, bundle size
   - **Recomendação**: Otimizar lazy loading

3. **Preview System**
   - **Prós**: Tempo real, dados mock isolados
   - **Contras**: Performance, complexidade de sync
   - **Recomendação**: Implementar web workers

### Future Considerations

1. **Micro-frontends**
   - Plugins como aplicações independentes
   - Melhor isolamento e performance

2. **Server Components**
   - Next.js 13+ App Router
   - Melhor SEO e performance inicial

3. **Edge Computing**
   - Preview generation na edge
   - Melhor latência global

---

## 🔍 Análise Técnica Detalhada - Exemplos de Código

### Problema 1: Lógica Duplicada de Plugins Habilitados

**Localização**: `Wizard.tsx` (linha 51-66) vs `PluginConfiguration.tsx` (linha 62)

```typescript
// Wizard.tsx - LÓGICA DUPLICADA E PROBLEMÁTICA
const enabledPlugins = Object.keys(plugins).filter((name) => {
  const plugin = plugins[name]
  const isEnabled = plugin?.enabled && plugin.sections && plugin.sections.length > 0

  console.log(`[Wizard] Plugin ${name}:`, {
    // ❌ DEBUG LOGS EM PRODUÇÃO
    exists: !!plugin,
    enabled: plugin?.enabled,
    sections: plugin?.sections,
    sectionsLength: plugin?.sections?.length,
    isEnabled,
  })

  return isEnabled
})
```

```typescript
// PluginConfiguration.tsx - MESMA LÓGICA REPETIDA
const enabledPlugins = pluginsOrder.filter((name) => plugins[name]?.enabled)
```

**Problemas Identificados:**

1. **Duplicação**: Mesmo cálculo feito em 2 componentes diferentes
2. **Inconsistência**: `Wizard.tsx` verifica `sections.length > 0`, mas `PluginConfiguration.tsx` não
3. **Performance**: Executado em cada render sem memoização
4. **Debug**: Console logs poluem produção

**Solução Sugerida:**

```typescript
// No Zustand store - selector memoizado
const useEnabledPlugins = () => {
  return useWizardStore((state) => {
    return Object.keys(state.plugins).filter((name) => {
      const plugin = state.plugins[name]
      return plugin?.enabled && plugin.sections?.length > 0
    })
  })
}
```

### Problema 2: Sistema de Tabs Ineficiente

**Localização**: `Wizard.tsx` (linha 364-393)

```typescript
// ❌ PROBLEMA: activeTab força re-render completo
const [activeTab, setActiveTab] = useState<"plugins" | "style">("plugins")

<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plugins" | "style")}>
  <TabsContent value="plugins" className="p-4 m-0">
    <PluginConfiguration /> {/* Re-render completo aqui */}
  </TabsContent>
  <TabsContent value="style" className="p-4 m-0">
    <StyleConfiguration /> {/* Re-render completo aqui */}
  </TabsContent>
</Tabs>
```

**Problema**: Cada mudança de tab força re-render completo dos componentes filhos, mesmo que não tenham mudado.

**Solução Sugerida:**

```typescript
// ✅ Lazy mounting dos componentes
const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set(["plugins"]))

const handleTabChange = (tab: string) => {
  setActiveTab(tab)
  setMountedTabs(prev => new Set(prev).add(tab))
}

<TabsContent value="plugins">
  {mountedTabs.has("plugins") && <PluginConfiguration />}
</TabsContent>
<TabsContent value="style">
  {mountedTabs.has("style") && <StyleConfiguration />}
</TabsContent>
```

### Problema 3: Validação Apenas no Final

**Localização**: `Wizard.tsx` (linha 81-92)

```typescript
// ❌ VALIDAÇÃO APENAS NO FINAL
const handleFinish = async () => {
  if (hasMissingEssential) {
    // Calculado apenas aqui
    toast({
      title: "Configuração incompleta",
      description: "Por favor, preencha todos os campos obrigatórios",
      variant: "destructive",
    })
    return
  }
  // ... resto
}
```

**Problema**: Usuário só descobre campos faltantes no final, após configurar tudo.

**Solução Sugerida:**

```typescript
// ✅ Validação em tempo real com feedback visual
const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

// Hook para validar em tempo real
useEffect(() => {
  const errors = validatePluginConfigs(enabledPlugins, plugins)
  setValidationErrors(errors)
}, [enabledPlugins, plugins])

// Mostrar erros inline nos componentes
{validationErrors.github?.includes('username') && (
  <div className="text-red-500 text-sm">Username é obrigatório</div>
)}
```

### Problema 4: Preview Renderer - Carregamento Síncrono

**Localização**: `PreviewRenderer.tsx` (linha 107-116)

```typescript
// ❌ CARREGAMENTO SÍNCRONO DE TODOS OS PLUGINS
useEffect(() => {
  async function loadPlugins() {
    // Carrega TODOS os plugins de uma vez
    const activePlugins = await getActivePlugins(preparedPluginsConfig)
    const map = new Map(activePlugins)
    setActivePluginsMap(map)
  }

  loadPlugins()
}, [preparedPluginsConfig])
```

**Problema**: Todos os plugins são carregados simultaneamente, causando:

- Bundle inicial grande
- Carregamento lento
- Memória desnecessária

**Solução Sugerida:**

```typescript
// ✅ Lazy loading por demanda
const [loadedPlugins, setLoadedPlugins] = useState<Map<string, any>>(new Map())

const loadPlugin = useCallback(async (pluginName: string) => {
  if (loadedPlugins.has(pluginName)) return

  try {
    const pluginModule = await import(`@/plugins/${pluginName}`)
    setLoadedPlugins((prev) => new Map(prev).set(pluginName, pluginModule))
  } catch (error) {
    console.error(`Failed to load plugin ${pluginName}:`, error)
  }
}, [])

// Carregar apenas plugins visíveis
useEffect(() => {
  enabledPlugins.slice(0, 3).forEach(loadPlugin) // Top 3 apenas
}, [enabledPlugins, loadPlugin])
```

### Problema 5: Gerenciamento de Estado Fragmentado

**Localização**: Múltiplos componentes gerenciando estado relacionado

```typescript
// ❌ ESTADO ESPALHADO
// PluginConfiguration.tsx
const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set())

// ProfileConfigModal.tsx
const [profile, setProfile] = useState<{ username?: string; essentialConfigs?: any }>({})

// SectionConfigDialog.tsx
const [localConfig, setLocalConfig] = useState(() => getInitialConfig())
```

**Problema**: Estado relacionado espalhado por múltiplos componentes, dificultando sincronização e debugging.

**Solução Sugerida:**

```typescript
// ✅ Estado centralizado no store
interface WizardState {
  // UI State
  ui: {
    expandedPlugins: Set<string>
    activeTab: "plugins" | "style"
    profileModalOpen: boolean
    sectionDialogs: Record<string, boolean>
  }

  // Form State
  profile: {
    username?: string
    essentialConfigs: EssentialConfigs
  }

  // Temp State
  tempConfigs: Record<string, any>
}

// Actions centralizadas
const actions = {
  togglePluginExpansion: (pluginName: string) => {
    /* */
  },
  updateProfileConfig: (updates: Partial<Profile>) => {
    /* */
  },
  setTempSectionConfig: (plugin: string, section: string, config: any) => {
    /* */
  },
}
```

### Problema 6: Componente Wizard Muito Grande

**Localização**: `Wizard.tsx` (506 linhas)

```typescript
// ❌ COMPONENTE MUITO GRANDE - 506 LINHAS
export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  // 15+ hooks de estado
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"plugins" | "style">("plugins")

  // Lógica complexa inline (81-262)
  const handleFinish = async () => {
    // 50+ linhas de lógica
  }

  // JSX complexo (311-503)
  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* 150+ linhas de JSX */}
    </div>
  )
}
```

**Problema**: Componente faz tudo - estado, lógica, UI, validação.

**Solução Sugerida:**

```typescript
// ✅ Separação de responsabilidades
function useWizardLogic() {
  // Toda lógica aqui
  return { actions, state }
}

function WizardLayout({ children, stats }: WizardLayoutProps) {
  // Apenas layout e animações
}

function Wizard() {
  const logic = useWizardLogic()

  return (
    <WizardLayout stats={logic.state.stats}>
      <WizardContent {...logic.state} {...logic.actions} />
    </WizardLayout>
  )
}
```

## 🎯 Pontos Críticos para Brainstorm

### 1. **Arquitetura de Estado**

- Migrar para Zustand slices ou Redux Toolkit?
- Implementar optimistic updates?
- Centralizar toda lógica de validação?

### 2. **Performance Crítica**

- Code splitting por plugin?
- Virtualização da lista de plugins?
- Service worker para caching?

### 3. **UX Fundamental**

- Progressive disclosure obrigatório?
- Validação em tempo real vs final?
- Onboarding para novatos?

### 4. **Component Architecture**

- Compound components pattern?
- Render props vs hooks?
- Error boundaries por seção?

### 5. **Mobile Experience**

- Bottom sheet para preview?
- Swipe gestures?
- Touch-optimized controls?

### 6. **Developer Experience**

- Storybook para componentes?
- Cypress para E2E?
- Performance monitoring?

---

## 📋 Conclusão e Recomendações

A tela de criação é um sistema complexo com **problemas estruturais** que impactam diretamente UX e performance. Os exemplos de código acima mostram pontos específicos onde melhorias podem ter **impacto máximo**.

**Brainstorm Prioritário:**

1. **Refatorar estado** - Centralizar lógica fragmentada
2. **Implementar lazy loading** - Plugins sob demanda
3. **Adicionar validação real-time** - Feedback imediato
4. **Quebrar componente Wizard** - Separação de responsabilidades
5. **Otimizar re-renders** - Memoização estratégica

**Métricas de Sucesso:**

- Bundle size: -60% com code splitting
- Time to Interactive: -40% com lazy loading
- User completion rate: +25% com melhor UX
- Development velocity: +50% com arquitetura limpa
