# Animações dos cards (opt-in)

Escrito em 15/11/2026, junto com a implementação. Os números daqui foram **medidos** em
Chromium headless com o SVG dentro de `<img>`, como o GitHub mostra um README.

## O que liga e onde mora

Uma chave só, no nível do SVG: `ui_config.animations` (boolean). `ui_config` já é JSON no
D1, então não há migration. Desligada por padrão, e só `true` literal liga.

| camada                | onde                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| wizard                | toggle "Animations" em `StyleConfiguration`, estado `animations` no `wizard-store`                                      |
| gravação              | `setTerminalConfigs` (`lib/config/svg-config-helpers.ts`) põe em `ui_config`                                            |
| geração manual e cron | `getTerminalConfigs` (`functions/api/_shared/svg-generation.ts`) → `animations` no `POST /` do gerador                  |
| gerador               | `SvgConfig.animations` → `react-renderer` (timeline, provider) → `PluginStyles` (classe `weeb-anim`) → `ANIMATIONS_CSS` |
| componentes           | `AnimationsProvider`/`useAnimations` (`weeb-plugins/src/templates/animations.tsx`)                                      |
| preview do wizard     | `PreviewRenderer` → `PreviewSvgContainer`, com botão "Replay"                                                           |

Os componentes de plugin não recebem a chave: ela chega por React context aos templates
compartilhados (`TerminalCommand`, barras, `StatisticRow`, `TerminalLineWithDots`…). Com a
chave desligada nada muda no markup — o SVG sai **idêntico byte a byte** ao de antes
(conferido contra a base da branch, e travado em `templates/animations.test.tsx`).

## O que anima

| efeito                                            | estilo   | como                                                                                  |
| ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| comando digitado com cursor, saída aparece depois | terminal | `clip-path` em `steps(n)`, `n` = caracteres do comando                                |
| seções entram em sequência (fade + 6px)           | default  | `opacity`/`transform`                                                                 |
| barras enchem da esquerda                         | ambos    | `clip-path` em `.weeb-bar`                                                            |
| números contam de 0                               | ambos    | `@property --weeb-p` (0 a 1) + `counter()` num pseudo-elemento por cima do texto real |
| calendário do GitHub surge em onda diagonal       | default  | `opacity` por célula, atraso pela distância ao canto superior direito (ver abaixo)    |
| itens de lista, grade, tags e linhas um a um      | ambos    | `opacity` por item, atraso pela posição entre os irmãos (ver "Cascata de itens")      |

Regras que todo efeito segue (testadas em `animations.test.tsx`):

- **Só CSS.** `<img>` não roda script nem `:hover`.
- **`animation-fill-mode: backwards`, nunca `forwards`.** O primeiro keyframe vale durante o
  atraso; quando a animação acaba ela deixa de existir, e o card em repouso é o card estático
  — não um último keyframe parecido com ele.
- **Nada muda layout.** Só `opacity`, `transform`, `clip-path`, `visibility`, cor do texto e
  `left` de um elemento absoluto. A altura continua vindo de `calculateHeight()`.
- **Tudo dentro de `@media (prefers-reduced-motion: no-preference)`.**
- **Termina em ≤ 2 s** (`ANIMATION_BUDGET_S`). `animationTimeline()` encurta o intervalo
  entre seções conforme o card cresce, para a última acabar dentro do orçamento.

### Linha do tempo

Cada seção-folha (`section` sem `section` dentro; vários plugins embrulham as suas numa) começa
em `(--weeb-base + --weeb-k) × --weeb-step`:

- `--weeb-base`: primeira posição do plugin, posta no wrapper de cada plugin pelo gerador (e
  pelo preview) a partir do número de seções configuradas dos plugins anteriores;
- `--weeb-k`: posição da seção entre as irmãs, via `:nth-of-type`;
- `--weeb-step`: no container, calculado por `animationTimeline(style, seções por plugin)`.

## Medições

Em 15/11/2026, cards gerados pelo `POST /` do gerador, **sem `dev`**:

- GitHub: `wrangler dev` (workerd) com dados reais da API, seções `profile`,
  `favorite_languages`, `calendar` (token local do `gh`).
