# Plugin Internationalization (i18n)

Este documento explica como funciona o sistema de internacionalização para metadados de plugins no WeebProfile.

## Visão Geral

O sistema de i18n permite que os metadados dos plugins sejam traduzidos automaticamente para múltiplos idiomas (inglês, português, espanhol, e futuramente japonês). Os autores de plugins escrevem apenas em inglês no arquivo `plugin.metadata.ts`, e o sistema gera automaticamente arquivos de tradução organizados por plugin.

## Estrutura de Arquivos

### Arquivos de Tradução por Plugin

As traduções são organizadas em arquivos separados por plugin:

```
weeb-dashboard/messages/plugins/
├── {pluginId}/
│   ├── en.json  # Inglês (fonte de verdade, sempre atualizado)
│   ├── pt.json  # Português (preserva traduções existentes)
│   └── es.json  # Espanhol (preserva traduções existentes)
```

**Exemplo:**
```
weeb-dashboard/messages/plugins/
├── github/
│   ├── en.json
│   ├── pt.json
│   └── es.json
├── steam/
│   ├── en.json
│   ├── pt.json
│   └── es.json
└── ...
```

### Por que Arquivos Separados?

- ✅ **Facilita edição manual**: Cada plugin tem seus próprios arquivos
- ✅ **Fácil de rastrear**: Ver quais plugins têm novas keys para traduzir
- ✅ **Não sobrescreve traduções**: Preserva traduções existentes
- ✅ **Organização melhor**: Um arquivo por plugin
- ✅ **Diffs limpos**: Mudanças isoladas por plugin em PRs

## Como Funciona

### 1. Autor de Plugin Escreve em Inglês

No arquivo `plugin.metadata.ts`, o autor escreve todos os textos em inglês:

```typescript
export const myPluginMetadata = {
  displayName: "My Plugin",
  description: "Show your awesome statistics",
  sections: [
    {
      id: "stats",
      name: "Statistics",
      description: "Display your statistics",
      configOptions: [
        {
          key: "max_items",
          label: "Maximum items",
          description: "Maximum number of items to display",
          // ...
        }
      ]
    }
  ]
}
```

### 2. Script Gera Traduções

Ao executar `pnpm generate-metadata`, o script:

1. **Descobre plugins** automaticamente
2. **Extrai strings** de todos os campos traduzíveis (displayName, description, labels, placeholders, tooltips, etc.)
3. **Gera i18n keys** determinísticas baseadas no caminho (ex: `plugins.github.displayName`)
4. **Enriquece metadata** com objetos `i18nKey` apontando para as keys geradas
5. **Gera arquivos JSON** separados por plugin e locale

**Campos traduzíveis:**
- `displayName` → `plugins.{id}.displayName`
- `description` → `plugins.{id}.description`
- `sections[].name` → `plugins.{id}.sections.{sectionId}.name`
- `sections[].description` → `plugins.{id}.sections.{sectionId}.description`
- `configOptions[].label` → `plugins.{id}.sections.{sectionId}.config.{key}.label`
- `configOptions[].description` → `plugins.{id}.sections.{sectionId}.config.{key}.description`
- `configOptions[].placeholder` → `plugins.{id}.sections.{sectionId}.config.{key}.placeholder`
- `configOptions[].tooltip` → `plugins.{id}.sections.{sectionId}.config.{key}.tooltip`
- `configOptions[].defaultValue` (apenas para strings) → `plugins.{id}.sections.{sectionId}.config.{key}.defaultValue`
- `selectOptions` → `plugins.{id}.sections.{sectionId}.config.{key}.options.{optionValue}`

### 3. Comportamento de Merge

#### Inglês (en.json)
- ✅ **Sempre atualizado**: O arquivo EN é sempre sobrescrito com os valores do metadata
- ✅ **Fonte de verdade**: Serve como referência para traduções

#### Outros Locales (pt.json, es.json)
- ✅ **Preserva traduções existentes**: Se uma key já existe, mantém a tradução
- ✅ **Adiciona novas keys**: Keys novas são adicionadas com o valor em inglês como placeholder
- ✅ **Não remove keys**: Se uma key não existe mais no metadata, ela permanece no arquivo (para permitir deprecação gradual)

**Exemplo de Merge:**

**Antes (pt.json):**
```json
{
  "displayName": "GitHub",
  "sections": {
    "profile": {
      "name": "Perfil",
      "config": {
        "max_items": {
          "label": "Máximo de itens"
        }
      }
    }
  }
}
```

**Metadata atualizado adiciona novo campo:**
```typescript
configOptions: [
  { key: "max_items", label: "Maximum items" },
  { key: "show_avatar", label: "Show avatar" } // ← NOVO
]
```

