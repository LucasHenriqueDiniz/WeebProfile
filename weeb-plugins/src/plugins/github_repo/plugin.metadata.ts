/**
 * Metadata do Plugin Repository (github_repo)
 *
 * Este arquivo define as seções, configurações e opções do plugin github_repo.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 *
 * NÃO edite metadata.ts manualmente - ele é gerado automaticamente a partir deste arquivo.
 *
 * Para atualizar:
 * 1. Edite este arquivo
 * 2. Execute: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

// Compartilhado por todas as seções (só uma fica ativa por vez) - escala fonte,
// ícones, gráfico e padding juntos, não só um espaço extra.
const CONTENT_SIZE_OPTION = {
  key: "content_size",
  label: "Size",
  type: "select" as const,
  defaultValue: "md",
  options: [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium (default)" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
  ],
  tooltip: "Scales font size, icons, chart and spacing together.",
}

export const githubRepoPluginMetadata = {
  displayName: "Repository",
  description: "Show a card with stats for a single GitHub repository",
  category: "repository" as const,
  icon: "BookMarked",
  requiredFields: ["owner", "repo"],
  essentialConfigKeys: ["pat"],
  essentialConfigKeysMetadata: [
    {
      key: "pat",
      label: "GitHub Classic Token",
      type: "password",
      placeholder: "ghp_...",
      description: "Reuses the same token configured for the GitHub plugin, if you already have one.",
      helpUrl:
        "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
      docKey: "github.pat",
    },
  ],
  sections: [
    {
      id: "banner",
      name: "Banner",
      description: "Repository header card: name, description and key metadata, tinted by the theme highlight",
      configOptions: [
        {
          key: "banner_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "hero",
          description: "Choose the banner layout",
          options: [
            { value: "hero", label: "Hero (accent bar, big name, description and meta row)" },
            { value: "minimal", label: "Minimal (single row with mark, name and stars)" },
            { value: "split", label: "Split (content left, star panel with growth right)" },
            { value: "display", label: "Display (giant typography with ghost letter)" },
            { value: "centered", label: "Centered (avatar, name and meta centered)" },
            { value: "dark", label: "Dark (fixed dark card with highlight bar)" },
          ],
        },
        {
          key: "banner_show_description",
          label: "Show description",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "banner_show_languages",
          label: "Show primary language",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Shows the primary language dot in the meta row (Hero and Display styles).",
        },
        {
          key: "banner_show_owner",
          label: "Show owner",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Shows the owner login (e.g. \"LucasHenriqueDiniz /\") before the repository name.",
        },
        {
          key: "banner_show_avatar",
          label: "Show avatar",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Shows the owner avatar / repository mark (Hero, Minimal and Dark styles).",
        },
        {
          key: "banner_image",
          label: "Custom image (URL)",
          type: "string" as const,
          defaultValue: "",
          description: "Optional image URL (project logo etc.) shown instead of the repository mark",
          tooltip: "Converted to base64 at generation time so it works inside Gists. Leave empty to use the owner avatar.",
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "stats",
      name: "Stats",
      description: "Stars, forks, issues and watchers",
      configOptions: [
        {
          key: "stats_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "grid",
          options: [
            { value: "grid", label: "Grid (four cells with thin dividers)" },
            { value: "inline", label: "Inline (single strip with growth)" },
            { value: "sparkstats", label: "Sparkstats (grid with star sparkline)" },
            { value: "featured", label: "Featured (highlighted stars block)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "star_graph",
      name: "Star Growth Graph",
      description: "A real graph of the repository's star growth over time",
      configOptions: [
        {
          key: "star_graph_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "area",
          options: [
            { value: "area", label: "Area (filled curve with live point)" },
            { value: "bars", label: "Bars (growth per period, fading in)" },
            { value: "milestones", label: "Milestones (progress ruler with real marks)" },
            { value: "sparkline", label: "Sparkline (compact row, count + trend)" },
            { value: "steps", label: "Steps (staircase line)" },
            { value: "dots", label: "Dots (sampled points over dashed grid)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "languages",
      name: "Technologies",
      description: "Language/technology breakdown, by bytes of code",
      configOptions: [
        {
          key: "max_languages",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 5,
          min: 0,
          max: 5,
          step: 1,
          tooltip: "Languages beyond this limit are omitted from the breakdown.",
        },
        {
          key: "languages_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "spectrum",
          options: [
            { value: "spectrum", label: "Spectrum (segmented bar + legend)" },
            { value: "bars", label: "Bars (one row per language)" },
            { value: "donut", label: "Donut (ring chart + legend column)" },
            { value: "blocks", label: "Blocks (proportional mosaic)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "topics",
      name: "Topics",
      description: "Repository topic tags",
      configOptions: [
        {
          key: "max_topics",
          label: "Maximum topics",
          type: "number" as const,
          defaultValue: 6,
          min: 0,
          max: 6,
          step: 1,
          description: "Maximum 6 topics",
          tooltip: "Topics beyond this limit are summarized as '+N'.",
        },
        {
          key: "topics_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "chips",
          options: [
            { value: "chips", label: "Chips (soft highlight pills)" },
            { value: "cloud", label: "Cloud (mixed weights, centered)" },
            { value: "hash", label: "Hash (#hashtags as colored text)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "overview",
      name: "Overview",
      description: "Single combined card: identity, meta row, star count and growth chart",
      configOptions: [CONTENT_SIZE_OPTION],
    },
  ],
}
