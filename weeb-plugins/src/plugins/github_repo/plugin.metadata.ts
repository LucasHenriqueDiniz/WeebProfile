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
          ],
        },
        {
          key: "banner_show_description",
          label: "Show description",
          type: "boolean" as const,
          defaultValue: true,
        },
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
      ],
    },
  ],
}
