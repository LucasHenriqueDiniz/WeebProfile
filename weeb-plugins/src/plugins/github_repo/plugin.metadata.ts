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
      description: "Header banner with owner avatar, repository name and description, tinted by the primary language",
      configOptions: [
        {
          key: "banner_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "large",
          description: "Choose how big and prominent the banner is",
          options: [
            { value: "large", label: "Large (avatar + gradient background)" },
            { value: "compact", label: "Compact (single row)" },
            { value: "minimal", label: "Minimal (text only, no background)" },
            { value: "clean", label: "Clean (name, description and techs in one bordered row)" },
            { value: "editorial", label: "Editorial (color rail + serif headline)" },
            { value: "mono", label: "Mono (dark monospace, GitHub terminal style)" },
            { value: "aurora", label: "Aurora (dark gradient with glass panel)" },
            { value: "bold", label: "Bold (large headline, minimal detail)" },
            { value: "split", label: "Split (two columns, tech bars on the side)" },
            { value: "blueprint", label: "Blueprint (technical frame, monospace uppercase)" },
            { value: "ribbon", label: "Ribbon (circular mark + bottom info strip)" },
            { value: "social", label: "Social (wide layout for link previews)" },
            { value: "hero", label: "Hero (extra tall, meant to sit at the top of the project)" },
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
          label: "Show technologies",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Shows the repository's top languages in styles that display technologies (Clean, Editorial, Mono, Aurora, Bold, Blueprint, Ribbon, Hero).",
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "stats",
      name: "Stats",
      description: "Star and fork counters",
      configOptions: [
        {
          key: "stats_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "stats_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Stats",
        },
        {
          key: "stats_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "inline",
          options: [
            { value: "inline", label: "Inline (Stars and Forks side by side)" },
            { value: "grid", label: "Grid (Stars, Forks, Issues, Watchers in blocks)" },
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
          key: "star_graph_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "star_graph_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Star growth",
        },
        {
          key: "star_graph_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "area",
          options: [
            { value: "area", label: "Area (filled line, current default)" },
            { value: "line", label: "Line (clean line with light grid)" },
            { value: "milestones", label: "Milestones (marks a few key points)" },
            { value: "bars", label: "Bars (growth between sampled points)" },
            { value: "gradient", label: "Gradient (two-tone stroke, dashed baseline)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "languages",
      name: "Technologies",
      description: "Language/technology breakdown bar, by bytes of code",
      configOptions: [
        {
          key: "languages_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "languages_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Technologies",
        },
        {
          key: "max_languages",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 5,
          min: 0,
          max: 5,
          step: 1,
          tooltip: "Languages beyond this limit are omitted from the breakdown bar.",
        },
        {
          key: "languages_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "bars",
          options: [
            { value: "bars", label: "Bars (thin bar + inline legend)" },
            { value: "spectrum", label: "Spectrum (thicker bar + two-column legend)" },
            { value: "badges", label: "Badges (solid shields.io-style tags)" },
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
          key: "topics_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "topics_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Topics",
        },
        {
          key: "max_topics",
          label: "Maximum topics",
          type: "number" as const,
          defaultValue: 6,
          min: 0,
          max: 6,
          step: 1,
          description: "Maximum 6 topics",
          tooltip: "Topics beyond this limit are summarized as '+N more'.",
        },
        {
          key: "topics_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "chips",
          options: [
            { value: "chips", label: "Chips (flat list, all equal weight)" },
            { value: "cloud", label: "Cloud (first topics featured/highlighted)" },
          ],
        },
        CONTENT_SIZE_OPTION,
      ],
    },
    {
      id: "overview",
      name: "Overview",
      description: "Compact combined card: identity, key metrics, mini star growth and mini technologies panel",
      configOptions: [
        {
          key: "overview_max_languages",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 4,
          min: 0,
          max: 4,
          step: 1,
          tooltip: "Languages beyond this limit are omitted from the mini technologies bar.",
        },
        CONTENT_SIZE_OPTION,
      ],
    },
  ],
}
