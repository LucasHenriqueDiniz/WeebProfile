# Sistema de Metadata Automático

## 🎯 Filosofia

**ZERO edição manual de arquivos centralizados!** 

Quando você cria um plugin ou adiciona uma seção, tudo é **automático**. Você só edita o arquivo `plugin.metadata.ts` do seu plugin.

## 📋 Como Funciona

### 1. Cada Plugin Tem Seu Próprio Metadata

Cada plugin tem um arquivo `plugin.metadata.ts` que define:
- Seções disponíveis
- Opções de configuração de cada seção
- Configurações essenciais (API keys, tokens)
- Valores padrão

### 2. Geração Automática

O script `generate-metadata.ts`:
- Lê todos os `plugin.metadata.ts`
- Gera o `metadata.ts` centralizado automaticamente
- Mantém tipos e estrutura corretos

### 3. Integração Automática

O metadata é gerado automaticamente:
- **No build**: `pnpm build` executa `generate-metadata` antes de compilar
- **No generate-plugin-wrappers**: O script do dashboard executa `generate-metadata` antes de copiar

## 🚀 Workflow

### Criar Novo Plugin

1. **Execute o comando de criação:**
   ```bash
   pnpm create-plugin nome-do-plugin
   ```
   
   ⚠️ **Regras de nomenclatura:**
   - Use apenas letras minúsculas, números e hífens
   - Exemplos válidos: `meu-plugin`, `github-stats`, `plugin123`
   - Exemplos inválidos: `MeuPlugin`, `meu_plugin`, `meu plugin`

2. **O script cria automaticamente:**
   - Estrutura de diretórios (`components/`, `services/`)
   - Arquivos base (`index.tsx`, `types.ts`, `plugin.metadata.ts`)
   - Registro no `PluginManager` e `index.ts`
   - Geração automática do metadata

3. **Edite o `plugin.metadata.ts`:**
   - Configure `displayName`, `description`, `category`, `icon`
   - Defina `essentialConfigKeys` e `essentialConfigKeysMetadata`
   - Adicione suas seções no array `sections[]`
   - Configure `exampleConfig`, `defaultConfig` e `fieldDefaults`

4. **Implemente o plugin:**
   - Edite `types.ts` para definir tipos
   - Implemente `services/fetchData.ts` para buscar dados
   - Implemente `components/Render[PluginName].tsx` para renderizar
   - Adicione dados mock em `services/mock-data.ts`

5. **Valide e gere metadata:**
   ```bash
   pnpm generate-metadata
   ```
   
   O script valida automaticamente:
   - ✅ Campos obrigatórios presentes
   - ✅ Tipos corretos (category, icon, etc)
   - ✅ ConfigOptions válidos
   - ✅ Valores min/max consistentes
   - ✅ Select options quando type é "select"

6. **Teste:**
   ```bash
   pnpm dev
   ```

### Adicionar Nova Seção a um Plugin Existente

1. Edite `src/plugins/[plugin-name]/plugin.metadata.ts`
2. Adicione a seção no array `sections[]`:
   ```typescript
   {
     id: "nova_secao",
     name: "Nova Seção",
     description: "Descrição da seção",
     configOptions: [
       // ... opções de configuração
     ],
   }
   ```
3. Execute: `pnpm generate-metadata` (ou deixe o build fazer isso)
4. Implemente o componente em `components/`
5. Adicione o case no `Render[PluginName].tsx`
6. Pronto! A seção aparece automaticamente no dashboard

## 📝 Formato do plugin.metadata.ts

### Estrutura Completa