- LastFM: `worker.fetch` no vitest, caminho de produção inteiro (`fetchLastFmDataFromApi`,
  embed das imagens, render, altura). Sem API key nesta máquina, só as respostas de
  `ws.audioscrobbler.com` foram simuladas (`user.getinfo`, `user.getrecenttracks`,
  `user.gettopartists` para `Amayacrab`, com o conteúdo do mock do plugin); as 11 imagens
  vieram da CDN real do Last.fm. **Falta** rodar com a key do usuário.

Quadros capturados do `<img>` em sequência por 3,5 s; "pixels movidos" é a soma de pixels
diferentes entre quadros consecutivos; "repouso × estático" compara o quadro após 4 s com o
card gerado com a opção desligada.

| card                       | ligada  | desligada | ligada + `reduce` | repouso × estático | altura (SVG = HTML renderizado) | fim da última animação |
| -------------------------- | ------- | --------- | ----------------- | ------------------ | ------------------------------- | ---------------------- |
| GitHub default (real)      | 183.693 | 0         | 0                 | 0                  | 804 = 804                       | 1,05 s                 |
| GitHub terminal (real)     | 52.128  | 0         | 0                 | 0                  | 726 (HTML 597)                  | 1,55 s                 |
| LastFM default (API sim.)  | 476.085 | 0         | 0                 | 0                  | 853 = 853                       | 0,90 s                 |
| LastFM terminal (API sim.) | 64.101  | 0         | 0                 | 0                  | 598 (HTML 489)                  | 1,35 s                 |

- Altura: igual com e sem a opção em todos. No terminal o SVG já era mais alto que o HTML
  antes desta mudança (`calculateHeight` do estilo terminal superestima; não é das animações).
- Com a opção desligada, os oito SVGs (GitHub real e mock, LastFM mock, dois estilos) saíram
  idênticos byte a byte aos da base da branch (929d168).
- "Fim da última animação": maior `endTime` de `document.getAnimations()` com o SVG aberto
  como documento.

No github.com, README de perfil (`lab/15-anim-*.svg`, seção "Animations"), Chromium headless
abrindo a página e capturando a imagem desde o carregamento:

| imagem      | caminho                      | pixels movidos | com `reduce` |
| ----------- | ---------------------------- | -------------- | ------------ |
| 6a terminal | relativo (`/raw/main/lab/…`) | 21.283         | 0            |
| 6b terminal | camo (jsDelivr)              | 45.496         | 0            |
| 6c default  | camo (jsDelivr)              | 78.803         | 0            |

## Calendário do GitHub em onda

No estilo default, as células do calendário de contribuições aparecem uma diagonal depois da
outra, do canto superior direito ao inferior esquerdo. O terminal não muda.

- **Lugar de cada célula na onda:** colunas até a borda direita mais linhas desde o topo. No
  half o ano quebra em dois blocos (27 + 26 semanas), e no modo `full` com vários anos cada
  ano é um bloco; o bloco de baixo soma as 7 linhas de cada bloco acima, e as colunas contam
  a partir da grade mais larga. Assim a onda atravessa o calendário inteiro uma vez, não um
  bloco de cada vez.
- **Quem calcula o quê:** `cellWave()` (`templates/animations.tsx`) põe `--weeb-c` em cada
  coluna (`.weeb-wave`) e `--weeb-wave` (o intervalo entre diagonais) em volta da grade. A
  linha vem do CSS, por `:nth-child` (`--weeb-r`). Atraso da célula:
  `--weeb-out + (--weeb-c + --weeb-r) × --weeb-wave`.
- **Tempo:** cada célula faz fade de 200 ms (`ANIMATION_TIMING.cell`), e a última diagonal
  começa 600 ms depois da primeira (`ANIMATION_TIMING.wave`), qualquer que seja o tamanho
  da grade: 15,4 ms entre diagonais no half (40 diagonais), 10,3 ms no full (59), menos com
  vários anos. `0,1 + 0,6 + 0,2 = 0,9 s`, o mesmo rabo que a contagem dos números já dava à
  seção (`sectionTail("default")`), então a onda não alonga o card nem muda o `--weeb-step`.
- **Só `opacity`.** A primeira versão também crescia a célula (`scale(0.4)` → 1). Medido em
  `<img>` com a animação congelada 1 ms antes do fim, as bordas das células saíam até um
  pixel fora do card estático: 9.424 px diferentes no Chromium 151 e 20.253 no Firefox 150
  (diferença de até 215 por canal), ou seja, um pulo quando a animação acabava. Só com
  `opacity`: 0 px nos três engines. `animations.test.tsx` trava isso.

