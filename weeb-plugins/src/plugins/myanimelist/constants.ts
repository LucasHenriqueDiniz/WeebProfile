/**
 * Shared MyAnimeList defaults.
 *
 * Mantido fora de plugin.metadata.ts porque o metadata é lido pelo gerador de
 * `metadata.ts` (auto-gerado) e não pode importar código de runtime. O valor aqui
 * precisa continuar igual ao `defaultValue` de `*_favorites_max` / `favorites_max`
 * na metadata: é o fallback usado quando a config não traz nenhum limite
 * (ex: GitHub Action com YAML mínimo).
 */
export const DEFAULT_FAVORITES_MAX = 5
