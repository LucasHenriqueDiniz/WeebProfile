# Script create-plugin - Criar Novos Plugins

O script `create-plugin` automatiza a criação de novos plugins no WeebProfile.

## Uso

```bash
cd source-v2
pnpm create-plugin nome-do-plugin
```

## Exemplo

```bash
pnpm create-plugin spotify
```

Isso criará:
- Nova pasta `src/plugins/spotify/` com estrutura completa
- Arquivos com placeholders substituídos automaticamente
- Plugin registrado no PluginManager
- Export adicionado no `index.ts`

## Validações

O script valida:
- **Nome do plugin**: Deve estar em kebab-case (apenas letras minúsculas, números e hífens)
  - ✅ Válido: `spotify`, `meu-plugin`, `plugin-123`
  - ❌ Inválido: `Spotify`, `meu_plugin`, `MeuPlugin`
- **Plugin existente**: Verifica se o plugin já existe antes de criar

## Estrutura Criada

```
src/plugins/nome-do-plugin/
├── index.tsx              # Definição principal do plugin
├── types.ts               # Tipos específicos do plugin
├── services/
│   ├── fetchData.ts       # Lógica de busca de dados
│   └── mock-data.ts       # Dados mock para desenvolvimento
├── components/
│   └── RenderNomeDoPlugin.tsx  # Componente de renderização
└── README.md              # Documentação do template
```

## Placeholders Substituídos

O script substitui automaticamente:

| Placeholder | Exemplo (plugin: "spotify") |
|------------|------------------------------|
| `PLUGIN_NAME` | `spotify` |
| `PluginName` | `Spotify` |
| `PLUGIN_NAME_UPPER` | `SPOTIFY` |

## O que o Script Faz

1. **Valida nome**: Verifica se está em kebab-case e se não existe
2. **Cria estrutura**: Cria diretórios necessários
3. **Copia template**: Copia arquivos do `_template/`
4. **Substitui placeholders**: Substitui todos os placeholders nos arquivos
5. **Registra plugin**: Adiciona import e registro no `PluginManager`
6. **Adiciona export**: Adiciona export no `index.ts`

## Após Criar o Plugin

1. **Edite `types.ts`**: Defina tipos específicos do seu plugin
2. **Implemente `fetchData.ts`**: Adicione lógica de busca de dados
3. **Crie `mock-data.ts`**: Adicione dados mock para desenvolvimento
4. **Implemente componentes**: Crie componentes de renderização
5. **Teste**: Use `pnpm dev` para testar

## Exemplo Completo

```bash
# Criar plugin
pnpm create-plugin spotify

# Saída esperada:
# 🚀 Criando plugin "spotify"...
#   ✓ Criado index.tsx
#   ✓ Criado types.ts
#   ✓ Criado services/fetchData.ts
#   ✓ Criado services/mock-data.ts
#   ✓ Criado components/RenderSpotify.tsx
#   ✓ Criado README.md
#   ✓ Atualizado PluginManager
#   ✓ Atualizado index.ts
#
# ✅ Plugin "spotify" criado com sucesso!
#
# 📝 Próximos passos:
#    1. Edite src/plugins/spotify/types.ts para definir seus tipos
#    2. Implemente src/plugins/spotify/services/fetchData.ts
#    3. Implemente src/plugins/spotify/components/RenderSpotify.tsx
#    4. Teste com pnpm dev
```

## Troubleshooting

### Erro: "Nome do plugin deve estar em kebab-case"
- Use apenas letras minúsculas, números e hífens
- Exemplo: `meu-plugin` ✅, `MeuPlugin` ❌

### Erro: "Plugin já existe"
- Escolha outro nome ou remova o plugin existente

### Erro: "Template não encontrado"
- Certifique-se de que `src/plugins/_template/` existe
- Execute o comando a partir do diretório `source-v2`

## Veja Também

- [Estrutura de Plugins](./PLUGIN_STRUCTURE.md) - Documentação completa da estrutura
- [Template README](../src/plugins/_template/README.md) - Documentação do template

