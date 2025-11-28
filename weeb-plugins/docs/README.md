# Documentação - source-v2

## Estrutura Modular de Plugins

O `source-v2` foi completamente refatorado para uma arquitetura modular que facilita a criação e manutenção de plugins.

### Documentos Disponíveis

1. **[Estrutura de Plugins](./PLUGIN_STRUCTURE.md)** - Documentação completa da estrutura modular
2. **[Script create-plugin](./CREATE_PLUGIN.md)** - Como usar o script para criar novos plugins
3. **[Migração JS → TS](./MIGRATION_JS_TO_TS.md)** - Guia de migração de arquivos JavaScript para TypeScript
4. **[Status da Migração](./MIGRATION_STATUS.md)** - Status atual da migração JS → TS

### Quick Start

#### Criar um Novo Plugin

```bash
cd source-v2
pnpm create-plugin meu-plugin
```

#### Estrutura de um Plugin

```
src/plugins/meu-plugin/
├── index.tsx              # Definição principal
├── types.ts               # Tipos específicos
├── services/
│   ├── fetchData.ts       # Lógica de fetch
│   └── mock-data.ts       # Dados mock
└── components/
    └── RenderMeuPlugin.tsx # Renderização
```

### Infraestrutura Compartilhada

- **Types**: `shared/types/` - Tipos base (BasePluginConfig, Plugin, etc)
- **Utils**: `shared/utils/` - Utilitários (api, validation, formatting, errors)
- **Constants**: `shared/constants/` - Constantes compartilhadas

### Configurações

- **Essenciais**: API keys, tokens (em `essentialConfigs` no banco)
- **Não-Essenciais**: Preferências do usuário (em `pluginsConfig` no banco)

Veja a [documentação completa](./PLUGIN_STRUCTURE.md) para mais detalhes.

