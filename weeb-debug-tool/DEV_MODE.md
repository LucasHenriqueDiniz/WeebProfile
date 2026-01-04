# Dev Mode - Explicação

## O que é o Dev Mode?

O **Dev Mode** é um modo de desenvolvimento que permite testar e visualizar plugins **sem precisar de credenciais reais** (API keys, tokens, etc.).

## Como funciona?

Quando o Dev Mode está **ativado** (`dev = true`):

1. **Usa dados mock**: Os plugins retornam dados de exemplo pré-definidos em vez de fazer chamadas reais à API
2. **Ignora credenciais**: Não precisa de API keys, tokens ou outras credenciais
3. **Mais rápido**: Não faz requisições HTTP reais, então é mais rápido
4. **Ideal para desenvolvimento**: Permite testar a UI e layout sem configurar todas as credenciais

Quando o Dev Mode está **desativado** (`dev = false`):

1. **Usa dados reais**: Faz chamadas reais às APIs dos serviços
2. **Requer credenciais**: Precisa de API keys, tokens, etc. configurados
3. **Mais lento**: Faz requisições HTTP reais
4. **Ideal para produção**: Gera SVGs com dados reais do usuário

## Exemplo

### Com Dev Mode (ON):
- GitHub: Mostra estatísticas mock (ex: 100 stars, 50 repos)
- MyAnimeList: Mostra dados de exemplo de um usuário fictício
- LastFM: Mostra músicas e artistas de exemplo

### Sem Dev Mode (OFF):
- GitHub: Busca dados reais da sua conta GitHub (precisa de PAT)
- MyAnimeList: Busca dados reais do seu perfil (precisa de username)
- LastFM: Busca dados reais da sua conta (precisa de API key)

## Quando usar?

- **Desenvolvimento**: Use Dev Mode para testar layouts, estilos e funcionalidades
- **Produção**: Desative Dev Mode para gerar SVGs com dados reais dos usuários

