# GitHub API para o WeebProfile

> Guia prático e detalhado para coletar informações públicas de perfis, repositórios, linguagens, organizações, gists, seguidores, estrelas, atividade e contribuições.
>
> Revisado com base na documentação atual do GitHub em julho de 2026.
>
> Exemplos usam a versão REST `2026-03-10`.

---

## Sumário

1. [O que usar no WeebProfile](#1-o-que-usar-no-weebprofile)
2. [REST API, GraphQL API e URLs base](#2-rest-api-graphql-api-e-urls-base)
3. [Cabeçalhos obrigatórios e recomendados](#3-cabeçalhos-obrigatórios-e-recomendados)
4. [Autenticação e segurança](#4-autenticação-e-segurança)
5. [Limites de requisição](#5-limites-de-requisição)
6. [Perfil de usuário](#6-perfil-de-usuário)
7. [Seguidores, seguindo e redes sociais](#7-seguidores-seguindo-e-redes-sociais)
8. [Repositórios](#8-repositórios)
9. [Linguagens dos repositórios](#9-linguagens-dos-repositórios)
10. [README, arquivos e conteúdo](#10-readme-arquivos-e-conteúdo)
11. [Commits e contribuidores](#11-commits-e-contribuidores)
12. [Releases, branches, tags e licença](#12-releases-branches-tags-e-licença)
13. [Organizações](#13-organizações)
14. [Gists](#14-gists)
15. [Repositórios favoritados com estrela](#15-repositórios-favoritados-com-estrela)
16. [Atividade pública e eventos](#16-atividade-pública-e-eventos)
17. [Calendário e estatísticas de contribuições](#17-calendário-e-estatísticas-de-contribuições)
18. [Paginação](#18-paginação)
19. [Cache condicional com ETag](#19-cache-condicional-com-etag)
20. [Erros e códigos HTTP](#20-erros-e-códigos-http)
21. [Cliente TypeScript reutilizável](#21-cliente-typescript-reutilizável)
22. [Agregador de dados do WeebProfile](#22-agregador-de-dados-do-weebprofile)
23. [Modelo normalizado recomendado](#23-modelo-normalizado-recomendado)
24. [Arquitetura recomendada para Cloudflare](#24-arquitetura-recomendada-para-cloudflare)
25. [Estratégia de cache](#25-estratégia-de-cache)
26. [O que não fazer](#26-o-que-não-fazer)
27. [Checklist de implementação](#27-checklist-de-implementação)
28. [Referências oficiais](#28-referências-oficiais)

---

# 1. O que usar no WeebProfile

Para uma integração de perfil público, a melhor solução é combinar:

- **REST API** para perfil, repositórios, organizações, gists, linguagens, redes sociais e atividade recente.
- **GraphQL API** para o calendário e os totais de contribuições.
- **Backend/Cloudflare Function ou Worker** para guardar o token.
- **Cache** para evitar repetir dezenas de chamadas ao GitHub.

## Conjunto mínimo de chamadas

| Informação | Endpoint |
|---|---|
| Perfil | `GET /users/{username}` |
| Repositórios | `GET /users/{username}/repos` |
| Organizações públicas | `GET /users/{username}/orgs` |
| Gists públicos | `GET /users/{username}/gists` |
| Redes sociais | `GET /users/{username}/social_accounts` |
| Seguidores | `GET /users/{username}/followers` |
| Seguindo | `GET /users/{username}/following` |
| Atividade pública recente | `GET /users/{username}/events/public` |
| Repositórios favoritados | `GET /users/{username}/starred` |
| Linguagens de um repositório | `GET /repos/{owner}/{repo}/languages` |
| Detalhes de um repositório | `GET /repos/{owner}/{repo}` |
| README | `GET /repos/{owner}/{repo}/readme` |
| Calendário de contribuições | GraphQL: `contributionsCollection` |

## Recomendação de escopo

Para a primeira versão do WeebProfile:

1. Busque perfil, repositórios, organizações, gists e redes sociais.
2. Busque linguagens apenas dos repositórios exibidos ou dos principais repositórios.
3. Use GraphQL para contribuições.
4. Use eventos apenas para uma seção de “atividade recente”.
5. Não busque todos os commits de todos os repositórios para calcular contribuições.
6. Faça tudo pelo backend quando existir token.

---

# 2. REST API, GraphQL API e URLs base

## REST API

```text
https://api.github.com
```

Exemplo:

```text
https://api.github.com/users/LucasHenriqueDiniz
```

## GraphQL API

```text
https://api.github.com/graphql
```

A GraphQL API exige autenticação. A consulta é enviada em um `POST` com JSON.

## Versão da REST API

A REST API do GitHub é versionada. A versão atual usada neste guia é:

```text
2026-03-10
```

Envie a versão explicitamente:

```http
X-GitHub-Api-Version: 2026-03-10
```

Sem esse cabeçalho, o GitHub atualmente usa por padrão a versão `2022-11-28`. Não dependa desse comportamento implícito.

O GitHub mantém versões antigas por um período de compatibilidade. Quando uma versão deixa de ser aceita, requisições que a especificam podem retornar `410 Gone`.

---

# 3. Cabeçalhos obrigatórios e recomendados

Modelo de requisição REST:

```http
GET /users/LucasHenriqueDiniz HTTP/1.1
Host: api.github.com
Accept: application/vnd.github+json
Authorization: Bearer SEU_TOKEN
X-GitHub-Api-Version: 2026-03-10
User-Agent: WeebProfile
```

## `Accept`

Use:

```http
Accept: application/vnd.github+json
```

Alguns endpoints oferecem formatos especiais. Por exemplo, a API de estrelas pode retornar a data em que o usuário adicionou a estrela usando:

```http
Accept: application/vnd.github.star+json
```

## `Authorization`

Quando autenticado:

```http
Authorization: Bearer SEU_TOKEN
```

Nunca coloque o token diretamente no repositório, JavaScript do navegador ou variável `VITE_*`.

## `X-GitHub-Api-Version`

```http
X-GitHub-Api-Version: 2026-03-10
```

## `User-Agent`

Todas as requisições devem possuir um `User-Agent` válido. Em navegador, ele é controlado pelo browser. Em Worker, Node.js ou outro backend, configure um nome identificável:

```http
User-Agent: WeebProfile
```

---

# 4. Autenticação e segurança

## 4.1 Dados públicos sem autenticação

Muitos endpoints de leitura pública funcionam sem token:

- perfil público;
- repositórios públicos;
- organizações exibidas publicamente;
- gists públicos;
- seguidores e seguindo;
- redes sociais públicas;
- atividade pública;
- linguagens de repositórios públicos.

Problemas dessa opção:

- limite muito menor;
- limite associado ao IP;
- usuários de uma mesma rede podem compartilhar o limite;
- alguns campos podem vir ausentes;
- GraphQL não funciona anonimamente;
- não há acesso a dados privados autorizados.

## 4.2 Personal access token

Para desenvolvimento pessoal, pode ser usado um **fine-grained personal access token**.

Use o menor conjunto possível de permissões. Para o WeebProfile público, várias chamadas precisam apenas de acesso a metadados públicos.

O token atua com a identidade e permissões de seu proprietário. Portanto, um vazamento permite que terceiros usem essas permissões.

## 4.3 GitHub App

Para uma aplicação pública que crescerá, o modelo mais apropriado é um **GitHub App**.

Vantagens:

- permissões granulares;
- tokens temporários;
- acesso limitado a contas/repositórios autorizados;
- melhor controle de instalações;
- arquitetura mais adequada para agir em nome de usuários ou organizações.

O próprio GitHub recomenda GitHub Apps para integrações que operam em nome de usuários ou organizações.

## 4.4 OAuth

OAuth pode ser usado para permitir que cada pessoa conecte sua própria conta. Depois do consentimento, o WeebProfile recebe um token daquele usuário.

É útil quando o projeto precisa:

- mostrar dados privados autorizados;
- mostrar contribuições privadas permitidas;
- identificar o usuário conectado;
- permitir edição ou ações;
- distribuir consumo da API entre usuários autenticados.

Para uma página que mostra somente perfis públicos, OAuth não é obrigatório.

## 4.5 Nunca use token em `VITE_*`

Em Vite, valores como:

```env
VITE_GITHUB_TOKEN=...
```

são incorporados ao bundle enviado ao navegador. Qualquer pessoa pode encontrá-los no JavaScript, DevTools ou Network.

Use uma variável secreta no backend:

```env
GITHUB_TOKEN=...
```

No Cloudflare, configure-a como secret ou variável protegida da Function/Worker.

## 4.6 Estratégias possíveis

### Estratégia A — navegador sem token

```text
Browser -> api.github.com
```

Adequada apenas para protótipo de baixo tráfego.

### Estratégia B — backend com token do projeto

```text
Browser -> API do WeebProfile -> api.github.com
```

É a opção mais simples para produção, desde que exista cache.

Todos os usuários compartilham o limite do token do projeto.

### Estratégia C — login GitHub

```text
Browser -> OAuth/GitHub App -> API do WeebProfile -> GitHub
```

É a melhor opção quando cada usuário conecta a própria conta.

---

# 5. Limites de requisição

## Limite primário

Valores gerais da REST API:

| Tipo | Limite geral |
|---|---:|
| Não autenticado | `60` requisições por hora, por IP |
| Autenticado como usuário | `5.000` requisições por hora |
| Alguns cenários Enterprise | até `15.000` por hora |
| `GITHUB_TOKEN` em Actions | normalmente `1.000` por hora por repositório |

Alguns recursos, especialmente pesquisa, possuem limites próprios mais restritivos.

## Cabeçalhos de limite

O GitHub retorna:

```http
x-ratelimit-limit
x-ratelimit-remaining
x-ratelimit-used
x-ratelimit-reset
x-ratelimit-resource
```

Exemplo de leitura:

```ts
const remaining = Number(response.headers.get("x-ratelimit-remaining"));
const resetEpoch = Number(response.headers.get("x-ratelimit-reset"));
const resetAt = new Date(resetEpoch * 1000);
```

## Consultar o limite

```http
GET /rate_limit
```

Na versão `2026-03-10`, leia os dados dentro de `resources`, como `resources.core`. A propriedade antiga `rate` foi removida nessa versão.

## Limites secundários

Mesmo que ainda existam requisições no limite primário, o GitHub pode bloquear tráfego agressivo.

Evite:

- dezenas ou centenas de chamadas simultâneas;
- polling frequente;
- repetição imediata após `403` ou `429`;
- chamadas mutativas em alta velocidade;
- baixar detalhes de todos os repositórios em toda visita.

O limite secundário pode retornar:

```text
403 Forbidden
```

ou:

```text
429 Too Many Requests
```

Respeite:

```http
Retry-After
```

ou aguarde até `x-ratelimit-reset`.

---

# 6. Perfil de usuário

## Endpoint

```http
GET /users/{username}
```

Exemplo:

```bash
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  https://api.github.com/users/LucasHenriqueDiniz
```

## Campos importantes

| Campo | Uso no WeebProfile |
|---|---|
| `id` | ID numérico estável da conta |
| `node_id` | ID global usado pelo GraphQL |
| `login` | username atual |
| `name` | nome de exibição |
| `avatar_url` | avatar |
| `html_url` | link do perfil |
| `bio` | biografia |
| `company` | empresa |
| `blog` | website informado no perfil |
| `location` | localização |
| `email` | e-mail público, frequentemente `null` |
| `twitter_username` | username antigo/específico do Twitter, quando disponível |
| `public_repos` | quantidade de repositórios públicos |
| `public_gists` | quantidade de gists públicos |
| `followers` | quantidade de seguidores |
| `following` | quantidade de contas seguidas |
| `created_at` | criação da conta |
| `updated_at` | última atualização do perfil |
| `type` | normalmente `User` ou `Organization` |
| `site_admin` | indica administrador do GitHub |

## Exemplo TypeScript

```ts
interface GitHubUser {
  id: number;
  node_id: string;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: "User" | "Organization" | string;
  site_admin: boolean;
}
```

## Observações

- `login` pode mudar; o `id` numérico é mais estável.
- `name`, `bio`, `company`, `location` e `email` podem ser `null`.
- Não trate `blog` como URL confiável sem normalização.
- Não use `email` como requisito: muitas contas não publicam endereço.
- Um `404` pode significar conta inexistente ou recurso inacessível.

## Usuário autenticado

```http
GET /user
```

Esse endpoint representa a conta vinculada ao token. Não use `/user` para buscar um perfil arbitrário.

---

# 7. Seguidores, seguindo e redes sociais

## Seguidores

```http
GET /users/{username}/followers
```

## Contas seguidas

```http
GET /users/{username}/following
```

Os totais já aparecem em `GET /users/{username}`. Só busque as listas completas quando precisar exibir avatares, nomes ou páginas de seguidores.

## Redes sociais

```http
GET /users/{username}/social_accounts
```

Exemplo de resposta:

```json
[
  {
    "provider": "twitter",
    "url": "https://twitter.com/github"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/@GitHub"
  }
]
```

Essa rota é melhor do que depender apenas de `twitter_username`, pois permite múltiplos serviços.

## Cuidados

- As listas são paginadas.
- O usuário pode ter milhares de seguidores.
- Para um card de perfil, o total é suficiente.
- Não faça paginação completa de seguidores durante o carregamento inicial.
- URLs de redes sociais são conteúdo fornecido pelo usuário; valide protocolo e escape na interface.

---

# 8. Repositórios

## 8.1 Listar repositórios de um usuário

```http
GET /users/{username}/repos
```

Exemplo recomendado:

```text
GET /users/LucasHenriqueDiniz/repos?type=owner&sort=pushed&direction=desc&per_page=100
```

## Parâmetros

| Parâmetro | Valores | Uso |
|---|---|---|
| `type` | `all`, `owner`, `member` | relação do usuário com o repositório |
| `sort` | `created`, `updated`, `pushed`, `full_name` | ordenação |
| `direction` | `asc`, `desc` | direção |
| `per_page` | até `100` | itens por página |
| `page` | número da página | paginação |

Para o perfil principal, normalmente use:

```text
type=owner
sort=pushed
direction=desc
per_page=100
```

Depois filtre no código:

```ts
const visibleRepos = repositories.filter(
  (repo) => !repo.fork && !repo.archived && !repo.disabled,
);
```

A escolha de esconder forks e arquivados é de produto, não uma regra da API.

## 8.2 Detalhes de um repositório

```http
GET /repos/{owner}/{repo}
```

Exemplo:

```http
GET /repos/LucasHenriqueDiniz/heartopia-vite
```

## Campos importantes

| Campo | Descrição |
|---|---|
| `id` | ID numérico |
| `node_id` | ID GraphQL |
| `name` | nome |
| `full_name` | `owner/repo` |
| `description` | descrição |
| `html_url` | página no GitHub |
| `homepage` | website do projeto |
| `private` | visibilidade privada |
| `visibility` | `public`, `private` ou `internal` |
| `fork` | é fork |
| `forks_count` | forks |
| `stargazers_count` | estrelas |
| `watchers_count` | historicamente equivale a estrelas |
| `subscribers_count` | watchers reais/assinantes |
| `open_issues_count` | issues e PRs abertos combinados em alguns contextos |
| `language` | linguagem principal |
| `topics` | tópicos |
| `license` | licença detectada |
| `default_branch` | branch padrão |
| `size` | tamanho aproximado em KB |
| `created_at` | criação |
| `updated_at` | atualização do objeto |
| `pushed_at` | último push |
| `archived` | arquivado |
| `disabled` | desabilitado |
| `has_issues` | issues habilitadas |
| `has_wiki` | wiki habilitada |
| `has_pages` | GitHub Pages |
| `has_discussions` | Discussions |

## Stars, watchers e subscribers

Existe uma diferença importante:

- `stargazers_count`: quantidade de estrelas.
- `watchers_count`: também representa estrelas por compatibilidade histórica.
- `subscribers_count`: pessoas que realmente acompanham notificações do repositório.

No WeebProfile, mostre `stargazers_count` como “stars”.

## Issues abertas

`open_issues_count` não deve ser interpretado necessariamente como apenas issues: pull requests podem estar incluídos nessa contagem.

Quando precisar separar:

```http
GET /repos/{owner}/{repo}/issues
GET /repos/{owner}/{repo}/pulls
```

---

# 9. Linguagens dos repositórios

## Endpoint

```http
GET /repos/{owner}/{repo}/languages
```

Exemplo:

```bash
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  https://api.github.com/repos/OWNER/REPO/languages
```

Resposta:

```json
{
  "TypeScript": 245000,
  "CSS": 51000,
  "JavaScript": 18000
}
```

Os valores representam **bytes de código detectados para cada linguagem**. Eles não são porcentagens.

## Converter em porcentagem

```ts
function languagePercentages(
  languages: Record<string, number>,
): Array<{ name: string; bytes: number; percentage: number }> {
  const total = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );

  if (total === 0) return [];

  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: (bytes / total) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}
```

## Agregar linguagens de todos os repositórios

```ts
function aggregateLanguages(
  repositoryLanguages: Array<Record<string, number>>,
): Record<string, number> {
  const total: Record<string, number> = {};

  for (const languages of repositoryLanguages) {
    for (const [language, bytes] of Object.entries(languages)) {
      total[language] = (total[language] ?? 0) + bytes;
    }
  }

  return total;
}
```

## Filtros recomendados

Para representar melhor o desenvolvedor, considere excluir:

- forks;
- repositórios arquivados;
- repositórios desabilitados;
- projetos de exemplo muito pequenos;
- repositórios que o usuário optou por ocultar no WeebProfile.

Não existe um único critério oficial de “linguagem favorita”. A API só fornece os bytes por repositório.

## Custo da operação

Uma conta com 100 repositórios pode exigir:

- 1 chamada para listar os repositórios;
- até 100 chamadas para buscar linguagens.

Isso é caro. Alternativas:

1. buscar apenas os 6–12 repositórios mostrados;
2. processar em background no seu servidor;
3. armazenar resultado por várias horas;
4. atualizar somente repositórios cujo `pushed_at` mudou;
5. usar GraphQL para reduzir parte das chamadas, observando seu custo em pontos.

---

# 10. README, arquivos e conteúdo

## README do repositório

```http
GET /repos/{owner}/{repo}/readme
```

Campos úteis:

```json
{
  "name": "README.md",
  "path": "README.md",
  "sha": "...",
  "size": 1234,
  "html_url": "...",
  "download_url": "...",
  "encoding": "base64",
  "content": "..."
}
```

O conteúdo normalmente é retornado em Base64.

```ts
function decodeBase64Utf8(value: string): string {
  const normalized = value.replace(/\n/g, "");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
```

## Conteúdo de um caminho

```http
GET /repos/{owner}/{repo}/contents/{path}
```

Exemplos:

```text
GET /repos/OWNER/REPO/contents/package.json
GET /repos/OWNER/REPO/contents/src
```

Sem `path`, o endpoint retorna a raiz.

## Formatos de mídia

Para obter conteúdo bruto:

```http
Accept: application/vnd.github.raw+json
```

Para receber HTML renderizado de Markdown:

```http
Accept: application/vnd.github.html+json
```

## Segurança ao renderizar README

README é conteúdo não confiável.

Não injete HTML retornado pelo GitHub diretamente com `innerHTML` sem sanitização. Use:

- parser Markdown seguro;
- sanitizador de HTML;
- política restritiva para links e imagens;
- `rel="noopener noreferrer"` em links externos.

---

# 11. Commits e contribuidores

## Listar commits

```http
GET /repos/{owner}/{repo}/commits
```

Parâmetros úteis:

| Parâmetro | Uso |
|---|---|
| `sha` | branch ou SHA inicial |
| `path` | filtrar commits que modificaram um caminho |
| `author` | login ou e-mail do autor |
| `committer` | login ou e-mail do committer |
| `since` | início ISO 8601 |
| `until` | fim ISO 8601 |
| `per_page` | até 100 |
| `page` | página |

Exemplo:

```text
GET /repos/OWNER/REPO/commits?author=USERNAME&per_page=100
```

## Problemas ao calcular total de contribuições por commits REST

Não some commits de todos os repositórios para imitar o gráfico do GitHub. Os resultados podem divergir porque:

- autoria depende de e-mails associados à conta;
- o GitHub aplica regras próprias ao gráfico;
- commits podem não estar na branch padrão;
- forks possuem regras específicas;
- repositórios privados não são acessíveis;
- paginação completa é cara;
- commits podem ser duplicados ao analisar forks;
- o endpoint de eventos não contém o histórico completo.

Use `contributionsCollection` da GraphQL API.

## Listar contribuidores

```http
GET /repos/{owner}/{repo}/contributors
```

A resposta inclui usuários e o campo `contributions`, que representa contribuições naquele repositório segundo o cálculo do endpoint.

Use para mostrar principais contribuidores de um projeto, não para calcular o total global de um usuário.

## Estatísticas

Alguns endpoints de estatísticas podem ser calculados de forma assíncrona pelo GitHub e inicialmente retornar `202 Accepted`. Não os use no caminho crítico da página sem tratamento específico e cache.

---

# 12. Releases, branches, tags e licença

## Releases

```http
GET /repos/{owner}/{repo}/releases
GET /repos/{owner}/{repo}/releases/latest
GET /repos/{owner}/{repo}/releases/{release_id}
```

Campos úteis:

- `tag_name`;
- `name`;
- `body`;
- `draft`;
- `prerelease`;
- `published_at`;
- `html_url`;
- `assets`.

`/releases/latest` ignora drafts e normalmente busca a release mais recente considerada estável pela API.

## Branches

```http
GET /repos/{owner}/{repo}/branches
GET /repos/{owner}/{repo}/branches/{branch}
```

## Tags

```http
GET /repos/{owner}/{repo}/tags
```

## Licença

```http
GET /repos/{owner}/{repo}/license
```

O objeto principal do repositório também pode trazer um resumo em `license`.

## Tópicos

Os tópicos normalmente aparecem em `topics` no objeto do repositório. Há também endpoint específico:

```http
GET /repos/{owner}/{repo}/topics
```

---

# 13. Organizações

## Organizações públicas de um usuário

```http
GET /users/{username}/orgs
```

Esse endpoint é apropriado para o WeebProfile, mas mostra apenas as associações visíveis ao observador.

Uma pessoa pode pertencer a uma organização e escolher ocultar essa associação. Portanto:

```text
lista vazia != usuário não participa de nenhuma organização
```

## Dados de uma organização

```http
GET /orgs/{org}
```

Campos úteis:

- `login`;
- `name`;
- `avatar_url`;
- `html_url`;
- `description`;
- `company`;
- `blog`;
- `location`;
- `email`;
- `twitter_username`;
- `is_verified`;
- `public_repos`;
- `public_gists`;
- `followers`;
- `created_at`;
- `updated_at`.

## Repositórios de uma organização

```http
GET /orgs/{org}/repos
```

Parâmetros comuns:

- `type`;
- `sort`;
- `direction`;
- `per_page`;
- `page`.

## Membros públicos

```http
GET /orgs/{org}/public_members
```

## Membros da organização

```http
GET /orgs/{org}/members
```

Sem autorização adequada, a resposta pública não revela membros que esconderam a associação. Com token e permissão de organização, um membro autorizado pode receber informações adicionais.

## Regra para o WeebProfile

Nunca afirme que a lista é completa. Use texto como:

> Organizações públicas exibidas pelo GitHub.

---

# 14. Gists

## Listar gists públicos de um usuário

```http
GET /users/{username}/gists
```

## Obter um gist

```http
GET /gists/{gist_id}
```

## Campos úteis

- `id`;
- `description`;
- `public`;
- `html_url`;
- `created_at`;
- `updated_at`;
- `comments`;
- `owner`;
- `files`;
- `forks`;
- `history`.

`files` é um objeto indexado pelo nome do arquivo:

```json
{
  "files": {
    "example.ts": {
      "filename": "example.ts",
      "type": "application/typescript",
      "language": "TypeScript",
      "raw_url": "https://gist.githubusercontent.com/...",
      "size": 500,
      "truncated": false,
      "content": "console.log('hello')"
    }
  }
}
```

## Limite e truncamento

A API pode fornecer até aproximadamente 1 MB de conteúdo por arquivo dentro da resposta do gist. Quando:

```json
{
  "truncated": true
}
```

use o `raw_url` para obter o conteúdo completo.

## Gists secretos

Gists “secretos” não são listados publicamente no perfil. Eles não devem ser tratados como um mecanismo de armazenamento privado.

Para mostrar apenas o perfil público de outra pessoa, use `/users/{username}/gists`.

Para gists da conta autenticada, existe:

```http
GET /gists
```

que pode incluir dados disponíveis para aquela autenticação.

## Criar, editar ou excluir

O WeebProfile provavelmente não precisa destas operações, mas existem:

```http
POST /gists
PATCH /gists/{gist_id}
DELETE /gists/{gist_id}
```

Escrita exige autenticação e permissão apropriada.

---

# 15. Repositórios favoritados com estrela

## Listar repositórios favoritados por um usuário

```http
GET /users/{username}/starred
```

Parâmetros:

```text
sort=created|updated
direction=asc|desc
per_page=1..100
page=N
```

## Incluir data da estrela

Use:

```http
Accept: application/vnd.github.star+json
```

A resposta muda para objetos com metadados como:

```json
{
  "starred_at": "2026-07-01T12:00:00Z",
  "repo": {
    "id": 123,
    "full_name": "owner/repo"
  }
}
```

Sem esse media type, a resposta é uma lista direta de repositórios.

## Uso no WeebProfile

Pode alimentar:

- “favoritos recentes”;
- tecnologias de interesse;
- projetos recomendados;
- estatísticas de categorias favoritas.

Evite carregar toda a lista durante o primeiro paint. Uma conta pode ter milhares de estrelas.

---

# 16. Atividade pública e eventos

## Endpoint

```http
GET /users/{username}/events/public
```

Exemplo:

```text
GET /users/LucasHenriqueDiniz/events/public?per_page=30&page=1
```

## Estrutura básica

```json
{
  "id": "...",
  "type": "PushEvent",
  "actor": {
    "login": "USERNAME",
    "avatar_url": "..."
  },
  "repo": {
    "name": "OWNER/REPO",
    "url": "https://api.github.com/repos/OWNER/REPO"
  },
  "payload": {},
  "public": true,
  "created_at": "2026-07-01T12:00:00Z"
}
```

## Tipos frequentes

| Tipo | Significado aproximado |
|---|---|
| `PushEvent` | push |
| `CreateEvent` | criação de branch, tag ou repositório |
| `DeleteEvent` | exclusão de branch ou tag |
| `ForkEvent` | fork |
| `WatchEvent` | estrela adicionada |
| `IssuesEvent` | ação em issue |
| `IssueCommentEvent` | comentário |
| `PullRequestEvent` | ação em pull request |
| `PullRequestReviewEvent` | review |
| `PullRequestReviewCommentEvent` | comentário em review |
| `ReleaseEvent` | release |
| `PublicEvent` | repositório tornou-se público |
| `MemberEvent` | colaborador adicionado |
| `CommitCommentEvent` | comentário em commit |

O conteúdo de `payload` varia conforme `type`.

## Não é tempo real

A documentação informa que a latência dos eventos pode variar aproximadamente de 30 segundos a 6 horas. Portanto, não use esse endpoint para:

- notificações instantâneas;
- auditoria;
- gatilhos críticos;
- contagem exata de contribuições;
- sincronização em tempo real.

## Não confundir endpoints

```http
GET /users/{username}/events/public
```

Atividade realizada pelo usuário.

```http
GET /users/{username}/received_events/public
```

Eventos públicos recebidos no feed do usuário, relacionados ao que ele segue.

Para o WeebProfile, use o primeiro.

## Normalização de eventos

```ts
interface ActivityItem {
  id: string;
  type: string;
  repository: string;
  createdAt: string;
  action?: string;
  url?: string;
}
```

O link precisa ser construído com cuidado ou obtido buscando o recurso relacionado. Não presuma que todo evento possui URL navegável direta.

---

# 17. Calendário e estatísticas de contribuições

## Por que GraphQL

A REST API não oferece um endpoint simples equivalente ao calendário de contribuições do perfil.

Não tente reproduzi-lo usando somente:

```http
GET /users/{username}/events/public
```

O feed de eventos é recente, atrasado e não representa todas as regras do gráfico.

Use:

```graphql
user(login: $login) {
  contributionsCollection(from: $from, to: $to) {
    ...
  }
}
```

## Endpoint GraphQL

```text
POST https://api.github.com/graphql
```

Cabeçalhos:

```http
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
User-Agent: WeebProfile
```

## Consulta recomendada

```graphql
query WeebProfileContributions(
  $login: String!
  $from: DateTime!
  $to: DateTime!
) {
  user(login: $login) {
    login

    contributionsCollection(from: $from, to: $to) {
      startedAt
      endedAt
      restrictedContributionsCount
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
      totalRepositoriesWithContributedCommits

      contributionCalendar {
        totalContributions
        colors

        weeks {
          firstDay

          contributionDays {
            date
            weekday
            contributionCount
            contributionLevel
            color
          }
        }
      }

      commitContributionsByRepository(maxRepositories: 20) {
        repository {
          name
          nameWithOwner
          url
          isPrivate
          isFork
          stargazerCount
        }

        contributions(first: 100) {
          totalCount

          nodes {
            occurredAt
            commitCount
            isRestricted
          }
        }
      }
    }
  }

  rateLimit {
    cost
    remaining
    resetAt
  }
}
```

## Variáveis

```json
{
  "login": "LucasHenriqueDiniz",
  "from": "2026-01-01T00:00:00Z",
  "to": "2026-12-31T23:59:59Z"
}
```

## Requisição TypeScript

```ts
interface GraphQLErrorItem {
  message: string;
  path?: Array<string | number>;
  type?: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
): Promise<T> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "WeebProfile",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok || payload.errors?.length) {
    const message =
      payload.errors?.map((error) => error.message).join("; ") ||
      `GitHub GraphQL returned ${response.status}`;

    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error("GitHub GraphQL returned no data");
  }

  return payload.data;
}
```

## Contribuições privadas

O GraphQL pode informar:

```graphql
restrictedContributionsCount
```

Esse número representa contribuições cujo conteúdo o observador não pode acessar, quando o usuário escolheu exibir contagens privadas.

Não é possível revelar:

- nome do repositório privado;
- commit privado;
- conteúdo privado;
- organização privada;

sem autorização apropriada.

Na interface, mostre algo como:

> 24 contribuições privadas.

Não invente detalhes.

## Limite GraphQL

A GraphQL API usa pontos. Para usuários, o limite geral informado é de `5.000` pontos por hora. Cada resposta pode incluir:

```graphql
rateLimit {
  cost
  remaining
  resetAt
}
```

Uma consulta grande pode custar mais do que uma chamada REST simples. Selecione somente campos usados pela interface.

---

# 18. Paginação

A maioria das listas retorna uma parte dos resultados.

Padrão comum:

```text
per_page=30
page=1
```

Máximo comum:

```text
per_page=100
```

## Cabeçalho `Link`

Exemplo:

```http
Link: <https://api.github.com/users/USER/repos?page=2>; rel="next",
      <https://api.github.com/users/USER/repos?page=5>; rel="last"
```

Não monte a próxima URL manualmente quando o `Link` estiver disponível.

## Parser simples

```ts
function parseLinkHeader(
  header: string | null,
): Record<string, string> {
  if (!header) return {};

  const links: Record<string, string> = {};

  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>\s*;\s*rel="([^"]+)"/);

    if (match) {
      links[match[2]] = match[1];
    }
  }

  return links;
}
```

## Buscar todas as páginas

```ts
async function fetchAllPages<T>(
  initialUrl: string,
  init: RequestInit,
  maxPages = 10,
): Promise<T[]> {
  const items: T[] = [];
  let url: string | undefined = initialUrl;
  let page = 0;

  while (url && page < maxPages) {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const payload = (await response.json()) as T[];

    items.push(...payload);

    const links = parseLinkHeader(response.headers.get("link"));
    url = links.next;
    page += 1;
  }

  return items;
}
```

## Sempre defina limite interno

Não permita paginação infinita controlada pelo usuário.

Exemplo:

```ts
const MAX_REPOSITORY_PAGES = 5;
const MAX_GIST_PAGES = 2;
const MAX_EVENT_PAGES = 2;
```

---

# 19. Cache condicional com ETag

A maioria dos endpoints retorna:

```http
ETag: W/"..."
```

Armazene:

- corpo JSON;
- ETag;
- data;
- status;
- URL e parâmetros.

Na próxima requisição:

```http
If-None-Match: W/"..."
```

Se nada mudou:

```text
304 Not Modified
```

Nesse caso, reutilize o corpo salvo.

Quando a requisição condicional está corretamente autenticada e retorna `304`, ela não conta contra o limite primário da REST API.

## Exemplo

```ts
interface CacheEntry<T> {
  etag: string | null;
  value: T;
  storedAt: number;
}

async function fetchWithEtag<T>(
  url: string,
  token: string,
  cached?: CacheEntry<T>,
): Promise<CacheEntry<T>> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2026-03-10",
    "User-Agent": "WeebProfile",
  });

  if (cached?.etag) {
    headers.set("If-None-Match", cached.etag);
  }

  const response = await fetch(url, { headers });

  if (response.status === 304 && cached) {
    return {
      ...cached,
      storedAt: Date.now(),
    };
  }

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}`);
  }

  return {
    etag: response.headers.get("etag"),
    value: (await response.json()) as T,
    storedAt: Date.now(),
  };
}
```

---

# 20. Erros e códigos HTTP

| Status | Significado comum |
|---:|---|
| `200` | sucesso |
| `201` | recurso criado |
| `202` | aceito/processamento ainda pode estar ocorrendo |
| `204` | sucesso sem corpo |
| `304` | cache ainda válido |
| `400` | requisição inválida |
| `401` | token ausente, inválido ou expirado |
| `403` | proibido, limite ou política |
| `404` | não encontrado ou ocultado por falta de acesso |
| `410` | versão/recurso removido |
| `422` | validação falhou |
| `429` | excesso de requisições |

## `404` nem sempre significa inexistente

Para evitar revelar recursos privados, o GitHub pode retornar `404` quando o token não possui acesso.

## Tratamento de erro recomendado

```ts
interface GitHubErrorBody {
  message?: string;
  documentation_url?: string;
  status?: string;
}

class GitHubApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly documentationUrl?: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

async function readGitHubError(
  response: Response,
): Promise<GitHubApiError> {
  let body: GitHubErrorBody = {};

  try {
    body = (await response.json()) as GitHubErrorBody;
  } catch {
    // A resposta pode não ser JSON.
  }

  return new GitHubApiError(
    response.status,
    body.message ?? `GitHub returned ${response.status}`,
    body.documentation_url,
  );
}
```

## Retry

Faça retry automático apenas para casos temporários:

- `429`;
- alguns `502`, `503` e `504`;
- falhas de rede.

Não repita automaticamente:

- `401`;
- `404`;
- `422`.

Use backoff exponencial e respeite `Retry-After`.

---

# 21. Cliente TypeScript reutilizável

```ts
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";

interface GitHubRequestOptions {
  token?: string;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

function buildGitHubHeaders(
  token?: string,
  extra?: HeadersInit,
): Headers {
  const headers = new Headers(extra);

  headers.set("Accept", "application/vnd.github+json");
  headers.set("X-GitHub-Api-Version", GITHUB_API_VERSION);
  headers.set("User-Agent", "WeebProfile");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function githubRest<T>(
  pathOrUrl: string,
  options: GitHubRequestOptions = {},
): Promise<{
  data: T;
  etag: string | null;
  rateLimit: {
    limit: number | null;
    remaining: number | null;
    resetAt: Date | null;
    resource: string | null;
  };
}> {
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${GITHUB_API_BASE}${pathOrUrl}`;

  const response = await fetch(url, {
    method: "GET",
    headers: buildGitHubHeaders(
      options.token,
      options.headers,
    ),
    signal: options.signal,
  });

  if (!response.ok) {
    throw await readGitHubError(response);
  }

  const reset = response.headers.get("x-ratelimit-reset");

  return {
    data: (await response.json()) as T,
    etag: response.headers.get("etag"),
    rateLimit: {
      limit: toOptionalNumber(
        response.headers.get("x-ratelimit-limit"),
      ),
      remaining: toOptionalNumber(
        response.headers.get("x-ratelimit-remaining"),
      ),
      resetAt: reset
        ? new Date(Number(reset) * 1000)
        : null,
      resource: response.headers.get("x-ratelimit-resource"),
    },
  };
}

function toOptionalNumber(
  value: string | null,
): number | null {
  if (value === null) return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}
```

## Métodos específicos

```ts
function encodePathPart(value: string): string {
  return encodeURIComponent(value);
}

async function getUser(
  username: string,
  token?: string,
): Promise<GitHubUser> {
  const user = encodePathPart(username);

  return (
    await githubRest<GitHubUser>(
      `/users/${user}`,
      { token },
    )
  ).data;
}

async function getUserRepositories(
  username: string,
  token?: string,
): Promise<GitHubRepository[]> {
  const user = encodePathPart(username);

  const query = new URLSearchParams({
    type: "owner",
    sort: "pushed",
    direction: "desc",
    per_page: "100",
  });

  return (
    await githubRest<GitHubRepository[]>(
      `/users/${user}/repos?${query}`,
      { token },
    )
  ).data;
}

async function getRepositoryLanguages(
  owner: string,
  repository: string,
  token?: string,
): Promise<Record<string, number>> {
  const safeOwner = encodePathPart(owner);
  const safeRepo = encodePathPart(repository);

  return (
    await githubRest<Record<string, number>>(
      `/repos/${safeOwner}/${safeRepo}/languages`,
      { token },
    )
  ).data;
}
```

---

# 22. Agregador de dados do WeebProfile

## Interfaces resumidas

```ts
interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

interface GitHubOrganizationSummary {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
  url: string;
}

interface GitHubGistSummary {
  id: string;
  description: string | null;
  public: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  files: Record<
    string,
    {
      filename: string;
      language: string | null;
      type: string;
      size: number;
      raw_url: string;
    }
  >;
}

interface GitHubSocialAccount {
  provider: string;
  url: string;
}
```

## Buscar dados principais em paralelo

```ts
interface WeebProfileGitHubData {
  user: GitHubUser;
  repositories: GitHubRepository[];
  organizations: GitHubOrganizationSummary[];
  gists: GitHubGistSummary[];
  socialAccounts: GitHubSocialAccount[];
  languages: Array<{
    name: string;
    bytes: number;
    percentage: number;
  }>;
}

async function getWeebProfileGitHubData(
  username: string,
  token: string,
): Promise<WeebProfileGitHubData> {
  const safeUsername = encodePathPart(username);

  const [
    userResponse,
    repositoriesResponse,
    organizationsResponse,
    gistsResponse,
    socialResponse,
  ] = await Promise.all([
    githubRest<GitHubUser>(
      `/users/${safeUsername}`,
      { token },
    ),
    githubRest<GitHubRepository[]>(
      `/users/${safeUsername}/repos?type=owner&sort=pushed&direction=desc&per_page=100`,
      { token },
    ),
    githubRest<GitHubOrganizationSummary[]>(
      `/users/${safeUsername}/orgs?per_page=100`,
      { token },
    ),
    githubRest<GitHubGistSummary[]>(
      `/users/${safeUsername}/gists?per_page=30`,
      { token },
    ),
    githubRest<GitHubSocialAccount[]>(
      `/users/${safeUsername}/social_accounts?per_page=100`,
      { token },
    ),
  ]);

  const repositories = repositoriesResponse.data
    .filter((repo) => !repo.fork && !repo.disabled)
    .slice(0, 12);

  // Limite a concorrência em produção. Este Promise.all é aceitável
  // para uma lista pequena previamente limitada.
  const languageMaps = await Promise.all(
    repositories.map(async (repo) => {
      const [owner, name] = repo.full_name.split("/", 2);

      return getRepositoryLanguages(owner, name, token);
    }),
  );

  const aggregate = aggregateLanguages(languageMaps);

  return {
    user: userResponse.data,
    repositories,
    organizations: organizationsResponse.data,
    gists: gistsResponse.data,
    socialAccounts: socialResponse.data,
    languages: languagePercentages(aggregate),
  };
}
```

## Controle de concorrência

Não use `Promise.all` com centenas de repositórios.

Exemplo simples:

```ts
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;

      if (index >= items.length) return;

      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );

  await Promise.all(workers);

  return results;
}
```

Uso:

```ts
const languages = await mapWithConcurrency(
  repositories,
  4,
  async (repo) => {
    const [owner, name] = repo.full_name.split("/", 2);

    return getRepositoryLanguages(owner, name, token);
  },
);
```

---

# 23. Modelo normalizado recomendado

Não passe as respostas brutas do GitHub diretamente para toda a aplicação.

```ts
interface WeebProfileGitHub {
  identity: {
    githubId: number;
    login: string;
    displayName: string;
    avatarUrl: string;
    profileUrl: string;
    bio?: string;
    location?: string;
    company?: string;
    website?: string;
    accountCreatedAt: string;
  };

  counts: {
    publicRepositories: number;
    publicGists: number;
    followers: number;
    following: number;
    totalContributions?: number;
    commits?: number;
    issues?: number;
    pullRequests?: number;
    pullRequestReviews?: number;
    privateContributions?: number;
  };

  repositories: Array<{
    id: number;
    name: string;
    fullName: string;
    description?: string;
    url: string;
    homepage?: string;
    stars: number;
    forks: number;
    openIssuesAndPullRequests: number;
    primaryLanguage?: string;
    topics: string[];
    isFork: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    pushedAt?: string;
  }>;

  languageStats: Array<{
    name: string;
    bytes: number;
    percentage: number;
  }>;

  organizations: Array<{
    login: string;
    avatarUrl: string;
    description?: string;
    profileUrl: string;
  }>;

  gists: Array<{
    id: string;
    description?: string;
    url: string;
    files: Array<{
      name: string;
      language?: string;
      size: number;
      rawUrl: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;

  socialAccounts: Array<{
    provider: string;
    url: string;
  }>;

  contributionCalendar?: Array<{
    date: string;
    count: number;
    level: string;
    color: string;
  }>;

  fetchedAt: string;
}
```

## Vantagens

- desacopla a interface da resposta do GitHub;
- facilita cache e versionamento;
- remove campos desnecessários;
- permite combinar REST e GraphQL;
- simplifica testes;
- evita espalhar nomes `snake_case`;
- permite trocar a origem no futuro.

---

# 24. Arquitetura recomendada para Cloudflare

## Fluxo

```text
Frontend WeebProfile
        |
        v
/api/github/profile/:username
        |
        +--> Cache API / KV / D1
        |
        +--> GitHub REST API
        |
        +--> GitHub GraphQL API
```

## Function/Worker

Responsabilidades:

1. validar `username`;
2. bloquear entrada malformada;
3. consultar cache;
4. buscar GitHub quando necessário;
5. normalizar respostas;
6. remover campos sensíveis;
7. armazenar ETag e dados;
8. devolver JSON compacto;
9. definir cache HTTP;
10. tratar rate limit.

## Validação de username

Um login do GitHub não deve ser usado diretamente em caminho sem validação/escape.

```ts
const GITHUB_LOGIN_PATTERN =
  /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;

function assertGitHubLogin(value: string): void {
  if (!GITHUB_LOGIN_PATTERN.test(value)) {
    throw new Error("Invalid GitHub username");
  }
}
```

Mesmo após validação, use:

```ts
encodeURIComponent(username)
```

## Headers para o navegador

Resposta de sua API:

```http
Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400
Content-Type: application/json; charset=utf-8
```

Significado aproximado:

- navegador pode usar por 5 minutos;
- cache compartilhado pode manter por 1 hora;
- dado antigo pode ser servido enquanto atualiza por até 24 horas.

Adapte conforme a frequência de atualização desejada.

## Token no Cloudflare

Configure como secret, não em arquivo commitado.

Exemplo conceitual:

```ts
interface Env {
  GITHUB_TOKEN: string;
}
```

No Worker:

```ts
export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    // env.GITHUB_TOKEN fica no servidor.
    return new Response("...");
  },
};
```

---

# 25. Estratégia de cache

## TTL sugerido

| Recurso | TTL sugerido |
|---|---:|
| perfil | 30 min–6 h |
| repositórios | 15 min–2 h |
| linguagens | 6–24 h |
| organizações | 6–24 h |
| gists | 1–6 h |
| redes sociais | 6–24 h |
| estrelas | 1–6 h |
| atividade recente | 5–15 min |
| contribuições | 15–60 min |
| README | 1–24 h |

Esses valores não são exigências do GitHub. São uma política recomendada para o produto.

## Chave de cache

Inclua:

- versão interna do schema;
- username normalizado;
- endpoint;
- parâmetros;
- período de contribuições.

Exemplo:

```text
github:v2:profile:lucashenriquediniz
github:v2:repos:lucashenriquediniz:type-owner
github:v2:contributions:lucashenriquediniz:2026
```

## Cache negativo

Um username inexistente pode ser armazenado por pouco tempo:

```text
404 por 1–5 minutos
```

Não use cache negativo longo, pois a conta pode ser criada ou o erro pode depender de autorização.

## Stale-while-revalidate

Quando o GitHub estiver indisponível ou limitado:

1. devolva cache antigo;
2. marque `stale: true`;
3. não derrube o perfil inteiro;
4. atualize depois quando possível.

Exemplo de metadata:

```json
{
  "data": {},
  "meta": {
    "fetchedAt": "2026-07-19T12:00:00Z",
    "stale": false,
    "source": "github"
  }
}
```

---

# 26. O que não fazer

## Não exponha token

Errado:

```ts
const token = import.meta.env.VITE_GITHUB_TOKEN;
```

## Não calcule contribuições pelo feed de eventos

Errado:

```text
total de PushEvent = total de commits
```

Eventos não são um histórico completo nem seguem exatamente as regras do gráfico.

## Não faça uma chamada de linguagens para cada repositório em toda visita

Armazene o resultado.

## Não use `language` do repositório como distribuição completa

`language` contém apenas a linguagem principal.

## Não interprete `watchers_count` como watchers reais

Use:

- `stargazers_count` para estrelas;
- `subscribers_count` para watchers/assinantes.

## Não confie que organizações públicas sejam todas as organizações

A associação pode estar oculta.

## Não confie que `email` exista

Ele costuma ser `null`.

## Não renderize README ou bio como HTML inseguro

Conteúdo de perfil é entrada do usuário.

## Não use URLs manualmente analisadas como fonte de IDs

Prefira campos próprios como:

- `id`;
- `number`;
- `full_name`;
- `node_id`;
- `html_url`.

## Não ignore paginação

Uma primeira página com 30 itens não representa necessariamente o total.

## Não faça retry contínuo após `403`/`429`

Respeite os cabeçalhos de limite e use backoff.

---

# 27. Checklist de implementação

## MVP

- [ ] Criar endpoint interno `/api/github/profile/:username`.
- [ ] Guardar `GITHUB_TOKEN` somente no backend.
- [ ] Definir `X-GitHub-Api-Version: 2026-03-10`.
- [ ] Buscar `GET /users/{username}`.
- [ ] Buscar `GET /users/{username}/repos`.
- [ ] Buscar `GET /users/{username}/orgs`.
- [ ] Buscar `GET /users/{username}/gists`.
- [ ] Buscar `GET /users/{username}/social_accounts`.
- [ ] Normalizar a resposta.
- [ ] Adicionar cache.
- [ ] Tratar `404`, `403`, `429` e timeout.

## Estatísticas

- [ ] Filtrar forks e arquivados conforme regra do produto.
- [ ] Buscar linguagens somente dos principais repositórios.
- [ ] Agregar bytes por linguagem.
- [ ] Converter bytes em porcentagens.
- [ ] Definir algoritmo próprio de “top repositories”.
- [ ] Documentar que rankings são do WeebProfile, não do GitHub.

## Contribuições

- [ ] Criar consulta GraphQL.
- [ ] Definir período `from`/`to`.
- [ ] Buscar `contributionCalendar`.
- [ ] Mostrar `restrictedContributionsCount` sem revelar detalhes.
- [ ] Ler `rateLimit.cost` e `rateLimit.remaining`.
- [ ] Não usar eventos para total anual.

## Segurança

- [ ] Não usar `VITE_GITHUB_TOKEN`.
- [ ] Validar username.
- [ ] Escapar URLs e textos.
- [ ] Sanitizar Markdown/HTML.
- [ ] Limitar páginas e concorrência.
- [ ] Limitar requisições ao endpoint interno.
- [ ] Remover dados privados antes de responder ao navegador.
- [ ] Registrar erros sem registrar o token.

## Resiliência

- [ ] Usar timeout com `AbortController`.
- [ ] Usar ETag.
- [ ] Servir cache antigo em falha temporária.
- [ ] Respeitar `Retry-After`.
- [ ] Mostrar estado parcial quando uma fonte secundária falhar.
- [ ] Monitorar consumo do rate limit.

---

# 28. Referências oficiais

## Visão geral

- [Documentação do GitHub](https://docs.github.com/pt)
- [Introdução à REST API](https://docs.github.com/pt/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2026-03-10)
- [Versões da REST API](https://docs.github.com/pt/rest/about-the-rest-api/api-versions?apiVersion=2026-03-10)
- [Alterações incompatíveis](https://docs.github.com/pt/rest/about-the-rest-api/breaking-changes?apiVersion=2026-03-10)

## Autenticação, limites e uso correto

- [Autenticação REST](https://docs.github.com/pt/rest/authentication/authenticating-to-the-rest-api?apiVersion=2026-03-10)
- [Limites da REST API](https://docs.github.com/pt/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10)
- [Paginação REST](https://docs.github.com/pt/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2026-03-10)
- [Boas práticas REST](https://docs.github.com/pt/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10)

## Usuários

- [Endpoints de usuários](https://docs.github.com/pt/rest/users/users?apiVersion=2026-03-10)
- [Seguidores](https://docs.github.com/pt/rest/users/followers?apiVersion=2026-03-10)
- [Contas de redes sociais](https://docs.github.com/pt/rest/users/social-accounts?apiVersion=2026-03-10)

## Repositórios

- [Endpoints de repositórios](https://docs.github.com/pt/rest/repos/repos?apiVersion=2026-03-10)
- [Conteúdo de repositórios](https://docs.github.com/pt/rest/repos/contents?apiVersion=2026-03-10)
- [Commits](https://docs.github.com/pt/rest/commits/commits?apiVersion=2026-03-10)
- [Releases](https://docs.github.com/pt/rest/releases/releases?apiVersion=2026-03-10)
- [Branches](https://docs.github.com/pt/rest/branches/branches?apiVersion=2026-03-10)

## Organizações, gists e atividade

- [Organizações](https://docs.github.com/pt/rest/orgs/orgs?apiVersion=2026-03-10)
- [Membros de organizações](https://docs.github.com/pt/rest/orgs/members?apiVersion=2026-03-10)
- [Gists](https://docs.github.com/pt/rest/gists/gists?apiVersion=2026-03-10)
- [Eventos](https://docs.github.com/pt/rest/activity/events?apiVersion=2026-03-10)
- [Estrelas](https://docs.github.com/pt/rest/activity/starring?apiVersion=2026-03-10)

## GraphQL

- [Guias da GraphQL API](https://docs.github.com/pt/graphql/guides)
- [Referência de usuários e contribuições](https://docs.github.com/en/graphql/reference/users)
- [Referência de commits](https://docs.github.com/en/graphql/reference/commits)
- [Limites GraphQL](https://docs.github.com/pt/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)
