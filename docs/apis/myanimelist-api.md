# MyAnimeList API v2 — Guia detalhado de integração

> Guia técnico em português sobre a API REST oficial da MyAnimeList (MAL).
>
> **Base URL:** `https://api.myanimelist.net/v2`  
> **Revisão deste documento:** 19 de julho de 2026  
> **Formato predominante:** JSON sobre HTTPS  
> **Autorização de usuário:** OAuth 2.0 Authorization Code + PKCE  
> **Acesso público:** cabeçalho `X-MAL-CLIENT-ID`

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Versionamento](#2-versionamento)
3. [Registro de uma aplicação](#3-registro-de-uma-aplicação)
4. [Autenticação e autorização](#4-autenticação-e-autorização)
5. [OAuth 2.0 com PKCE, passo a passo](#5-oauth-20-com-pkce-passo-a-passo)
6. [Estrutura das requisições](#6-estrutura-das-requisições)
7. [Seleção de campos com `fields`](#7-seleção-de-campos-com-fields)
8. [Paginação](#8-paginação)
9. [Erros, limites e retentativas](#9-erros-limites-e-retentativas)
10. [Referência rápida dos endpoints](#10-referência-rápida-dos-endpoints)
11. [Endpoints de anime](#11-endpoints-de-anime)
12. [Lista de anime do usuário](#12-lista-de-anime-do-usuário)
13. [Endpoints de mangá](#13-endpoints-de-mangá)
14. [Lista de mangá do usuário](#14-lista-de-mangá-do-usuário)
15. [Endpoints de usuário](#15-endpoints-de-usuário)
16. [Endpoints de fórum](#16-endpoints-de-fórum)
17. [Principais modelos de resposta](#17-principais-modelos-de-resposta)
18. [Enumerações importantes](#18-enumerações-importantes)
19. [Exemplos em JavaScript/TypeScript](#19-exemplos-em-javascripttypescript)
20. [Exemplos com `curl`](#20-exemplos-com-curl)
21. [Arquitetura recomendada](#21-arquitetura-recomendada)
22. [Segurança](#22-segurança)
23. [Quirks e inconsistências conhecidas](#23-quirks-e-inconsistências-conhecidas)
24. [Checklist de implementação](#24-checklist-de-implementação)
25. [Fontes](#25-fontes)

---

# 1. Visão geral

A MyAnimeList API v2 é a API REST oficial para consultar dados do catálogo da MyAnimeList e, mediante autorização do usuário, ler e modificar informações pessoais como:

- lista de animes;
- lista de mangás;
- status de acompanhamento;
- notas;
- progresso em episódios, capítulos e volumes;
- datas de início e conclusão;
- tags e comentários;
- recomendações personalizadas;
- estatísticas do próprio usuário.

Os grupos principais da API são:

| Grupo | Exemplos |
|---|---|
| Anime | pesquisa, detalhes, rankings, temporadas e sugestões |
| Mangá | pesquisa, detalhes e rankings |
| Usuário | perfil do usuário autenticado |
| Lista de anime | leitura, criação/atualização e remoção |
| Lista de mangá | leitura, criação/atualização e remoção |
| Fórum | boards, tópicos e mensagens de um tópico |

A API usa IDs numéricos da própria MyAnimeList. Por exemplo:

```text
https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood
                               └── anime_id = 5114
```

## 1.1 Base URL

Todas as rotas descritas neste documento são relativas a:

```text
https://api.myanimelist.net/v2
```

Exemplo completo:

```text
GET https://api.myanimelist.net/v2/anime/5114
```

## 1.2 Formato de resposta

A maior parte das respostas é JSON:

```http
HTTP/2 200 OK
Content-Type: application/json; charset=UTF-8
```

```json
{
  "id": 5114,
  "title": "Fullmetal Alchemist: Brotherhood",
  "main_picture": {
    "medium": "https://cdn.myanimelist.net/...",
    "large": "https://cdn.myanimelist.net/..."
  }
}
```

As operações que atualizam listas recebem dados em:

```http
Content-Type: application/x-www-form-urlencoded
```

Não envie JSON nesses endpoints de atualização, a menos que a documentação oficial passe a declarar suporte explícito.

---

# 2. Versionamento

A versão principal faz parte do caminho da URL:

```text
https://api.myanimelist.net/v2
                              └─ versão principal
```

Isso significa que:

- todos os endpoints deste documento pertencem à versão `v2`;
- uma futura versão incompatível pode aparecer sob outro prefixo, como `/v3`;
- o número `v2` da API não é a mesma coisa que a versão do documento OpenAPI/Swagger usado para renderizar a documentação;
- não remova o segmento `/v2` da URL;
- não use rotas antigas ou privadas encontradas em aplicativos, scraping ou repositórios não oficiais como se fossem parte da API pública v2.

## 2.1 Compatibilidade

Mesmo dentro de `v2`, sua aplicação deve ser defensiva:

- ignore campos JSON desconhecidos;
- trate campos opcionais ou anuláveis;
- não dependa da ordem das propriedades;
- não presuma que um campo solicitado sempre estará presente;
- valide enums, mas registre valores desconhecidos antes de falhar;
- não acople sua aplicação à representação textual de erros.

Uma alteração aditiva, como um novo campo, não deveria quebrar um cliente bem implementado.

---

# 3. Registro de uma aplicação

Antes de chamar a API, registre um cliente em:

```text
https://myanimelist.net/apiconfig
```

O painel fornece pelo menos um:

```text
Client ID
```

Dependendo do tipo de aplicação, também pode fornecer:

```text
Client Secret
```

## 3.1 Campos normalmente solicitados

O formulário de registro pode pedir:

- nome da aplicação;
- tipo da aplicação;
- nome do desenvolvedor ou empresa;
- descrição;
- URL da aplicação;
- Redirect URI do OAuth;
- informações de contato.

Para desenvolvimento local, use uma URL de callback controlada por você, por exemplo:

```text
http://localhost:3000/auth/mal/callback
```

A URI usada no fluxo OAuth deve corresponder à registrada no painel.

## 3.2 Tipos de cliente

Em termos práticos:

- uma aplicação web com backend consegue proteger um `client_secret`;
- uma SPA, aplicação desktop ou mobile é um cliente público e não deve embutir segredos;
- qualquer segredo distribuído no JavaScript do navegador, em APK, executável desktop ou extensão deve ser considerado exposto.

## 3.3 Credenciais

Nunca versione credenciais:

```gitignore
.env
.env.*
!.env.example
```

Exemplo de `.env.example`:

```dotenv
MAL_CLIENT_ID=
MAL_CLIENT_SECRET=
MAL_REDIRECT_URI=http://localhost:3000/auth/mal/callback
```

---

# 4. Autenticação e autorização

A MAL oferece dois modos principais de acesso.

## 4.1 Dados públicos com `X-MAL-CLIENT-ID`

Para consultar dados públicos, envie o Client ID no cabeçalho:

```http
X-MAL-CLIENT-ID: SEU_CLIENT_ID
```

Exemplo:

```bash
curl "https://api.myanimelist.net/v2/anime?q=one%20piece&limit=5" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

Esse modo é adequado para:

- pesquisa de anime;
- detalhes públicos;
- rankings;
- anime por temporada;
- pesquisa e detalhes de mangá;
- listas públicas de outros usuários, quando a privacidade permite.

Ele não representa um usuário autenticado e não deve ser usado para modificar listas.

## 4.2 Token OAuth com `Authorization: Bearer`

Para acessar dados pessoais ou modificar a lista do usuário:

```http
Authorization: Bearer ACCESS_TOKEN
```

Exemplo:

```bash
curl "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

O token é associado ao usuário que autorizou a aplicação.

## 4.3 Matriz simplificada de autenticação

| Operação | Client ID | OAuth Bearer |
|---|---:|---:|
| Pesquisar anime/mangá | Sim | Sim |
| Consultar detalhes públicos | Sim | Sim |
| Rankings e temporadas | Sim | Sim |
| Lista pública de outro usuário | Sim | Sim |
| Perfil `/users/@me` | Não | Sim |
| Sugestões personalizadas | Não | Sim |
| Ler a própria lista privada | Não | Sim |
| Atualizar lista | Não | Sim |
| Remover item da lista | Não | Sim |
| Receber `my_list_status` pessoal | Não | Sim |

Quando uma requisição autenticada solicita `my_list_status`, a API pode incluir o estado daquele título na lista do usuário.

---

# 5. OAuth 2.0 com PKCE, passo a passo

A MyAnimeList usa o Authorization Code Grant com PKCE.

Endpoints OAuth:

```text
Autorização:
https://myanimelist.net/v1/oauth2/authorize

Token e refresh:
https://myanimelist.net/v1/oauth2/token
```

> Atenção: os endpoints OAuth usam `/v1/oauth2`, enquanto a API de dados usa `api.myanimelist.net/v2`.

## 5.1 Particularidade importante da MAL

A documentação da MAL declara suporte ao método PKCE:

```text
plain
```

Portanto:

```text
code_challenge = code_verifier
```

Não presuma que `S256`, embora seja o método recomendado no padrão PKCE moderno, seja aceito pela MAL. Testes e documentação disponíveis até julho de 2026 continuam indicando `plain`.

## 5.2 Gere `state` e `code_verifier`

O `code_verifier` deve ser uma string aleatória de alta entropia, normalmente entre 43 e 128 caracteres URL-safe.

Exemplo Node.js:

```ts
import crypto from "node:crypto";

export function randomUrlSafe(bytes = 64): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

const state = randomUrlSafe(32);
const codeVerifier = randomUrlSafe(64).slice(0, 128);

// A MAL suporta PKCE plain:
const codeChallenge = codeVerifier;
```

Armazene temporariamente, vinculado à sessão do navegador:

```ts
{
  state,
  codeVerifier,
  createdAt
}
```

Não confunda:

- `state`: protege a transação contra CSRF e troca de sessão;
- `code_verifier`: prova que quem troca o authorization code é o mesmo cliente que iniciou o fluxo.

## 5.3 Construa a URL de autorização

Parâmetros principais:

| Parâmetro | Uso |
|---|---|
| `response_type` | deve ser `code` |
| `client_id` | Client ID registrado |
| `redirect_uri` | callback registrado |
| `code_challenge` | igual ao verifier no modo `plain` |
| `code_challenge_method` | `plain` |
| `state` | valor aleatório vinculado à sessão |

Exemplo:

```ts
const params = new URLSearchParams({
  response_type: "code",
  client_id: process.env.MAL_CLIENT_ID!,
  redirect_uri: process.env.MAL_REDIRECT_URI!,
  code_challenge: codeChallenge,
  code_challenge_method: "plain",
  state,
});

const authorizationUrl =
  `https://myanimelist.net/v1/oauth2/authorize?${params.toString()}`;
```

Redirecione o usuário para essa URL.

## 5.4 Callback

Após o usuário aprovar, a MAL redireciona para algo como:

```text
http://localhost:3000/auth/mal/callback?code=CODIGO&state=ESTADO
```

No callback:

1. leia `code`;
2. leia `state`;
3. recupere o `state` armazenado na sessão;
4. compare os dois com comparação segura;
5. recupere o `code_verifier`;
6. invalide a transação para impedir replay;
7. troque o `code` por tokens.

Nunca prossiga se o `state` não corresponder.

## 5.5 Troca do código por tokens

Requisição:

```http
POST https://myanimelist.net/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded
```

Corpo:

```text
client_id=...
client_secret=...
grant_type=authorization_code
code=...
code_verifier=...
redirect_uri=...
```

Exemplo `curl`:

```bash
curl -X POST "https://myanimelist.net/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_id=SEU_CLIENT_ID" \
  --data-urlencode "client_secret=SEU_CLIENT_SECRET" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=CODIGO_RECEBIDO" \
  --data-urlencode "code_verifier=VERIFIER_ORIGINAL" \
  --data-urlencode "redirect_uri=http://localhost:3000/auth/mal/callback"
```

Resposta típica:

```json
{
  "token_type": "Bearer",
  "expires_in": 2678400,
  "access_token": "eyJ...",
  "refresh_token": "def..."
}
```

## 5.6 Renovação com refresh token

```http
POST https://myanimelist.net/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded
```

```bash
curl -X POST "https://myanimelist.net/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_id=SEU_CLIENT_ID" \
  --data-urlencode "client_secret=SEU_CLIENT_SECRET" \
  --data-urlencode "grant_type=refresh_token" \
  --data-urlencode "refresh_token=SEU_REFRESH_TOKEN"
```

Salve atomicamente qualquer novo `refresh_token` retornado.

## 5.7 Duração de tokens

Há uma discrepância histórica relevante:

- textos antigos da documentação mencionam acesso de aproximadamente uma hora e refresh de aproximadamente um mês;
- respostas reais observadas em 2026 retornam frequentemente `expires_in: 2678400`, equivalente a 31 dias, para o access token.

A regra correta para o cliente é:

```text
use sempre expires_in retornado pela resposta
```

Não fixe a duração no código.

---

# 6. Estrutura das requisições

## 6.1 GET público

```http
GET /v2/anime/5114?fields=id,title,mean,genres
Host: api.myanimelist.net
X-MAL-CLIENT-ID: ...
Accept: application/json
```

## 6.2 GET autenticado

```http
GET /v2/users/@me/animelist?status=watching&limit=100&fields=list_status,num_episodes
Host: api.myanimelist.net
Authorization: Bearer ...
Accept: application/json
```

## 6.3 Atualização de lista

```http
PATCH /v2/anime/5114/my_list_status
Host: api.myanimelist.net
Authorization: Bearer ...
Content-Type: application/x-www-form-urlencoded

status=completed&score=10&num_watched_episodes=64
```

## 6.4 Codificação

- Query string: URL encoded.
- Corpo de atualização: `application/x-www-form-urlencoded`.
- Resposta: JSON UTF-8.
- Datas de lista: `YYYY-MM-DD`.
- Timestamps: ISO 8601.
- Booleanos em formulário: prefira `true` e `false`.

---

# 7. Seleção de campos com `fields`

A MAL não retorna todos os campos por padrão.

Sem `fields`, um item de catálogo normalmente contém apenas:

```json
{
  "id": 5114,
  "title": "Fullmetal Alchemist: Brotherhood",
  "main_picture": {
    "medium": "...",
    "large": "..."
  }
}
```

Para pedir dados adicionais:

```text
?fields=mean,rank,popularity,genres,num_episodes
```

Exemplo:

```bash
curl "https://api.myanimelist.net/v2/anime/5114?fields=alternative_titles,synopsis,mean,rank,popularity,genres,num_episodes,studios" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

## 7.1 Sintaxe aninhada

É possível selecionar campos internos:

```text
fields=authors{first_name,last_name}
```

Ou:

```text
fields=list_status{status,score,num_episodes_watched}
```

Exemplo combinado:

```text
fields=title,mean,genres,list_status{status,score,updated_at}
```

## 7.2 `node`, `list_status` e `my_list_status`

Em endpoints paginados de usuário:

```json
{
  "data": [
    {
      "node": {
        "id": 5114,
        "title": "Fullmetal Alchemist: Brotherhood"
      },
      "list_status": {
        "status": "completed",
        "score": 10
      }
    }
  ]
}
```

Para receber `list_status`, solicite esse campo.

Nos endpoints de detalhes de anime e mangá, o estado pessoal costuma aparecer como:

```text
my_list_status
```

Esse campo só faz sentido com token OAuth de usuário e pode ser omitido quando:

- a requisição usa apenas Client ID;
- o usuário não autorizou;
- o campo não foi pedido;
- o item não está na lista.

## 7.3 Campos caros

Alguns campos detalhados aumentam bastante a resposta:

- `pictures`;
- `background`;
- `related_anime`;
- `related_manga`;
- `recommendations`;
- `statistics`.

Peça-os apenas em páginas de detalhes, não em grades com centenas de itens.

## 7.4 Estratégia recomendada

Para listagens:

```text
id,title,main_picture,mean,media_type,status,start_season,genres
```

Para detalhes de anime:

```text
alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,
num_list_users,num_scoring_users,media_type,status,genres,num_episodes,
start_season,broadcast,source,average_episode_duration,rating,pictures,
background,related_anime,related_manga,recommendations,studios,statistics,
my_list_status
```

Para detalhes de mangá:

```text
alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,
num_list_users,num_scoring_users,media_type,status,genres,num_volumes,
num_chapters,authors,pictures,background,related_anime,related_manga,
recommendations,serialization,my_list_status
```

---

# 8. Paginação

Endpoints de coleção usam:

```text
limit
offset
```

Exemplo:

```text
GET /anime?q=naruto&limit=20&offset=40
```

Isso solicita 20 itens começando no deslocamento 40.

## 8.1 Resposta paginada

```json
{
  "data": [
    {
      "node": {
        "id": 20,
        "title": "Naruto"
      }
    }
  ],
  "paging": {
    "previous": "https://api.myanimelist.net/v2/anime?offset=20&...",
    "next": "https://api.myanimelist.net/v2/anime?offset=60&..."
  }
}
```

`paging.next` e `paging.previous` são URLs completas.

## 8.2 Limites máximos observados/documentados

| Endpoint | Máximo conhecido de `limit` |
|---|---:|
| Pesquisa de anime | 100 |
| Detalhes | não paginado |
| Pesquisa de mangá | 100 |
| Ranking de anime | 500 |
| Ranking de mangá | 500 |
| Anime por temporada | 500 |
| Sugestões | 100 |
| Lista de anime de usuário | 1000 |
| Lista de mangá de usuário | 1000 |

A API pode alterar limites. Trate `400` como indicação de parâmetros inválidos e reduza o lote.

## 8.3 Percorrendo todas as páginas

```ts
type PagedResponse<T> = {
  data: T[];
  paging?: {
    previous?: string;
    next?: string;
  };
};

async function collectAll<T>(
  firstUrl: string,
  headers: HeadersInit,
  maxItems = 20_000,
): Promise<T[]> {
  const items: T[] = [];
  let url: string | undefined = firstUrl;

  while (url && items.length < maxItems) {
    const parsed = new URL(url);

    // Evita enviar o Bearer token para um host injetado na resposta.
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "api.myanimelist.net"
    ) {
      throw new Error(`URL de paginação não confiável: ${url}`);
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`MAL ${response.status}: ${await response.text()}`);
    }

    const page = (await response.json()) as PagedResponse<T>;
    items.push(...page.data);
    url = page.paging?.next;
  }

  return items.slice(0, maxItems);
}
```

Validar o host da URL de paginação impede vazamento do token caso uma resposta malformada ou intermediário malicioso injete uma URL externa.

---

# 9. Erros, limites e retentativas

## 9.1 Corpo de erro

Formato comum:

```json
{
  "error": "invalid_token",
  "message": "The access token is invalid"
}
```

Ou:

```json
{
  "error": "forbidden",
  "message": ""
}
```

## 9.2 Códigos HTTP relevantes

| Código | Significado provável |
|---:|---|
| `200` | sucesso |
| `400` | parâmetro ausente, inválido ou fora do limite |
| `401` | token ausente, inválido ou expirado |
| `403` | proibido, lista privada, bloqueio antiabuso ou credencial inadequada |
| `404` | anime, mangá, usuário ou tópico não encontrado |
| `429` | excesso de requisições, quando usado pelo servidor |
| `500–599` | falha temporária no servidor |

## 9.3 Rate limit

A MAL não publica uma política de rate limit suficientemente clara para ser tratada como contrato estável.

Prática segura:

- mantenha baixa concorrência;
- use cache;
- evite repetir chamadas idênticas;
- comece em aproximadamente 1 requisição por segundo em processos de coleta;
- implemente backoff exponencial;
- respeite `Retry-After`, quando presente;
- trate tanto `429` quanto determinados `403` temporários como possível antiabuso;
- não faça scraping paralelo agressivo usando a API.

## 9.4 Backoff

Exemplo:

```ts
const RETRYABLE_STATUS = new Set([403, 429, 500, 502, 503, 504]);

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxAttempts = 5,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, init);

      if (!RETRYABLE_STATUS.has(response.status) || attempt === maxAttempts) {
        return response;
      }

      const retryAfter = response.headers.get("retry-after");
      const serverDelay = retryAfter ? Number(retryAfter) * 1000 : 0;
      const exponential = 500 * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      const delay = Math.max(serverDelay, exponential + jitter);

      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 500 * 2 ** (attempt - 1)),
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Falha desconhecida ao chamar a MAL");
}
```

Não repita automaticamente uma mutação sem considerar idempotência.

---

# 10. Referência rápida dos endpoints

Todas as rotas abaixo usam a base:

```text
https://api.myanimelist.net/v2
```

## 10.1 Anime

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/anime` | pesquisar anime |
| `GET` | `/anime/{anime_id}` | detalhes de anime |
| `GET` | `/anime/ranking` | ranking de anime |
| `GET` | `/anime/season/{year}/{season}` | anime de uma temporada |
| `GET` | `/anime/suggestions` | sugestões personalizadas |

## 10.2 Lista de anime

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/users/{user_name}/animelist` | lista de anime |
| `PATCH`/`PUT` | `/anime/{anime_id}/my_list_status` | adicionar ou atualizar |
| `DELETE` | `/anime/{anime_id}/my_list_status` | remover da lista |

## 10.3 Mangá

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/manga` | pesquisar mangá |
| `GET` | `/manga/{manga_id}` | detalhes de mangá |
| `GET` | `/manga/ranking` | ranking de mangá |

## 10.4 Lista de mangá

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/users/{user_name}/mangalist` | lista de mangá |
| `PATCH`/`PUT` | `/manga/{manga_id}/my_list_status` | adicionar ou atualizar |
| `DELETE` | `/manga/{manga_id}/my_list_status` | remover da lista |

## 10.5 Usuário

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/users/@me` | perfil do usuário autenticado |

## 10.6 Fórum

| Método | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/forum/boards` | categorias e boards |
| `GET` | `/forum/topics` | buscar/listar tópicos |
| `GET` | `/forum/topic/{topic_id}` | tópico e mensagens |

---

# 11. Endpoints de anime

## 11.1 Pesquisar anime

```http
GET /anime
```

### Parâmetros

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `q` | string | Sim | texto pesquisado |
| `limit` | inteiro | Não | quantidade, máximo conhecido 100 |
| `offset` | inteiro | Não | deslocamento |
| `fields` | string | Não | campos adicionais |
| `nsfw` | boolean | Não | incluir conteúdo NSFW quando permitido |

### Exemplo

```bash
curl --get "https://api.myanimelist.net/v2/anime" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID" \
  --data-urlencode "q=fullmetal alchemist" \
  --data-urlencode "limit=10" \
  --data-urlencode "fields=mean,rank,popularity,media_type,status,genres"
```

### Resposta simplificada

```json
{
  "data": [
    {
      "node": {
        "id": 5114,
        "title": "Fullmetal Alchemist: Brotherhood",
        "main_picture": {
          "medium": "...",
          "large": "..."
        },
        "mean": 9.1,
        "rank": 1,
        "popularity": 3,
        "media_type": "tv",
        "status": "finished_airing",
        "genres": [
          {
            "id": 1,
            "name": "Action"
          }
        ]
      }
    }
  ],
  "paging": {
    "next": "..."
  }
}
```

### Observação sobre `q`

Resultados e validações podem variar. Há observações comunitárias de que consultas muito curtas, especialmente abaixo de três caracteres, podem retornar `400`. Não trate isso como regra contratual sem testar.

---

## 11.2 Obter detalhes de anime

```http
GET /anime/{anime_id}
```

### Parâmetros

| Nome | Tipo | Obrigatório |
|---|---|---:|
| `anime_id` | inteiro no path | Sim |
| `fields` | string | Não |

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/anime/5114?fields=alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

### Campos relevantes

| Campo | Significado |
|---|---|
| `id` | ID MAL |
| `title` | título principal |
| `main_picture` | imagens principal média e grande |
| `alternative_titles` | sinônimos, inglês e japonês |
| `start_date` | data de início, possivelmente parcial |
| `end_date` | data final, possivelmente parcial |
| `synopsis` | sinopse |
| `mean` | média de notas |
| `rank` | posição no ranking |
| `popularity` | posição por popularidade |
| `num_list_users` | usuários que adicionaram à lista |
| `num_scoring_users` | usuários contabilizados na nota |
| `nsfw` | classificação interna `white`, `gray` ou `black` |
| `media_type` | TV, OVA, filme etc. |
| `status` | situação de exibição |
| `genres` | gêneros |
| `num_episodes` | total de episódios; `0` pode significar desconhecido |
| `start_season` | ano e estação |
| `broadcast` | dia e horário de transmissão |
| `source` | mídia de origem |
| `average_episode_duration` | duração média em segundos |
| `rating` | classificação indicativa |
| `pictures` | imagens adicionais |
| `background` | texto de contexto |
| `related_anime` | obras de anime relacionadas |
| `related_manga` | mangás relacionados |
| `recommendations` | recomendações e quantidade de votos |
| `studios` | estúdios |
| `statistics` | distribuição por status nas listas |
| `my_list_status` | estado do usuário autenticado |

### Datas parciais

A API pode retornar:

```text
2017
2017-10
2017-10-03
```

Não force parsing direto para `Date` sem uma camada que aceite precisão variável.

---

## 11.3 Ranking de anime

```http
GET /anime/ranking
```

### Parâmetros

| Nome | Obrigatório | Valores |
|---|---:|---|
| `ranking_type` | Sim | veja tabela abaixo |
| `limit` | Não | máximo conhecido 500 |
| `offset` | Não | inteiro |
| `fields` | Não | seleção de campos |
| `nsfw` | Não | boolean |

### Tipos

| Valor | Significado |
|---|---|
| `all` | ranking geral |
| `airing` | em exibição |
| `upcoming` | futuros |
| `tv` | TV |
| `ova` | OVA |
| `movie` | filmes |
| `special` | especiais |
| `bypopularity` | popularidade |
| `favorite` | favoritos |

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/anime/ranking?ranking_type=airing&limit=25&fields=mean,rank,popularity,media_type,num_episodes" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

### Item de resposta

```json
{
  "node": {
    "id": 123,
    "title": "..."
  },
  "ranking": {
    "rank": 1,
    "previous_rank": 2
  }
}
```

`previous_rank` pode não estar presente.

---

## 11.4 Anime por temporada

```http
GET /anime/season/{year}/{season}
```

### `season`

```text
winter
spring
summer
fall
```

Convenção:

| Estação | Meses aproximados |
|---|---|
| `winter` | janeiro a março |
| `spring` | abril a junho |
| `summer` | julho a setembro |
| `fall` | outubro a dezembro |

### Parâmetros

| Nome | Valores |
|---|---|
| `sort` | `anime_score` ou `anime_num_list_users` |
| `limit` | máximo conhecido 500 |
| `offset` | deslocamento |
| `fields` | campos |
| `nsfw` | boolean |

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/anime/season/2026/summer?sort=anime_num_list_users&limit=100&fields=mean,start_season,broadcast,genres,num_episodes,studios" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

---

## 11.5 Sugestões personalizadas

```http
GET /anime/suggestions
```

Requer token OAuth.

### Parâmetros

```text
limit
offset
fields
nsfw
```

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/anime/suggestions?limit=25&fields=mean,genres,media_type,status" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Usuários novos ou sem histórico suficiente podem receber uma lista vazia.

---

# 12. Lista de anime do usuário

## 12.1 Obter lista

```http
GET /users/{user_name}/animelist
```

Use:

```text
@me
```

para o usuário autenticado:

```text
/users/@me/animelist
```

Ou um nome público:

```text
/users/USERNAME/animelist
```

### Parâmetros

| Nome | Valores |
|---|---|
| `status` | `watching`, `completed`, `on_hold`, `dropped`, `plan_to_watch` |
| `sort` | `list_score`, `list_updated_at`, `anime_title`, `anime_start_date` |
| `limit` | máximo conhecido 1000 |
| `offset` | deslocamento |
| `fields` | campos do anime e `list_status` |
| `nsfw` | boolean, quando disponível |

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/users/@me/animelist?status=watching&sort=list_updated_at&limit=100&fields=list_status,num_episodes,mean,genres,media_type,status,start_season,broadcast" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### `list_status`

```json
{
  "status": "watching",
  "score": 8,
  "num_episodes_watched": 7,
  "is_rewatching": false,
  "updated_at": "2026-07-19T12:34:56+00:00",
  "start_date": "2026-07-01",
  "finish_date": "",
  "priority": 0,
  "num_times_rewatched": 0,
  "rewatch_value": 0,
  "tags": [],
  "comments": ""
}
```

### Privacidade

Ao consultar outro usuário, `403` pode significar:

- lista privada;
- usuário inexistente;
- bloqueio de acesso;
- restrição temporária.

Não interprete todo `403` como rate limit.

---

## 12.2 Adicionar ou atualizar anime

```http
PATCH /anime/{anime_id}/my_list_status
```

A documentação e bibliotecas antigas também se referem a `PUT`. O servidor aceita historicamente atualização parcial; `PATCH` expressa melhor a semântica de “somente os campos enviados mudam”.

Requer OAuth.

### Corpo

```http
Content-Type: application/x-www-form-urlencoded
```

### Campos

| Campo | Tipo | Faixa/valores |
|---|---|---|
| `status` | string | status de anime |
| `is_rewatching` | boolean | `true`/`false` |
| `score` | inteiro | `0–10`; `0` remove nota |
| `num_watched_episodes` | inteiro | progresso |
| `priority` | inteiro | `0–2` |
| `num_times_rewatched` | inteiro | contagem |
| `rewatch_value` | inteiro | `0–5` |
| `tags` | string | tags separadas por vírgula |
| `comments` | string | comentário |
| `start_date` | data | `YYYY-MM-DD` |
| `finish_date` | data | `YYYY-MM-DD` |

### Atenção ao nome do campo

Na requisição:

```text
num_watched_episodes
```

Na resposta:

```text
num_episodes_watched
```

### Exemplo

```bash
curl -X PATCH "https://api.myanimelist.net/v2/anime/5114/my_list_status" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "status=completed" \
  --data-urlencode "score=10" \
  --data-urlencode "num_watched_episodes=64" \
  --data-urlencode "finish_date=2026-07-19"
```

Se o anime ainda não estiver na lista, a operação pode criá-lo.

### Resposta

```json
{
  "status": "completed",
  "score": 10,
  "num_episodes_watched": 64,
  "is_rewatching": false,
  "updated_at": "2026-07-19T...",
  "priority": 0,
  "num_times_rewatched": 0,
  "rewatch_value": 0,
  "tags": [],
  "comments": "",
  "finish_date": "2026-07-19"
}
```

---

## 12.3 Remover anime da lista

```http
DELETE /anime/{anime_id}/my_list_status
```

```bash
curl -X DELETE \
  "https://api.myanimelist.net/v2/anime/5114/my_list_status" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

O sucesso pode retornar:

```json
[]
```

Não espere necessariamente um objeto ou `204 No Content`.

---

# 13. Endpoints de mangá

## 13.1 Pesquisar mangá

```http
GET /manga
```

### Parâmetros

```text
q
limit
offset
fields
nsfw
```

### Exemplo

```bash
curl --get "https://api.myanimelist.net/v2/manga" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID" \
  --data-urlencode "q=berserk" \
  --data-urlencode "limit=10" \
  --data-urlencode "fields=mean,rank,popularity,media_type,status,genres,num_chapters,num_volumes,authors{first_name,last_name}"
```

---

## 13.2 Detalhes de mangá

```http
GET /manga/{manga_id}
```

Campos relevantes:

| Campo | Significado |
|---|---|
| `num_volumes` | total de volumes; `0` pode significar desconhecido |
| `num_chapters` | total de capítulos; `0` pode significar desconhecido |
| `authors` | autores e seus papéis |
| `serialization` | revistas/publicações de serialização |
| `related_anime` | anime relacionado |
| `related_manga` | mangá relacionado |
| `recommendations` | recomendações |
| `my_list_status` | estado do usuário autenticado |

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/manga/2?fields=alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,media_type,status,genres,num_volumes,num_chapters,authors,pictures,background,related_anime,related_manga,recommendations,serialization" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

### Autores

Estrutura típica:

```json
{
  "node": {
    "id": 1868,
    "first_name": "Kentaro",
    "last_name": "Miura"
  },
  "role": "Story & Art"
}
```

---

## 13.3 Ranking de mangá

```http
GET /manga/ranking
```

### Tipos de ranking

| Valor | Significado |
|---|---|
| `all` | geral |
| `manga` | mangá |
| `novels` | novels |
| `lightnovels` | light novels, quando aceito pela operação |
| `oneshots` | one-shots |
| `doujin` | doujinshi |
| `manhwa` | manhwa |
| `manhua` | manhua |
| `bypopularity` | popularidade |
| `favorite` | favoritos |

O conjunto exato aceito pode variar entre a especificação renderizada e clientes antigos; valide `lightnovels` no ambiente atual antes de depender dele.

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/manga/ranking?ranking_type=manga&limit=50&fields=mean,rank,popularity,num_chapters,num_volumes,authors" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

---

# 14. Lista de mangá do usuário

## 14.1 Obter lista

```http
GET /users/{user_name}/mangalist
```

### Status

```text
reading
completed
on_hold
dropped
plan_to_read
```

### Ordenação

```text
list_score
list_updated_at
manga_title
manga_start_date
```

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/users/@me/mangalist?status=reading&sort=list_updated_at&limit=100&fields=list_status,num_chapters,num_volumes,mean,genres,authors" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### `list_status`

```json
{
  "status": "reading",
  "is_rereading": false,
  "num_volumes_read": 12,
  "num_chapters_read": 103,
  "score": 9,
  "updated_at": "2026-07-19T...",
  "priority": 0,
  "num_times_reread": 0,
  "reread_value": 0,
  "tags": [],
  "comments": "",
  "start_date": "2026-01-10",
  "finish_date": ""
}
```

---

## 14.2 Adicionar ou atualizar mangá

```http
PATCH /manga/{manga_id}/my_list_status
```

### Campos

| Campo | Tipo |
|---|---|
| `status` | string |
| `is_rereading` | boolean |
| `score` | `0–10` |
| `num_volumes_read` | inteiro |
| `num_chapters_read` | inteiro |
| `priority` | `0–2` |
| `num_times_reread` | inteiro |
| `reread_value` | `0–5` |
| `tags` | string separada por vírgulas |
| `comments` | string |
| `start_date` | `YYYY-MM-DD` |
| `finish_date` | `YYYY-MM-DD` |

### Exemplo

```bash
curl -X PATCH "https://api.myanimelist.net/v2/manga/2/my_list_status" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "status=reading" \
  --data-urlencode "score=9" \
  --data-urlencode "num_volumes_read=12" \
  --data-urlencode "num_chapters_read=103"
```

---

## 14.3 Remover mangá

```http
DELETE /manga/{manga_id}/my_list_status
```

```bash
curl -X DELETE \
  "https://api.myanimelist.net/v2/manga/2/my_list_status" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

---

# 15. Endpoints de usuário

## 15.1 Perfil autenticado

```http
GET /users/@me
```

Requer OAuth.

### Parâmetro

```text
fields
```

### Exemplo

```bash
curl "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics,time_zone,is_supporter" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Resposta típica

```json
{
  "id": 123456,
  "name": "example",
  "picture": "https://cdn.myanimelist.net/...",
  "gender": "Male",
  "birthday": "2000-01-01",
  "location": "Brazil",
  "joined_at": "2015-01-01T00:00:00+00:00",
  "time_zone": "America/Sao_Paulo",
  "is_supporter": false,
  "anime_statistics": {
    "num_items_watching": 10,
    "num_items_completed": 250,
    "num_items_on_hold": 3,
    "num_items_dropped": 20,
    "num_items_plan_to_watch": 80,
    "num_items": 363,
    "num_days_watched": 120.5,
    "num_days_watching": 2.1,
    "num_days_completed": 112.4,
    "num_days_on_hold": 0.7,
    "num_days_dropped": 5.3,
    "num_days": 120.5,
    "num_episodes": 7200,
    "num_times_rewatched": 15,
    "mean_score": 7.8
  }
}
```

A API oficial expõe este endpoint para `@me`; não presuma que `/users/qualquer_nome` forneça perfis arbitrários.

---

# 16. Endpoints de fórum

Os endpoints de fórum existem na superfície v2, mas recebem menos uso que os endpoints de catálogo.

## 16.1 Boards

```http
GET /forum/boards
```

Retorna categorias, boards e subboards.

```bash
curl "https://api.myanimelist.net/v2/forum/boards" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID"
```

Estrutura conceitual:

```json
{
  "categories": [
    {
      "title": "Anime & Manga",
      "boards": [
        {
          "id": 1,
          "title": "Anime Discussion",
          "description": "...",
          "subboards": []
        }
      ]
    }
  ]
}
```

## 16.2 Tópicos

```http
GET /forum/topics
```

Filtros conhecidos incluem:

```text
board_id
subboard_id
q
topic_user_name
user_name
sort
limit
offset
```

Pelo menos um critério de pesquisa pode ser necessário dependendo da combinação.

A ordenação documentada por clientes oficiais/comunitários é:

```text
recent
```

Exemplo:

```bash
curl --get "https://api.myanimelist.net/v2/forum/topics" \
  -H "X-MAL-CLIENT-ID: SEU_CLIENT_ID" \
  --data-urlencode "q=Fullmetal Alchemist" \
  --data-urlencode "sort=recent" \
  --data-urlencode "limit=20"
```

## 16.3 Detalhes de um tópico

```http
GET /forum/topic/{topic_id}
```

Parâmetros:

```text
limit
offset
```

Resposta conceitual:

```json
{
  "title": "Título do tópico",
  "posts": [
    {
      "id": 123,
      "number": 1,
      "created_at": "2026-07-19T...",
      "created_by": {
        "id": 1,
        "name": "usuario",
        "forum_avator": "..."
      },
      "body": "..."
    }
  ],
  "poll": null
}
```

A grafia `forum_avator` pode aparecer em modelos históricos; preserve o nome realmente recebido em vez de corrigi-lo silenciosamente no parser sem mapeamento explícito.

---

# 17. Principais modelos de resposta

## 17.1 `Picture`

```ts
type Picture = {
  medium?: string;
  large?: string;
};
```

## 17.2 `Paging`

```ts
type Paging = {
  previous?: string;
  next?: string;
};
```

## 17.3 Resposta paginada

```ts
type PagedResponse<TNode, TExtra extends object = object> = {
  data: Array<
    {
      node: TNode;
    } & TExtra
  >;
  paging?: Paging;
};
```

## 17.4 Anime resumido

```ts
type AnimeNode = {
  id: number;
  title: string;
  main_picture?: Picture;
  alternative_titles?: {
    synonyms?: string[];
    en?: string;
    ja?: string;
  };
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number | null;
  rank?: number | null;
  popularity?: number | null;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: "white" | "gray" | "black" | string;
  created_at?: string;
  updated_at?: string;
  media_type?: string;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  num_episodes?: number;
};
```

## 17.5 Status de anime

```ts
type AnimeListStatus = {
  status:
    | "watching"
    | "completed"
    | "on_hold"
    | "dropped"
    | "plan_to_watch";
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: string;
  start_date?: string;
  finish_date?: string;
  priority?: 0 | 1 | 2;
  num_times_rewatched?: number;
  rewatch_value?: 0 | 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  comments?: string;
};
```

## 17.6 Mangá resumido

```ts
type MangaNode = {
  id: number;
  title: string;
  main_picture?: Picture;
  alternative_titles?: {
    synonyms?: string[];
    en?: string;
    ja?: string;
  };
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number | null;
  rank?: number | null;
  popularity?: number | null;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: "white" | "gray" | "black" | string;
  media_type?: string;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  num_volumes?: number;
  num_chapters?: number;
};
```

## 17.7 Status de mangá

```ts
type MangaListStatus = {
  status:
    | "reading"
    | "completed"
    | "on_hold"
    | "dropped"
    | "plan_to_read";
  score: number;
  num_volumes_read: number;
  num_chapters_read: number;
  is_rereading: boolean;
  updated_at: string;
  start_date?: string;
  finish_date?: string;
  priority?: 0 | 1 | 2;
  num_times_reread?: number;
  reread_value?: 0 | 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  comments?: string;
};
```

## 17.8 Relacionamentos

```ts
type RelatedAnime = {
  node: {
    id: number;
    title: string;
    main_picture?: Picture;
  };
  relation_type: string;
  relation_type_formatted: string;
};
```

## 17.9 Recomendação

```ts
type Recommendation<T> = {
  node: T;
  num_recommendations: number;
};
```

---

# 18. Enumerações importantes

## 18.1 Status de anime na lista

```text
watching
completed
on_hold
dropped
plan_to_watch
```

## 18.2 Status de mangá na lista

```text
reading
completed
on_hold
dropped
plan_to_read
```

## 18.3 Tipo de anime

```text
unknown
tv
ova
movie
special
ona
music
```

## 18.4 Status de exibição

```text
finished_airing
currently_airing
not_yet_aired
```

## 18.5 Classificação indicativa

```text
g
pg
pg_13
r
r+
rx
```

## 18.6 Origem de anime

Valores conhecidos:

```text
other
original
manga
4_koma_manga
web_manga
digital_manga
novel
light_novel
visual_novel
game
card_game
book
picture_book
radio
music
```

Implemente fallback para valores novos.

## 18.7 Prioridade da lista

| Valor | Interpretação |
|---:|---|
| `0` | baixa |
| `1` | média |
| `2` | alta |

## 18.8 Valor de rewatch/reread

| Valor | Interpretação |
|---:|---|
| `0` | sem valor |
| `1` | muito baixo |
| `2` | baixo |
| `3` | médio |
| `4` | alto |
| `5` | muito alto |

## 18.9 Nota

```text
0 a 10
```

`0` representa ausência de nota.

---

# 19. Exemplos em JavaScript/TypeScript

## 19.1 Cliente base

```ts
const MAL_API_BASE = "https://api.myanimelist.net/v2";

export class MalApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | undefined,
    message: string,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "MalApiError";
  }
}

type MalClientOptions =
  | { clientId: string; accessToken?: never }
  | { accessToken: string; clientId?: never };

export class MalClient {
  constructor(private readonly options: MalClientOptions) {}

  private headers(extra?: HeadersInit): Headers {
    const headers = new Headers(extra);
    headers.set("Accept", "application/json");

    if ("accessToken" in this.options) {
      headers.set("Authorization", `Bearer ${this.options.accessToken}`);
    } else {
      headers.set("X-MAL-CLIENT-ID", this.options.clientId);
    }

    return headers;
  }

  async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${MAL_API_BASE}${path}`, {
      ...init,
      headers: this.headers(init.headers),
    });

    const text = await response.text();
    let body: unknown = null;

    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!response.ok) {
      const errorBody =
        body && typeof body === "object"
          ? (body as Record<string, unknown>)
          : undefined;

      throw new MalApiError(
        response.status,
        typeof errorBody?.error === "string"
          ? errorBody.error
          : undefined,
        typeof errorBody?.message === "string"
          ? errorBody.message
          : `MyAnimeList respondeu HTTP ${response.status}`,
        body,
      );
    }

    return body as T;
  }
}
```

## 19.2 Pesquisa

```ts
type AnimeSearchItem = {
  node: {
    id: number;
    title: string;
    main_picture?: Picture;
    mean?: number | null;
    media_type?: string;
  };
};

type AnimeSearchResponse = {
  data: AnimeSearchItem[];
  paging?: Paging;
};

const mal = new MalClient({
  clientId: process.env.MAL_CLIENT_ID!,
});

const query = new URLSearchParams({
  q: "Monster",
  limit: "10",
  fields: "mean,rank,popularity,media_type,status,genres",
});

const result = await mal.request<AnimeSearchResponse>(
  `/anime?${query.toString()}`,
);
```

## 19.3 Obter a própria lista

```ts
const mal = new MalClient({
  accessToken,
});

const params = new URLSearchParams({
  status: "watching",
  sort: "list_updated_at",
  limit: "100",
  fields:
    "list_status,num_episodes,mean,genres,media_type,status,start_season,broadcast",
});

const page = await mal.request<
  PagedResponse<AnimeNode, { list_status: AnimeListStatus }>
>(`/users/@me/animelist?${params.toString()}`);
```

## 19.4 Atualizar anime

```ts
const body = new URLSearchParams({
  status: "watching",
  score: "8",
  num_watched_episodes: "7",
});

const updated = await mal.request<AnimeListStatus>(
  "/anime/5114/my_list_status",
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  },
);
```

## 19.5 Não envie `undefined`

```ts
function formBody(
  values: Record<string, string | number | boolean | undefined>,
): URLSearchParams {
  const body = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      body.set(key, String(value));
    }
  }

  return body;
}
```

Isso preserva a semântica de atualização parcial.

---

# 20. Exemplos com `curl`

## 20.1 Pesquisa pública

```bash
curl --get "https://api.myanimelist.net/v2/anime" \
  -H "X-MAL-CLIENT-ID: $MAL_CLIENT_ID" \
  --data-urlencode "q=Frieren" \
  --data-urlencode "limit=10" \
  --data-urlencode "fields=mean,rank,popularity,genres,media_type,status"
```

## 20.2 Detalhes autenticados com `my_list_status`

```bash
curl --get "https://api.myanimelist.net/v2/anime/52991" \
  -H "Authorization: Bearer $MAL_ACCESS_TOKEN" \
  --data-urlencode "fields=alternative_titles,synopsis,mean,genres,num_episodes,studios,my_list_status"
```

## 20.3 Própria lista

```bash
curl --get "https://api.myanimelist.net/v2/users/@me/animelist" \
  -H "Authorization: Bearer $MAL_ACCESS_TOKEN" \
  --data-urlencode "status=watching" \
  --data-urlencode "sort=list_updated_at" \
  --data-urlencode "limit=100" \
  --data-urlencode "fields=list_status,num_episodes,mean,genres"
```

## 20.4 Atualização parcial

```bash
curl -X PATCH \
  "https://api.myanimelist.net/v2/anime/52991/my_list_status" \
  -H "Authorization: Bearer $MAL_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "status=watching" \
  --data-urlencode "num_watched_episodes=5"
```

## 20.5 Remoção

```bash
curl -X DELETE \
  "https://api.myanimelist.net/v2/anime/52991/my_list_status" \
  -H "Authorization: Bearer $MAL_ACCESS_TOKEN"
```

---

# 21. Arquitetura recomendada

## 21.1 Aplicação apenas de catálogo

Para um site que só exibe informações públicas:

```text
Browser
   ↓
Seu backend
   ↓ X-MAL-CLIENT-ID
MyAnimeList API
```

Evite expor o Client ID desnecessariamente e use backend para:

- cache;
- controle de taxa;
- normalização;
- observabilidade;
- ocultar detalhes de integração.

Um Client ID não tem o mesmo nível de sigilo de um Client Secret, mas ainda identifica sua aplicação e pode ser abusado.

## 21.2 Aplicação com login MAL

```text
Browser
   ↓ inicia login
Seu backend
   ↓ redireciona
MAL Authorization Server
   ↓ callback com code
Seu backend
   ↓ troca code + verifier
MAL Token Endpoint
   ↓ access + refresh
Seu armazenamento seguro
```

Chamadas de dados:

```text
Browser
   ↓ sessão da sua aplicação
Seu backend
   ↓ Bearer do usuário
MAL API
```

## 21.3 Banco de dados de tokens

Modelo conceitual:

```sql
create table mal_oauth_tokens (
  user_id bigint primary key,
  access_token_encrypted text not null,
  refresh_token_encrypted text not null,
  access_token_expires_at timestamptz not null,
  token_type text not null default 'Bearer',
  updated_at timestamptz not null default now()
);
```

Armazene tokens criptografados em repouso.

## 21.4 Cache

Sugestão inicial:

| Recurso | TTL aproximado |
|---|---:|
| Pesquisa | 5–30 min |
| Detalhes de catálogo | 1–24 h |
| Rankings | 15–60 min |
| Temporada | 15–60 min |
| Lista de usuário | curto ou sem cache |
| Perfil do próprio usuário | 5–15 min |
| Resultado de mutação | não cachear; invalidar relacionados |

Esses valores são decisões de arquitetura, não regras da MAL.

## 21.5 Sincronização

Se sua aplicação mantém uma cópia da lista:

- use `sort=list_updated_at`;
- salve `updated_at` de cada item;
- percorra páginas até encontrar itens anteriores ao último checkpoint;
- faça reconciliação completa ocasional;
- trate remoções, que não aparecem como registros atualizados;
- não use o catálogo da MAL como banco local sem observar os termos de uso.

---

# 22. Segurança

## 22.1 Proteja o Client Secret

Nunca coloque em:

- frontend;
- aplicativo mobile distribuído;
- repositório Git;
- log;
- mensagem de erro;
- analytics;
- URL.

## 22.2 Proteja tokens

- criptografe em repouso;
- use HTTPS;
- não registre `Authorization`;
- não envie Bearer token a hosts diferentes de `api.myanimelist.net`;
- rotacione e substitua refresh tokens recebidos;
- apague tokens quando o usuário desconectar a conta;
- limite acesso interno por usuário e finalidade.

## 22.3 `state`

- gere com CSPRNG;
- vincule à sessão;
- use uma vez;
- expire rapidamente;
- compare antes de trocar o authorization code.

## 22.4 Redirect URI

- use correspondência exata;
- evite redirectors abertos;
- não aceite um `redirect_uri` fornecido livremente pelo cliente;
- em produção, use HTTPS.

## 22.5 SSRF em paginação

Nunca siga cegamente `paging.next` com um Bearer token.

Valide:

```text
protocol === https:
hostname === api.myanimelist.net
pathname começa com /v2/
```

## 22.6 Logs

Pode registrar:

```text
método, endpoint lógico, status, duração, request ID, tentativa
```

Não registre:

```text
access_token
refresh_token
client_secret
authorization code
code_verifier
corpo completo de perfil privado
```

---

# 23. Quirks e inconsistências conhecidas

## 23.1 `PATCH` versus `PUT`

Operações históricas e IDs da documentação podem usar o sufixo `_put`, enquanto clientes e testes usam `PATCH`.

Recomendação:

- use `PATCH` para atualização parcial;
- envie apenas campos alterados;
- mantenha suporte configurável a `PUT` caso um ambiente específico exija.

## 23.2 Nome do progresso de anime

Requisição:

```text
num_watched_episodes
```

Resposta:

```text
num_episodes_watched
```

Não reutilize automaticamente o mesmo nome nos dois sentidos.

## 23.3 DELETE retorna `[]`

Uma remoção bem-sucedida pode retornar:

```json
[]
```

Seu parser de mutações não deve exigir objeto JSON.

## 23.4 DELETE pode parecer idempotente

Testes ao vivo em 2026 observaram sucesso ao remover um item já ausente, embora documentação e bibliotecas antigas indiquem `404`.

Implemente assim:

- qualquer `2xx` = sucesso;
- `404` do item de catálogo = erro real;
- para remoção de estado ausente, decida se `404` será tratado como sucesso lógico.

## 23.5 Duração de token

Não fixe “uma hora” nem “31 dias”. Use `expires_in`.

## 23.6 Sem scopes granulares

A MAL não oferece um conjunto rico de scopes OAuth comparável a APIs como Google ou GitHub. Trate o token como capaz de acessar a superfície autorizada da conta.

## 23.7 `comments` em listas

A especificação possui observações históricas de que `comments` pode não ser incluído em respostas de lista, mesmo que exista no status detalhado ou na mutação.

Não dependa desse campo em lote sem verificar.

## 23.8 Campos opcionais silenciosamente omitidos

A API pode omitir:

- `my_list_status`;
- `previous_rank`;
- datas;
- imagens;
- média/rank;
- campos detalhados não suportados naquele endpoint.

Diferencie:

```ts
field === undefined
```

de:

```ts
field === null
```

## 23.9 Valores zero

Em campos como:

```text
num_episodes
num_chapters
num_volumes
```

`0` frequentemente significa desconhecido, não necessariamente “nenhum”.

## 23.10 Datas incompletas

Não transforme `2017-10` automaticamente em `2017-10-01` sem registrar que houve inferência.

## 23.11 `403` é ambíguo

Pode representar:

- sem permissão;
- lista privada;
- credencial inadequada;
- usuário não encontrado em uma operação de lista;
- mecanismo antiabuso;
- bloqueio temporário.

Use contexto, corpo e padrão de repetição.

---

# 24. Checklist de implementação

## Credenciais

- [ ] Aplicação criada no painel MAL.
- [ ] Client ID fora do código-fonte.
- [ ] Client Secret somente no backend.
- [ ] Redirect URI registrada corretamente.

## OAuth

- [ ] `state` aleatório e validado.
- [ ] `code_verifier` de alta entropia.
- [ ] `code_challenge_method=plain`.
- [ ] `code_challenge === code_verifier`.
- [ ] Authorization code usado uma única vez.
- [ ] `expires_in` persistido.
- [ ] Refresh token atualizado atomicamente.

## Cliente HTTP

- [ ] Base URL fixa em `https://api.myanimelist.net/v2`.
- [ ] Timeout.
- [ ] Tratamento de JSON e corpo vazio.
- [ ] Backoff para falhas temporárias.
- [ ] Sem retry cego de mutações.
- [ ] Validação de host em `paging.next`.
- [ ] Seleção explícita de `fields`.

## Modelos

- [ ] Campos opcionais.
- [ ] Datas parciais.
- [ ] Enums com fallback.
- [ ] `0` como possível “desconhecido”.
- [ ] Diferença `num_watched_episodes`/`num_episodes_watched`.
- [ ] DELETE aceitando `[]`.

## Operação

- [ ] Cache de catálogo.
- [ ] Baixa concorrência.
- [ ] Métricas de status e latência.
- [ ] Tokens removidos dos logs.
- [ ] Respeito aos termos de uso da MAL.

---

# 25. Fontes

## Documentação oficial

- Referência da API v2:  
  https://myanimelist.net/apiconfig/references/api/v2
- Seção de versionamento indicada no pedido:  
  https://myanimelist.net/apiconfig/references/api/v2#section/Versioning
- Autorização OAuth:  
  https://myanimelist.net/apiconfig/references/authorization
- Registro e gerenciamento de aplicações:  
  https://myanimelist.net/apiconfig

## Referências técnicas cruzadas

A página oficial é renderizada a partir de uma especificação OpenAPI e pode não ser indexada integralmente por buscadores. Este documento cruzou os endpoints oficiais com:

- cliente Go que liga cada operação à referência oficial:  
  https://github.com/nstratos/go-myanimelist
- documentação do pacote Go:  
  https://pkg.go.dev/github.com/nstratos/go-myanimelist/mal
- notas verificadas em julho de 2026 contra o OpenAPI oficial e testes reais:  
  https://github.com/UmutKDev/myanimelist-mcp/blob/main/NOTES.md
- RFC 7636, PKCE:  
  https://datatracker.ietf.org/doc/html/rfc7636

## Confiabilidade das observações

Os comportamentos abaixo devem ser tratados como observações de implementação, não como contrato imutável:

- access token real frequentemente com `expires_in=2678400`;
- refresh token rotacionado;
- `DELETE` retornando `[]`;
- remoção de item ausente podendo retornar sucesso;
- bloqueio antiabuso manifestado como `403`;
- limite prático conservador de aproximadamente uma requisição por segundo;
- consulta `q` muito curta podendo retornar `400`.

Antes de construir uma dependência crítica, execute testes de integração contra sua própria aplicação MAL e revalide a documentação oficial.