Medido em 17/11/2026, Playwright 1.60 (Chromium 151, Firefox 150, WebKit 26.4), cards gerados
por `generateSvg` sem `dev`, com dados reais da API do GitHub (token local do `gh`): calendário
sozinho em half e em full, calendário como 3ª seção de um card half (`profile`,
`favorite_languages`, `calendar`) e modo `full` com 3 anos.

**Ordem em `<img>`:** quadros capturados em sequência desde o load; uma célula "aparece" no
primeiro quadro em que o pixel do centro passou da metade do caminho entre o fundo e a cor do
card estático. Pares de células a 2 diagonais ou mais de distância que apareceram na ordem
errada:

| card           | células visíveis | pares   | invertidos (Chromium / Firefox / WebKit) | primeira → última                                  |
| -------------- | ---------------- | ------- | ---------------------------------------- | -------------------------------------------------- |
| half           | 365              | 60.496  | 0 / 0 / 0                                | topo, coluna da direita → base, coluna da esquerda |
| full           | 365              | 62.988  | 0 / 0 / 0                                | idem                                               |
| half, 3ª seção | 365              | 60.496  | 0 / 0 / 0                                | idem                                               |
| full, 3 anos   | 1.096            | 570.530 | 0 / 0 / 0                                | topo do 1º ano, direita → base do 3º ano, esquerda |

O intervalo entre quadros variou de 8 a 122 ms com a máquina carregada (load 8 a 34), então o
filme em `<img>` mostra a ordem por faixas. A ordem exata saiu do SVG aberto como documento,
todas as animações pausadas e avançadas juntas de 10 em 10 ms: 0 pares invertidos nos três
engines nos quatro cards (64.569, 65.402, 64.569 e 590.573 pares).

**Tempo:** a última célula termina 900 ms depois do início da seção. No card de 3 seções o
calendário é a última: a onda vai de 400 a 1.200 ms e o card termina em 1.200 ms, igual a
antes.

**Último quadro e repouso:** cada célula congelada 1 ms antes do fim dentro do `<img>`
(`animation-delay` negativo + `paused`), contra o card estático: 0 px nos três engines nos
quatro cards (controle, congelada no início: 174 mil a 546 mil px). Repouso × estático: 0 px
em todos. Com a opção desligada, os oito SVGs (os quatro reais e quatro do mock, um deles
terminal) saíram idênticos byte a byte aos da `main` (406717e).

**`reduce`:** Chromium com `--force-prefers-reduced-motion` e Firefox com a pref
`ui.prefersReducedMotion=1`, card em `<img>`: 0 px movidos e primeiro quadro igual ao estático
(controle sem `reduce`: anima). No WebKit o `reducedMotion` do Playwright não chega no `<img>`
(anima igual ao controle); com o SVG aberto como documento e `reduce` emulado, nenhuma
animação roda e o primeiro quadro é o estático.

## Cascata de itens

Desde 18/11/2026 toda seção tem um efeito próprio além da entrada genérica, nos dois estilos
e em todas as variantes. O que não é barra, número nem calendário entra em cascata: os
itens de uma lista, de uma grade, de uma fileira de tags ou as linhas de um bloco aparecem
um depois do outro, na ordem em que são desenhados.

- **Quem marca o quê:** o elemento cujos filhos são os itens recebe a classe `weeb-seq` e
  `--weeb-gap` (o intervalo entre dois itens), por `useItemCascade(n)` / `withCascade()`
  (`templates/animations.tsx`). O lugar de cada filho vem do CSS, por `:nth-child`
  (`--weeb-idx`), então os itens não carregam nada. O primeiro filho recebe `0` explícito,
  porque uma cascata pode estar dentro de um item de outra e herdaria o lugar dele.
- **Itens sem elemento em volta** (direto na `<section>`, ao lado do título ou do comando
  do terminal) passam por `<CascadeGroup count>`, que só desenha um `<div>` com a animação
  ligada. Só para blocos empilhados: dentro de flex ou grid ele mudaria o layout.
- **Nunca na `<section>`:** os filhos dela incluem a linha de comando do terminal, que tem
  animação própria.
