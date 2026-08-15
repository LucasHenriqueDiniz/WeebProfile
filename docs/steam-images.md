# Imagens da Steam

Escrito em 15/08/2026, depois de duas rodadas de bug com imagem no plugin Steam. Os
formatos aqui foram **medidos**, não copiados de memória — cada tamanho veio de um
`Content-Length` real.

## O problema que este documento existe para evitar

A API da Steam **não devolve URL de imagem**. `GetOwnedGames` devolve dois hashes
(`img_icon_url`, `img_logo_url`) e mais nada. Toda URL precisa ser montada a partir
do `appid`.

Isso já causou três bugs distintos:

1. O `header_image` só existia no `mock-data.ts`, então o preview do wizard mostrava
   capa e a geração real saía com retângulos escuros. Nunca havia sido montado no
   caminho real.
2. O comentário nos componentes dizia que `img_icon_url` era "often invalid". Não
   era: é um hash, e faltava montar a URL. Por causa disso a miniatura quadrada
   usava um recorte da capa larga, cortando o logo no meio ("COUNTER STRIK", "DOT A").
3. Um fallback montava `library_hero.jpg` e mandava a URL **crua** para dentro do
   SVG. URL externa não carrega num Gist do GitHub, então o card ficava com um
   buraco em vez de um layout sem imagem.

---

## Capas do jogo

Base: `https://cdn.akamai.steamstatic.com/steam/apps/{appid}/{arquivo}`

| arquivo               | dimensões | tamanho médio | onde usamos            |
| --------------------- | --------- | ------------- | ---------------------- |
| `header.jpg`          | 460×215   | 35,3 KB       | fundo do card destaque |
| `capsule_231x87.jpg`  | 231×87    | 17,2 KB       | fundo dos cards lista  |
| `capsule_184x69.jpg`  | 184×69    | 10,6 KB       | —                      |
| `capsule_616x353.jpg` | 616×353   | 57,3 KB       | —                      |
| `library_hero.jpg`    | 1920×620  | ~600 KB       | **não usar**           |

Médias de 4 jogos, medidas em 15/08/2026. `header` e `capsule_231x87` têm a mesma
disponibilidade (11/12 numa amostra que mistura jogos antigos e modernos), então a
escolha é só de peso.

O `library_hero` passa do teto de 250 KB da conversão para base64 — não adianta nem
tentar.

**Nem todo appid tem todos os arquivos.** O `2062430` (BALL x PIT), por exemplo, dá
404 tanto em `header.jpg` quanto em `capsule_231x87.jpg`. Falha de imagem tem que
degradar para "sem imagem", nunca para uma URL externa.

## Ícone do jogo

Base: `https://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{hash}.jpg`

Onde `{hash}` é o `img_icon_url` que veio da API. 32×32, entre **0,7 e 2 KB** — duas
ordens de grandeza menor que uma capa.

`cdn.cloudflare.steamstatic.com` serve o mesmo caminho, byte a byte idêntico.

Sem o hash não há URL: se a API não mandou `img_icon_url`, não há ícone, e montar
uma URL chutada só gastaria uma requisição para receber 404.

## Avatar do usuário

Vem pronto em `GetPlayerSummaries`, nos campos `avatar`, `avatarmedium` e
`avatarfull`. São os únicos campos de imagem da API da Steam que já chegam como URL.

O avatar padrão (conta sem foto) é
`https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`
— é ele que o mock usa, de propósito, para o dado de exemplo parecer exemplo.

---

## Regras ao mexer nisso

**Toda imagem vira base64 antes de entrar no SVG.** O SVG é servido em Gist e
README do GitHub, onde URL externa não carrega. Ver
`weeb-plugins/src/utils/image-to-base64.ts`, que embute os bytes exatos — sem
decode, resize ou recompressão — e valida MIME, magic bytes e tamanho máximo.

**Nunca emitir URL externa como fallback.** Falhou a conversão, o resultado é
`null`. Sem imagem é honesto; imagem quebrada não é.

**Só buscar imagem do que vai ser renderizado.** Uma biblioteca real tem centenas de
jogos e cada imagem é uma requisição. `withHeaderImages` (em
`services/fetchData.ts`) espelha o recorte que os componentes fatiam — mesma
ordenação, mesmos limites de config.

**A Steam limita requisições vindas do Worker.** Gerações seguidas do mesmo SVG
progressivamente perdem imagens: numa sequência observada em 15/08/2026, a primeira
geração trouxe 15 imagens e as seguintes, em poucos minutos, trouxeram 1, 3 e 1.
Em uso normal (cron diário) isso não aparece — mas invalida medições feitas com
regerações em sequência.

## Fontes

- [Steam Web API — Valve Developer Community](https://developer.valvesoftware.com/wiki/Steam_Web_API)
  — formato de `img_icon_url` / `img_logo_url`
- [WebAPI/GetRecentlyPlayedGames — TF2 Wiki](https://wiki.teamfortress.com/wiki/WebAPI/GetRecentlyPlayedGames)
- [Authentication using Web API Keys — Steamworks](https://partner.steamgames.com/doc/webapi_overview/auth)