**Depois do merge (pt.json):**
```json
{
  "displayName": "GitHub",
  "sections": {
    "profile": {
      "name": "Perfil", // ← PRESERVADO
      "config": {
        "max_items": {
          "label": "Máximo de itens" // ← PRESERVADO
        },
        "show_avatar": {
          "label": "Show avatar" // ← NOVO (em inglês como placeholder)
        }
      }
    }
  }
}
```

### 4. Carregamento no Dashboard

O arquivo `weeb-dashboard/i18n/request.ts` carrega automaticamente:

1. **Mensagens principais** de `messages/{locale}.json`
2. **Traduções de plugins** de `messages/plugins/{pluginId}/{locale}.json`
3. **Merge** tudo em um objeto `messages.plugins.{pluginId}`

**Código:**
```typescript
// Carrega mensagens base
const baseMessages = await import(`../messages/${locale}.json`)

// Carrega traduções de plugins
const pluginMessages = await loadPluginMessages(locale)

// Merge
return {
  locale,
  messages: {
    ...baseMessages,
    plugins: pluginMessages, // { github: {...}, steam: {...}, ... }
  },
}
```

### 5. Uso nos Componentes

Os componentes usam o hook `usePluginI18n()` para traduzir textos:

```typescript
import { usePluginI18n } from '@/lib/plugins/i18n-helper'

function PluginCard({ metadata }) {
  const { tWithFallback } = usePluginI18n()
  
  // Usa i18nKey do metadata ou fallback para o valor original
  const displayName = tWithFallback(
    metadata.i18nKey?.displayName || `plugins.${metadata.id}.displayName`,
    metadata.displayName // fallback
  )
  
  return <h3>{displayName}</h3>
}
```

**Fallback Seguro:**
- ✅ Tenta traduzir usando a key
- ✅ Se a tradução não existe, usa o valor original em inglês
- ✅ Nunca quebra a UI mesmo sem tradução

## Comandos

### Gerar/Atualizar Traduções

```bash
cd weeb-plugins
pnpm generate-metadata
```

Este comando:
- ✅ Processa todos os plugins
- ✅ Gera/atualiza `metadata.ts` com `i18nKey`
- ✅ Gera/atualiza arquivos `messages/plugins/{pluginId}/{locale}.json`
- ✅ Atualiza lista de plugins em `i18n/request.ts`

### Verificar Traduções

```bash
cd weeb-plugins
pnpm check-translations
```

Este comando verifica:
- ✅ Se todos os plugins têm arquivos de tradução para os idiomas suportados (PT, ES)
- ✅ Se as traduções foram realmente traduzidas (não apenas cópia do inglês)
- ⚠️ Avisa quando uma tradução está igual ao inglês (não traduzida)
- ✅ Ignora termos técnicos e placeholders que geralmente não são traduzidos
- ✅ Mostra resumo detalhado por plugin

**Exemplo de saída:**
```
📊 Summary:
============================================================
✅ Fully translated: 10/10 plugins
⚠️  Missing translation files: 0 plugin(s)
⚠️  Partially translated: 0 plugin(s)
⚠️  Total warnings: 0
============================================================

📋 Details by plugin:
------------------------------------------------------------
✅ github: pt: ✅ translated | es: ✅ translated
✅ steam: pt: ✅ translated | es: ✅ translated
...
```

**Idiomas suportados**: Configurado via constante `SUPPORTED_LANGUAGES` no script (por padrão: `['pt', 'es']`). Para adicionar novos idiomas, edite o array no início do arquivo `scripts/check-translations.ts`.

### Limpar Keys Obsoletas (apenas EN)

```bash
cd weeb-plugins
pnpm generate-metadata --prune
```

⚠️ **Atenção**: O flag `--prune` apenas afeta o arquivo `en.json`. Arquivos `pt.json` e `es.json` sempre preservam traduções existentes.

## Estrutura de Keys i18n

As keys são geradas deterministicamente baseadas no caminho no metadata:

```
plugins.{pluginId}.displayName
plugins.{pluginId}.description
plugins.{pluginId}.essentialConfig.{key}.label
plugins.{pluginId}.essentialConfig.{key}.description
plugins.{pluginId}.essentialConfig.{key}.placeholder
plugins.{pluginId}.sections.{sectionId}.name
plugins.{pluginId}.sections.{sectionId}.description
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.label
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.description
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.placeholder
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.tooltip
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.defaultValue
plugins.{pluginId}.sections.{sectionId}.config.{configKey}.options.{optionValue}
```

## Traduzindo Plugins

### Processo Recomendado

1. **Execute o script** para gerar/atualizar arquivos:
   ```bash
   pnpm generate-metadata
   ```

2. **Verifique arquivos EN** para ver estrutura completa:
   ```bash
   cat weeb-dashboard/messages/plugins/github/en.json
   ```

3. **Traduza arquivos PT e ES** manualmente:
   - Edite `weeb-dashboard/messages/plugins/{pluginId}/pt.json`
   - Edite `weeb-dashboard/messages/plugins/{pluginId}/es.json`

