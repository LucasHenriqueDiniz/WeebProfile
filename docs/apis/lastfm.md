# API do Last.fm — guia detalhado para desenvolvedores

> Guia prático em português sobre a **Last.fm Music Discovery API**, baseado na documentação oficial consultada em **19 de julho de 2026**.
>
> Documentação principal: <https://www.last.fm/api>

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [O que a API permite fazer](#2-o-que-a-api-permite-fazer)
3. [Criando uma chave de API](#3-criando-uma-chave-de-api)
4. [Endpoint e estrutura das requisições](#4-endpoint-e-estrutura-das-requisições)
5. [Credenciais e conceitos de autenticação](#5-credenciais-e-conceitos-de-autenticação)
6. [Chamadas públicas, autenticadas e de escrita](#6-chamadas-públicas-autenticadas-e-de-escrita)
7. [Assinatura `api_sig`](#7-assinatura-api_sig)
8. [Fluxos de autenticação](#8-fluxos-de-autenticação)
9. [Cliente TypeScript reutilizável](#9-cliente-typescript-reutilizável)
10. [Métodos mais usados](#10-métodos-mais-usados)
11. [Scrobbling](#11-scrobbling)
12. [Paginação, períodos e timestamps](#12-paginação-períodos-e-timestamps)
13. [Formato das respostas](#13-formato-das-respostas)
14. [Erros e retentativas](#14-erros-e-retentativas)
15. [Catálogo dos métodos oficiais](#15-catálogo-dos-métodos-oficiais)
16. [Arquitetura recomendada](#16-arquitetura-recomendada)
17. [Limites, cache e termos de uso](#17-limites-cache-e-termos-de-uso)
18. [Funcionalidades descontinuadas](#18-funcionalidades-descontinuadas)
19. [Checklist de produção](#19-checklist-de-produção)
20. [Referências oficiais](#20-referências-oficiais)

---

## 1. Visão geral

A API do Last.fm expõe dados de:

- usuários;
- histórico de músicas ouvidas;
- artistas;
- álbuns;
- faixas;
- tags e gêneros;
- rankings globais;
- rankings por país;
- artistas e faixas similares;
- músicas marcadas como favoritas;
- scrobbles;
- estado de “tocando agora”.

A API usa um modelo RPC sobre HTTP. Embora a documentação a chame de REST, todas as operações são enviadas ao mesmo endpoint e o método desejado é informado no parâmetro `method`.

Exemplo:

```text
https://ws.audioscrobbler.com/2.0/
    ?method=artist.getInfo
    &artist=Cher
    &api_key=SUA_API_KEY
    &format=json
```

O nome do método segue normalmente o formato:

```text
pacote.metodo
```

Exemplos:

```text
artist.getInfo
user.getRecentTracks
track.scrobble
chart.getTopArtists
```

### Endpoint principal

```text
https://ws.audioscrobbler.com/2.0/
```

A documentação antiga ainda mostra exemplos com `http://`. Em aplicações modernas, use **HTTPS**.

---

## 2. O que a API permite fazer

### Consultas públicas

Com apenas uma `api_key`, é possível consultar, por exemplo:

- perfil de um usuário;
- últimas músicas ouvidas;
- artistas, álbuns e faixas mais ouvidos;
- músicas favoritas;
- informações de artistas;
- artistas similares;
- álbuns e faixas populares de um artista;
- informações e tracklist de um álbum;
- informações de uma faixa;
- rankings globais;
- rankings por país;
- conteúdo associado a tags.

### Operações autenticadas

Com uma sessão de usuário, é possível:

- registrar scrobbles;
- atualizar “tocando agora”;
- amar ou desamar uma faixa;
- adicionar ou remover tags pessoais;
- realizar outras operações que modificam a conta do usuário.

### O que a API não é

A API não deve ser tratada como:

- serviço de streaming de áudio;
- API oficial do Spotify;
- fonte garantida de capas em alta resolução;
- catálogo musical completamente normalizado;
- substituto integral do MusicBrainz;
- banco de dados para replicar toda a base do Last.fm.

Dados como nome de artista, álbum, MBID, capa e biografia podem estar ausentes, desatualizados ou inconsistentes.

---

## 3. Criando uma chave de API

É necessário possuir uma conta do Last.fm e registrar uma aplicação.

Página de criação:

<https://www.last.fm/api/account/create>

A conta da API fornece dois valores principais:

```text
API Key
Shared Secret
```

### `API Key`

Identifica sua aplicação nas chamadas.

Exemplo fictício:

```text
1234567890abcdef1234567890abcdef
```

Ela é enviada como:

```text
api_key=1234567890abcdef1234567890abcdef
```

### `Shared Secret`

É usado para gerar a assinatura `api_sig`.

Exemplo fictício:

```text
abcdef1234567890abcdef1234567890
```

O secret **não deve ser enviado ao navegador, incluído no JavaScript público, commitado no Git ou exposto em logs**.

### Variáveis de ambiente sugeridas

```env
LASTFM_API_KEY=1234567890abcdef1234567890abcdef
LASTFM_SHARED_SECRET=abcdef1234567890abcdef1234567890
LASTFM_CALLBACK_URL=https://seusite.com/auth/lastfm/callback
```

Para uma sessão persistente:

```env
LASTFM_SESSION_KEY=chave_de_sessao_do_usuario
```

Adicione `.env` ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

---

## 4. Endpoint e estrutura das requisições

## 4.1 Requisição de leitura

Métodos de leitura normalmente usam `GET`.

```bash
curl --get 'https://ws.audioscrobbler.com/2.0/' \
  --data-urlencode 'method=artist.getInfo' \
  --data-urlencode 'artist=Radiohead' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'format=json'
```

Parâmetros comuns:

| Parâmetro | Função |
|---|---|
| `method` | Método da API, como `artist.getInfo` |
| `api_key` | Chave pública da aplicação |
| `format` | `json` para receber JSON; sem ele, o padrão é XML |
| `page` | Página da consulta |
| `limit` | Quantidade de registros |
| `autocorrect` | `1` para permitir correção automática de nomes |
| `lang` | Idioma de biografias, quando suportado |
| `callback` | Nome de callback JSONP; normalmente não deve ser usado |

## 4.2 Requisição de escrita

Métodos que alteram dados exigem:

- `POST`;
- autenticação;
- `api_key`;
- `sk`;
- `api_sig`;
- parâmetros no corpo da requisição.

Exemplo estrutural:

```bash
curl -X POST 'https://ws.audioscrobbler.com/2.0/' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'method=track.love' \
  --data-urlencode 'artist=Radiohead' \
  --data-urlencode 'track=Paranoid Android' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'sk=SUA_SESSION_KEY' \
  --data-urlencode 'api_sig=ASSINATURA_MD5' \
  --data-urlencode 'format=json'
```

### Codificação

Use:

```text
UTF-8
application/x-www-form-urlencoded
```

Todos os valores devem ser corretamente codificados para URL.

### `User-Agent`

A documentação solicita um `User-Agent` identificável em todas as requisições.

Exemplo:

```http
User-Agent: MeuApp/1.0 (contato@exemplo.com)
```

Isso ajuda o Last.fm a identificar sua aplicação e reduz o risco de bloqueios por tráfego anônimo ou suspeito.

---

## 5. Credenciais e conceitos de autenticação

Existem quatro elementos que costumam ser confundidos.

| Elemento | Origem | Função | Pode ir ao frontend? |
|---|---|---|---|
| `api_key` | Conta da API | Identifica a aplicação | Tecnicamente sim, mas pode ser abusada |
| `shared secret` | Conta da API | Gera `api_sig` | **Não** |
| `token` | Fluxo temporário de autorização | Troca por uma sessão | Apenas durante o fluxo |
| `session key` / `sk` | `auth.getSession` | Representa a autorização do usuário | Preferencialmente não |

### Token temporário

O token:

- é associado à aplicação;
- precisa ser autorizado pelo usuário;
- vale por 60 minutos;
- só pode ser usado uma vez para criar uma sessão.

### Session key

A session key:

- é enviada no parâmetro `sk`;
- representa uma sessão autorizada;
- normalmente não expira automaticamente;
- pode deixar de funcionar caso o usuário revogue o acesso da aplicação.

---

## 6. Chamadas públicas, autenticadas e de escrita

### Pública

Exige normalmente:

```text
method
api_key
```

Exemplo:

```text
user.getRecentTracks
```

### Assinada, mas ainda sem sessão

Usada durante o fluxo de autenticação.

Exemplo:

```text
auth.getToken
auth.getSession
```

Exige:

```text
api_key
api_sig
```

`auth.getSession` também exige:

```text
token
```

### Autenticada

Exige:

```text
api_key
api_sig
sk
```

### Escrita

Além da autenticação, deve usar `POST`.

Exemplos:

```text
track.scrobble
track.updateNowPlaying
track.love
track.unlove
album.addTags
artist.removeTag
```

---

## 7. Assinatura `api_sig`

A assinatura é um hash MD5 construído com os parâmetros da chamada e o shared secret.

## 7.1 Algoritmo

1. Pegue todos os parâmetros que serão assinados.
2. Remova `format` e `callback`.
3. Não inclua `api_sig`.
4. Ordene os parâmetros alfabeticamente pelo nome.
5. Concatene cada nome diretamente com seu valor.
6. Acrescente o shared secret ao final.
7. Calcule o MD5 da string completa.
8. Envie o resultado hexadecimal como `api_sig`.

Exemplo de parâmetros:

```text
api_key=xxxxxxxx
method=auth.getSession
token=yyyyyyyy
```

String intermediária:

```text
api_keyxxxxxxxxmethodauth.getSessiontokenyyyyyyyy
```

Após acrescentar o secret:

```text
api_keyxxxxxxxxmethodauth.getSessiontokenyyyyyyyyMEU_SHARED_SECRET
```

Assinatura:

```text
md5(string_completa)
```

## 7.2 Implementação em TypeScript/Node.js

```ts
import { createHash } from "node:crypto";

type LastFmSignableValue = string | number | boolean;

export function createLastFmSignature(
  params: Record<string, LastFmSignableValue>,
  sharedSecret: string,
): string {
  const signatureBase = Object.entries(params)
    .filter(([key]) => key !== "format" && key !== "callback" && key !== "api_sig")
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, "en", { sensitivity: "variant" }))
    .map(([key, value]) => `${key}${String(value)}`)
    .join("");

  return createHash("md5")
    .update(signatureBase + sharedSecret, "utf8")
    .digest("hex");
}
```

Para evitar diferenças de locale na ordenação, uma variante mais rígida:

```ts
export function compareAscii(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
```

```ts
.sort(([keyA], [keyB]) => compareAscii(keyA, keyB))
```

### Atenção com scrobbles em lote

Parâmetros com índices devem ser ordenados pelo nome completo conforme a tabela ASCII.

Exemplo:

```text
artist[0]
artist[1]
artist[10]
artist[2]
```

A ordem lexical não é a mesma ordem numérica. A própria documentação alerta que:

```text
artist[10]
```

pode aparecer antes de:

```text
artist[1]
```

na ordenação usada para a assinatura. Não ordene os índices convertendo-os para números.

## 7.3 Exemplo de assinatura de `auth.getSession`

```ts
const params = {
  api_key: process.env.LASTFM_API_KEY!,
  method: "auth.getSession",
  token,
};

const apiSig = createLastFmSignature(
  params,
  process.env.LASTFM_SHARED_SECRET!,
);
```

---

## 8. Fluxos de autenticação

## 8.1 Aplicação web

Fluxo recomendado para websites.

### Etapa 1 — redirecionar o usuário

```text
https://www.last.fm/api/auth/?api_key=SUA_API_KEY
```

Com callback customizado:

```text
https://www.last.fm/api/auth/
  ?api_key=SUA_API_KEY
  &cb=https%3A%2F%2Fseusite.com%2Fauth%2Flastfm%2Fcallback
```

O callback precisa estar corretamente configurado na conta da API.

### Etapa 2 — receber o token

Após o usuário autorizar, o Last.fm redireciona para:

```text
https://seusite.com/auth/lastfm/callback?token=TOKEN
```

### Etapa 3 — trocar o token por uma sessão

Parâmetros:

```text
method=auth.getSession
api_key=SUA_API_KEY
token=TOKEN
api_sig=ASSINATURA
format=json
```

Exemplo:

```ts
import { createLastFmSignature } from "./lastfm-signature";

const API_URL = "https://ws.audioscrobbler.com/2.0/";

interface LastFmSessionResponse {
  session?: {
    name: string;
    key: string;
    subscriber: string;
  };
  error?: number;
  message?: string;
}

export async function exchangeTokenForSession(
  token: string,
): Promise<LastFmSessionResponse["session"]> {
  const apiKey = process.env.LASTFM_API_KEY;
  const secret = process.env.LASTFM_SHARED_SECRET;

  if (!apiKey || !secret) {
    throw new Error("LASTFM_API_KEY ou LASTFM_SHARED_SECRET não configurado");
  }

  const signedParams = {
    api_key: apiKey,
    method: "auth.getSession",
    token,
  };

  const body = new URLSearchParams({
    ...signedParams,
    api_sig: createLastFmSignature(signedParams, secret),
    format: "json",
  });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "MeuApp/1.0 (contato@exemplo.com)",
    },
    body,
  });

  const data = (await response.json()) as LastFmSessionResponse;

  if (!response.ok || data.error || !data.session) {
    throw new Error(
      `Falha ao criar sessão: ${data.error ?? response.status} ${data.message ?? ""}`,
    );
  }

  return data.session;
}
```

Armazene:

```text
session.key
```

como `sk`.

## 8.2 Aplicação desktop

Fluxo:

1. chamar `auth.getToken`;
2. abrir o navegador;
3. enviar o usuário para autorizar o token;
4. chamar `auth.getSession`;
5. armazenar a session key.

URL de autorização:

```text
https://www.last.fm/api/auth/
  ?api_key=SUA_API_KEY
  &token=TOKEN
```

A aplicação desktop normalmente consulta ou aguarda o usuário concluir a autorização antes de chamar `auth.getSession`.

## 8.3 Aplicação móvel standalone

Existe o método:

```text
auth.getMobileSession
```

Ele recebe:

```text
username
password
api_key
api_sig
```

Requisitos oficiais:

- `POST`;
- HTTPS;
- senha em texto puro dentro da requisição HTTPS.

Apesar de documentado, esse fluxo exige que sua aplicação manipule diretamente a senha do usuário. Para aplicações modernas que possuem navegador, prefira o fluxo web ou desktop, no qual a senha é digitada diretamente no domínio do Last.fm.

Nunca registre a senha em logs.

---

## 9. Cliente TypeScript reutilizável

O exemplo abaixo implementa:

- requisições públicas;
- requisições autenticadas;
- timeout;
- parsing de erro;
- `User-Agent`;
- assinatura;
- suporte a GET e POST.

```ts
import { createHash } from "node:crypto";

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

type Primitive = string | number | boolean;
type Params = Record<string, Primitive | undefined>;

export class LastFmApiError extends Error {
  public readonly code: number | null;
  public readonly httpStatus: number;

  constructor(message: string, code: number | null, httpStatus: number) {
    super(message);
    this.name = "LastFmApiError";
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

interface LastFmErrorBody {
  error?: number;
  message?: string;
}

interface LastFmClientOptions {
  apiKey: string;
  sharedSecret?: string;
  sessionKey?: string;
  userAgent: string;
  timeoutMs?: number;
}

export class LastFmClient {
  private readonly apiKey: string;
  private readonly sharedSecret?: string;
  private readonly sessionKey?: string;
  private readonly userAgent: string;
  private readonly timeoutMs: number;

  constructor(options: LastFmClientOptions) {
    this.apiKey = options.apiKey;
    this.sharedSecret = options.sharedSecret;
    this.sessionKey = options.sessionKey;
    this.userAgent = options.userAgent;
    this.timeoutMs = options.timeoutMs ?? 10_000;
  }

  private sign(params: Record<string, Primitive>): string {
    if (!this.sharedSecret) {
      throw new Error("sharedSecret é obrigatório para chamadas assinadas");
    }

    const base = Object.entries(params)
      .filter(([key]) => !["format", "callback", "api_sig"].includes(key))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, value]) => `${key}${String(value)}`)
      .join("");

    return createHash("md5")
      .update(base + this.sharedSecret, "utf8")
      .digest("hex");
  }

  private cleanParams(params: Params): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params)
        .filter((entry): entry is [string, Primitive] => entry[1] !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    let data: T & LastFmErrorBody;

    try {
      data = (await response.json()) as T & LastFmErrorBody;
    } catch {
      throw new LastFmApiError(
        "O Last.fm retornou uma resposta que não é JSON válido",
        null,
        response.status,
      );
    }

    if (!response.ok || data.error !== undefined) {
      throw new LastFmApiError(
        data.message ?? `Erro HTTP ${response.status}`,
        data.error ?? null,
        response.status,
      );
    }

    return data;
  }

  async get<T>(method: string, params: Params = {}): Promise<T> {
    const query = new URLSearchParams({
      method,
      api_key: this.apiKey,
      format: "json",
      ...this.cleanParams(params),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${LASTFM_API_URL}?${query}`, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      return await this.parseResponse<T>(response);
    } finally {
      clearTimeout(timeout);
    }
  }

  async post<T>(
    method: string,
    params: Params = {},
    requireSession = true,
  ): Promise<T> {
    const signable: Record<string, Primitive> = {
      method,
      api_key: this.apiKey,
      ...Object.fromEntries(
        Object.entries(params).filter(
          (entry): entry is [string, Primitive] => entry[1] !== undefined,
        ),
      ),
    };

    if (requireSession) {
      if (!this.sessionKey) {
        throw new Error("sessionKey é obrigatória para esta chamada");
      }

      signable.sk = this.sessionKey;
    }

    const body = new URLSearchParams({
      ...this.cleanParams(signable),
      api_sig: this.sign(signable),
      format: "json",
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(LASTFM_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept: "application/json",
        },
        body,
        signal: controller.signal,
      });

      return await this.parseResponse<T>(response);
    } finally {
      clearTimeout(timeout);
    }
  }
}
```

### Uso

```ts
const lastFm = new LastFmClient({
  apiKey: process.env.LASTFM_API_KEY!,
  sharedSecret: process.env.LASTFM_SHARED_SECRET,
  sessionKey: process.env.LASTFM_SESSION_KEY,
  userAgent: "MeuApp/1.0 (contato@exemplo.com)",
});
```

Consulta pública:

```ts
const result = await lastFm.get("user.getRecentTracks", {
  user: "RJ",
  limit: 20,
  extended: 1,
});
```

Chamada autenticada:

```ts
await lastFm.post("track.love", {
  artist: "Radiohead",
  track: "Paranoid Android",
});
```

---

## 10. Métodos mais usados

## 10.1 `user.getRecentTracks`

Retorna as faixas ouvidas recentemente por um usuário.

```bash
curl --get 'https://ws.audioscrobbler.com/2.0/' \
  --data-urlencode 'method=user.getRecentTracks' \
  --data-urlencode 'user=RJ' \
  --data-urlencode 'limit=50' \
  --data-urlencode 'extended=1' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'format=json'
```

Parâmetros:

| Parâmetro | Obrigatório | Descrição |
|---|---:|---|
| `user` | Sim | Nome do usuário |
| `limit` | Não | Padrão 50; máximo documentado 200 |
| `page` | Não | Página |
| `from` | Não | Timestamp UNIX UTC inicial |
| `to` | Não | Timestamp UNIX UTC final |
| `extended` | Não | `1` inclui mais dados do artista e status de loved |
| `api_key` | Sim | Chave da aplicação |

Não exige sessão.

### Faixa tocando agora

Caso o usuário esteja ouvindo uma música, o primeiro registro pode ter:

```json
{
  "@attr": {
    "nowplaying": "true"
  }
}
```

Essa entrada pode não possuir o campo `date`, porque ainda não é um scrobble concluído.

Verificação segura:

```ts
const isNowPlaying = track["@attr"]?.nowplaying === "true";
```

## 10.2 `user.getTopArtists`

Retorna os artistas mais ouvidos.

```text
period=overall
period=7day
period=1month
period=3month
period=6month
period=12month
```

Exemplo:

```bash
curl --get 'https://ws.audioscrobbler.com/2.0/' \
  --data-urlencode 'method=user.getTopArtists' \
  --data-urlencode 'user=RJ' \
  --data-urlencode 'period=12month' \
  --data-urlencode 'limit=100' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'format=json'
```

Métodos equivalentes:

```text
user.getTopTracks
user.getTopAlbums
```

## 10.3 `user.getInfo`

Retorna informações do perfil:

- nome;
- nome real, quando público;
- país;
- URL do perfil;
- imagens;
- total de scrobbles;
- data de registro;
- status de assinante.

```text
method=user.getInfo
user=RJ
```

Não presuma que campos opcionais sempre existam.

## 10.4 `user.getLovedTracks`

Retorna as faixas que o usuário marcou como loved.

```text
method=user.getLovedTracks
user=RJ
page=1
limit=50
```

Não exige autenticação para consultar um perfil público.

## 10.5 `artist.search`

Pesquisa artistas por nome.

```bash
curl --get 'https://ws.audioscrobbler.com/2.0/' \
  --data-urlencode 'method=artist.search' \
  --data-urlencode 'artist=Radiohead' \
  --data-urlencode 'limit=30' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'format=json'
```

Parâmetros:

```text
artist
limit
page
api_key
```

Os resultados são ordenados por relevância.

## 10.6 `artist.getInfo`

Retorna metadados do artista:

- nome;
- MBID;
- URL;
- estatísticas;
- tags;
- artistas similares;
- biografia;
- imagens, quando disponíveis.

```text
method=artist.getInfo
artist=Radiohead
autocorrect=1
lang=pt
username=USUARIO_OPCIONAL
```

O parâmetro `username` inclui contexto pessoal, como o playcount daquele usuário para o artista.

É possível identificar o artista por:

```text
artist
```

ou por:

```text
mbid
```

## 10.7 `artist.getSimilar`

Retorna artistas similares e um valor de similaridade.

```text
method=artist.getSimilar
artist=Radiohead
limit=50
autocorrect=1
```

O campo `match` normalmente vem como string e deve ser convertido para número.

```ts
const similarity = Number(item.match);
```

## 10.8 `artist.getTopAlbums`

Retorna os álbuns mais populares de um artista.

```text
method=artist.getTopAlbums
artist=Radiohead
page=1
limit=50
autocorrect=1
```

## 10.9 `artist.getTopTracks`

Retorna as faixas mais populares de um artista.

```text
method=artist.getTopTracks
artist=Radiohead
page=1
limit=50
autocorrect=1
```

## 10.10 `track.search`

Pesquisa uma faixa.

```text
method=track.search
track=Creep
artist=Radiohead
page=1
limit=30
```

O artista é opcional, mas melhora a precisão.

## 10.11 `track.getInfo`

Retorna:

- duração;
- artista;
- álbum;
- posição no álbum;
- listeners;
- playcount;
- tags;
- wiki;
- contexto de um usuário, quando informado.

```text
method=track.getInfo
artist=Radiohead
track=Creep
username=RJ
autocorrect=1
```

Também aceita `mbid`.

A duração é normalmente retornada em milissegundos e como string:

```ts
const durationMs = Number(track.duration);
```

## 10.12 `album.getInfo`

Retorna:

- nome;
- artista;
- MBID;
- URL;
- imagens;
- listeners;
- playcount;
- tags;
- wiki;
- tracklist.

```text
method=album.getInfo
artist=Radiohead
album=OK Computer
autocorrect=1
lang=pt
username=RJ
```

Também aceita `mbid`.

## 10.13 Rankings globais

```text
chart.getTopArtists
chart.getTopTracks
chart.getTopTags
```

Parâmetros comuns:

```text
page
limit
api_key
```

## 10.14 Rankings por país

```text
geo.getTopArtists
geo.getTopTracks
```

Exemplo:

```bash
curl --get 'https://ws.audioscrobbler.com/2.0/' \
  --data-urlencode 'method=geo.getTopTracks' \
  --data-urlencode 'country=Brazil' \
  --data-urlencode 'limit=50' \
  --data-urlencode 'api_key=SUA_API_KEY' \
  --data-urlencode 'format=json'
```

O país deve seguir os nomes do padrão ISO 3166-1.

## 10.15 Métodos de tags

Exemplos:

```text
tag.getInfo
tag.getSimilar
tag.getTopArtists
tag.getTopAlbums
tag.getTopTracks
tag.getTopTags
```

Consulta:

```text
method=tag.getTopArtists
tag=progressive metal
limit=50
```

---

## 11. Scrobbling

Scrobbling registra no perfil que o usuário ouviu uma faixa.

O fluxo recomendado para cada reprodução é:

1. enviar `track.updateNowPlaying` quando a música começar;
2. aguardar a faixa atingir o critério de scrobble;
3. enviar `track.scrobble`.

## 11.1 Quando uma reprodução deve virar scrobble

Segundo a documentação oficial:

- a faixa deve ter mais de 30 segundos;
- deve ter sido reproduzida por pelo menos metade da duração;
- ou por 4 minutos;
- vale o que acontecer primeiro.

Exemplos:

| Duração da faixa | Momento mínimo |
|---:|---:|
| 2 min | 1 min |
| 5 min | 2 min 30 s |
| 10 min | 4 min |
| 30 s ou menos | Não deve ser scrobblada |

## 11.2 `track.updateNowPlaying`

Parâmetros:

| Parâmetro | Obrigatório | Descrição |
|---|---:|---|
| `artist` | Sim | Nome do artista |
| `track` | Sim | Nome da faixa |
| `album` | Não | Álbum |
| `trackNumber` | Não | Número no álbum |
| `mbid` | Não | MusicBrainz Track ID |
| `duration` | Não | Duração em segundos |
| `albumArtist` | Não | Artista do álbum |
| `api_key` | Sim | API key |
| `api_sig` | Sim | Assinatura |
| `sk` | Sim | Session key |

Requer `POST`.

```ts
await lastFm.post("track.updateNowPlaying", {
  artist: "Radiohead",
  track: "Paranoid Android",
  album: "OK Computer",
  albumArtist: "Radiohead",
  trackNumber: 2,
  duration: 387,
});
```

Isso atualiza o perfil, mas não adiciona a reprodução aos charts por si só.

## 11.3 `track.scrobble`

Parâmetros principais:

| Parâmetro | Obrigatório | Descrição |
|---|---:|---|
| `artist` | Sim | Artista |
| `track` | Sim | Faixa |
| `timestamp` | Sim | Momento em que a faixa começou, em UNIX UTC |
| `album` | Não | Álbum |
| `chosenByUser` | Não | `1` se escolhida pelo usuário; `0` se veio de rádio/recomendação |
| `trackNumber` | Não | Número da faixa |
| `mbid` | Não | MBID |
| `albumArtist` | Não | Artista do álbum |
| `duration` | Não | Duração em segundos |
| `api_key` | Sim | API key |
| `api_sig` | Sim | Assinatura |
| `sk` | Sim | Session key |

O `timestamp` representa **quando a música começou**, não quando terminou.

```ts
const startedAt = Math.floor(Date.now() / 1000);

await lastFm.post("track.scrobble", {
  artist: "Radiohead",
  track: "Paranoid Android",
  album: "OK Computer",
  albumArtist: "Radiohead",
  trackNumber: 2,
  duration: 387,
  chosenByUser: 1,
  timestamp: startedAt,
});
```

## 11.4 `chosenByUser`

Use:

```text
1
```

quando o usuário escolheu diretamente a faixa.

Use:

```text
0
```

quando a faixa foi escolhida por outra fonte, por exemplo:

- rádio;
- autoplay;
- serviço de recomendação;
- programação feita por DJ ou apresentador.

Caso não haja clareza, a documentação recomenda não enviar esse parâmetro.

## 11.5 Scrobble em lote

É possível enviar até 50 scrobbles em uma requisição.

Formato:

```text
artist[0]
track[0]
timestamp[0]

artist[1]
track[1]
timestamp[1]
```

Exemplo de montagem:

```ts
interface ScrobbleInput {
  artist: string;
  track: string;
  timestamp: number;
  album?: string;
  albumArtist?: string;
  duration?: number;
  chosenByUser?: 0 | 1;
}

function buildBatchScrobbleParams(
  scrobbles: ScrobbleInput[],
): Record<string, string | number> {
  if (scrobbles.length === 0 || scrobbles.length > 50) {
    throw new Error("O lote deve conter entre 1 e 50 scrobbles");
  }

  const params: Record<string, string | number> = {};

  scrobbles.forEach((item, index) => {
    params[`artist[${index}]`] = item.artist;
    params[`track[${index}]`] = item.track;
    params[`timestamp[${index}]`] = item.timestamp;

    if (item.album !== undefined) {
      params[`album[${index}]`] = item.album;
    }

    if (item.albumArtist !== undefined) {
      params[`albumArtist[${index}]`] = item.albumArtist;
    }

    if (item.duration !== undefined) {
      params[`duration[${index}]`] = item.duration;
    }

    if (item.chosenByUser !== undefined) {
      params[`chosenByUser[${index}]`] = item.chosenByUser;
    }
  });

  return params;
}
```

```ts
await lastFm.post(
  "track.scrobble",
  buildBatchScrobbleParams(scrobbles),
);
```

## 11.6 Cache local

O cliente deve manter scrobbles pendentes quando houver falha temporária.

Recomendação:

- persistir o cache em disco ou banco local;
- manter a ordem cronológica;
- enviar scrobbles antigos antes dos novos;
- agrupar em lotes de até 50;
- remover do cache somente os itens confirmados;
- distinguir erro temporário de erro permanente.

## 11.7 Resposta aceita, mas ignorada

Uma chamada pode retornar sucesso geral e ainda ignorar um scrobble individual.

Códigos de `ignoredMessage` documentados:

| Código | Significado |
|---:|---|
| `0` | Não ignorado |
| `1` | Artista filtrado |
| `2` | Faixa filtrada |
| `3` | Timestamp antigo demais |
| `4` | Timestamp futuro demais |
| `5` | Limite diário de scrobbles excedido |

Portanto, não basta verificar apenas o HTTP status ou apenas a ausência de `error`.

## 11.8 Correções automáticas

O Last.fm pode corrigir nomes de artista, álbum ou faixa.

Exemplo:

```xml
<artist corrected="1">Björk</artist>
```

A documentação orienta a não substituir automaticamente os metadados locais usando a correção retornada pelo “now playing”, a menos que o usuário aprove explicitamente.

---

## 12. Paginação, períodos e timestamps

## 12.1 Paginação

Muitos métodos usam:

```text
page
limit
```

Metadados de paginação costumam aparecer em `@attr`.

Exemplo aproximado:

```json
{
  "recenttracks": {
    "track": [],
    "@attr": {
      "user": "RJ",
      "page": "1",
      "perPage": "50",
      "totalPages": "100",
      "total": "5000"
    }
  }
}
```

Todos esses números podem chegar como strings.

```ts
const totalPages = Number(data.recenttracks["@attr"].totalPages);
```

### Iteração

```ts
async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; totalPages: number }>,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await fetchPage(page);
    all.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}
```

Não busque milhares de páginas sem necessidade. Prefira:

- filtros por data;
- cache;
- sincronização incremental;
- limites razoáveis.

## 12.2 Períodos de top charts pessoais

Valores documentados:

```text
overall
7day
1month
3month
6month
12month
```

Esses períodos não aceitam datas arbitrárias.

Para recortes exatos, use charts semanais quando aplicável ou derive estatísticas com `user.getRecentTracks` e parâmetros `from`/`to`.

## 12.3 Timestamps

A API usa timestamp UNIX em segundos UTC.

Correto:

```ts
const unixSeconds = Math.floor(Date.now() / 1000);
```

Incorreto:

```ts
const milliseconds = Date.now();
```

O segundo valor é 1000 vezes maior e será interpretado como uma data futura inválida.

Conversão:

```ts
const date = new Date(unixSeconds * 1000);
```

---

## 13. Formato das respostas

## 13.1 XML

Sem `format=json`, o padrão é XML.

Resposta de sucesso:

```xml
<lfm status="ok">
  ...
</lfm>
```

Resposta de erro:

```xml
<lfm status="failed">
  <error code="10">Invalid API Key</error>
</lfm>
```

## 13.2 JSON

Envie:

```text
format=json
```

Erro JSON:

```json
{
  "error": 10,
  "message": "Invalid API Key"
}
```

### Regras e peculiaridades

A conversão oficial de XML para JSON produz estruturas pouco uniformes:

- atributos XML viram propriedades como `@attr`;
- texto com atributos pode aparecer em `#text`;
- números geralmente vêm como strings;
- valores booleanos geralmente vêm como `"0"` e `"1"`;
- listas aparecem como arrays;
- campos vazios podem aparecer como `""`, `{}` ou estar ausentes;
- imagens costumam ser arrays com `size` em `@attr` e URL em `#text`.

Exemplo:

```json
{
  "image": [
    {
      "#text": "https://...",
      "size": "small"
    }
  ]
}
```

Em algumas respostas, o atributo pode aparecer em `size`; em outras conversões ou bibliotecas, em `@attr.size`. Tipagens devem refletir a resposta realmente observada.

## 13.3 Normalização recomendada

```ts
function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toBoolean01(value: unknown): boolean {
  return value === 1 || value === "1" || value === true;
}

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}
```

## 13.4 Imagens

Utilitário:

```ts
interface LastFmImage {
  "#text"?: string;
  size?: string;
}

function getLargestImage(images: LastFmImage[] | undefined): string | null {
  if (!images) return null;

  const preferredOrder = ["mega", "extralarge", "large", "medium", "small"];

  for (const size of preferredOrder) {
    const found = images.find(
      (image) => image.size === size && image["#text"]?.trim(),
    );

    if (found?.["#text"]) {
      return found["#text"];
    }
  }

  return null;
}
```

Não dependa de imagens como identificadores. URLs podem ser vazias ou mudar.

## 13.5 MBID

`mbid` é um identificador do MusicBrainz, mas pode estar vazio.

```ts
const mbid = item.mbid?.trim() || null;
```

Não use apenas o MBID como chave obrigatória. Estratégias comuns:

```text
artist + track
artist + album
URL canônica do Last.fm
MBID quando disponível
```

---

## 14. Erros e retentativas

Erros comuns documentados:

| Código | Significado | Ação sugerida |
|---:|---|---|
| `2` | Serviço inválido | Corrigir `method` |
| `3` | Método inválido | Corrigir nome do método |
| `4` | Falha de autenticação | Revisar autorização e credenciais |
| `5` | Formato inválido | Usar XML ou `format=json` |
| `6` | Parâmetro obrigatório ausente | Corrigir requisição |
| `7` | Recurso inválido | Validar usuário, artista ou item |
| `8` | Operação falhou | Avaliar mensagem; retentar com cautela |
| `9` | Session key inválida | Reautenticar usuário |
| `10` | API key inválida | Corrigir chave |
| `11` | Serviço offline | Retentar depois |
| `13` | Assinatura inválida | Corrigir `api_sig` |
| `14` | Token não autorizado | Usuário ainda não autorizou |
| `15` | Token expirado | Reiniciar autenticação |
| `16` | Erro temporário | Retentar com backoff |
| `26` | API key suspensa | Contatar o Last.fm |
| `29` | Rate limit excedido | Reduzir chamadas e aplicar backoff |

### Não confie apenas no HTTP status

A documentação de scrobbling alerta que:

- HTTP 200 não garante sucesso da operação;
- um erro pode estar no corpo;
- um lote pode ter itens aceitos e ignorados;
- é necessário inspecionar o JSON ou XML.

## 14.1 Política de retry

Retente automaticamente principalmente:

```text
11
16
29
```

Para `9`:

1. não repita indefinidamente;
2. invalide a sessão local;
3. peça nova autorização;
4. somente então tente novamente.

Não retente erros de validação, como `6`, sem corrigir a requisição.

## 14.2 Backoff exponencial com jitter

```ts
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 5,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const retryable =
        error instanceof LastFmApiError &&
        [11, 16, 29].includes(error.code ?? -1);

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const baseDelay = 500 * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(baseDelay + jitter);
    }
  }

  throw lastError;
}
```

---

## 15. Catálogo dos métodos oficiais

A lista abaixo corresponde aos métodos exibidos na documentação principal.

Legenda:

- **Público**: normalmente requer apenas `api_key`;
- **Auth**: requer sessão, assinatura ou fluxo de autenticação;
- **POST**: modifica dados e deve ser enviado por POST.

## 15.1 Álbum

| Método | Tipo | Finalidade |
|---|---|---|
| `album.addTags` | Auth + POST | Adiciona tags pessoais a um álbum |
| `album.getInfo` | Público | Metadados e tracklist de um álbum |
| `album.getTags` | Público/contextual | Tags de um álbum; pode usar contexto de usuário |
| `album.getTopTags` | Público | Tags mais populares de um álbum |
| `album.removeTag` | Auth + POST | Remove tag pessoal |
| `album.search` | Público | Pesquisa álbuns |

## 15.2 Artista

| Método | Tipo | Finalidade |
|---|---|---|
| `artist.addTags` | Auth + POST | Adiciona tags pessoais |
| `artist.getCorrection` | Público | Consulta correção de nome |
| `artist.getInfo` | Público | Metadados, bio, tags e similares |
| `artist.getSimilar` | Público | Artistas similares |
| `artist.getTags` | Público/contextual | Tags associadas ao artista |
| `artist.getTopAlbums` | Público | Álbuns mais populares |
| `artist.getTopTags` | Público | Tags mais populares |
| `artist.getTopTracks` | Público | Faixas mais populares |
| `artist.removeTag` | Auth + POST | Remove tag pessoal |
| `artist.search` | Público | Pesquisa artistas |

## 15.3 Autenticação

| Método | Tipo | Finalidade |
|---|---|---|
| `auth.getMobileSession` | Assinado + POST + HTTPS | Cria sessão usando credenciais |
| `auth.getSession` | Assinado | Troca token autorizado por sessão |
| `auth.getToken` | Assinado | Gera token para aplicação desktop |

## 15.4 Charts globais

| Método | Tipo | Finalidade |
|---|---|---|
| `chart.getTopArtists` | Público | Artistas globais mais populares |
| `chart.getTopTags` | Público | Tags globais mais populares |
| `chart.getTopTracks` | Público | Faixas globais mais populares |

## 15.5 Geografia

| Método | Tipo | Finalidade |
|---|---|---|
| `geo.getTopArtists` | Público | Artistas populares por país |
| `geo.getTopTracks` | Público | Faixas populares por país |

## 15.6 Biblioteca

| Método | Tipo | Finalidade |
|---|---|---|
| `library.getArtists` | Público | Artistas da biblioteca de um usuário |

## 15.7 Tags

| Método | Tipo | Finalidade |
|---|---|---|
| `tag.getInfo` | Público | Informações sobre uma tag |
| `tag.getSimilar` | Público | Tags similares |
| `tag.getTopAlbums` | Público | Álbuns mais associados à tag |
| `tag.getTopArtists` | Público | Artistas mais associados à tag |
| `tag.getTopTags` | Público | Tags mais populares |
| `tag.getTopTracks` | Público | Faixas mais associadas à tag |
| `tag.getWeeklyChartList` | Público | Intervalos semanais disponíveis |

## 15.8 Faixas

| Método | Tipo | Finalidade |
|---|---|---|
| `track.addTags` | Auth + POST | Adiciona tags pessoais |
| `track.getCorrection` | Público | Consulta correção de artista/faixa |
| `track.getInfo` | Público | Metadados da faixa |
| `track.getSimilar` | Público | Faixas similares |
| `track.getTags` | Público/contextual | Tags da faixa |
| `track.getTopTags` | Público | Tags mais populares |
| `track.love` | Auth + POST | Marca faixa como loved |
| `track.removeTag` | Auth + POST | Remove tag pessoal |
| `track.scrobble` | Auth + POST | Registra uma ou até 50 reproduções |
| `track.search` | Público | Pesquisa faixas |
| `track.unlove` | Auth + POST | Remove loved |
| `track.updateNowPlaying` | Auth + POST | Atualiza “tocando agora” |

## 15.9 Usuários

| Método | Tipo | Finalidade |
|---|---|---|
| `user.getFriends` | Público | Amigos de um usuário |
| `user.getInfo` | Público | Dados do perfil |
| `user.getLovedTracks` | Público | Faixas marcadas como loved |
| `user.getPersonalTags` | Público/contextual | Itens associados a tags pessoais |
| `user.getRecentTracks` | Público | Histórico recente |
| `user.getTopAlbums` | Público | Álbuns mais ouvidos |
| `user.getTopArtists` | Público | Artistas mais ouvidos |
| `user.getTopTags` | Público | Tags mais usadas pelo usuário |
| `user.getTopTracks` | Público | Faixas mais ouvidas |
| `user.getWeeklyAlbumChart` | Público | Ranking de álbuns em intervalo semanal |
| `user.getWeeklyArtistChart` | Público | Ranking de artistas em intervalo semanal |
| `user.getWeeklyChartList` | Público | Intervalos semanais disponíveis |
| `user.getWeeklyTrackChart` | Público | Ranking de faixas em intervalo semanal |

Para parâmetros e erros específicos, consulte:

```text
https://www.last.fm/api/show/NOME_DO_METODO
```

Exemplo:

<https://www.last.fm/api/show/user.getRecentTracks>

---

## 16. Arquitetura recomendada

## 16.1 Aplicação somente de leitura

Para protótipos, chamadas públicas podem ser feitas diretamente do frontend com a `api_key`.

Riscos:

- terceiros podem copiar sua chave;
- sua cota ou reputação pode ser afetada;
- controle de cache fica limitado;
- não é possível proteger regras de negócio;
- você fica dependente de comportamento de CORS e rede do serviço.

Em produção, uma arquitetura mais controlada é:

```text
Frontend
   ↓
Seu backend / Worker / Function
   ↓
Last.fm API
```

O backend pode:

- esconder o shared secret;
- aplicar cache;
- controlar rate limit;
- normalizar respostas;
- implementar retry;
- registrar métricas;
- bloquear abuso;
- trocar a API no futuro sem alterar o frontend.

## 16.2 Aplicação autenticada

Fluxo:

```text
Navegador
   ↓ redireciona
Last.fm authorization
   ↓ callback com token
Backend
   ↓ auth.getSession
Banco seguro / sessão do servidor
```

O navegador não deve receber o shared secret.

## 16.3 Cloudflare Worker

Estrutura simplificada:

```ts
export interface Env {
  LASTFM_API_KEY: string;
  LASTFM_SHARED_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/lastfm/recent") {
      const user = url.searchParams.get("user");

      if (!user) {
        return Response.json(
          { error: "Parâmetro user é obrigatório" },
          { status: 400 },
        );
      }

      const params = new URLSearchParams({
        method: "user.getRecentTracks",
        user,
        limit: "50",
        api_key: env.LASTFM_API_KEY,
        format: "json",
      });

      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?${params}`,
        {
          headers: {
            "User-Agent": "MeuProjeto/1.0 (contato@exemplo.com)",
          },
          cf: {
            cacheTtl: 60,
            cacheEverything: true,
          },
        },
      );

      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
```

Não exponha `LASTFM_SHARED_SECRET` como variável `VITE_*`, `NEXT_PUBLIC_*` ou equivalente.

---

## 17. Limites, cache e termos de uso

## 17.1 Rate limit

A documentação não publica um número fixo universal de requisições por segundo.

Ela informa que:

- limites são definidos e aplicados pelo Last.fm;
- várias chamadas por segundo de forma contínua podem causar suspensão;
- o código `29` indica rate limit;
- não se deve tentar contornar os limites.

Consequência prática:

- aplique cache;
- deduplique requisições;
- não consulte a API a cada renderização;
- use debounce em buscas;
- use backoff em `29`;
- evite polling agressivo.

## 17.2 Cache

Os termos determinam que a aplicação respeite os headers HTTP de cache enviados pelo serviço.

Sugestões adicionais:

| Tipo de dado | Cache sugerido |
|---|---|
| Artista/álbum/faixa | 1 hora a 1 dia |
| Charts globais | 5 a 30 minutos |
| Top pessoal | 5 a 30 minutos |
| Recent tracks | 15 a 60 segundos |
| Now playing | Polling moderado, por exemplo 15–30 segundos |
| Tags e similares | 1 hora ou mais |

Esses valores são sugestões de arquitetura, não limites oficiais.

## 17.3 Limite de armazenamento

Os termos oficiais mencionam um “Reasonable Usage Cap” de até **100 MB de dados do Last.fm armazenados ou utilizados no total**, salvo autorização específica.

Não use a API para espelhar a base inteira.

## 17.4 Uso comercial e acadêmico

O Last.fm solicita contato prévio para:

- uso comercial;
- pesquisa;
- uso acadêmico.

Contato indicado:

```text
partners@last.fm
```

## 17.5 Atribuição

Os termos exigem crédito ao Last.fm e links para as páginas correspondentes.

Ao exibir um artista:

```text
https://www.last.fm/music/<ARTISTA>
```

Ao exibir um álbum:

```text
https://www.last.fm/music/<ARTISTA>/<ALBUM>
```

Ao exibir uma faixa:

```text
https://www.last.fm/music/<ARTISTA>/_/<FAIXA>
```

Ao exibir perfil:

```text
https://www.last.fm/user/<USUARIO>
```

Use preferencialmente a URL retornada pela própria API.

## 17.6 Restrições importantes

Os termos incluem restrições como:

- não sublicenciar os dados;
- não usar a API para exploração não autorizada de propriedade intelectual;
- não usar os dados para identificar ou contatar usuários;
- respeitar privacidade e legislação aplicável;
- não contornar limites;
- não tratar a licença como autorização para streaming;
- não presumir que imagens e artwork estejam licenciados para qualquer uso.

A seção jurídica deve ser revisada diretamente antes de publicar um produto comercial.

---

## 18. Funcionalidades descontinuadas

## 18.1 Radio API

A documentação marca a Radio API como:

```text
DEPRECATED
```

Ela não é mais suportada e permanece apenas como referência histórica.

Não desenvolva novas integrações com:

```text
radio.tune
radio.getPlaylist
```

## 18.2 Playlists API

A documentação também marca a Playlists API como:

```text
DEPRECATED
```

Ela não é mais suportada.

Não baseie novos projetos em:

```text
playlist.fetch
```

## 18.3 XML-RPC

O site ainda contém documentação para XML-RPC, mas o modelo mais simples e comum atualmente é usar o endpoint HTTP com:

```text
format=json
```

---

## 19. Checklist de produção

### Credenciais

- [ ] `api_key` configurada;
- [ ] shared secret somente no servidor;
- [ ] session key criptografada ou protegida;
- [ ] `.env` fora do Git;
- [ ] callback autorizado e validado.

### Requisições

- [ ] HTTPS;
- [ ] UTF-8;
- [ ] `User-Agent` identificável;
- [ ] `format=json`;
- [ ] timeout;
- [ ] tratamento de resposta não JSON;
- [ ] inspeção do campo `error`;
- [ ] inspeção dos itens ignorados no scrobble.

### Assinatura

- [ ] parâmetros ordenados pelo nome;
- [ ] concatenação sem `=` e sem `&`;
- [ ] secret acrescentado no final;
- [ ] `format` excluído;
- [ ] `callback` excluído;
- [ ] `api_sig` excluído;
- [ ] MD5 em hexadecimal;
- [ ] parâmetros indexados ordenados lexicalmente.

### Desempenho

- [ ] cache;
- [ ] debounce de pesquisa;
- [ ] deduplicação de chamadas;
- [ ] paginação controlada;
- [ ] backoff exponencial;
- [ ] métricas de erro `29`;
- [ ] sem polling agressivo.

### Scrobbling

- [ ] faixa com mais de 30 segundos;
- [ ] metade da faixa ou 4 minutos;
- [ ] timestamp em segundos;
- [ ] timestamp do início;
- [ ] cache persistente;
- [ ] lotes de no máximo 50;
- [ ] ordem cronológica;
- [ ] reautenticação no erro `9`.

### Jurídico

- [ ] atribuição ao Last.fm;
- [ ] links para páginas do Last.fm;
- [ ] revisão dos termos;
- [ ] contato prévio para uso comercial ou pesquisa;
- [ ] não ultrapassar armazenamento permitido;
- [ ] política de privacidade adequada.

---

## 20. Referências oficiais

- Documentação principal: <https://www.last.fm/api>
- Introdução: <https://www.last.fm/api/intro>
- Requisições REST: <https://www.last.fm/api/rest>
- Autenticação: <https://www.last.fm/api/authentication>
- Especificação de autenticação: <https://www.last.fm/api/authspec>
- Autenticação web: <https://www.last.fm/api/webauth>
- Autenticação desktop: <https://www.last.fm/api/desktopauth>
- Autenticação mobile: <https://www.last.fm/api/mobileauth>
- Scrobbling 2.0: <https://www.last.fm/api/scrobbling>
- Termos de uso da API: <https://www.last.fm/api/tos>
- Criação de conta de API: <https://www.last.fm/api/account/create>
- `user.getRecentTracks`: <https://www.last.fm/api/show/user.getRecentTracks>
- `user.getTopArtists`: <https://www.last.fm/api/show/user.getTopArtists>
- `artist.getInfo`: <https://www.last.fm/api/show/artist.getInfo>
- `artist.getSimilar`: <https://www.last.fm/api/show/artist.getSimilar>
- `track.getInfo`: <https://www.last.fm/api/show/track.getInfo>
- `track.scrobble`: <https://www.last.fm/api/show/track.scrobble>
- `track.updateNowPlaying`: <https://www.last.fm/api/show/track.updateNowPlaying>
- `auth.getToken`: <https://www.last.fm/api/show/auth.getToken>
- `auth.getSession`: <https://www.last.fm/api/show/auth.getSession>
- `auth.getMobileSession`: <https://www.last.fm/api/show/auth.getMobileSession>
- Radio API descontinuada: <https://www.last.fm/api/radio>
- Playlists API descontinuada: <https://www.last.fm/api/playlists>

---

## Observação final

A API do Last.fm é simples para consultas públicas, mas possui algumas características legadas:

- assinatura MD5;
- estrutura RPC em endpoint único;
- JSON derivado de XML;
- números e booleanos frequentemente representados como strings;
- documentação com exemplos antigos em HTTP;
- limites de uso sem valor numérico público;
- funcionalidades históricas ainda presentes na navegação.

Para uma integração confiável, normalize as respostas, mantenha o shared secret no backend, implemente cache e trate o conteúdo da resposta mesmo quando o HTTP status for 200.