- **Templates compartilhados já trazem a cascata:** `StatisticRow`, `TerminalStatisticRow`,
  `DefaultList`, `DefaultGrid`, `DefaultImageGrid` e `TerminalGrid` (que também conta o
  valor de cada linha). Plugin que usa um deles não precisa fazer nada.
- **Tempo:** cada item faz fade de 200 ms (`ANIMATION_TIMING.item`), a partir do conteúdo
  da seção (`--weeb-out`), e o último começa no máximo 600 ms depois do primeiro
  (`ANIMATION_TIMING.cascade`), com no máximo 80 ms entre dois (`MAX_ITEM_GAP_S`), para
  uma lista de três não se arrastar. `0,1 + 0,6 + 0,2 = 0,9 s` no default e
  `0,35 + 0,6 + 0,2 = 1,15 s` no terminal: o mesmo rabo que a seção já tinha
  (`sectionTail`), então o `--weeb-step` e o fim do card não mudam.
- **60 lugares** (`CASCADE_SLOTS`): o calendário do terminal em `full` tem 53 semanas, e o
  `TerminalGrid` de 3 colunas com 10 linhas tem 30 células. Do 60º em diante os itens
  aparecem juntos.
- **Só `opacity`**, pelo mesmo motivo do calendário.
- **Gráfico de estrelas do `github_repo`** se desenha da esquerda para a direita com a mesma
  classe das barras (`weeb-bar`, `clip-path`), no `<svg>` do gráfico.

**Conferência de markup** (todas as seções de todos os plugins, nos dois estilos, uma vez
por valor de cada opção `select`, dados do mock: 370 renders). Com a animação desligada,
370/370 iguais byte a byte aos da `main` (216509ab). Com ela ligada, 144 de 146 pares
seção × estilo têm efeito próprio em todas as variantes. Faltam os dois de `github/people` com
`people_type=repository`, que no mock só desenha a caixa de erro.

**No browser** (18/11/2026, Playwright 1.60: Chromium 151, Firefox 150, WebKit 26.4). Um
card por plugin e estilo com todas as seções (30 cards), gerados por `generateSvg` com e sem
a opção. Dados reais de GitHub, `github_repo`, Codeforces, Codewars, Dev.to e websites; mock
nos outros (chave do usuário, ou API que não responde fora da Cloudflare: Jikan pelo
`jikan-edge`).

| medição                                     | Chromium  | Firefox   | WebKit               |
| ------------------------------------------- | --------- | --------- | -------------------- |
| seções-folha com efeito próprio             | 138/142   | 138/142   | 138/142              |
| fim da última animação                      | 2.000 ms  | 2.000 ms  | 2.000 ms             |
| cards que se mexem em `<img>`               | 30/30     | 30/30     | 30/30                |
| `reduce`: pixels movidos em `<img>`         | 0 (30/30) | 0 (30/30) | não chega no `<img>` |
| repouso × estático, os 370 variantes (mock) | 358/370   | 370/370   | 352/370              |

- As 4 seções sem efeito são `sponsors` e `sponsorships` do GitHub real, que sem patrocínio
  desenham só o aviso de vazio.
- **Repouso × estático:** no Chromium, as 12 variantes que diferem são do terminal, de 1 a
  186 px de anti-aliasing de texto, com as caixas das seções iguais. Com `reduce` (sem animação
  nenhuma) a diferença é a mesma, então vem do `<div>` do `CascadeGroup` (arredondamento de
  subpixel), não da animação. Antes da correção do `CascadeGroup` (bloco em vez de coluna
  flex) os favoritos do MAL no terminal saíam 40 px mais curtos com a opção ligada. No
  WebKit, as 18 que diferem (33 a 156 px) são seções com número que conta: o
  `inline-block` do `AnimatedNumber` desloca o número em subpixel, igual com `reduce` e
  nenhuma animação rodando, e invisível ampliado 4×.
- **Nos cards de dado real**, o GitHub difere em 114 a 280 px porque o "56 minutes ago" de
  uma geração virou "57" na outra. No WebKit, o card **estático** em `<img>` às vezes não
  desenha as capas (MAL: 106.873 px, as capas ausentes no card sem animação), e o número
  que contou assenta com outro subpixel (Steam: 45 px). Nenhum dos dois é mudança de layout.
