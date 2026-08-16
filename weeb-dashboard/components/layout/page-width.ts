/**
 * Largura do conteúdo — fonte única.
 *
 * O motivo de isto existir: o Header e o conteúdo da página são renderizados por
 * componentes diferentes, e cada rota escolhia a própria largura. A 1920px o
 * título do Header saía em x=24 e o conteúdo do Settings em x=448 — nada
 * alinhava com nada, e cada tela desalinhava de um jeito diferente
 * (wizard 86px, lista 168px, plugins 360px, settings 424px).
 *
 * Header e conteúdo passam a receber a MESMA classe a partir daqui. Se a largura
 * mudar, muda nos dois ao mesmo tempo, que é a única forma de isso não voltar a
 * divergir.
 */

/**
 * `app` listas e grids · `narrow` formulários e leitura · `full` canvas sem limite ·
 * `workspace` colunas coladas na borda (wizard), com o inset igual ao dos painéis.
 */
export type ContentWidth = "app" | "narrow" | "full" | "workspace"

const MAX_WIDTH: Record<ContentWidth, string> = {
  // Grids de card ganham uma coluna a mais que o antigo `container` (1536) sem virar
  // uma faixa larga demais para varrer com os olhos.
  app: "max-w-[1600px]",
  // Formulário largo é formulário ruim: linha longa demais para ler e label longe
  // do campo. Settings e o passo de criação ficam aqui.
  narrow: "max-w-5xl",
  // Workspaces que gerenciam o próprio espaço internamente (wizard, onboarding).
  full: "max-w-none",
  workspace: "max-w-none",
}

/** Padding horizontal idêntico em toda parte — some do cálculo de alinhamento. */
export const CONTENT_PADDING_X = "px-4 md:px-6 lg:px-8"

/**
 * O wizard não é uma página com margens: são colunas que vão até a borda. O inset
 * do header aqui é o mesmo padding interno do primeiro painel (ver PluginListPanel),
 * senão o título flutua deslocado em relação à busca logo abaixo dele.
 */
const WORKSPACE_PADDING_X = "px-4 lg:px-5"

export function contentContainer(width: ContentWidth = "app"): string {
  const paddingX = width === "workspace" ? WORKSPACE_PADDING_X : CONTENT_PADDING_X
  return `mx-auto w-full ${MAX_WIDTH[width]} ${paddingX}`
}