```typescript
export const [pluginName]PluginMetadata = {
  // Informações básicas do plugin
  displayName: "Nome do Plugin",        // Nome exibido no dashboard
  description: "Descrição do plugin",   // Descrição curta
  category: "coding",                    // "coding" | "music" | "anime" | "gaming"
  icon: "IconName",                      // Nome do ícone lucide-react (ex: "Github", "Music")
  
  // Campos obrigatórios do usuário
  requiredFields: ["username"],          // Campos que o usuário deve preencher
  
  // Chaves de configuração essenciais (API keys, tokens)
  essentialConfigKeys: ["apiKey"],      // Lista de chaves necessárias
  essentialConfigKeysMetadata: [        // Metadata detalhada de cada chave
    {
      key: "apiKey",                     // Nome da chave (deve estar em essentialConfigKeys)
      label: "API Key",                   // Label exibido no formulário
      type: "password",                   // "text" | "password"
      placeholder: "sua-api-key",         // Placeholder do input
      description: "Descrição da API key", // Descrição exibida
      helpUrl: "https://exemplo.com/api-keys", // URL para obter a chave
      docKey: "plugin.apiKey",            // Chave para documentação futura
    },
  ],
  
  // Seções disponíveis do plugin
  sections: [
    {
      id: "section_id",                  // ID único da seção (usado em config.sections)
      name: "Nome da Seção",             // Nome exibido no dashboard
      description: "Descrição da seção", // Descrição opcional
      configOptions: [                   // Opções de configuração da seção
        {
          key: "section_hide_title",       // Chave da configuração
          label: "Ocultar título",        // Label exibido
          type: "boolean",                 // "number" | "boolean" | "string" | "select"
          defaultValue: false,             // Valor padrão
        },
        {
          key: "section_title",
          label: "Título",
          type: "string",
          defaultValue: "Título Padrão",
        },
        {
          key: "section_max",
          label: "Máximo de itens",
          type: "number",
          defaultValue: 10,
          min: 1,                         // Valor mínimo (apenas para type: "number")
          max: 50,                        // Valor máximo (apenas para type: "number")
          step: 1,                        // Incremento (apenas para type: "number")
          description: "Máximo 50 itens",  // Descrição opcional
        },
        {
          key: "section_style",
          label: "Estilo",
          type: "select",                 // Para select, options é obrigatório
          defaultValue: "default",
          options: [                      // Opções para select
            { value: "default", label: "Padrão" },
            { value: "list", label: "Lista" },
          ],
        },
      ],
    },
  ],
  
  // Configuração de exemplo (usado em previews)
  exampleConfig: {
    enabled: true,
    username: "exemplo",
    sections: ["section_id"],
  },
  
  // Configuração padrão quando plugin é adicionado
  defaultConfig: {
    enabled: false,
    sections: ["section_id"],
    username: "",
  },
  
  // Valores padrão para campos específicos
  fieldDefaults: {
    username: "exemplo",
  },
}
```

### Validações Automáticas

O script `generate-metadata` valida automaticamente:

✅ **Campos obrigatórios:**
- `displayName`, `description`, `category`, `icon`
- `requiredFields`, `essentialConfigKeys`, `essentialConfigKeysMetadata`, `sections`

✅ **Tipos corretos:**
- `category` deve ser: `"coding" | "music" | "anime" | "gaming"`
- `essentialConfigKeysMetadata[].type` deve ser: `"text" | "password"`
- `configOptions[].type` deve ser: `"number" | "boolean" | "string" | "select"`

✅ **Regras específicas:**
- `select` type requer `options` array
- `number` type valida `min` e `max` (min não pode ser > max)
- Todas as seções devem ter `id` e `name`
- Todas as configOptions devem ter `key` e `label`

### Exemplos de Erros Comuns

❌ **Erro:** `Invalid category: invalid. Must be one of: coding, music, anime, gaming`
```typescript
// ❌ ERRADO
category: "invalid"

// ✅ CORRETO
category: "coding"
```

❌ **Erro:** `sections[0].configOptions[0]: select type requires options array`
```typescript
// ❌ ERRADO
{
  key: "style",
  type: "select",
  // Faltando options
}

// ✅ CORRETO
{
  key: "style",
  type: "select",
  options: [
    { value: "default", label: "Padrão" }
  ]
}
```

