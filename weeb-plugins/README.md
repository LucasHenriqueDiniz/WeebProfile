# @weeb/source-v2

Source V2 - Plugins e templates otimizados com arquitetura modular.

## 🎯 Objetivos

- ✅ **Melhor Organização** - Estrutura mais clara e modular
- ✅ **Type Safe** - Tipos melhorados e compartilhados
- ✅ **Modular** - Plugins independentes com boilerplate
- ✅ **Performance** - Otimizado
- ✅ **Escalável** - Fácil adicionar novos plugins

## 📦 Instalação

```bash
pnpm install
```

## 🚀 Uso

### Build

```bash
# Build do projeto
pnpm build

# Build em modo watch (desenvolvimento)
pnpm dev

# Verificar tipos sem build
pnpm typecheck
```

### Uso no código

```typescript
import { PluginManager } from '@weeb/source-v2/plugins'
import { DefaultTemplate } from '@weeb/source-v2/templates'

// Usar plugins
const manager = PluginManager.getInstance()
const githubData = await manager.fetchPluginData('github', config, false, essentialConfig)

// Usar templates
const template = <DefaultTemplate data={githubData} />
```

## 🏗️ Estrutura

- `src/plugins/` - Plugins (github, lastfm, myanimelist)
  - `shared/` - Infraestrutura compartilhada
    - `types/` - Tipos base (BasePluginConfig, Plugin, etc)
    - `utils/` - Utilitários (api, validation, formatting, errors)
    - `constants/` - Constantes compartilhadas
  - `_template/` - Template/boilerplate para novos plugins
- `src/templates/` - Templates de renderização
- `src/utils/` - Utilitários compartilhados
- `src/types/` - Tipos compartilhados

## 🔧 Criar Novo Plugin

Use o script `create-plugin` para gerar um novo plugin automaticamente:

```bash
pnpm create-plugin meu-plugin
```

Isso criará:
- Nova pasta `src/plugins/meu-plugin/` com estrutura completa
- Arquivos com placeholders substituídos
- Plugin registrado no PluginManager

Veja `src/plugins/_template/README.md` para documentação completa.

## 📋 Configurações Essenciais vs Não-Essenciais

### Essenciais (EssentialConfig)
- API keys, tokens, credenciais sensíveis
- Armazenadas em `essentialConfigs` no banco de dados
- Acessadas via parâmetro `essentialConfig` em `fetchData`
- Definidas em `essentialConfigKeys` no plugin

### Não-Essenciais (NonEssentialConfig)
- Preferências do usuário (max_items, titles, etc)
- Armazenadas em `pluginsConfig` no banco de dados
- Acessadas via `config.nonEssential`

## 📝 Status

✅ **Estrutura Modular Completa** - Pronto para adicionar novos plugins facilmente

## 📚 Documentação

- [Estrutura de Plugins](./docs/PLUGIN_STRUCTURE.md) - Documentação completa da estrutura modular
- [Script create-plugin](./docs/CREATE_PLUGIN.md) - Como usar o script para criar novos plugins
- [Migração JS → TS](./docs/MIGRATION_JS_TO_TS.md) - Guia de migração de arquivos JavaScript para TypeScript