- **1 ms antes do fim** a opacidade é 0,9999, e o card difere do estático em arredondamento:
  no terminal, 100% dos pixels diferentes por até 2/255, o mesmo que o fade da saída do
  terminal que já está na `main` (33.764 px, até 2/255). No default, com capas, 85 a 99,8%
  até 2/255 e de 9 a 199 px acima de 8/255, nas capas. As barras do gráfico: 0 a 24 px.

## Pontos de atenção

- **`page.emulateMedia({ reducedMotion })` não chega no documento de um `<img>`** no Chromium
  headless: o SVG continua vendo `no-preference`. Para medir o caso `reduce`, lançar o
  Chromium com `--force-prefers-reduced-motion`. No Firefox, a pref
  `ui.prefersReducedMotion=1` (`firefoxUserPrefs`) chega. No WebKit, o `reducedMotion` do
  contexto também não chega no `<img>`; só dá para medir com o SVG aberto como documento.
- **Animação com `scale` não termina no card estático.** Uma escala perto de 1 desenha a
  borda do elemento fora da grade de pixels do card parado (calendário com `scale`: 9.424 px
  no Chromium, 20.253 no Firefox, 1 ms antes do fim), e o card pula quando a animação acaba.
  Para fazer algo aparecer, usar `opacity`.
- **O XML parser lê `<number>` como elemento.** O `syntax` do `@property` passa por
  `escapeStyleText` no gerador, como o `customCss`.
- **Número com decimal conta com as mesmas casas.** Contador CSS só imprime inteiro, então
  `AnimatedNumber` põe o alvo escalado (`68.2` → `--weeb-to: 682`, `--weeb-scale: 10`) e o
  pseudo-elemento imprime a parte inteira, o ponto e o resto (`decimal-leading-zero` com 2
  casas): `0.0 … 68.2`, `0.00 … 6.05`, `0.0K … 13.1K`. Até 16/11/2026 contava só a parte
  inteira (`0 … 68`) e saltava para `68.2` no fim. Desde 18/11/2026 conta também com `#`
  na frente (`#287.4K`, posição no Codewars, em `--weeb-prefix`) e com uma palavra depois
  (`123 days`, `6 years`, que entra em `--weeb-unit` com o espaço). Texto com mais de uma
  palavra ou outro símbolo (`70.4% • 4.4M lines`, `3 days ago`), com mais de 2 casas ou
  acima de 2^23 (`8388608`, contando as casas) não conta: acima disso o Firefox 150 erra o
  último dígito do `round()` (`16777215` sai `16777216`).
- **Keyframe da contagem só com valor literal.** O `weeb-count` anima `--weeb-p` de `0` a `1`
  e a conta (`round()`/`mod()` sobre `--weeb-to`) fica no `counter-reset`. Medido em `<img>`
  (Playwright 1.60) com o desenho anterior (`--weeb-n` de `0` a `var(--weeb-to)`, contador
  direto da propriedade): o Firefox 150 interpolava em degrau (`0`, e o valor final na
  metade) e o WebKit 26.4 nunca redesenhava (`0` até o fim). Só o Chromium contava.
- **O número é `inline-block`.** Assim o pseudo-elemento começa na mesma linha do texto e cai
  na mesma linha de base. Como inline, ele ficava meia entrelinha abaixo (2 px no terminal) e
  subia no fim da contagem.
- **Separador de milhar não entra na contagem.** `1,234` conta `0 … 1234` e assenta em
  `1,234`. Hoje só o `codeforces` (problemas por dificuldade, `toLocaleString`) pode mandar
  número com vírgula para o `AnimatedNumber`, e só a partir de 1.000.
- **Fonte proporcional:** um valor intermediário pode ser mais largo que o final (`3.2K`
  contra `4.1K` na Poppins) e encostar no rótulo durante a contagem.
- **Safari e o app do GitHub não foram testados.** Sem `:has()` ou sem `@property`, o pior
  caso é animar menos; o quadro final continua sendo o card estático.

## Replay ao recarregar o README

A animação toca quando o browser decodifica a imagem. Reaproveitar a cópia já decodificada
mostra o card em repouso, então o que decide se um reload anima de novo é o `Cache-Control`
da rota `/svg/<id>.svg` (`SVG_CACHE_CONTROL` em `functions/api/svg/[id].ts`).