❌ **Erro:** `sections[0].configOptions[0]: min (10) cannot be greater than max (5)`
```typescript
// ❌ ERRADO
{
  key: "max_items",
  type: "number",
  min: 10,
  max: 5,  // min > max
}

// ✅ CORRETO
{
  key: "max_items",
  type: "number",
  min: 1,
  max: 50,
}
```

## ⚠️ Regras Importantes

1. **NUNCA edite `metadata.ts` manualmente** - ele é gerado automaticamente
2. **SEMPRE edite `plugin.metadata.ts`** no diretório do plugin
3. **O nome da exportação deve ser**: `[pluginName]PluginMetadata` (ex: `githubPluginMetadata`)
4. **Execute `pnpm generate-metadata`** após fazer alterações (ou deixe o build fazer)
5. **Valide antes de commitar** - o script valida automaticamente e mostra erros
6. **Use kebab-case** para nomes de plugins (ex: `meu-plugin`, não `MeuPlugin`)

## 🔍 Validação e Tratamento de Erros

### Durante a Geração

O script `generate-metadata` valida automaticamente e mostra erros detalhados:

```bash
$ pnpm generate-metadata

🔍 Generating metadata.ts from plugin.metadata.ts files...

📦 Loading metadata for github...
✅ Loaded github (12 sections)

📦 Loading metadata for meu-plugin...
❌ Validation errors in meu-plugin/plugin.metadata.ts:
   - Missing displayName
   - Invalid category: invalid. Must be one of: coding, music, anime, gaming
   - sections[0].configOptions[0]: select type requires options array

❌ Error generating metadata: Validation failed
```

### Durante a Criação de Plugin

O script `create-plugin` valida:
- ✅ Nome do plugin em kebab-case
- ✅ Plugin não existe ainda
- ✅ Template existe
- ✅ Metadata exportado corretamente
- ✅ Campos básicos presentes

### Como Corrigir Erros

1. **Leia a mensagem de erro** - ela indica exatamente o que está errado
2. **Localize o arquivo** - o erro mostra o caminho completo
3. **Corrija o valor** - siga o formato mostrado nos exemplos
4. **Execute novamente** - `pnpm generate-metadata` para validar

## 📂 Estrutura

```
weeb-plugins/
  src/
    plugins/
      github/
        plugin.metadata.ts  ← ✅ Edite aqui
        index.tsx
        ...
      lastfm/
        plugin.metadata.ts  ← ✅ Edite aqui
        ...
      metadata.ts           ← ⚠️ GERADO - NÃO EDITAR
  scripts/
    generate-metadata.ts    ← Script gerador
```

## 🔄 Fluxo Completo

```
1. Você edita: src/plugins/github/plugin.metadata.ts
2. Executa: pnpm generate-metadata
3. Gera: src/plugins/metadata.ts (automático)
4. Dashboard executa: pnpm generate:plugin-wrappers
5. Copia: metadata.ts para weeb-dashboard/lib/weeb-plugins/plugins/
6. Dashboard usa: metadata.ts automaticamente
7. ✨ Plugin aparece no dashboard sem edição manual!
```

## 🎉 Benefícios

- ✅ **Zero edição manual** de arquivos centralizados
- ✅ **Criação de plugin** já inclui metadata
- ✅ **Adicionar seção** = editar 1 arquivo + rodar script
- ✅ **Type-safe** - tudo tipado corretamente
- ✅ **Automático** - integrado no build e scripts

## 🐛 Troubleshooting

### Metadata não atualiza?

1. Verifique se `plugin.metadata.ts` existe
2. Verifique se a exportação está correta: `export const [name]PluginMetadata = {...}`
3. Execute `pnpm generate-metadata` manualmente
4. Verifique erros no console

### Plugin não aparece no dashboard?

1. Verifique se `plugin.metadata.ts` está no formato correto
2. Execute `pnpm generate-metadata` no weeb-plugins
3. Execute `pnpm generate:plugin-wrappers` no weeb-dashboard
4. Reinicie o servidor Next.js
