# TODO List - WeebProfile

Este arquivo lista todos os TODOs, FIXMEs e melhorias pendentes no projeto.

## GitHub Plugin

## Template Plugin

### heights.ts

- [ ] **TODO**: Implement height calculation for each section (linha 30)
  - Arquivo: `weeb-plugins/src/plugins/_template/heights.ts`
  - Template para novos plugins
  - Deve ser implementado ao criar um novo plugin

## Melhorias Gerais

### Console.logs em Produção

- [ ] Remover ou substituir console.logs em arquivos de produção
  - 156 ocorrências encontradas em 13 arquivos
  - Scripts de desenvolvimento podem manter console.logs
  - Arquivos de produção devem usar sistema de logging adequado

### Performance

- [ ] Otimizar geração de SVGs grandes
- [ ] Implementar cache para requisições de API quando possível
- [ ] Considerar rate limits de APIs externas

### Documentação

- [ ] Adicionar mais exemplos de uso para cada plugin
- [ ] Melhorar documentação de configurações avançadas
- [ ] Adicionar guias de troubleshooting

---

**Nota**: Este arquivo é compatível com a extensão todo-tree do VSCode. Use `// TODO:`, `// FIXME:`, `// XXX:`, `// HACK:`, ou `// BUG:` nos comentários para que apareçam aqui.


