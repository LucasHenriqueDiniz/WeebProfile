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

| efeito                                            | estilo   | como                                                                          |
| ------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| comando digitado com cursor, saída aparece depois | terminal | `clip-path` em `steps(n)`, `n` = caracteres do comando                        |
| seções entram em sequência (fade + 6px)           | default  | `opacity`/`transform`                                                         |
| barras enchem da esquerda                         | ambos    | `clip-path` em `.weeb-bar`                                                    |
| números contam de 0                               | ambos    | `@property --weeb-n` + `counter()` num pseudo-elemento por cima do texto real |

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

## Pontos de atenção

- **`page.emulateMedia({ reducedMotion })` não chega no documento de um `<img>`** no Chromium
  headless: o SVG continua vendo `no-preference`. Para medir o caso `reduce`, lançar o
  Chromium com `--force-prefers-reduced-motion`.
- **O XML parser lê `<integer>` como elemento.** O `syntax` do `@property` passa por
  `escapeStyleText` no gerador, como o `customCss`.
- **Contador só imprime inteiros.** `12.3K` conta `0K…12K` e assenta em `12.3K` no fim.
  Texto que não é número puro (`70.4% • 4.4M lines`, `6 years`) não conta.
- **Safari e o app do GitHub não foram testados.** Sem `:has()` ou sem `@property`, o pior
  caso é animar menos; o quadro final continua sendo o card estático.

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
