# jikan-edge API para o WeebProfile

> Documentação prática da API **jikan-edge**, criada e mantida por nós para fornecer dados públicos de perfis e listas do MyAnimeList ao WeebProfile.
>
> Esta não é a API oficial do MyAnimeList nem uma cópia integral do Jikan. Ela coleta HTML público, normaliza o resultado e aplica cache, proteção de fonte e limites próprios.

---

## Sumário

1. [Responsabilidade e suporte](#1-responsabilidade-e-suporte)
2. [Base e rotas](#2-base-e-rotas)
3. [Respostas e metadados](#3-respostas-e-metadados)
4. [Perfis e estatísticas](#4-perfis-e-estatísticas)
5. [Listas e paginação](#5-listas-e-paginação)
6. [Cache e atualização](#6-cache-e-atualização)
7. [Erros](#7-erros)
8. [Limites, CORS e segurança](#8-limites-cors-e-segurança)
9. [Headers de diagnóstico](#9-headers-de-diagnóstico)
10. [O que não fazer](#10-o-que-não-fazer)

---

# 1. Responsabilidade e suporte

O `jikan-edge` é uma API nossa, feita para a integração do WeebProfile. Qualquer comportamento inesperado — dados incorretos, resposta ausente, cache stale inesperado, bloqueio, erro de CORS ou diferença em relação ao MyAnimeList — deve ser informado diretamente ao responsável pelo projeto para investigação.

Ao reportar um problema, envie quando possível:

- URL chamada;
- horário aproximado em UTC;
- status HTTP;
- `x-request-id`, `cf-ray`, `x-worker-version` e `x-cache-status`;
- body resumido, sem dados pessoais desnecessários.

Não trate o HTML do MAL como contrato estável. Mudanças de markup podem exigir uma correção no parser do `jikan-edge`.

# 2. Base e rotas

Base publicada:

```text
https://jikan-edge.lucas-hdo.workers.dev
```

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica saúde do Worker |
| `GET` | `/v1/users/:username` | Perfil público normalizado |
| `GET` | `/v1/users/:username/statistics` | Estatísticas extraídas da página de perfil |
| `GET` | `/v1/users/:username/animelist?page=1&limit=100` | Lista de anime paginada localmente |
| `GET` | `/v1/users/:username/mangalist?page=1&limit=100` | Lista de manga paginada localmente |

Exemplo:

```bash
curl -i "https://jikan-edge.lucas-hdo.workers.dev/v1/users/AMayacrab/animelist?limit=3"
```

# 3. Respostas e metadados

Rotas de dados respondem com:

```json
{
  "data": {},
  "meta": {
    "cached": false,
    "stale": false,
    "refreshFailed": false,
    "fetchedAt": "2026-07-19T00:00:00.000Z"
  }
}
```

- `cached`: resposta veio do D1.
- `stale`: dado anterior foi preservado porque a atualização falhou.
- `refreshFailed`: houve tentativa de refresh sem sucesso.
- `fetchedAt`: instante do snapshot usado na resposta.

Para listas, `meta.pagination` contém `page`, `limit`, `total` e `hasNextPage`.

# 4. Perfis e estatísticas

## Perfil

```http
GET /v1/users/:username
```

O username aceita somente letras ASCII, números, `_` e `-`, com até 32 caracteres.

Campos principais:

```text
username, canonicalUsername, profileUrl, avatarUrl, about,
gender, location, birthday, joinedAt, lastOnlineAt
```

## Estatísticas

```http
GET /v1/users/:username/statistics
```

As estatísticas são lidas da página pública de perfil do MAL; elas não são recalculadas automaticamente a partir das listas. Isso evita apresentar dados derivados como se fossem a fonte oficial, mas diferenças pontuais devem ser reportadas.

# 5. Listas e paginação

```http
GET /v1/users/:username/animelist?page=1&limit=100
GET /v1/users/:username/mangalist?page=1&limit=100
```

`page` começa em 1. `limit` padrão é 100 e o máximo é 300. A paginação é aplicada sobre o snapshot persistido no D1.

O `jikan-edge` só substitui uma lista quando o snapshot é aceito como completo. Snapshot parcial, inválido, duplicado, truncado ou suspeito não substitui uma lista válida anterior.

# 6. Cache e atualização

| Recurso | TTL |
| --- | ---: |
| Perfil e estatísticas | 6 horas |
| Anime list e manga list | 2 horas |

Em cache fresh, o Worker não consulta o MAL. Em cache stale, ele tenta atualizar; se a fonte falhar ou for suspeita, devolve o dado anterior com `stale: true`.

# 7. Erros

Erros seguem o formato:

```json
{
  "error": {
    "code": "UPSTREAM_SUSPICIOUS",
    "message": "Unable to refresh this resource.",
    "requestId": "..."
  }
}
```

| Status | Código típico | Significado |
| ---: | --- | --- |
| 400 | `INVALID_USERNAME` | username inválido |
| 403 | `PRIVATE_PROFILE` | perfil não público/upstream 403 |
| 404 | `NOT_FOUND` | perfil inexistente |
| 429 | `RATE_LIMITED` / `UPSTREAM_RATE_LIMITED` | limite local ou da fonte |
| 502 | `UPSTREAM_SUSPICIOUS` | HTML inesperado, challenge ou parser rejeitado |
| 503 | `UPSTREAM_UNAVAILABLE` / `REFRESH_IN_PROGRESS` | fonte indisponível ou refresh concorrente |
| 504 | `UPSTREAM_TIMEOUT` | timeout da fonte |

# 8. Limites, CORS e segurança

- Rate limit atual: 60 requisições por minuto, por IP e rota, local ao colo Cloudflare.
- CORS usa allowlist configurável; desenvolvimento local permite `http://localhost:5173` por padrão.
- Não há credenciais CORS.
- O Worker só consulta HTTPS no hostname exato `myanimelist.net`.
- Redirects são seguidos manualmente e revalidados.
- Respostas upstream possuem timeout e limite de 2 MiB.

Antes de integrar a origem de produção do WeebProfile, ela deve ser adicionada à variável `CORS_ALLOWED_ORIGINS`.

# 9. Headers de diagnóstico

| Header | Uso |
| --- | --- |
| `x-request-id` | Correlacionar a resposta com logs do Worker |
| `x-worker-version` | Identificador declarativo da release |
| `x-cache-status` | `hit`, `miss`, `stale`, `rate_limited` ou `unknown` |
| `cf-ray` | Identificador Cloudflare/colo para incidentes de edge |

# 10. O que não fazer

- Não use esta API como substituta de todas as rotas do Jikan.
- Não faça polling agressivo: use cache no WeebProfile.
- Não dependa de campos opcionais como se fossem sempre presentes.
- Não trate `200` isoladamente como prova de conteúdo válido; consulte `meta` e reporte anomalias.
- Não exponha dados pessoais capturados pelo perfil em logs ou relatórios de bug.
## Contrato implementado

`GET /v1/users/:username/favorites` retorna `data` com `anime`, `manga`, `characters` e `people`. Cada item possui `mal_id`, `url`, `imageUrl` (`string | null`), `title` ou `name` e `type` quando aplicável.

`GET /v1/users/:username/userupdates` retorna `501` com `error.code = "USER_UPDATES_UNSUPPORTED"`. Clientes devem marcar a seção como indisponível, nunca como uma lista vazia.

As listas retornam `data: Entry[]` e `meta.pagination` (`page`, `limit`, `total`, `hasNextPage`). Cada item inclui `malId`, `title`, `imageUrl`, `status`, `score`, `progress`, `total` e `updatedAt`; campos não verificados podem ser `null`.

Erros usam `{ error: { code, message, requestId } }`. Preserve 404, 429, 501 e 5xx como erro/estado indisponível e registre somente `x-request-id`, `x-worker-version` e `x-cache-status` para diagnóstico.