Medido em 16/11/2026, Playwright 1.60, card real de 491 KB em `<img>`, `page.reload()` e nova
navegação ~5 s depois do primeiro load, 3 runs por célula (Firefox: 6), controle (primeiro
load) animando em todas. "7×" é a mesma URL 7 vezes na página, como no README do autor.

| engine       | `public, max-age=60, s-maxage=60` (antes) | `no-cache, s-maxage=60` (agora) |
| ------------ | ----------------------------------------- | ------------------------------- |
| Chromium 151 | reload 3/3, mas 0/3 com 7×                | 3/3 com 1× e 7×                 |
| WebKit 26.4  | 0/3 (reload e navegação, 1× e 7×)         | 3/3                             |
| Firefox 150  | reload 6/6, navegação 0/6                 | 6/6 nos dois                    |

`no-cache`, `no-store` e `max-age=0, must-revalidate` animam igual no browser. A diferença está
no camo do GitHub, medido com origens que devolvem cada header:

| origem envia                           | camo entrega ao browser    | cache do camo (Fastly)       |
| -------------------------------------- | -------------------------- | ---------------------------- |
| `max-age=60` / `no-cache` / `no-store` | o mesmo header             | vai à origem a cada ~61 s    |
| `no-cache, s-maxage=60`                | o mesmo header             | vai à origem a cada ~61 s    |
| `max-age=0, must-revalidate`           | o mesmo header             | vai à origem em toda request |
| sem `Cache-Control`                    | `public, max-age=31536000` | guarda                       |
| qualquer um + `ETag`                   | sem o `ETag`               | —                            |

- **Custo na origem pelo GitHub:** igual ao de antes, no máximo uma request por card por cache
  do camo por minuto. A view repetida em menos de 60 s passa a baixar o card do cache do camo
  (0,12 s para 491 KB), não da nossa rota.
- **Embed fora do GitHub:** o browser fala direto com a rota, e cada view vira uma invocação
  (8 ms de CPU, 1 linha do D1, 1 GET no R2). A Cloudflare não guarda a resposta da Function.
  As prévias do dashboard usam a URL do R2, não a rota.
- **Sem `ETag` nem `Last-Modified`:** com 304 o WebKit mantém o card em repouso (4/4).
- **Por que o `s-maxage` explícito:** o camo guarda `no-cache` por 60 s, mas isso não está
  documentado. O `s-maxage=60` fixa o prazo de hoje.
- **Ponta a ponta pelo camo (preview do PR #62, 16/11/2026):** página local com `<img>` apontando
  para URLs do camo assinadas pela API de markdown do GitHub, uma URL nova por run, 2 runs por
  engine × 1 e 7 cópias. Com o header novo, reload e nova navegação animaram 24/24, e o tail do
  deploy registrou 1 request na origem por run (só o primeiro load; reload e navegação vieram do
  cache do camo). Produção com o header antigo, no mesmo teste: Chromium 4/4 com 1× e 0/4 com 7×,
  WebKit 0/8, Firefox reload 4/4 e navegação 0/4.
- **Não medido:** navegação interna do GitHub (Turbo) entre abas do perfil, e Safari de verdade.

## Próximo passo: carrossel numa lista

Não implementado. A ideia (lab `04-carousel.svg`): N itens de uma lista (ex.: LastFM
`recent_tracks`) no espaço de 1, alternando em loop com `animation-delay` escalonado.

Por que ficou de fora:

- a altura deixa de ser a da lista: `calculateHeight()` da seção precisaria de uma opção
  própria (ex.: `recent_tracks_carousel`) e saber se a animação está ligada, porque sem ela
  (ou com `reduce`) o card teria que mostrar só o primeiro item no mesmo espaço;
- é um loop infinito, então não tem "quadro final" — contraria a regra de terminar em 2 s e
  pede uma regra própria (o primeiro item visível em repouso);
- reescreve o componente de itens que a sessão `svg-links` está mexendo (links por item).

Desenho sugerido: opção de seção `recent_tracks_carousel` (raiz da config, como as demais),
`calculateHeight` devolvendo a altura de 1 item quando ela está ligada, itens empilhados com
`position: absolute` num container da altura de 1 item, e o primeiro item estático fora do
`@media (prefers-reduced-motion: no-preference)`.