4. **Preserve traduções existentes**: O script nunca sobrescreve traduções, então você pode traduzir gradualmente

5. **Nova key adicionada?**: Execute o script novamente - novas keys serão adicionadas sem sobrescrever traduções

### Testando

Após traduzir, teste no dashboard:
- Mude o idioma usando o seletor de idioma
- Verifique se os textos aparecem traduzidos
- Se não traduzido, verifica se a key existe no arquivo JSON correto

## Exemplo Completo

### 1. Metadata Original (plugin.metadata.ts)

```typescript
export const githubPluginMetadata = {
  displayName: "GitHub",
  description: "Show your GitHub statistics",
  sections: [
    {
      id: "profile",
      name: "Profile",
      description: "User profile with avatar",
      configOptions: [
        {
          key: "max_items",
          label: "Maximum items",
          description: "Maximum number of items to display",
          type: "number",
          defaultValue: 10,
        }
      ]
    }
  ]
}
```

### 2. Metadata Gerado (metadata.ts)

```typescript
export const githubMetadata: PluginMetadata = {
  displayName: "GitHub",
  description: "Show your GitHub statistics",
  i18nKey: {
    displayName: "plugins.github.displayName",
    description: "plugins.github.description"
  },
  sections: [
    {
      id: "profile",
      name: "Profile",
      description: "User profile with avatar",
      i18nKey: {
        name: "plugins.github.sections.profile.name",
        description: "plugins.github.sections.profile.description"
      },
      configOptions: [
        {
          key: "max_items",
          label: "Maximum items",
          description: "Maximum number of items to display",
          i18nKey: {
            label: "plugins.github.sections.profile.config.max_items.label",
            description: "plugins.github.sections.profile.config.max_items.description"
          },
          // ...
        }
      ]
    }
  ]
}
```

### 3. Arquivo de Tradução Gerado (en.json)

```json
{
  "displayName": "GitHub",
  "description": "Show your GitHub statistics",
  "sections": {
    "profile": {
      "name": "Profile",
      "description": "User profile with avatar",
      "config": {
        "max_items": {
          "label": "Maximum items",
          "description": "Maximum number of items to display"
        }
      }
    }
  }
}
```

### 4. Arquivo Traduzido (pt.json)

```json
{
  "displayName": "GitHub",
  "description": "Mostre suas estatísticas do GitHub",
  "sections": {
    "profile": {
      "name": "Perfil",
      "description": "Perfil do usuário com avatar",
      "config": {
        "max_items": {
          "label": "Máximo de itens",
          "description": "Número máximo de itens a exibir"
        }
      }
    }
  }
}
```

## Boas Práticas

### Para Autores de Plugins

- ✅ **Escreva apenas em inglês** no `plugin.metadata.ts`
- ✅ **Execute `pnpm generate-metadata`** após alterar metadata
- ✅ **Não edite manualmente** `metadata.ts` ou arquivos de tradução gerados (exceto para traduzir)
- ✅ **Mantenha keys estáveis**: Evite renomear campos frequentemente

### Para Tradutores

- ✅ **Edite apenas arquivos PT/ES**: Nunca edite `en.json` manualmente
- ✅ **Traduza gradualmente**: Não precisa traduzir tudo de uma vez
- ✅ **Preserve estrutura**: Mantenha a mesma estrutura do arquivo EN
- ✅ **Teste após traduzir**: Verifique se aparece corretamente no dashboard

## Troubleshooting

### Tradução não aparece

1. Verifique se o arquivo existe: `messages/plugins/{pluginId}/{locale}.json`
2. Verifique se a key existe no arquivo JSON
3. Verifique se a key no `i18nKey` do metadata está correta
4. Limpe cache do Next.js: `rm -rf .next && pnpm dev`

### Key não foi gerada

1. Execute `pnpm generate-metadata` novamente
2. Verifique se o campo existe no `plugin.metadata.ts`
3. Verifique se o campo está na lista de campos traduzíveis (displayName, description, label, etc.)

### Tradução foi perdida

- ✅ **Não deveria acontecer**: O sistema preserva traduções existentes
- ✅ Se aconteceu, verifique se você não sobrescreveu o arquivo manualmente
- ✅ Restaure do git se necessário: `git checkout messages/plugins/{pluginId}/{locale}.json`

## Suporte a Novos Idiomas

Para adicionar um novo idioma (ex: japonês):

1. **Adicione o locale** em `weeb-plugins/scripts/generate-metadata.ts`:
   ```typescript
   for (const locale of ['en', 'pt', 'es', 'ja']) {
     writePluginI18nFile(locale, pluginName, pluginJson, ...)
   }
   ```

2. **Configure o routing** em `weeb-dashboard/i18n/routing.ts`

3. **Execute o script** para gerar arquivos `ja.json` para cada plugin

4. **Traduza os arquivos** `messages/plugins/{pluginId}/ja.json`

